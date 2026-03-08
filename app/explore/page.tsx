import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ExploreGrid } from "@/components/explore-grid";
import {
  IconTopologyRing3,
  IconPackage,
  IconNetwork,
  IconDownload,
} from "@tabler/icons-react";
import { Navbar } from "@/components/navbar";
import { listNodes, getNodeManifest, type NodeManifest } from "@/lib/r2";

export const metadata: Metadata = {
  title: "Explore Nodes — AMAROS Registry",
  description:
    "Browse, search, and discover distributed agent nodes in the AMAROS registry.",
};

async function getAllNodes(): Promise<NodeManifest[]> {
  const names = await listNodes(500);
  const manifests: NodeManifest[] = [];
  for (const name of names) {
    const manifest = await getNodeManifest(name);
    if (manifest) manifests.push(manifest);
  }
  return manifests;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: initialQuery } = await searchParams;
  const nodes = await getAllNodes();

  const totalDl = nodes.reduce(
    (sum, n) => sum + n.versions.reduce((s, v) => s + v.downloads, 0),
    0,
  );
  const totalOrgs = new Set(nodes.map((n) => n.organization).filter(Boolean))
    .size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Page header ── */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Explore Nodes
            </h1>
            <p className="mt-1 text-muted-foreground">
              Browse and search the full AMAROS node registry
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <IconPackage className="size-3.5" />
              <span>
                <strong className="text-foreground">{nodes.length}</strong>{" "}
                nodes
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <IconNetwork className="size-3.5" />
              <span>
                <strong className="text-foreground">{totalOrgs}</strong>{" "}
                organizations
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <IconDownload className="size-3.5" />
              <span>
                <strong className="text-foreground">
                  {totalDl >= 1000
                    ? `${(totalDl / 1000).toFixed(1)}k`
                    : totalDl}
                </strong>{" "}
                installs
              </span>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Grid ── */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <ExploreGrid nodes={nodes} initialQuery={initialQuery ?? ""} />
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <IconTopologyRing3 className="size-4 text-primary" />
            <span>AMAROS Registry</span>
          </div>
          <p>
            Distributed agent orchestration — Nodes that do one thing well.
          </p>
        </div>
      </footer>
    </div>
  );
}
