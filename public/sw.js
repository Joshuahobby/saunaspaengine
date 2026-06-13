/**
 * KILL SWITCH SERVICE WORKER
 * This worker strictly unregisters itself and clears all CacheStorage
 * to resolve Next.js 16 / Turbopack routing interceptions (ERR_FAILED).
 */

self.addEventListener('install', () => {
    console.log('[SW-RESET] Installing Kill Switch SW...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW-RESET] Activating Kill Switch SW...');
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(names.map((name) => caches.delete(name)));
        }).then(() => {
            return self.registration.unregister();
        }).then(() => {
            console.log('[SW-RESET] Unregistered successfully. Purge complete.');
            return self.clients.matchAll().then((clients) => {
                clients.forEach((client) => client.navigate(client.url));
            });
        })
    );
});


