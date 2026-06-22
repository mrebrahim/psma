#!/usr/bin/env node
// Download every applicant CV from Supabase Storage and organise locally as:
//   <out-dir>/بصمة/<company>/<job>/<applicant>_<id>.<ext>
// Run:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/download-cvs.mjs ./out
//
// Then drag the resulting "بصمة" folder into Google Drive.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const outDir = path.resolve(process.argv[2] ?? "./cv-export");

if (!url || !key) {
  console.error("لازم تحدد SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في الـ environment.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function sanitize(s) {
  return String(s ?? "غير محدد")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "غير محدد";
}

console.log("جارٍ قراءة التقديمات من Supabase...");

const { data: rows, error } = await supabase
  .from("applications")
  .select("id, full_name, cv_url, position_applied, created_at, job_id, jobs(title, companies(name))")
  .not("cv_url", "is", null)
  .order("created_at", { ascending: false });

if (error) {
  console.error("فشل قراءة الـ applications:", error.message);
  process.exit(1);
}

console.log(`عدد التقديمات اللي فيها CV: ${rows.length}`);

let done = 0;
let failed = 0;

for (const a of rows) {
  const job = Array.isArray(a.jobs) ? a.jobs[0] : a.jobs;
  const company = job?.companies && (Array.isArray(job.companies) ? job.companies[0] : job.companies);
  const companyName = sanitize(company?.name);
  const jobTitle = sanitize(job?.title ?? a.position_applied);
  const applicantName = sanitize(a.full_name);
  const ext = path.extname(a.cv_url) || ".bin";
  const idShort = a.id.slice(0, 8);

  const targetDir = path.join(outDir, "بصمة", companyName, jobTitle);
  const targetFile = path.join(targetDir, `${applicantName}_${idShort}${ext}`);

  try {
    const { data, error: dlErr } = await supabase.storage.from("cvs").download(a.cv_url);
    if (dlErr || !data) {
      failed++;
      console.warn(`✗ ${applicantName} — ${dlErr?.message ?? "no data"}`);
      continue;
    }
    await mkdir(targetDir, { recursive: true });
    const buf = Buffer.from(await data.arrayBuffer());
    await writeFile(targetFile, buf);
    done++;
    if (done % 20 === 0) console.log(`... ${done}/${rows.length}`);
  } catch (e) {
    failed++;
    console.warn(`✗ ${applicantName} — ${e.message}`);
  }
}

console.log(`\nتم تنزيل ${done} ملف، فشل ${failed}.`);
console.log(`المسار: ${outDir}/بصمة/`);
