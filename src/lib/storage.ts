/**
 * Victory Hub - LocalStorage Utility Module
 * Handles all persistence operations for the application
 */

/* ------------------------------------------------------------------
   Generic helpers
   ------------------------------------------------------------------ */

const STORAGE_PREFIX = 'victoryhub_';

/** Read a value from localStorage with JSON parsing */
export function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Write a value to localStorage as JSON */
export function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    console.warn('LocalStorage write failed for', key);
  }
}

/** Remove a key from localStorage */
export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/** Export all VictoryHub data as a JSON string */
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(STORAGE_PREFIX)) {
      data[k] = JSON.parse(localStorage.getItem(k) || 'null');
    }
  }
  return JSON.stringify(data, null, 2);
}

/** Import data from a JSON string, overwriting existing keys */
export function importAllData(json: string): boolean {
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    for (const [k, v] of Object.entries(data)) {
      if (k.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(k, JSON.stringify(v));
      }
    }
    return true;
  } catch {
    return false;
  }
}

/** Clear all VictoryHub data */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
