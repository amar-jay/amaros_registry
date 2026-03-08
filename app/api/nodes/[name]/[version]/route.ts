import { NextResponse } from "next/server";
import {
  getNodeManifest,
  getNodeTarball,
} from "@/lib/r2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string; version: string }> },
) {
  const { name, version } = await params;
  const { searchParams } = new URL(request.url);

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

  // If ?download is present, stream the tarball directly
  if (searchParams.has("download")) {
    const obj = await getNodeTarball(name, resolvedVersion);
    if (!obj?.Body) {
      return NextResponse.json(
        { error: "Tarball not found in storage" },
        { status: 404 },
      );
    }

    const bytes = await obj.Body.transformToByteArray();
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${name}-${resolvedVersion}.tar.gz"`,
        "Content-Length": String(bytes.length),
      },
    });
  }

  return NextResponse.json({
    name,
    version: resolvedVersion,
    checksum: versionEntry.checksum,
    size: versionEntry.size,
  });
}
