"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/explore");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-xl items-center gap-2">
      <div className="relative flex-1">
        <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search nodes... (e.g. llm-inference, sqlite-store)"
          className="h-11 pl-9 text-sm"
        />
      </div>
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}
