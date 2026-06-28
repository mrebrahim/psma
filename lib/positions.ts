// Extracts the list of available positions from a job description ONLY when
// the description uses the legacy "الوظائف المتاحة:" marker (from the Excel
// imports). Company-submitted jobs have free-form descriptions — for those
// the dropdown is hidden and the applicant applies to the job's own title.
export function extractPositions(description: string | null | undefined): string[] {
  if (!description) return [];
  const marker = "الوظائف المتاحة:";
  const idx = description.indexOf(marker);
  if (idx === -1) return [];

  const text = description.slice(idx + marker.length);
  const parts = text.split(/[\n/،,]+|\s+-\s+|\s+–\s+|\s+\|\s+/g);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of parts) {
    const p = raw.replace(/^[\s\-–.0-9)(]+|[\s\-–.()]+$/g, "").trim();
    if (!p || p.length > 120) continue;
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}
