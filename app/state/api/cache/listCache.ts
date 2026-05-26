type Entry<T> = { data: T; timestamp: number };

export type ListCache<T> = {
  getOrFetch: (key: string, fetcher: () => Promise<T>) => Promise<T>;
  invalidate: (key: string) => void;
  invalidateAll: () => void;
};

const DEFAULT_TTL_MS = 60 * 60 * 1000;

export function createListCache<T>(namespace: string, ttlMs: number = DEFAULT_TTL_MS): ListCache<T> {
  const storageKey = `cache:${namespace}`;

  function load(): Map<string, Entry<T>> {
    if (typeof window === "undefined") return new Map();
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return new Map();
      const parsed = JSON.parse(raw) as Record<string, Entry<T>>;
      const map = new Map<string, Entry<T>>();
      const now = Date.now();
      for (const [k, v] of Object.entries(parsed)) {
        if (v && typeof v.timestamp === "number" && now - v.timestamp < ttlMs) {
          map.set(k, v);
        }
      }
      return map;
    } catch {
      return new Map();
    }
  }

  function persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(store)));
    } catch {
      /* quota exceeded or storage unavailable — silently no-op */
    }
  }

  const store = load();
  const inflight = new Map<string, Promise<T>>();

  return {
    async getOrFetch(key, fetcher) {
      const cached = store.get(key);
      if (cached && Date.now() - cached.timestamp < ttlMs) {
        return cached.data;
      }
      const pending = inflight.get(key);
      if (pending) return pending;

      const promise = fetcher()
        .then((data) => {
          store.set(key, { data, timestamp: Date.now() });
          persist();
          return data;
        })
        .finally(() => {
          inflight.delete(key);
        });
      inflight.set(key, promise);
      return promise;
    },
    invalidate(key) {
      store.delete(key);
      inflight.delete(key);
      persist();
    },
    invalidateAll() {
      store.clear();
      inflight.clear();
      persist();
    },
  };
}
