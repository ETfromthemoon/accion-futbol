const windowMs = 10 * 60_000;
const perIpLimit = 10;
const instanceLimit = 300;
const buckets = new Map<string, number[]>();

/** Instance-local fallback limiter; production must also enforce an edge limit. */
export function checkPublicFormLimit(slug: string, ip: string) {
  const now = Date.now();
  const minimum = now - windowMs;
  const key = `${slug}:${ip}`;
  const byIp = (buckets.get(key) ?? []).filter((time) => time > minimum);
  const global = (buckets.get("__global__") ?? []).filter((time) => time > minimum);
  const blockedUntil = Math.max(
    byIp.length >= perIpLimit ? byIp[0] + windowMs : 0,
    global.length >= instanceLimit ? global[0] + windowMs : 0,
  );
  if (blockedUntil > now) return { allowed: false, retryAfter: Math.ceil((blockedUntil - now) / 1000) };
  byIp.push(now);
  global.push(now);
  if (!buckets.has(key) && buckets.size >= 5000) {
    const oldest = [...buckets.keys()].find((entry) => entry !== "__global__");
    if (oldest) buckets.delete(oldest);
  }
  buckets.set(key, byIp);
  buckets.set("__global__", global);
  return { allowed: true, retryAfter: 0 };
}
