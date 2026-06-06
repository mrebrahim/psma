#!/usr/bin/env node
// رفع الصور من public/images إلى Supabase Storage (bucket: media)
// التشغيل:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-media.mjs

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("لازم تحدد SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const dir = path.resolve("public/images");
const files = await readdir(dir);

const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const contentType = mime[ext];
  if (!contentType) continue;
  const buf = await readFile(path.join(dir, f));
  const { error } = await supabase.storage
    .from("media")
    .upload(f, buf, { contentType, upsert: true });
  if (error) {
    console.error(`✗ ${f}: ${error.message}`);
  } else {
    console.log(`✓ ${f}`);
  }
}
