self.addEventListener("push", (e) => {
  if (e.data) {
    const data = e.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/logo/logo.png",
      badge: data.badge || "/logo/logo.png",
      vibrate: [100, 50, 100],
    };

    e.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("https://rocket-in-st.vercel.app/"));
});
