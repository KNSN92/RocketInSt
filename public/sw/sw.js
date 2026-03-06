/**@type {ServiceWorkerGlobalScope} sw */
const sw = self;

sw.addEventListener("install", (e) => {
  e.skipWaiting();
});

sw.addEventListener("activate", (e) => {
  e.waitUntil(sw.clients.claim());
});

sw.addEventListener("push", (e) => {
  if (e.data) {
    const data = e.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/logo/logo.png",
      badge: data.badge || "/logo/logo.png",
      vibrate: [100, 50, 100],
    };

    e.waitUntil(sw.registration.showNotification(data.title, options));
  }
});

sw.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(sw.clients.openWindow("https://rocket-in-st.vercel.app/"));
});
