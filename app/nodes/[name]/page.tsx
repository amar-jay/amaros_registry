import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CopyButton } from "@/components/copy-button";
import {
  IconTopologyRing3,
  IconDownload,
  IconCalendar,
  IconTag,
  IconScale,
  IconBrandGithub,
  IconTerminal2,
  IconArrowLeft,
  IconPackage,
  IconHexagons,
  IconArrowUpRight,
  IconHeartbeat,
  IconNetwork,
  IconFileText,
  IconVersions,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Navbar } from "@/components/navbar";
import {
  getNodeManifest,
  getNodeReadme,
  type NodeManifest,
} from "@/lib/r2";

// ── Data fetching ────────────────────────────────────────────

async function getNode(name: string) {
  const manifest = await getNodeManifest(name);
  if (!manifest) return null;
  const readme = await getNodeReadme(name);
  return { manifest, readme };
}

// ── Metadata ────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const data = await getNode(name);
  if (!data) return { title: "Node Not Found — AMAROS Registry" };
  return {
    title: `${data.manifest.name} — AMAROS Registry`,
    description: data.manifest.description,
  };
}

// ── Helpers ─────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function totalDownloads(manifest: NodeManifest) {
  return manifest.versions.reduce((sum, v) => sum + v.downloads, 0);
}

// ── Page ────────────────────────────────────────────────────

export default async function NodePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const data = await getNode(name);
  if (!data) notFound();

  const { manifest, readme } = data;
  const installCmd = `amaros install ${manifest.name}`;
  const downloads = totalDownloads(manifest);
  const latestVersion = manifest.versions.find(
    (v) => v.version === manifest.latest,
  );
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const tarballApiUrl = `${proto}://${host}/api/nodes/${manifest.name}/${manifest.latest}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Breadcrumb & back ── */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-3.5" />
          Back to registry
        </Link>
      </div>

      {/* ── Header ── */}
      <section className="mx-auto max-w-6xl px-6 pt-6 pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left side — name, description, tags */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconHexagons className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {manifest.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>by {manifest.author}</span>
                  {manifest.organization && (
                    <>
                      <span>·</span>
                      <span>{manifest.organization}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {manifest.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {manifest.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right side — install card */}
          <Card className="w-full shrink-0 md:w-80">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-medium">Install</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-sm">
                <IconTerminal2 className="size-3.5 shrink-0 text-muted-foreground" />
                <code className="flex-1 truncate text-muted-foreground">
                  {installCmd}
                </code>
                <CopyButton text={installCmd} />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <IconTag className="size-3" />
                    Version
                  </p>
                  <p className="font-medium">{manifest.latest}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <IconScale className="size-3" />
                    License
                  </p>
                  <p className="font-medium">{manifest.license}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <IconDownload className="size-3" />
                    Downloads
                  </p>
                  <p className="font-medium">
                    {downloads.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <IconPackage className="size-3" />
                    Size
                  </p>
                  <p className="font-medium">
                    {latestVersion ? formatBytes(latestVersion.size) : "—"}
                  </p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <IconCalendar className="size-3" />
                    Last published
                  </p>
                  <p className="font-medium">
                    {formatDate(manifest.updatedAt)}
                  </p>
                </div>
              </div>

              {manifest.repository && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={manifest.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconBrandGithub className="size-4" />
                      Repository
                      <IconArrowUpRight className="size-3" />
                    </a>
                  </Button>
                </>
              )}

              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Tarball</p>
                <div className="grid grid-cols-2 gap-2">
                  <CopyButton text={`${tarballApiUrl}?download`} variant="dark" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={`${tarballApiUrl}?download`}>
                      <IconDownload className="size-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Tabs: Readme / Versions / Details ── */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="readme">
          <TabsList>
            <TabsTrigger value="readme" className="gap-1.5">
              <IconFileText className="size-3.5" />
              Readme
            </TabsTrigger>
            <TabsTrigger value="versions" className="gap-1.5">
              <IconVersions className="size-3.5" />
              Versions
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {manifest.versions.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-1.5">
              <IconInfoCircle className="size-3.5" />
              Details
            </TabsTrigger>
          </TabsList>

          {/* ── Readme tab ── */}
          <TabsContent value="readme" className="pt-6">
            {readme ? (
              <Card>
                <CardContent className="pt-6">
                  <MarkdownRenderer content={readme} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <IconFileText className="size-10 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    No readme available for this node.
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    The author hasn&apos;t published a readme yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Versions tab ── */}
          <TabsContent value="versions" className="pt-6">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Checksum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manifest.versions
                      .slice()
                      .reverse()
                      .map((v) => (
                        <TableRow key={v.version}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {v.version}
                              {v.version === manifest.latest && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  latest
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(v.publishedAt)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatBytes(v.size)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {v.downloads.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                              {v.checksum.slice(0, 12)}…
                            </code>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Details tab ── */}
          <TabsContent value="details" className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconHexagons className="size-4 text-primary" />
                    Capabilities
                  </CardTitle>
                  <CardDescription>
                    What this node can do
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {manifest.capabilities.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {manifest.capabilities.map((cap) => (
                        <Badge key={cap} variant="outline">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No capabilities listed.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Subscribes To */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconHeartbeat className="size-4 text-primary" />
                    Subscribes To
                  </CardTitle>
                  <CardDescription>
                    Topics this node listens to
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {manifest.subscribesTo.length > 0 ? (
                    <div className="space-y-1.5">
                      {manifest.subscribesTo.map((topic) => (
                        <div
                          key={topic}
                          className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-mono text-sm"
                        >
                          <IconNetwork className="size-3 text-muted-foreground" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No topic subscriptions.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Publishes To */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconArrowUpRight className="size-4 text-primary" />
                    Publishes To
                  </CardTitle>
                  <CardDescription>
                    Topics this node emits to
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {manifest.publishesTo.length > 0 ? (
                    <div className="space-y-1.5">
                      {manifest.publishesTo.map((topic) => (
                        <div
                          key={topic}
                          className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-mono text-sm"
                        >
                          <IconNetwork className="size-3 text-muted-foreground" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No topic publications.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconInfoCircle className="size-4 text-primary" />
                    Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Author</dt>
                      <dd className="font-medium">{manifest.author}</dd>
                    </div>
                    {manifest.organization && (
                      <div>
                        <dt className="text-muted-foreground">Organization</dt>
                        <dd className="font-medium">
                          {manifest.organization}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-muted-foreground">License</dt>
                      <dd className="font-medium">{manifest.license}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="font-medium">
                        {formatDate(manifest.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last updated</dt>
                      <dd className="font-medium">
                        {formatDate(manifest.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <IconTopologyRing3 className="size-4 text-primary" />
            <span>AMAROS Registry</span>
          </div>
          <p>Distributed agent orchestration — Nodes that do one thing well.</p>
        </div>
      </footer>
    </div>
  );
}
