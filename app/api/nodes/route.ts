import { NextResponse } from "next/server";
import { listNodes, getNodeManifest, type NodeManifest } from "@/lib/r2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  const tag = searchParams.get("tag")?.toLowerCase();

  const names = await listNodes(500);

  const manifests: NodeManifest[] = [];
  for (const name of names) {
    const manifest = await getNodeManifest(name);
    if (!manifest) continue;

    // Filter by search query
    if (
      query &&
      !manifest.name.toLowerCase().includes(query) &&
      !manifest.description.toLowerCase().includes(query) &&
      !manifest.tags.some((t) => t.toLowerCase().includes(query))
    ) {
      continue;
    }

    // Filter by tag
    if (tag && !manifest.tags.some((t) => t.toLowerCase() === tag)) {
      continue;
    }

    manifests.push(manifest);
  }

  return NextResponse.json({ nodes: manifests, count: manifests.length });
}
