import { headers } from "next/headers";
import type { NodeManifest } from "@/lib/r2/registry";

export type { NodeManifest };

/** Derive the app's base URL from incoming request headers. */
async function getBaseUrl(): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** Fetch all nodes, optionally filtered by search query or tag. */
export async function fetchAllNodes(
  opts: { q?: string; tag?: string } = {},
): Promise<NodeManifest[]> {
  const base = await getBaseUrl();
  const url = new URL("/api/nodes", base);
  if (opts.q) url.searchParams.set("q", opts.q);
  if (opts.tag) url.searchParams.set("tag", opts.tag);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch nodes: ${res.status}`);
  const data = await res.json();
  return data.nodes as NodeManifest[];
}

/** Fetch a single node's manifest and readme by name. */
export async function fetchNode(
  name: string,
): Promise<(NodeManifest & { readme: string | null }) | null> {
  const base = await getBaseUrl();
  const res = await fetch(new URL(`/api/nodes/${encodeURIComponent(name)}`, base), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch node "${name}": ${res.status}`);
  return res.json();
}
