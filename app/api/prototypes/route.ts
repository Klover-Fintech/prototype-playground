import type { Prototype } from "@/lib/prototypes";
import { NextResponse } from "next/server";

const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Klover-Fintech";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "prototype-playground";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "master";

async function ghFetch(endpoint: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`,
    {
      headers,
      next: { revalidate: 30 },
    },
  );
}

async function getGitHubPrototypes(): Promise<Prototype[]> {
  const results: Prototype[] = [];

  const res = await ghFetch(`/contents/public/prototypes?ref=${GITHUB_BRANCH}`);
  if (!res.ok) return results;

  const people = await res.json();
  if (!Array.isArray(people)) return results;

  for (const personDir of people) {
    if (personDir.type !== "dir" || personDir.name.startsWith(".")) continue;
    const person = personDir.name;

    const slugsRes = await ghFetch(
      `/contents/public/prototypes/${person}?ref=${GITHUB_BRANCH}`,
    );
    if (!slugsRes.ok) continue;

    const slugs = await slugsRes.json();
    if (!Array.isArray(slugs)) continue;

    for (const slugDir of slugs) {
      if (slugDir.type !== "dir" || slugDir.name.startsWith(".")) continue;
      const slug = slugDir.name;

      const filesRes = await ghFetch(
        `/contents/public/prototypes/${person}/${slug}?ref=${GITHUB_BRANCH}`,
      );
      if (!filesRes.ok) continue;

      const files = await filesRes.json();
      if (!Array.isArray(files)) continue;

      const hasIndex = files.some(
        (f: { name: string }) => f.name === "index.html",
      );
      const metaFile = files.find(
        (f: { name: string }) => f.name === "meta.json",
      );

      let collaborative = true;
      let displayName: string | undefined;

      if (metaFile) {
        try {
          const metaRes = await ghFetch(
            `/contents/public/prototypes/${person}/${slug}/meta.json?ref=${GITHUB_BRANCH}`,
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
          // ignore
        }
      }

      if (hasIndex) {
        results.push({
          person,
          slug,
          name: displayName,
          type: "html",
          href: `/html/${person}/${slug}`,
          collaborative,
        });
      }
    }
  }

  return results;
}

export async function GET() {
  const prototypes = await getGitHubPrototypes();

  // Also include React prototypes from the filesystem (these are in the codebase)
  const { getAllReactPrototypes } = await import("@/lib/prototypes");
  const reactPrototypes = getAllReactPrototypes();

  const all = [...reactPrototypes, ...prototypes];
  const grouped = new Map<string, Prototype[]>();

  for (const proto of all) {
    const existing = grouped.get(proto.person) || [];
    existing.push(proto);
    grouped.set(proto.person, existing);
  }

  const entries = Array.from(grouped.entries()).sort(([a], [b]) => {
    if (a === "examples") return 1;
    if (b === "examples") return -1;
    return a.localeCompare(b);
  });

  return NextResponse.json(entries);
}
