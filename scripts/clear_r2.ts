/**
 * Clear script — deletes all objects from the R2 bucket.
 * Run with: bun run scripts/clear_r2.ts
 */

import { listObjects, deleteObject } from "../lib/r2/bucket";

async function main() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   AMAROS Registry — R2 Clear Script      ║");
  console.log("╚══════════════════════════════════════════╝\n");

  let deleted = 0;
  let hasMore = true;

  while (hasMore) {
    const res = await listObjects("", 1000);
    const objects = res.Contents ?? [];

    if (objects.length === 0) break;

    for (const obj of objects) {
      if (!obj.Key) continue;
      console.log(`  ✕ ${obj.Key}`);
      await deleteObject(obj.Key);
      deleted++;
    }

    hasMore = res.IsTruncated ?? false;
  }

  console.log("\n═══════════════════════════════════════════");
  console.log(`✓ Deleted ${deleted} objects.`);
  console.log("═══════════════════════════════════════════");
}

main().catch((err) => {
  console.error("Clear failed:", err);
  process.exit(1);
});
