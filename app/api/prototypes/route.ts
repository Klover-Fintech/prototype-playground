import { NextResponse } from "next/server";
import { getAllPrototypes } from "@/lib/prototypes";

export async function GET() {
  const grouped = getAllPrototypes();
  const entries = Array.from(grouped.entries()).sort(([a], [b]) => {
    if (a === "examples") return 1;
    if (b === "examples") return -1;
    return a.localeCompare(b);
  });

  return NextResponse.json(entries);
}
