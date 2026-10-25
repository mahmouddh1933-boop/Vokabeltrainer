/* Generated for __OLIVE_RELEASE__. Public application files only. */
"use strict";
const RELEASE = "__OLIVE_RELEASE__";
const ASSETS = __OLIVE_ASSETS__;
const BASE = new URL(self.registration.scope);
const PREFIX = "huroof-pwa:" + BASE.pathname + ":";
const CORE = PREFIX + "core:" + RELEASE;
const MEDIA = PREFIX + "media:v1";
const MAX_MEDIA_ENTRIES = 500,
  MAX_MEDIA_BYTES = 40 * 1024 * 1024;
let mediaQueue = Promise.resolve();
function key(path, revision = ASSETS[path]?.rev) {
  const u = new URL(path, BASE);
  u.search = "v=" + revision;
  return u.href;
}
function pathOf(url) {
  return url.origin === BASE.origin && url.pathname.startsWith(BASE.pathname)
    ? url.pathname.slice(BASE.pathname.length)
    : null;
}
function coreNames() {
  return caches.keys().then((names) =>
    names
      .filter((n) => n.startsWith(PREFIX + "core:"))
      .reverse()
      .sort((a, b) => (a === CORE ? -1 : b === CORE ? 1 : 0)),
  );
}
async function findCore(path, url) {
  // HTML is an immutable release shell until the user accepts an update.
  const revision = url.searchParams.get("v");
  if (!revision || ASSETS[path].rev.startsWith(revision))
    return (await caches.open(CORE)).match(key(path));
  // Another tab may still request the previous release's versioned scripts.
  for (const name of await coreNames()) {
    const cache = await caches.open(name),
      requests = await cache.keys();
    const request = requests.find((r) => {
      const u = new URL(r.url);
      return (
        pathOf(u) === path && u.searchParams.get("v")?.startsWith(revision)
      );
    });
    if (request) return cache.match(request);
  }
}
async function prepareCore() {
  const cache = await caches.open(CORE),
    entries = Object.keys(ASSETS).filter((p) => !ASSETS[p].media);
  let cursor = 0;
  const results = await Promise.allSettled(
    Array.from({ length: 6 }, async () => {
      while (cursor < entries.length) {
        const path = entries[cursor++];
        if (await cache.match(key(path))) continue;
        const response = await fetch(
          new Request(new URL(path, BASE), {
            cache: "reload",
            credentials: "same-origin",
          }),
        );
        if (
          !response.ok ||
          response.status !== 200 ||
          response.redirected ||
          !["basic", "default"].includes(response.type)
        )
          throw Error("Core file unavailable: " + path);
        const digest = await crypto.subtle.digest(
          "SHA-256",
          await response.clone().arrayBuffer(),
        );
        const hex = Array.from(new Uint8Array(digest), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
        if (!hex.startsWith(ASSETS[path].rev))
          throw Error("Release changed while preparing: " + path);
        await cache.put(key(path), response);
      }
    }),
  );
  if (results.some((r) => r.status === "rejected"))
    throw Error("Offline preparation incomplete");
}
self.addEventListener("install", (event) => {
  event.waitUntil(
    prepareCore().catch(async (error) => {
      await caches.delete(CORE);
      throw error;
    }),
  );
  // No automatic skipWaiting: a new release must not interrupt an exercise.
});
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      const names = (await caches.keys()).filter((n) =>
        n.startsWith(PREFIX + "core:"),
      );
      // Keep the immediately previous release for tabs that have not reloaded.
      const old = names.filter((n) => n !== CORE);
      for (const name of old.slice(0, -1)) await caches.delete(name);
      await self.clients.claim();
    })(),
  ),
);
async function stats() {
  const cache = await caches.open(MEDIA),
    requests = await cache.keys();
  let bytes = 0;
  for (const r of requests) {
    const response = await cache.match(r);
    bytes += Number(response.headers.get("Content-Length") || 0);
  }
  const core = await caches.open(CORE);
  const complete =
    (await core.keys()).length ===
    Object.values(ASSETS).filter((a) => !a.media).length;
  return {
    release: RELEASE,
    ready: complete,
    mediaCount: requests.length,
    mediaBytes: bytes,
    maxMediaBytes: MAX_MEDIA_BYTES,
  };
}
async function saveMedia(path, response) {
  // Range responses are never stored: one complete recording supports later seeking.
  if (response.status !== 200 || response.redirected) return;
  const bytes = await response.clone().arrayBuffer();
  if (bytes.byteLength > MAX_MEDIA_BYTES) return;
  const headers = new Headers(response.headers);
  headers.set("Content-Length", String(bytes.byteLength));
  const stored = new Response(bytes, { status: 200, headers });
  mediaQueue = mediaQueue
    .catch(() => {})
    .then(async () => {
      const cache = await caches.open(MEDIA),
        address = key(path);
      await cache.delete(address);
      await cache.put(address, stored);
      const requests = await cache.keys();
      let size = 0;
      const sizes = [];
      for (const r of requests) {
        const hit = await cache.match(r),
          n = Number(hit.headers.get("Content-Length") || 0);
        sizes.push(n);
        size += n;
      }
      let i = 0;
      while (
        requests.length - i > MAX_MEDIA_ENTRIES ||
        size > MAX_MEDIA_BYTES
      ) {
        await cache.delete(requests[i]);
        size -= sizes[i++];
      }
    });
  await mediaQueue;
}
async function partial(response, range) {
  if (!range) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2]))
    return new Response(null, { status: 416 });
  const bytes = await response.arrayBuffer(),
    length = bytes.byteLength;
  const start = match[1]
    ? Number(match[1])
    : Math.max(0, length - Number(match[2]));
  const end = match[1]
    ? match[2]
      ? Math.min(Number(match[2]), length - 1)
      : length - 1
    : length - 1;
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  if (start >= length || start > end) {
    headers.set("Content-Range", "bytes */" + length);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${length}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers,
  });
}
async function mediaResponse(request, path, event) {
  const cached = await (await caches.open(MEDIA)).match(key(path));
  if (cached) return partial(cached, request.headers.get("Range"));
  const headers = new Headers(request.headers);
  headers.delete("Range");
  const response = await fetch(
    new Request(request, { headers, cache: "no-cache" }),
  );
  if (response.ok && response.status === 200)
    event.waitUntil(saveMedia(path, response.clone()).catch(() => {}));
  return response.status === 200
    ? partial(response, request.headers.get("Range"))
    : response;
}
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  let path = pathOf(url);
  if (path === "") path = "index.html";
  if (!path || !ASSETS[path]) {
    if (
      request.mode === "navigate" &&
      url.origin === BASE.origin &&
      url.pathname.startsWith(BASE.pathname)
    )
      event.respondWith(
        fetch(request).catch(async () => {
          const response = await (
            await caches.open(CORE)
          ).match(key("offline.html"));
          return response || Response.error();
        }),
      );
    return;
  }
  if (ASSETS[path].media) {
    event.respondWith(
      mediaResponse(request, path, event).catch(() => Response.error()),
    );
    return;
  }
  event.respondWith(
    (async () => {
      const cached = await findCore(path, url);
      if (cached) return cached;
      try {
        return await fetch(request);
      } catch (_) {
        if (request.mode === "navigate")
          return (
            (await (await caches.open(CORE)).match(key("offline.html"))) ||
            Response.error()
          );
        return Response.error();
      }
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "APPLY_UPDATE") {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type === "PWA_STATUS")
    event.waitUntil(
      stats().then((value) => event.ports[0]?.postMessage(value)),
    );
  if (event.data?.type === "PREPARE_CORE")
    event.waitUntil(
      prepareCore()
        .then(stats)
        .then((value) => event.ports[0]?.postMessage(value))
        .catch(() => event.ports[0]?.postMessage({ error: true })),
    );
  if (event.data?.type === "CLEAR_MEDIA")
    event.waitUntil(
      mediaQueue
        .catch(() => {})
        .then(() => caches.delete(MEDIA))
        .then(() => event.ports[0]?.postMessage({ cleared: true })),
    );
});
