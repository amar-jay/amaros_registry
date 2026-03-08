import { NextResponse } from "next/server";
import { getNodeManifest, getNodeReadme } from "@/lib/r2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  const manifest = await getNodeManifest(name);
  if (!manifest) {
    return NextResponse.json(
      { error: `Node "${name}" not found` },
      { status: 404 },
    );
  }

  const readme = await getNodeReadme(name);

  return NextResponse.json({ ...manifest, readme });
}
