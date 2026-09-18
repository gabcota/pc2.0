---
name: Replit Vite cache isolation
description: Prevent mixed optimized React chunks from breaking every route in the Replit development preview.
---

When a dependency update changes Vite's optimizer graph, use a new versioned optimizer cache directory, explicitly deduplicate React and React DOM, and send `no-store` headers for development modules. Keep development on one worker when all workers would share that cache.

**Why:** The Replit preview proxy and an existing browser session can retain references to an older optimizer directory even after the normal Vite cache is deleted. Mixing those chunks with a newly optimized React renderer causes global `Invalid hook call` failures before routing starts. Clearing the default cache and restarting alone did not resolve the affected session.

**How to apply:** Whenever dependency installation or optimizer output changes and the preview reports dispatcher hook failures across unrelated routes, invalidate the optimizer by changing its versioned directory rather than repeatedly deleting the same directory. Verify through the public `.replit.dev` URL and confirm new browser logs contain no hook errors.