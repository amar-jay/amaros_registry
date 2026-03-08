# AMAROS Registry

The official web registry for **AMAROS** (Autonomous Multi-Agent Robotic Orchestration System) — a distributed agent orchestration framework built on a ROS-style node graph with ZeroMQ messaging, topic-based pub/sub, and hierarchical memory.

Browse, search, and install reusable agent nodes that execute workflows across organizations.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, React Server Components) |
| Runtime | Bun |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Storage | Cloudflare R2 (S3-compatible) |
| Auth | NextAuth v5 (GitHub, Google) |
| Icons | @tabler/icons-react |
| Animations | Motion (framer-motion) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.3
- A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket
- OAuth apps for [GitHub](https://github.com/settings/developers) and/or [Google](https://console.cloud.google.com/apis/credentials) (optional, for auth)

### Install

```bash
bun install
```

### Environment

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret key |
| `R2_BUCKET_NAME` | Bucket name (default: `amaros-registry`) |
| `R2_PUBLIC_URL` | Public bucket URL or r2.dev subdomain |
| `AUTH_SECRET` | NextAuth secret — generate with `openssl rand -base64 32` |
| `AUTH_URL` | App URL (default: `http://localhost:3000`) |
| `AUTH_GITHUB_ID` | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |

### Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Sample Data

Populate the R2 bucket with sample nodes:

```bash
bun run scripts/populate_r2.ts
```

This creates ~10 sample nodes (llm-inference, http-request, sqlite-store, etc.) with manifests, readmes, and tarballs.

## Project Structure

```
app/
├── page.tsx                          # Landing page (RSC, fetches real data)
├── layout.tsx                        # Root layout with AuthProvider
├── explore/
│   └── page.tsx                      # Explore/search page with filters
├── nodes/
│   └── [name]/page.tsx               # Node detail page (readme, versions, metadata)
├── auth/
│   └── signin/page.tsx               # Custom sign-in page
└── api/
    ├── nodes/
    │   ├── route.ts                  # GET /api/nodes — list & search
    │   └── [name]/
    │       ├── route.ts              # GET /api/nodes/:name — manifest + readme
    │       └── [version]/route.ts    # GET /api/nodes/:name/:version — download URL
    └── publish/
        └── route.ts                  # POST /api/publish — upload a node

components/
├── node-beam.tsx                     # Animated beam visualizations
├── hero-search.tsx                   # Hero search bar → /explore
├── explore-grid.tsx                  # Client-side search/filter/sort grid
├── markdown-renderer.tsx             # Styled markdown with GFM
├── copy-button.tsx                   # Clipboard copy button
├── auth-provider.tsx                 # NextAuth SessionProvider wrapper
└── ui/                               # shadcn/ui primitives

lib/
├── auth.ts                           # NextAuth v5 config (GitHub, Google, Credentials)
├── utils.ts                          # cn() utility
└── r2/
    ├── client.ts                     # S3-compatible R2 client
    ├── bucket.ts                     # Low-level S3 operations
    ├── registry.ts                   # Registry business logic
    └── index.ts                      # Barrel export

middleware.ts                         # Protects /dashboard/* routes
scripts/
└── populate_r2.ts                    # Seed script with sample nodes
```

## API Reference

### `GET /api/nodes`

List all nodes. Supports query parameters:

| Param | Description |
|-------|-------------|
| `q` | Search by name, description, or tags |
| `tag` | Filter by exact tag |

**Response:** `{ nodes: NodeManifest[], count: number }`

### `GET /api/nodes/:name`

Fetch a single node's manifest and readme.

**Response:** `{ ...NodeManifest, readme: string | null }`

### `GET /api/nodes/:name/:version`

Get download metadata for a specific version. Use `latest` to resolve the most recent version.

**Response:** `{ name, version, checksum, size, downloadUrl }`

### `POST /api/publish`

Publish a node. Accepts `multipart/form-data`:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `manifest` | JSON string | Yes | Node manifest |
| `tarball` | File | Yes | `.tar.gz` package |
| `readme` | String | No | Markdown readme |

**Response:** `201 { ok: true, name, version }`

## Data Model

### NodeManifest

```typescript
interface NodeManifest {
  name: string;
  description: string;
  author: string;
  organization: string;
  license: string;
  repository: string;
  latest: string;
  versions: VersionEntry[];
  tags: string[];
  capabilities: string[];
  subscribesTo: string[];
  publishesTo: string[];
  createdAt: string;
  updatedAt: string;
}
```

### VersionEntry

```typescript
interface VersionEntry {
  version: string;
  publishedAt: string;
  checksum: string;
  sha256: string;
  size: number;
  downloads: number;
}
```

### R2 Bucket Layout

```
nodes/
└── <node-name>/
    ├── metadata.json         # NodeManifest
    ├── readme.md             # Markdown readme
    └── versions/
        └── <version>.tar.gz  # Package tarball
```

## Authentication

Authentication is handled by NextAuth v5 with JWT sessions. Configured providers:

- **GitHub** — OAuth login
- **Google** — OAuth login
- **Credentials** — Placeholder (not active)

Protected routes are defined in `middleware.ts` — currently `/dashboard/*` paths require authentication. The custom sign-in page is at `/auth/signin`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Production build |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run scripts/populate_r2.ts` | Seed R2 with sample nodes |

## License

Private.
