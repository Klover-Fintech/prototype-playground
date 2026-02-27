import { auth } from "@/auth";
import { personFromEmail } from "@/lib/people";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Klover-Fintech";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "prototype-playground";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "master";

type RouteParams = { params: Promise<{ person: string; slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
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

  const { person, slug } = await params;

  let html = "";
  const filePath = `public/prototypes/${person}/${slug}/index.html`;
  const htmlRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (htmlRes.ok) {
    const data = await htmlRes.json();
    html = Buffer.from(data.content, "base64").toString("utf-8");
  }

  let collaborative = true;
  let displayName: string | undefined;
  const metaPath = `public/prototypes/${person}/${slug}/meta.json`;
  try {
    const metaRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${metaPath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      const meta = JSON.parse(
        Buffer.from(metaData.content, "base64").toString("utf-8"),
      );
      collaborative = meta.collaborative !== false;
      if (meta.name) displayName = meta.name;
    }
  } catch {
    // no metadata file
  }

  if (!html) {
    return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
  }

  return NextResponse.json({
    html,
    person,
    slug,
    name: displayName,
    collaborative,
  });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

  const { person, slug } = await params;
  const currentPerson = personFromEmail(session.user.email);

  if (currentPerson !== person) {
    return NextResponse.json(
      { error: "You can only delete your own prototypes" },
      { status: 403 },
    );
  }

  const filePath = `public/prototypes/${person}/${slug}/index.html`;

  const checkRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!checkRes.ok) {
    return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
  }

  const existing = await checkRes.json();

  const deleteRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete prototype: ${person}/${slug}`,
        sha: existing.sha,
        branch: GITHUB_BRANCH,
      }),
    },
  );

  if (!deleteRes.ok) {
    const error = await deleteRes.json();
    return NextResponse.json(
      { error: "Failed to delete", details: error },
      { status: deleteRes.status },
    );
  }

  return NextResponse.json({ success: true });
}
