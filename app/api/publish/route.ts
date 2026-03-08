import { NextResponse } from "next/server";
import { publishNode, type NodeManifest } from "@/lib/r2";

export async function POST(request: Request) {
  // TODO: Add authentication (API key, JWT, etc.)

  const formData = await request.formData();
  const manifestRaw = formData.get("manifest");
  const tarball = formData.get("tarball");
  const readme = formData.get("readme");

  if (!manifestRaw || typeof manifestRaw !== "string") {
    return NextResponse.json(
      { error: "Missing 'manifest' field (JSON string)" },
      { status: 400 },
    );
  }

  if (!tarball || !(tarball instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'tarball' field (file upload)" },
      { status: 400 },
    );
  }

  let manifest: NodeManifest;
  try {
    manifest = JSON.parse(manifestRaw);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in 'manifest' field" },
      { status: 400 },
    );
  }

  if (!manifest.name || !manifest.latest || !manifest.versions?.length) {
    return NextResponse.json(
      { error: "Manifest must include name, latest, and versions" },
      { status: 400 },
    );
  }

  // Validate node name format (lowercase, alphanumeric, hyphens)
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(manifest.name)) {
    return NextResponse.json(
      { error: "Node name must be lowercase alphanumeric with hyphens" },
      { status: 400 },
    );
  }

  const tarballBuffer = Buffer.from(await tarball.arrayBuffer());
  const readmeText =
    readme && typeof readme === "string" ? readme : undefined;

  try {
    await publishNode(manifest, tarballBuffer, readmeText);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to publish";
    return NextResponse.json({ error: message }, { status: 409 });
  }

  return NextResponse.json(
    {
      ok: true,
      name: manifest.name,
      version: manifest.latest,
    },
    { status: 201 },
  );
}
