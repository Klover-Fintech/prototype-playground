import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type RouteParams = { params: Promise<{ person: string; slug: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { person, slug } = await params;
  const metaPath = path.join(
    process.cwd(),
    "public",
    "prototypes",
    person,
    slug,
    "meta.json",
  );

  let collaborative = true;
  let externalUrl = "";
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      collaborative = meta.collaborative !== false;
      externalUrl = meta.externalUrl || "";
    } catch {
      // invalid meta.json, default to enabled
    }
  }

  return NextResponse.json({ collaborative, externalUrl });
}
