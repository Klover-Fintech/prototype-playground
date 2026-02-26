import fs from "fs";
import path from "path";

export interface Prototype {
  person: string;
  slug: string;
  type: "react" | "html" | "url";
  href: string;
  collaborative?: boolean;
  externalUrl?: string;
}

const IGNORED_DIRS = new Set(["_example", "node_modules", ".next"]);

function isIgnored(name: string) {
  return name.startsWith(".") || name.startsWith("_") || IGNORED_DIRS.has(name);
}

function getReactPrototypes(): Prototype[] {
  const prototypesDir = path.join(process.cwd(), "app", "(prototypes)");
  if (!fs.existsSync(prototypesDir)) return [];

  const results: Prototype[] = [];

  for (const person of fs.readdirSync(prototypesDir)) {
    if (isIgnored(person)) continue;
    if (person.startsWith("[")) continue; // skip dynamic route segments

    const personDir = path.join(prototypesDir, person);
    if (!fs.statSync(personDir).isDirectory()) continue;

    for (const slug of fs.readdirSync(personDir)) {
      if (isIgnored(slug)) continue;

      const slugDir = path.join(personDir, slug);
      if (!fs.statSync(slugDir).isDirectory()) continue;

      const hasPage =
        fs.existsSync(path.join(slugDir, "page.tsx")) ||
        fs.existsSync(path.join(slugDir, "page.jsx"));

      if (hasPage) {
        results.push({
          person,
          slug,
          type: "react",
          href: `/${person}/${slug}`,
        });
      }
    }
  }

  return results;
}

function getHtmlPrototypes(): Prototype[] {
  const publicDir = path.join(process.cwd(), "public", "prototypes");
  if (!fs.existsSync(publicDir)) return [];

  const results: Prototype[] = [];

  for (const person of fs.readdirSync(publicDir)) {
    if (isIgnored(person)) continue;

    const personDir = path.join(publicDir, person);
    if (!fs.statSync(personDir).isDirectory()) continue;

    for (const slug of fs.readdirSync(personDir)) {
      if (isIgnored(slug)) continue;

      const slugDir = path.join(personDir, slug);
      if (!fs.statSync(slugDir).isDirectory()) continue;

      const hasIndex = fs.existsSync(path.join(slugDir, "index.html"));

      let collaborative = true;
      let externalUrl = "";
      const metaPath = path.join(slugDir, "meta.json");
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          collaborative = meta.collaborative !== false;
          externalUrl = meta.externalUrl || "";
        } catch {
          // invalid meta.json
        }
      }

      if (externalUrl) {
        results.push({
          person,
          slug,
          type: "url",
          href: `/embed/${person}/${slug}`,
          collaborative,
          externalUrl,
        });
      } else if (hasIndex) {
        results.push({
          person,
          slug,
          type: "html",
          href: `/html/${person}/${slug}`,
          collaborative,
        });
      }
    }
  }

  return results;
}

export function getAllPrototypes(): Map<string, Prototype[]> {
  const all = [...getReactPrototypes(), ...getHtmlPrototypes()];
  const grouped = new Map<string, Prototype[]>();

  for (const proto of all) {
    const existing = grouped.get(proto.person) || [];
    existing.push(proto);
    grouped.set(proto.person, existing);
  }

  return grouped;
}
