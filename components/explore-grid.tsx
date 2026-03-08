"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconSearch,
  IconDownload,
  IconHexagons,
  IconX,
  IconSortDescending,
  IconFilter,
  IconPackage,
} from "@tabler/icons-react";
import type { NodeManifest } from "@/lib/r2/registry";

type SortOption = "name" | "downloads" | "updated" | "created";

function totalDownloads(manifest: NodeManifest) {
  return manifest.versions.reduce((sum, v) => sum + v.downloads, 0);
}

function formatDownloads(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function ExploreGrid({
  nodes,
  initialQuery = "",
}: {
  nodes: NodeManifest[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("downloads");

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const node of nodes) {
      for (const tag of node.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }, [nodes]);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    const result = nodes.filter((node) => {
      // Search filter
      if (q) {
        const matchesName = node.name.toLowerCase().includes(q);
        const matchesDesc = node.description.toLowerCase().includes(q);
        const matchesTag = node.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAuthor = node.author.toLowerCase().includes(q);
        const matchesCap = node.capabilities.some((c) =>
          c.toLowerCase().includes(q),
        );
        if (
          !matchesName &&
          !matchesDesc &&
          !matchesTag &&
          !matchesAuthor &&
          !matchesCap
        )
          return false;
      }

      // Tag filter
      if (selectedTag && !node.tags.includes(selectedTag)) return false;

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "downloads":
          return totalDownloads(b) - totalDownloads(a);
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [nodes, query, selectedTag, sort]);

  const clearFilters = () => {
    setQuery("");
    setSelectedTag(null);
    setSort("downloads");
  };

  const hasActiveFilters = query || selectedTag || sort !== "downloads";

  return (
    <div className="space-y-6">
      {/* ── Search & Filters bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes by name, description, tag, or capability..."
            className="h-10 pl-9 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <IconX className="size-3.5" />
            </button>
          )}
        </div>

        {/* Tag filter */}
        <Select
          value={selectedTag ?? "all"}
          onValueChange={(v) => setSelectedTag(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <IconFilter className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="All tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <IconSortDescending className="size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Most downloads</SelectItem>
            <SelectItem value="updated">Recently updated</SelectItem>
            <SelectItem value="created">Newest first</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="shrink-0"
          >
            <IconX className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* ── Active tag pills ── */}
      {selectedTag && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Badge
            variant="secondary"
            className="cursor-pointer gap-1"
            onClick={() => setSelectedTag(null)}
          >
            {selectedTag}
            <IconX className="size-2.5" />
          </Badge>
        </div>
      )}

      {/* ── Results count ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length === nodes.length
            ? `${nodes.length} nodes`
            : `${filtered.length} of ${nodes.length} nodes`}
        </p>
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((node) => {
            const downloads = totalDownloads(node);
            return (
              <Link key={node.name} href={`/nodes/${node.name}`}>
                <Card className="group h-full cursor-pointer transition-colors hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <IconHexagons className="size-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                            {node.name}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground">
                            v{node.latest}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconDownload className="size-3" />
                        {formatDownloads(downloads)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-2 mb-3">
                      {node.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {node.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[11px] px-1.5 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {node.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-[11px] px-1.5 py-0"
                          >
                            +{node.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {node.author}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <IconPackage className="size-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium mb-1">No nodes found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {query
                ? `No nodes match "${query}". Try a different search term or remove filters.`
                : "No nodes match the current filters. Try removing some filters."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
