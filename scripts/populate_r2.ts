/**
 * Seed script — populates the R2 bucket with sample AMAROS nodes.
 * Run with: bun run scripts/populate_r2.ts
 */

import { createHash } from "crypto";
import { gzipSync } from "zlib";
import { putObject } from "../lib/r2/bucket";
import type { NodeManifest } from "../lib/r2/registry";

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;

// ── Seed data ───────────────────────────────────────────────

const NODES: {
  manifest: NodeManifest;
  readme: string;
}[] = [
  {
    manifest: {
      name: "llm-inference",
      description:
        "Call OpenAI, Anthropic, Ollama, or any LLM provider. Handles retries, streaming, and token tracking.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      repository: "https://github.com/amaros-project/llm-inference",
      latest: "2.1.0",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-06-15T10:00:00Z",
          checksum: "",
          size: 0,
          downloads: 3200,
        },
        {
          version: "2.0.0",
          publishedAt: "2025-11-02T14:30:00Z",
          checksum: "",
          size: 0,
          downloads: 5800,
        },
        {
          version: "2.1.0",
          publishedAt: "2026-01-20T09:15:00Z",
          checksum: "",
          size: 0,
          downloads: 3400,
        },
      ],
      tags: ["ai", "inference", "models", "llm", "openai", "anthropic"],
      capabilities: ["text-generation", "streaming", "token-counting", "multi-provider"],
      subscribesTo: ["llm.request", "llm.batch"],
      publishesTo: ["llm.response", "llm.usage"],
      createdAt: "2025-06-15T10:00:00Z",
      updatedAt: "2026-01-20T09:15:00Z",
    },
    readme: `# llm-inference

A multi-provider LLM inference node for AMAROS.

## Features

- **Multi-provider support** — OpenAI, Anthropic, Ollama, Groq, Mistral, and any OpenAI-compatible API
- **Streaming** — Token-by-token streaming with back-pressure support
- **Retries** — Exponential backoff with jitter, configurable max attempts
- **Token tracking** — Per-request and cumulative token usage metrics
- **Rate limiting** — Provider-aware rate limiting with queue management

## Configuration

\`\`\`yaml
provider: openai
model: gpt-4o
max_tokens: 4096
temperature: 0.7
retry:
  max_attempts: 3
  backoff_base: 1.5
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`llm.request\` | Subscribe | Incoming inference requests |
| \`llm.batch\` | Subscribe | Batch inference requests |
| \`llm.response\` | Publish | Completed inference results |
| \`llm.usage\` | Publish | Token usage metrics |

## Memory

- **In-memory**: Active request queue, provider rate limit state
- **File**: Model configuration, prompt templates
- **SQLite**: Token usage history, request logs, cost tracking
`,
  },
  {
    manifest: {
      name: "http-request",
      description:
        "Make HTTP requests to any external API. Supports auth, rate limiting, and response parsing.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      repository: "https://github.com/amaros-project/http-request",
      latest: "1.5.3",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-05-10T08:00:00Z",
          checksum: "",
          size: 0,
          downloads: 4100,
        },
        {
          version: "1.5.0",
          publishedAt: "2025-09-18T11:45:00Z",
          checksum: "",
          size: 0,
          downloads: 3200,
        },
        {
          version: "1.5.3",
          publishedAt: "2026-02-05T16:20:00Z",
          checksum: "",
          size: 0,
          downloads: 2500,
        },
      ],
      tags: ["http", "api", "external", "rest", "webhook"],
      capabilities: ["http-get", "http-post", "http-put", "http-delete", "auth", "rate-limiting"],
      subscribesTo: ["http.request", "http.webhook.register"],
      publishesTo: ["http.response", "http.webhook.event"],
      createdAt: "2025-05-10T08:00:00Z",
      updatedAt: "2026-02-05T16:20:00Z",
    },
    readme: `# http-request

A versatile HTTP client node for AMAROS workflows.

## Features

- **All HTTP methods** — GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
- **Authentication** — Bearer, Basic, API Key (header/query), OAuth2
- **Rate limiting** — Per-host rate limiting with sliding window
- **Response parsing** — Auto-detect JSON, XML, HTML; structured extraction
- **Webhooks** — Register and receive webhook callbacks

## Configuration

\`\`\`yaml
timeout: 30000
retry:
  max_attempts: 3
  status_codes: [429, 500, 502, 503, 504]
rate_limit:
  requests_per_second: 10
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`http.request\` | Subscribe | Outgoing HTTP request |
| \`http.webhook.register\` | Subscribe | Register a webhook listener |
| \`http.response\` | Publish | HTTP response data |
| \`http.webhook.event\` | Publish | Incoming webhook payload |
`,
  },
  {
    manifest: {
      name: "sqlite-store",
      description:
        "Persistent key-value and relational storage backed by SQLite. Auto-migration support.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      repository: "https://github.com/amaros-project/sqlite-store",
      latest: "3.0.1",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-04-01T12:00:00Z",
          checksum: "",
          size: 0,
          downloads: 2100,
        },
        {
          version: "2.0.0",
          publishedAt: "2025-08-22T09:30:00Z",
          checksum: "",
          size: 0,
          downloads: 3000,
        },
        {
          version: "3.0.1",
          publishedAt: "2026-01-10T14:00:00Z",
          checksum: "",
          size: 0,
          downloads: 3100,
        },
      ],
      tags: ["storage", "database", "persistence", "sqlite", "key-value"],
      capabilities: ["kv-store", "relational-queries", "auto-migration", "backup"],
      subscribesTo: ["store.query", "store.put", "store.get", "store.migrate"],
      publishesTo: ["store.result", "store.error"],
      createdAt: "2025-04-01T12:00:00Z",
      updatedAt: "2026-01-10T14:00:00Z",
    },
    readme: `# sqlite-store

The persistence layer for AMAROS — a SQLite-backed storage node.

## Features

- **Key-value store** — Simple get/put/delete with optional TTL
- **Relational queries** — Full SQL query support with parameterized queries
- **Auto-migration** — Schema versioning and automatic migrations
- **Backup** — Scheduled and on-demand database backups

## Memory Hierarchy

This node implements the full AMAROS memory hierarchy:

1. **In-memory** — LRU cache for frequently accessed keys (configurable size)
2. **File (README)** — Schema documentation and migration history
3. **SQLite** — Persistent structured storage

## Configuration

\`\`\`yaml
database: ./data/store.db
cache_size: 1000
wal_mode: true
backup:
  enabled: true
  interval: 3600
  path: ./backups/
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`store.query\` | Subscribe | SQL or KV read query |
| \`store.put\` | Subscribe | Write a key-value pair or run INSERT/UPDATE |
| \`store.get\` | Subscribe | Get a value by key |
| \`store.migrate\` | Subscribe | Run a schema migration |
| \`store.result\` | Publish | Query result data |
| \`store.error\` | Publish | Error from failed operation |
`,
  },
  {
    manifest: {
      name: "msg-relay",
      description:
        "Send and receive messages across WhatsApp, Telegram, Slack, and Discord via unified interface.",
      author: "amaros-community",
      organization: "amaros",
      license: "Apache-2.0",
      repository: "https://github.com/amaros-project/msg-relay",
      latest: "1.2.0",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-07-20T10:00:00Z",
          checksum: "",
          size: 0,
          downloads: 2800,
        },
        {
          version: "1.1.0",
          publishedAt: "2025-10-15T13:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1900,
        },
        {
          version: "1.2.0",
          publishedAt: "2026-02-28T08:45:00Z",
          checksum: "",
          size: 0,
          downloads: 1400,
        },
      ],
      tags: ["messaging", "relay", "integration", "whatsapp", "telegram", "slack", "discord"],
      capabilities: ["send-message", "receive-message", "media-upload", "group-messaging"],
      subscribesTo: ["msg.send", "msg.broadcast"],
      publishesTo: ["msg.received", "msg.delivered", "msg.failed"],
      createdAt: "2025-07-20T10:00:00Z",
      updatedAt: "2026-02-28T08:45:00Z",
    },
    readme: `# msg-relay

Unified messaging relay for AMAROS — send and receive across platforms.

## Supported Platforms

| Platform | Send | Receive | Media | Groups |
|----------|------|---------|-------|--------|
| WhatsApp | Yes | Yes | Yes | Yes |
| Telegram | Yes | Yes | Yes | Yes |
| Slack | Yes | Yes | Yes | Yes |
| Discord | Yes | Yes | Yes | Yes |

## Features

- **Unified API** — One interface for all platforms
- **Media support** — Images, files, audio, video
- **Group messaging** — Create, manage, and broadcast to groups
- **Delivery tracking** — Sent, delivered, read receipts where supported
- **Template messages** — Pre-defined message templates with variable substitution

## Configuration

\`\`\`yaml
platforms:
  whatsapp:
    api_key: \${WHATSAPP_API_KEY}
    phone_number_id: \${WHATSAPP_PHONE_ID}
  telegram:
    bot_token: \${TELEGRAM_BOT_TOKEN}
  slack:
    bot_token: \${SLACK_BOT_TOKEN}
  discord:
    bot_token: \${DISCORD_BOT_TOKEN}
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`msg.send\` | Subscribe | Send a message to a platform |
| \`msg.broadcast\` | Subscribe | Broadcast to multiple recipients |
| \`msg.received\` | Publish | Incoming message from any platform |
| \`msg.delivered\` | Publish | Delivery confirmation |
| \`msg.failed\` | Publish | Failed delivery notification |
`,
  },
  {
    manifest: {
      name: "web-scraper",
      description:
        "Fetch and parse web content. Headless browser support, CSS selectors, and structured extraction.",
      author: "amaros-community",
      organization: "amaros",
      license: "MIT",
      repository: "https://github.com/amaros-project/web-scraper",
      latest: "2.0.4",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-06-01T09:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1800,
        },
        {
          version: "2.0.0",
          publishedAt: "2025-12-01T11:30:00Z",
          checksum: "",
          size: 0,
          downloads: 2200,
        },
        {
          version: "2.0.4",
          publishedAt: "2026-02-15T15:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1700,
        },
      ],
      tags: ["scraping", "web", "extraction", "headless", "browser", "parsing"],
      capabilities: ["html-fetch", "css-select", "headless-render", "structured-extract", "screenshot"],
      subscribesTo: ["scrape.request", "scrape.batch"],
      publishesTo: ["scrape.result", "scrape.error"],
      createdAt: "2025-06-01T09:00:00Z",
      updatedAt: "2026-02-15T15:00:00Z",
    },
    readme: `# web-scraper

Web content extraction node for AMAROS workflows.

## Features

- **HTML fetching** — Fast HTTP-based page fetching with cookie/session support
- **Headless browser** — Full Chromium rendering for JS-heavy pages
- **CSS selectors** — Extract content using CSS selectors or XPath
- **Structured extraction** — Define schemas to extract structured data from pages
- **Screenshots** — Capture full-page or element screenshots
- **Batch scraping** — Process multiple URLs concurrently with rate limiting

## Configuration

\`\`\`yaml
mode: http  # or "headless"
user_agent: "AMAROS-Scraper/2.0"
timeout: 30000
concurrency: 5
rate_limit:
  requests_per_second: 2
  per_domain: true
\`\`\`

## Example: Structured Extraction

\`\`\`yaml
schema:
  title: "h1.article-title"
  author: ".author-name"
  date: "time[datetime]@datetime"
  content: "article.content@text"
  images: "article img@src[]"
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`scrape.request\` | Subscribe | Single URL scrape request |
| \`scrape.batch\` | Subscribe | Batch of URLs to scrape |
| \`scrape.result\` | Publish | Extracted content |
| \`scrape.error\` | Publish | Scraping failure |
`,
  },
  {
    manifest: {
      name: "cron-scheduler",
      description:
        "Schedule recurring tasks with cron expressions. Supports event-driven triggers and chaining.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      repository: "https://github.com/amaros-project/cron-scheduler",
      latest: "1.8.2",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-04-15T07:00:00Z",
          checksum: "",
          size: 0,
          downloads: 2900,
        },
        {
          version: "1.5.0",
          publishedAt: "2025-08-10T10:00:00Z",
          checksum: "",
          size: 0,
          downloads: 2400,
        },
        {
          version: "1.8.2",
          publishedAt: "2026-01-05T12:30:00Z",
          checksum: "",
          size: 0,
          downloads: 2000,
        },
      ],
      tags: ["scheduler", "cron", "events", "timer", "automation"],
      capabilities: ["cron-schedule", "one-shot-timer", "event-trigger", "chain-tasks"],
      subscribesTo: ["cron.schedule", "cron.cancel", "cron.list"],
      publishesTo: ["cron.tick", "cron.completed", "cron.error"],
      createdAt: "2025-04-15T07:00:00Z",
      updatedAt: "2026-01-05T12:30:00Z",
    },
    readme: `# cron-scheduler

Time-based task scheduling for AMAROS workflows.

## Features

- **Cron expressions** — Standard 5-field and extended 6-field cron syntax
- **One-shot timers** — Schedule a single execution at a specific time
- **Event triggers** — Chain schedules to external events or internal state changes
- **Task chaining** — Trigger downstream nodes on completion
- **Timezone support** — Full IANA timezone support
- **Persistence** — Scheduled jobs survive node restarts via SQLite

## Configuration

\`\`\`yaml
timezone: "America/New_York"
max_concurrent: 10
missed_run_policy: skip  # or "run_immediately"
\`\`\`

## Example Schedules

\`\`\`yaml
jobs:
  - name: daily-report
    cron: "0 9 * * *"
    topic: report.generate
    payload:
      type: daily
      
  - name: health-check
    cron: "*/5 * * * *"
    topic: health.ping
    
  - name: weekly-cleanup
    cron: "0 2 * * 0"
    topic: store.cleanup
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`cron.schedule\` | Subscribe | Register a new scheduled job |
| \`cron.cancel\` | Subscribe | Cancel a scheduled job |
| \`cron.list\` | Subscribe | List active schedules |
| \`cron.tick\` | Publish | Triggered when a job fires |
| \`cron.completed\` | Publish | Job execution completed |
| \`cron.error\` | Publish | Job execution failed |
`,
  },
  {
    manifest: {
      name: "vector-search",
      description:
        "Embedding generation and similarity search. Supports local and remote embedding models.",
      author: "amaros-community",
      organization: "amaros-ml",
      license: "MIT",
      repository: "https://github.com/amaros-project/vector-search",
      latest: "1.3.0",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-09-01T10:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1500,
        },
        {
          version: "1.3.0",
          publishedAt: "2026-02-01T14:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1800,
        },
      ],
      tags: ["ai", "embeddings", "vector", "search", "rag", "similarity"],
      capabilities: ["embed-text", "similarity-search", "index-management", "batch-embed"],
      subscribesTo: ["vector.embed", "vector.search", "vector.index"],
      publishesTo: ["vector.result", "vector.indexed"],
      createdAt: "2025-09-01T10:00:00Z",
      updatedAt: "2026-02-01T14:00:00Z",
    },
    readme: `# vector-search

Embedding and similarity search node for AMAROS — the backbone of RAG workflows.

## Features

- **Multi-model** — OpenAI, Cohere, local sentence-transformers, and more
- **Vector indexing** — HNSW-based index with configurable parameters
- **Similarity search** — Cosine, dot-product, and Euclidean distance
- **Batch processing** — Efficient bulk embedding and indexing
- **Persistence** — Index saved to disk, survives restarts

## Configuration

\`\`\`yaml
model: openai/text-embedding-3-small
dimensions: 1536
index:
  type: hnsw
  ef_construction: 200
  M: 16
storage: ./data/vectors/
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`vector.embed\` | Subscribe | Generate embeddings for text |
| \`vector.search\` | Subscribe | Search for similar vectors |
| \`vector.index\` | Subscribe | Add vectors to the index |
| \`vector.result\` | Publish | Search or embed results |
| \`vector.indexed\` | Publish | Confirmation of indexed vectors |
`,
  },
  {
    manifest: {
      name: "file-watcher",
      description:
        "Watch filesystem paths for changes and emit events. Supports glob patterns and debouncing.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      latest: "1.1.0",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-05-20T08:00:00Z",
          checksum: "",
          size: 0,
          downloads: 4200,
        },
        {
          version: "1.1.0",
          publishedAt: "2025-11-10T16:00:00Z",
          checksum: "",
          size: 0,
          downloads: 3100,
        },
      ],
      tags: ["filesystem", "watcher", "events", "file", "monitoring"],
      capabilities: ["watch-files", "glob-patterns", "debounce", "recursive-watch"],
      subscribesTo: ["fs.watch", "fs.unwatch"],
      publishesTo: ["fs.changed", "fs.created", "fs.deleted"],
      createdAt: "2025-05-20T08:00:00Z",
      updatedAt: "2025-11-10T16:00:00Z",
    },
    readme: `# file-watcher

Filesystem monitoring node for AMAROS.

## Features

- **Glob patterns** — Watch files matching glob patterns
- **Recursive** — Monitor entire directory trees
- **Debouncing** — Configurable debounce to avoid event storms
- **Event types** — Create, modify, delete, rename

## Configuration

\`\`\`yaml
paths:
  - "./data/**/*.json"
  - "./config/*.yaml"
debounce: 300
recursive: true
ignore:
  - "node_modules"
  - ".git"
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`fs.watch\` | Subscribe | Start watching a path |
| \`fs.unwatch\` | Subscribe | Stop watching a path |
| \`fs.changed\` | Publish | File was modified |
| \`fs.created\` | Publish | New file created |
| \`fs.deleted\` | Publish | File was deleted |
`,
  },
  {
    manifest: {
      name: "email-sender",
      description:
        "Send transactional and bulk emails via SMTP, SendGrid, or SES. Template rendering included.",
      author: "amaros-community",
      license: "MIT",
      latest: "1.0.2",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-10-05T09:00:00Z",
          checksum: "",
          size: 0,
          downloads: 1200,
        },
        {
          version: "1.0.2",
          publishedAt: "2026-01-18T11:30:00Z",
          checksum: "",
          size: 0,
          downloads: 950,
        },
      ],
      tags: ["email", "smtp", "sendgrid", "ses", "notification"],
      capabilities: ["send-email", "template-render", "bulk-send", "attachments"],
      subscribesTo: ["email.send", "email.bulk"],
      publishesTo: ["email.sent", "email.bounced", "email.failed"],
      createdAt: "2025-10-05T09:00:00Z",
      updatedAt: "2026-01-18T11:30:00Z",
    },
    readme: `# email-sender

Transactional and bulk email node for AMAROS.

## Providers

- **SMTP** — Any SMTP server
- **SendGrid** — Via SendGrid API
- **AWS SES** — Via SES API

## Features

- **Template rendering** — Handlebars-based email templates
- **Bulk sending** — Queue-based bulk email delivery
- **Attachments** — File and inline attachments
- **Tracking** — Delivery, bounce, and open tracking (provider-dependent)

## Configuration

\`\`\`yaml
provider: sendgrid
api_key: \${SENDGRID_API_KEY}
from:
  email: notifications@example.com
  name: AMAROS System
templates_dir: ./templates/
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`email.send\` | Subscribe | Send a single email |
| \`email.bulk\` | Subscribe | Bulk email dispatch |
| \`email.sent\` | Publish | Email delivered |
| \`email.bounced\` | Publish | Email bounced |
| \`email.failed\` | Publish | Email send failed |
`,
  },
  {
    manifest: {
      name: "json-transform",
      description:
        "Transform, validate, and map JSON data between schemas. JSONPath, JMESPath, and custom transforms.",
      author: "amaros-core",
      organization: "amaros",
      license: "MIT",
      latest: "2.2.0",
      versions: [
        {
          version: "1.0.0",
          publishedAt: "2025-03-15T10:00:00Z",
          checksum: "",
          size: 0,
          downloads: 5100,
        },
        {
          version: "2.0.0",
          publishedAt: "2025-07-30T14:00:00Z",
          checksum: "",
          size: 0,
          downloads: 3800,
        },
        {
          version: "2.2.0",
          publishedAt: "2026-02-20T09:00:00Z",
          checksum: "",
          size: 0,
          downloads: 2200,
        },
      ],
      tags: ["json", "transform", "mapping", "validation", "schema"],
      capabilities: ["json-transform", "schema-validation", "jsonpath", "jmespath", "mapping"],
      subscribesTo: ["transform.apply", "transform.validate"],
      publishesTo: ["transform.result", "transform.error"],
      createdAt: "2025-03-15T10:00:00Z",
      updatedAt: "2026-02-20T09:00:00Z",
    },
    readme: `# json-transform

Data transformation and validation node for AMAROS.

## Features

- **JSONPath** — Query and extract data using JSONPath expressions
- **JMESPath** — Advanced querying with JMESPath
- **Schema validation** — JSON Schema draft-07 validation
- **Custom transforms** — Define transformation pipelines
- **Mapping** — Map between different data schemas

## Example Transform

\`\`\`yaml
pipeline:
  - pick: ["name", "email", "address"]
  - rename:
      address.street: address.line1
  - default:
      address.country: "US"
  - validate:
      schema: ./schemas/user.json
\`\`\`

## Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| \`transform.apply\` | Subscribe | Apply a transformation pipeline |
| \`transform.validate\` | Subscribe | Validate data against a schema |
| \`transform.result\` | Publish | Transformed/validated data |
| \`transform.error\` | Publish | Transformation or validation error |
`,
  },
];

