// One entry point for data. On the web it calls the Rust function at /api/handler;
// inside the Tauri desktop app it calls the same Rust code through a Tauri command.

type Params = Record<string, string | number | undefined | null>;

const inTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const cache = new Map<string, Promise<unknown>>();

function clean(params: Params): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') out[k] = String(v);
  }
  return out;
}

async function call(route: string, params: Record<string, string>): Promise<unknown> {
  let data: unknown;
  if (inTauri) {
    const { invoke } = await import('@tauri-apps/api/core');
    data = await invoke('api', { route, params });
  } else {
    const qs = new URLSearchParams({ route, ...params });
    const res = await fetch(`/api/handler?${qs}`);
    if (!res.ok) throw new Error(`The server answered ${res.status}.`);
    data = await res.json();
  }
  if (data && typeof data === 'object' && 'error' in data) throw new Error(String((data as { error: unknown }).error));
  return data;
}

/** Fetch one route; identical requests are made once and shared. */
export function api<T>(route: string, params: Params = {}): Promise<T> {
  const p = clean(params);
  const key = route + '?' + new URLSearchParams(p).toString();
  let hit = cache.get(key);
  if (!hit) {
    hit = call(route, p).catch((e) => {
      cache.delete(key);
      throw e;
    });
    cache.set(key, hit);
  }
  return hit as Promise<T>;
}
