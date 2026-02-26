import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "Klover-Fintech";
const GITHUB_REPO = "prototype-playground";
const GITHUB_BRANCH = "master";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function personFromEmail(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  if (local.includes(".")) {
    const parts = local.split(".");
    return (parts[0][0] + parts.slice(1).join("")).replace(/[^a-z0-9]/g, "");
  }
  return local.replace(/[^a-z0-9]/g, "");
}

async function upsertFile(
  token: string,
  filePath: string,
  content: string,
  message: string,
) {
  let existingSha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      existingSha = existing.sha;
    }
  } catch {
    // doesn't exist yet
  }

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        branch: GITHUB_BRANCH,
        ...(existingSha && { sha: existingSha }),
      }),
    },
  );

  return res;
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

  const body = await req.json();
  const { name, html, externalUrl, collaborative } = body as {
    name: string;
    html?: string;
    externalUrl?: string;
    collaborative?: boolean;
  };

  if (!name || (!html && !externalUrl)) {
    return NextResponse.json(
      { error: "Name and either HTML content or external URL are required" },
      { status: 400 },
    );
  }

  const person = personFromEmail(session.user.email);
  const slug = slugify(name);

  if (html) {
    const filePath = `public/prototypes/${person}/${slug}/index.html`;
    const res = await upsertFile(
      token,
      filePath,
      html,
      `${externalUrl ? "Update" : "Add"} prototype: ${person}/${slug}`,
    );

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: "Failed to publish", details: error },
        { status: res.status },
      );
    }
  }

  const meta: Record<string, unknown> = { collaborative: !!collaborative };
  if (externalUrl) {
    meta.externalUrl = externalUrl;
  }

  const metaPath = `public/prototypes/${person}/${slug}/meta.json`;
  await upsertFile(
    token,
    metaPath,
    JSON.stringify(meta, null, 2),
    `Update metadata: ${person}/${slug}`,
  );

  const prototypeUrl = `/prototypes/${person}/${slug}/`;

  return NextResponse.json({
    success: true,
    url: prototypeUrl,
    person,
    slug,
  });
}