// ── Tarball helpers ──────────────────────────────────────────

/** Build a minimal valid .tar.gz containing a single file with lorem ipsum content. */
function makeTarball(name: string, version: string): Buffer {
  const fileName = `${name}-${version}/index.ts`;
  const fileBody = `// ${name}@${version}\n// AMAROS node package\n\nexport const NAME = "${name}";\nexport const VERSION = "${version}";\n\n/**\n * ${LOREM}\n */\nexport function run() {\n  // ${LOREM}\n  return { name: NAME, version: VERSION };\n}\n`;
  const fileContent = Buffer.from(fileBody);

  // -- Build a POSIX tar archive --
  const header = Buffer.alloc(512);
  // File name (0-99)
  header.write(fileName, 0, Math.min(fileName.length, 100), "utf-8");
  // File mode (100-107)
  header.write("0000644\0", 100, 8, "utf-8");
  // Owner ID (108-115)
  header.write("0001000\0", 108, 8, "utf-8");
  // Group ID (116-123)
  header.write("0001000\0", 116, 8, "utf-8");
  // File size in octal (124-135)
  header.write(fileContent.length.toString(8).padStart(11, "0") + "\0", 124, 12, "utf-8");
  // Modification time (136-147) — epoch seconds
  const mtime = Math.floor(Date.now() / 1000);
  header.write(mtime.toString(8).padStart(11, "0") + "\0", 136, 12, "utf-8");
  // Initialize checksum field with spaces (148-155)
  header.write("        ", 148, 8, "utf-8");
  // Type flag: regular file (156)
  header.write("0", 156, 1, "utf-8");
  // USTAR magic (257-262) + version (263-264)
  header.write("ustar\0", 257, 6, "utf-8");
  header.write("00", 263, 2, "utf-8");

  // Compute tar header checksum (sum of all bytes, treating checksum field as spaces)
  let chksum = 0;
  for (let i = 0; i < 512; i++) chksum += header[i];
  header.write(chksum.toString(8).padStart(6, "0") + "\0 ", 148, 8, "utf-8");

  // File content padded to 512-byte boundary
  const paddedLen = Math.ceil(fileContent.length / 512) * 512;
  const paddedContent = Buffer.alloc(paddedLen);
  fileContent.copy(paddedContent);

  // End-of-archive: two 512-byte zero blocks
  const endMarker = Buffer.alloc(1024);

  const tar = Buffer.concat([header, paddedContent, endMarker]);
  return Buffer.from(gzipSync(tar));
}

