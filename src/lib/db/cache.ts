import { eq } from "drizzle-orm";
import { getDb } from ".";
import { cache } from "./schema";

function tryGetDb() {
  try {
    return getDb();
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const db = tryGetDb();
  if (!db) return null;

  try {
    const rows = await db
      .select()
      .from(cache)
      .where(eq(cache.key, key))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0];
    if (new Date(row.expiresAt) < new Date()) {
      return null;
    }

    return row.value as T;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const db = tryGetDb();
  if (!db) return;

  try {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    await db
      .insert(cache)
      .values({ key, value: value as unknown as Record<string, unknown>, expiresAt })
      .onConflictDoUpdate({
        target: cache.key,
        set: { value: value as unknown as Record<string, unknown>, expiresAt },
      });
  } catch {
    // Cache write failure is non-fatal
  }
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<{ data: T; stale: false } | { data: T | null; stale: true }> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return { data: cached, stale: false };
  }

  try {
    const fresh = await fetcher();
    await cacheSet(key, fresh, ttlSeconds);
    return { data: fresh, stale: false };
  } catch (error) {
    console.error(`Failed to fetch ${key}:`, error);
    return { data: null, stale: true };
  }
}
