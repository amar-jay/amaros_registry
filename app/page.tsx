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
import { Separator } from "@/components/ui/separator";
import {
  IconSearch,
  IconDownload,
  IconNetwork,
  IconTopologyRing3,
  IconBrain,
  IconApi,
  IconMessageCircle,
  IconDatabase,
  IconCloudComputing,
  IconHeartbeat,
  IconArrowRight,
  IconBrandGithub,
  IconTerminal2,
  IconHexagons,
  IconCpu,
  IconWorldWww,
  IconChartDots3,
  IconPackage,
  IconClock,
  IconStack2,
} from "@tabler/icons-react";

const FEATURED_NODES = [
  {
    name: "llm-inference",
    description:
      "Call OpenAI, Anthropic, Ollama, or any LLM provider. Handles retries, streaming, and token tracking.",
    downloads: "12.4k",
    version: "2.1.0",
    icon: IconBrain,
    tags: ["ai", "inference", "models"],
  },
  {
    name: "http-request",
    description:
      "Make HTTP requests to any external API. Supports auth, rate limiting, and response parsing.",
    downloads: "9.8k",
    version: "1.5.3",
    icon: IconApi,
    tags: ["http", "api", "external"],
  },
  {
    name: "sqlite-store",
    description:
      "Persistent key-value and relational storage backed by SQLite. Auto-migration support.",
    downloads: "8.2k",
    version: "3.0.1",
    icon: IconDatabase,
    tags: ["storage", "database", "persistence"],
  },
  {
    name: "msg-relay",
    description:
      "Send and receive messages across WhatsApp, Telegram, Slack, and Discord via unified interface.",
    downloads: "6.1k",
    version: "1.2.0",
    icon: IconMessageCircle,
    tags: ["messaging", "relay", "integration"],
  },
  {
    name: "web-scraper",
    description:
      "Fetch and parse web content. Headless browser support, CSS selectors, and structured extraction.",
    downloads: "5.7k",
    version: "2.0.4",
    icon: IconWorldWww,
    tags: ["scraping", "web", "extraction"],
  },
  {
    name: "cron-scheduler",
    description:
      "Schedule recurring tasks with cron expressions. Supports event-driven triggers and chaining.",
    downloads: "7.3k",
    version: "1.8.2",
    icon: IconClock,
    tags: ["scheduler", "cron", "events"],
  },
];

