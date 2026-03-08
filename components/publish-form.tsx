"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconUpload,
  IconX,
  IconPlus,
  IconLoader2,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";

export function PublishForm() {
  const router = useRouter();

  // form fields
  const [name, setName] = useState("");
  const [version, setVersion] = useState("0.1.0");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [organization, setOrganization] = useState("");
  const [license, setLicense] = useState("MIT");
  const [repository, setRepository] = useState("");

  // array fields
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capInput, setCapInput] = useState("");
  const [subscribesTo, setSubscribesTo] = useState<string[]>([]);
  const [subInput, setSubInput] = useState("");
  const [publishesTo, setPublishesTo] = useState<string[]>([]);
  const [pubInput, setPubInput] = useState("");

  // file & readme
  const [tarball, setTarball] = useState<File | null>(null);
  const [readme, setReadme] = useState("");

  // status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function addToList(
    list: string[],
    setList: (v: string[]) => void,
    input: string,
    setInput: (v: string) => void,
  ) {
    const val = input.trim().toLowerCase();
    if (val && !list.includes(val)) {
      setList([...list, val]);
    }
    setInput("");
  }

  function removeFromList(
    list: string[],
    setList: (v: string[]) => void,
    item: string,
  ) {
    setList(list.filter((i) => i !== item));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!tarball) {
      setError("Please select a tarball file to upload.");
      setSubmitting(false);
      return;
    }

    const now = new Date().toISOString();
    const manifest = {
      name,
      description,
      author,
      organization: organization || undefined,
      license,
      repository: repository || undefined,
      latest: version,
      versions: [
        {
          version,
          publishedAt: now,
          checksum: "",
          sha256: "",
          size: tarball.size,
          downloads: 0,
        },
      ],
      tags,
      capabilities,
      subscribesTo,
      publishesTo,
      createdAt: now,
      updatedAt: now,
    };

    const formData = new FormData();
    formData.set("manifest", JSON.stringify(manifest));
    formData.set("tarball", tarball);
    if (readme.trim()) formData.set("readme", readme);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to publish node.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/nodes/${data.name}`), 1500);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <IconCheck className="size-6" />
          </div>
          <h2 className="text-xl font-semibold">Published successfully!</h2>
          <p className="text-muted-foreground">
            Redirecting to <strong>{name}</strong>…
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <IconAlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Basic Info ── */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            The core identity of your node package.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Node Name *</Label>
              <Input
                id="name"
                placeholder="my-node"
                value={name}
                onChange={(e) => setName(e.target.value)}
                pattern="^[a-z0-9]([a-z0-9-]*[a-z0-9])?$"
                title="Lowercase alphanumeric with hyphens"
                required
              />
              <p className="text-xs text-muted-foreground">
                Lowercase, alphanumeric, hyphens only.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                placeholder="0.1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="A brief description of what your node does…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Your org (optional)"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="license">License *</Label>
              <Input
                id="license"
                placeholder="MIT"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repository">Repository</Label>
              <Input
                id="repository"
                placeholder="https://github.com/you/node"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Topics & Capabilities ── */}
      <Card>
        <CardHeader>
          <CardTitle>Topics & Capabilities</CardTitle>
          <CardDescription>
            Define what your node subscribes to, publishes, and can do.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToList(tags, setTags, tagInput, setTagInput);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addToList(tags, setTags, tagInput, setTagInput)
                }
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 pr-1">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeFromList(tags, setTags, t)}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Capabilities */}
          <div className="space-y-2">
            <Label>Capabilities</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a capability…"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToList(
                      capabilities,
                      setCapabilities,
                      capInput,
                      setCapInput,
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addToList(
                    capabilities,
                    setCapabilities,
                    capInput,
                    setCapInput,
                  )
                }
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
            {capabilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {capabilities.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1 pr-1">
                    {c}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(capabilities, setCapabilities, c)
                      }
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Subscribes To */}
          <div className="space-y-2">
            <Label>Subscribes To</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Topic name…"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToList(
                      subscribesTo,
                      setSubscribesTo,
                      subInput,
                      setSubInput,
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addToList(
                    subscribesTo,
                    setSubscribesTo,
                    subInput,
                    setSubInput,
                  )
                }
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
            {subscribesTo.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {subscribesTo.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 pr-1">
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(subscribesTo, setSubscribesTo, s)
                      }
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Publishes To */}
          <div className="space-y-2">
            <Label>Publishes To</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Topic name…"
                value={pubInput}
                onChange={(e) => setPubInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToList(
                      publishesTo,
                      setPublishesTo,
                      pubInput,
                      setPubInput,
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  addToList(
                    publishesTo,
                    setPublishesTo,
                    pubInput,
                    setPubInput,
                  )
                }
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
            {publishesTo.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {publishesTo.map((p) => (
                  <Badge key={p} variant="secondary" className="gap-1 pr-1">
                    {p}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromList(publishesTo, setPublishesTo, p)
                      }
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Files ── */}
      <Card>
        <CardHeader>
          <CardTitle>Package Files</CardTitle>
          <CardDescription>
            Upload your node tarball and optionally provide a README.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tarball">Tarball (.tar.gz) *</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="tarball"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <IconUpload className="size-4" />
                {tarball ? tarball.name : "Choose file…"}
              </label>
              <input
                id="tarball"
                type="file"
                accept=".tar.gz,.tgz,application/gzip"
                className="hidden"
                onChange={(e) => setTarball(e.target.files?.[0] ?? null)}
              />
              {tarball && (
                <span className="text-xs text-muted-foreground">
                  {(tarball.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="readme">README (Markdown)</Label>
            <Textarea
              id="readme"
              placeholder="# My Node&#10;&#10;Describe your node here…"
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Submit ── */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              Publishing…
            </>
          ) : (
            <>
              <IconUpload className="size-4" />
              Publish Node
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
