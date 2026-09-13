const serviceWorker = `
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache admin documents or authenticated data. The service worker
  // exists for installability and leaves protected content network-only.
  if (request.mode === "navigate" || url.pathname.startsWith("/admin")) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(fetch(request));
});
`;

export async function GET() {
  return new Response(serviceWorker, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/admin/",
    },
  });
}