const CONCEPTS = [
  {
    icon: IconHexagons,
    title: "Nodes",
    description:
      "Specialized units that do one thing well. They run in a loop, subscribe to topics, and report capabilities via heartbeats. Ephemeral by design — they can come and go.",
  },
  {
    icon: IconChartDots3,
    title: "Topics & Events",
    description:
      "Nodes subscribe to topics and react to events. Events work like CRON jobs but can be triggered externally or by internal state changes. Message-passing across organizations.",
  },
  {
    icon: IconStack2,
    title: "Memory Hierarchy",
    description:
      "Three-tier storage: in-memory for hot data, file-based (README) for context, and SQLite for persistent structured storage. Each node manages its own memory stack.",
  },
  {
    icon: IconCloudComputing,
    title: "Distributed Graph",
    description:
      "Nodes form a distributed graph spanning organizations. Direct function calls within an org, message passing across orgs. Like ROS meets ZeroMQ.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <IconTopologyRing3 className="size-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              AMAROS<span className="text-muted-foreground font-normal"> Registry</span>
            </span>
          </div>

          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <a href="#concepts" className="text-muted-foreground hover:text-foreground transition-colors">
              Concepts
            </a>
            <a href="#install" className="text-muted-foreground hover:text-foreground transition-colors">
              Get Started
            </a>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <IconBrandGithub className="size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-background)_70%)]" />

        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
          <Badge variant="secondary" className="mb-6">
            <IconHeartbeat className="size-3" />
            v0.1.0 — Early Access
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The node registry for{" "}
            <span className="text-primary">AMAROS</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover, install, and compose distributed agent nodes.
            Each node does one thing well — together they form powerful
            orchestration workflows across organizations.
          </p>

          {/* Search */}
          <div className="mx-auto mt-10 flex max-w-xl items-center gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search nodes... (e.g. llm-inference, sqlite-store)"
                className="h-11 pl-9 text-sm"
              />
            </div>
            <Button size="lg">Search</Button>
          </div>

          {/* Quick install */}
          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-lg border bg-muted/50 px-4 py-2.5 font-mono text-sm">
            <IconTerminal2 className="size-4 shrink-0 text-muted-foreground" />
            <code className="text-muted-foreground">
              amaros install <span className="text-foreground">llm-inference</span>
            </code>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconPackage className="size-4" />
              <span><strong className="text-foreground">128</strong> nodes</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <IconNetwork className="size-4" />
              <span><strong className="text-foreground">42</strong> organizations</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <IconDownload className="size-4" />
              <span><strong className="text-foreground">84k</strong> installs</span>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Featured Nodes ── */}
      <section id="nodes" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular Nodes</h2>
            <p className="mt-1 text-muted-foreground">
              Most installed nodes this month
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/explore">
              View all <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_NODES.map((node) => (
            <Link key={node.name} href={`/nodes/${node.name}`}>
            <Card
              className="group cursor-pointer transition-colors hover:border-primary/40 h-full"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <node.icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {node.name}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        v{node.version}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <IconDownload className="size-3" />
                    {node.downloads}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-2">
                  {node.description}
                </CardDescription>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {node.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[11px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Concepts ── */}
      <section id="concepts" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            How AMAROS Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            A distributed graph of specialized nodes, communicating through
            topics and events
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {CONCEPTS.map((concept) => (
            <Card key={concept.title} className="border-dashed">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <concept.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{concept.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {concept.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Get Started ── */}
      <section id="install" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">Get Started</h2>
          <p className="mt-2 text-muted-foreground">
            Install AMAROS and start composing nodes in minutes
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {[
            {
              step: "1",
              title: "Install the CLI",
              code: "curl -fsSL https://amaros.dev/install | sh",
            },
            {
              step: "2",
              title: "Initialize a workspace",
              code: "amaros init my-workspace",
            },
            {
              step: "3",
              title: "Add nodes from the registry",
              code: "amaros install llm-inference sqlite-store msg-relay",
            },
            {
              step: "4",
              title: "Start the orchestrator",
              code: "amaros up",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 rounded-lg border bg-card p-4"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <div className="mt-1.5 flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-mono text-sm">
                  <IconTerminal2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <code className="truncate text-muted-foreground">{item.code}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Architecture strip ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-xl border bg-muted/30 p-8 md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
            {/* Memory hierarchy visual */}
            <div className="flex w-full flex-col items-center gap-3 md:w-1/3">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Memory Hierarchy
              </p>
              {[
                { label: "In-Memory", sublabel: "Hot / real-time", color: "bg-primary" },
                { label: "File (README)", sublabel: "Context / docs", color: "bg-primary/70" },
                { label: "SQLite", sublabel: "Persistent / structured", color: "bg-primary/40" },
              ].map((tier, i) => (
                <div
                  key={tier.label}
                  className={`flex w-full items-center justify-between rounded-md border px-4 py-3`}
                  style={{ maxWidth: `${100 - i * 5}%` }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${tier.color}`} />
                    <span className="text-sm font-medium">{tier.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tier.sublabel}
                  </span>
                </div>
              ))}
            </div>

            <Separator orientation="vertical" className="hidden h-32 md:block" />

            {/* Node communication */}
            <div className="flex flex-1 flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Node Communication
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-background p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <IconCpu className="size-4 text-primary" />
                    Same Organization
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct function calls, shared memory, zero-copy data.
                  </p>
                </div>
                <div className="rounded-md border bg-background p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <IconNetwork className="size-4 text-primary" />
                    Cross Organization
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Message passing over topics, serialized payloads, heartbeat-verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t bg-muted/30">
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
