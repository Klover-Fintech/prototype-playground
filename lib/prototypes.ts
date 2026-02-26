import fs from "fs";
import path from "path";

export interface Prototype {
  person: string;
  slug: string;
  type: "react" | "html";
  href: string;
  collaborative?: boolean;
}

const IGNORED_DIRS = new Set(["_example", "node_modules", ".next"]);

function isIgnored(name: string) {
  return name.startsWith(".") || name.startsWith("_") || IGNORED_DIRS.has(name);
}

export function getAllReactPrototypes(): Prototype[] {
  const prototypesDir = path.join(process.cwd(), "app", "(prototypes)");
  if (!fs.existsSync(prototypesDir)) return [];

  const results: Prototype[] = [];

  for (const person of fs.readdirSync(prototypesDir)) {
    if (isIgnored(person)) continue;
    if (person.startsWith("[")) continue;

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
