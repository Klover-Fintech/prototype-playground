import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GITHUB_OWNER = "Klover-Fintech";
const GITHUB_REPO = "prototype-playground";
const GITHUB_BRANCH = "master";

function personFromEmail(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  if (local.includes(".")) {
    const parts = local.split(".");
    return (parts[0][0] + parts.slice(1).join("")).replace(/[^a-z0-9]/g, "");
  }
  return local.replace(/[^a-z0-9]/g, "");
}

type RouteParams = { params: Promise<{ person: string; slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { person, slug } = await params;
  const baseDir = path.join(
    process.cwd(),
    "public",
    "prototypes",
    person,
    slug,
  );
  const htmlPath = path.join(baseDir, "index.html");
  const metaPath = path.join(baseDir, "meta.json");

  let html = "";
  if (fs.existsSync(htmlPath)) {
    html = fs.readFileSync(htmlPath, "utf-8");
  }

  let collaborative = true;
  let externalUrl = "";
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      collaborative = meta.collaborative !== false;
      externalUrl = meta.externalUrl || "";
    } catch {
      // invalid meta
    }
  }

  if (!html && !externalUrl) {
    return NextResponse.json({ error: "Prototype not found" }, { status: 404 });
  }

  return NextResponse.json({ html, externalUrl, person, slug, collaborative });
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
