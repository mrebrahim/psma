export function extractPositions(description: string | null | undefined): string[] {
  if (!description) return [];
  const text = description.replace(/^[\s\S]*?الوظائف المتاحة:\s*/, "");
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