function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

async function uploadNode(node: { manifest: NodeManifest; readme: string }) {
  const { manifest, readme } = node;
  const name = manifest.name;

  // Generate real tarballs and fill in real checksum + size
  for (const ver of manifest.versions) {
    const tarball = makeTarball(name, ver.version);
    ver.checksum = sha256(tarball);
    ver.size = tarball.length;

    console.log(`  Uploading tarball v${ver.version} (${tarball.length} bytes, sha256:${ver.checksum.slice(0, 12)}…)…`);
    await putObject(
      `nodes/${name}/versions/${ver.version}.tar.gz`,
      tarball,
      "application/gzip",
      {
        version: ver.version,
        name,
        checksum: ver.checksum,
      },
    );
  }

  // Derive createdAt / updatedAt from version timestamps
  const sorted = [...manifest.versions].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
  );
  manifest.createdAt = sorted[0].publishedAt;
  manifest.updatedAt = sorted[sorted.length - 1].publishedAt;

  console.log(`  Uploading metadata...`);
  await putObject(
    `nodes/${name}/metadata.json`,
    JSON.stringify(manifest, null, 2),
    "application/json",
  );

  console.log(`  Uploading readme...`);
  await putObject(`nodes/${name}/readme.md`, readme, "text/markdown");
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   AMAROS Registry — R2 Seed Script       ║");
  console.log("╚══════════════════════════════════════════╝\n");

  console.log(`Seeding ${NODES.length} nodes into R2 bucket...\n`);

  for (const node of NODES) {
    console.log(`▸ ${node.manifest.name} (${node.manifest.versions.length} versions)`);
    await uploadNode(node);
    console.log(`  ✓ Done\n`);
  }

  console.log("═══════════════════════════════════════════");
  console.log(`✓ Successfully seeded ${NODES.length} nodes.`);
  console.log("═══════════════════════════════════════════");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});