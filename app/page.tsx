import { getAllPrototypes } from "@/lib/prototypes";
import DirectoryPage from "@/components/directory";

export const dynamic = "force-dynamic";

export default function Home() {
  const grouped = getAllPrototypes();
  const entries = Array.from(grouped.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return <DirectoryPage entries={entries} />;
}
