import { auth } from "@/auth";
import { personFromEmail, slugify } from "@/lib/people";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Klover-Fintech";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "prototype-playground";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "master";

async function ghFetch(token: string, endpoint: string, options?: RequestInit) {
  return fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 },
    );
  }

  let body: {
    name: string;
    displayName?: string;
    html: string;
    collaborative?: boolean;
    oldSlug?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { name, displayName, html, collaborative, oldSlug } = body;

  if (!name || !html) {
    return NextResponse.json(
      { error: "Name and HTML content are required" },
      { status: 400 },
    );
  }

  const person = personFromEmail(session.user.email);
  const slug = slugify(name);
  const isRename = oldSlug && oldSlug !== slug;

  const meta: Record<string, unknown> = { collaborative: !!collaborative };
  if (displayName) {
    meta.name = displayName;
  }

  // Get the latest commit SHA on the branch
  const refRes = await ghFetch(token, `/git/ref/heads/${GITHUB_BRANCH}`);
  if (!refRes.ok) {
    return NextResponse.json(
      { error: "Failed to get branch ref" },
      { status: 500 },
    );
  }
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // Get the tree of the latest commit
  const commitRes = await ghFetch(token, `/git/commits/${latestCommitSha}`);
  if (!commitRes.ok) {
    return NextResponse.json(
      { error: "Failed to get commit" },
      { status: 500 },
    );
  }
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  const treeEntries: {
    path: string;
    mode: string;
    type: string;
    content?: string;
    sha?: null;
  }[] = [];

  if (isRename) {
    treeEntries.push({
      path: `public/prototypes/${person}/${oldSlug}/index.html`,
      mode: "100644",
      type: "blob",
      sha: null,
    });
    treeEntries.push({
      path: `public/prototypes/${person}/${oldSlug}/meta.json`,
      mode: "100644",
      type: "blob",
      sha: null,
    });
  }

  treeEntries.push({
    path: `public/prototypes/${person}/${slug}/index.html`,
    mode: "100644",
    type: "blob",
    content: html,
  });

  treeEntries.push({
    path: `public/prototypes/${person}/${slug}/meta.json`,
    mode: "100644",
    type: "blob",
    content: JSON.stringify(meta, null, 2),
  });

  // Create the new tree
  const treeRes = await ghFetch(token, "/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeEntries,
    }),
  });

  if (!treeRes.ok) {
    const error = await treeRes.json();
    return NextResponse.json(
      { error: "Failed to create tree", details: error },
      { status: treeRes.status },
    );
  }
  const treeData = await treeRes.json();

  const message = isRename
    ? `Rename prototype: ${person}/${oldSlug} → ${slug}`
    : `Publish prototype: ${person}/${slug}`;
  const newCommitRes = await ghFetch(token, "/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  });

  if (!newCommitRes.ok) {
    const error = await newCommitRes.json();
    return NextResponse.json(
      { error: "Failed to create commit", details: error },
      { status: newCommitRes.status },
    );
  }
  const newCommitData = await newCommitRes.json();

  // Update the branch ref
  const updateRefRes = await ghFetch(
    token,
    `/git/refs/heads/${GITHUB_BRANCH}`,
    {
      method: "PATCH",
      body: JSON.stringify({ sha: newCommitData.sha }),
    },
  );

  if (!updateRefRes.ok) {
    const error = await updateRefRes.json();
    return NextResponse.json(
      { error: "Failed to update branch", details: error },
      { status: updateRefRes.status },
    );
  }

  try {
    const localDir = path.join(
      process.cwd(),
      "public",
      "prototypes",
      person,
      slug,
    );
    fs.mkdirSync(localDir, { recursive: true });
    fs.writeFileSync(path.join(localDir, "index.html"), html, "utf-8");
    fs.writeFileSync(
      path.join(localDir, "meta.json"),
      JSON.stringify(meta, null, 2),
      "utf-8",
    );

    if (isRename) {
      const oldDir = path.join(
        process.cwd(),
        "public",
        "prototypes",
        person,
        oldSlug,
      );
      fs.rmSync(oldDir, { recursive: true, force: true });
    }
  } catch {
    // Local sync is best-effort; GitHub is the source of truth
  }

  return NextResponse.json({
    success: true,
    url: `/html/${person}/${slug}/`,
    person,
    slug,
  });
}
