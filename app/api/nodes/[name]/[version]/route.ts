import { NextResponse } from "next/server";
import {
  getNodeManifest,
  getNodeDownloadUrl,
  getPresignedDownloadUrl,
} from "@/lib/r2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string; version: string }> },
) {
  const { name, version } = await params;

  const manifest = await getNodeManifest(name);
  if (!manifest) {
    return NextResponse.json(
      { error: `Node "${name}" not found` },
      { status: 404 },
    );
  }

  const resolvedVersion =
    version === "latest" ? manifest.latest : version;

  const versionEntry = manifest.versions.find(
    (v) => v.version === resolvedVersion,
  );
  if (!versionEntry) {
    return NextResponse.json(
      { error: `Version "${resolvedVersion}" not found for "${name}"` },
      { status: 404 },
    );
  }

  // Try public URL first, fall back to presigned
  const publicUrl = getNodeDownloadUrl(name, resolvedVersion);
  const downloadUrl =
    publicUrl ??
    (await getPresignedDownloadUrl(
      `nodes/${name}/versions/${resolvedVersion}.tar.gz`,
    ));

  return NextResponse.json({
    name,
    version: resolvedVersion,
    checksum: versionEntry.checksum,
    size: versionEntry.size,
    downloadUrl,
  });
}
