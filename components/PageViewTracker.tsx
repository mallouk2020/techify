"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Simple client-side page view tracker.
// Sends a POST to /api/analytics/page-view with minimal info.
// Throttles per-path using sessionStorage to avoid spamming the server.

const STORAGE_KEY_PREFIX = "techify:pageview:";
const THROTTLE_SECONDS = 60; // don't send same path more than once per minute per tab/session

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    try {
      const key = `${STORAGE_KEY_PREFIX}${pathname}`;
      const last = sessionStorage.getItem(key);
      const now = Date.now();

      if (last) {
        const lastTs = Number(last);
        if (!Number.isNaN(lastTs) && now - lastTs < THROTTLE_SECONDS * 1000) {
          // recently sent for this path, skip
          return;
        }
      }

      // record immediately to avoid duplicate sends in concurrent effects
      sessionStorage.setItem(key, String(now));

      // Build payload
      const payload = {
        path: pathname,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      };

      // Fire-and-forget POST with minimal error handling
      fetch("/api/analytics/page-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        // swallow errors; we'll log to console for local debugging
        // and clear the session key so a retry can occur later
        try {
          sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${pathname}`);
        } catch (e) {
          // ignore
        }
        // eslint-disable-next-line no-console
        console.debug("PageViewTracker: failed to record page view", err);
      });
    } catch (e) {
      // sessionStorage may be unavailable; don't break the app
      // eslint-disable-next-line no-console
      console.debug("PageViewTracker error", e);
    }
  }, [pathname]);

  return null;
}
