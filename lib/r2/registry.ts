/**
 * AMAROS Registry — R2 storage layout and helpers for node packages.
 *
 * Bucket key layout:
 *   nodes/<name>/metadata.json          — node manifest (latest)
 *   nodes/<name>/versions/<ver>.tar.gz  — versioned tarball
 *   nodes/<name>/readme.md              — rendered readme
 */

import { putObject, getObject, headObject, listObjects } from "./bucket";
import { PUBLIC_URL } from "./client";

// ── Types ────────────────────────────────────────────────────

export interface NodeManifest {
  name: string;
  description: string;
  author: string;
  organization?: string;
  license: string;
  repository?: string;
  latest: string;
  versions: VersionEntry[];
  tags: string[];
  capabilities: string[];
  subscribesTo: string[];
  publishesTo: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VersionEntry {
  version: string;
  publishedAt: string;
  checksum: string; // sha256
  size: number; // bytes
  downloads: number;
}

// ── Key helpers ─────────────────────────────────────────────

function nodePrefix(name: string) {
  return `nodes/${name}`;
}

function metadataKey(name: string) {
  return `${nodePrefix(name)}/metadata.json`;
}

function tarballKey(name: string, version: string) {
  return `${nodePrefix(name)}/versions/${version}.tar.gz`;
}

function readmeKey(name: string) {
  return `${nodePrefix(name)}/readme.md`;
}

// ── Registry operations ─────────────────────────────────────

/** Publish a new version of a node */
export async function publishNode(
  manifest: NodeManifest,
  tarball: Buffer | Uint8Array,
  readme?: string,
) {
  const version = manifest.latest;

  // Check if this version already exists
  const existing = await headObject(tarballKey(manifest.name, version));
  if (existing) {
    throw new Error(
      `Version ${version} of ${manifest.name} already exists. Bump the version to publish.`,
    );
  }
	const manifestVersionChecksum = manifest.versions.find((v) => v.version === version)?.checksum ?? "";
	if (manifestVersionChecksum == "") {
		throw new Error(
			`Manifest version entry for ${version} is missing checksum. Ensure the manifest includes a checksum for the new version.`,
		);
	}
  // Upload tarball
  await putObject(
    tarballKey(manifest.name, version),
    tarball,
    "application/gzip",
    {
      version,
      name: manifest.name,
      checksum: manifestVersionChecksum,
    },
  );

  // Upload/update metadata
  await putObject(
    metadataKey(manifest.name),
    JSON.stringify(manifest, null, 2),
    "application/json",
  );

  // Upload readme if provided
  if (readme) {
    await putObject(readmeKey(manifest.name), readme, "text/markdown");
  }
}

/** Get a node's manifest */
export async function getNodeManifest(
  name: string,
): Promise<NodeManifest | null> {
  try {
    const res = await getObject(metadataKey(name));
    const body = await res.Body?.transformToString();
    if (!body) return null;
    return JSON.parse(body) as NodeManifest;
  } catch {
    return null;
  }
}

/** Get the download URL for a specific version tarball */
export function getNodeDownloadUrl(name: string, version: string) {
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${tarballKey(name, version)}`;
  }
  // Fallback: caller should use presigned URL instead
  return null;
}

/** Get the tarball stream for a version */
export async function getNodeTarball(name: string, version: string) {
  return getObject(tarballKey(name, version));
}

/** Get a node's readme */
export async function getNodeReadme(name: string): Promise<string | null> {
  try {
    const res = await getObject(readmeKey(name));
    return (await res.Body?.transformToString()) ?? null;
  } catch {
    return null;
  }
}

/** List all published nodes (returns names) */
export async function listNodes(limit = 100) {
  const res = await listObjects("nodes/", limit);
  if (!res.Contents) return [];

  // Extract unique node names from keys like "nodes/<name>/metadata.json"
  const names = new Set<string>();
  for (const obj of res.Contents) {
    if (!obj.Key) continue;
    const parts = obj.Key.split("/");
    if (parts.length >= 2 && parts[0] === "nodes") {
      names.add(parts[1]);
    }
  }
  return Array.from(names);
}

/** Check if a node exists */
export async function nodeExists(name: string): Promise<boolean> {
  return (await headObject(metadataKey(name))) !== null;
}
