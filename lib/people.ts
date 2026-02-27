/**
 * Shared helpers for person (email → identifier) and slug (name ↔ URL segment) handling.
 * Used by API routes, app-shell, and publish page for consistency.
 */

export function personFromEmail(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  if (local.includes(".")) {
    const parts = local.split(".");
    return (parts[0][0] + parts.slice(1).join("")).replace(/[^a-z0-9]/g, "");
  }
  return local.replace(/[^a-z0-9]/g, "");
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function unslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Title-case display label from a URL slug (e.g. "hello-world" → "Hello World"). */
export function formatSlug(slug: string): string {
  return unslugify(slug);
}
