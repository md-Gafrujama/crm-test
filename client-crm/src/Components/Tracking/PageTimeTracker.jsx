import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

// Tracks time spent on each route and posts to backend on route change/unmount
export default function PageTimeTracker() {

  const location = useLocation();
  const startRef = useRef(Date.now());
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    // On route change, send event for previous path
    const now = Date.now();
    const durationMs = now - startRef.current;
    const prevPath = pathRef.current;

    const token = localStorage.getItem("token");
    if (token && prevPath && durationMs >= 1000) {
      axios.post(
        `${API_BASE_URL}/api/analytics/page-time`,
        { page: prevPath, durationMs },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => { /* silent */ });
    }

    // Reset for new path
    startRef.current = now;
    pathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    // On unmount, send final event
    return () => {
      const now = Date.now();
      const durationMs = now - startRef.current;
      const prevPath = pathRef.current;
      const token = localStorage.getItem("token");

      if (prevPath && durationMs >= 100) {
        const url = `${API_BASE_URL}/api/analytics/page-time`;
        const payload = JSON.stringify({ page: prevPath, durationMs });
        // Prefer authenticated fetch with keepalive to ensure JWT is sent
        if (typeof fetch === 'function') {
          try {
            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: payload,
              keepalive: true,
            }).catch(() => {});
          } catch {
            // Fallback to sendBeacon (no auth headers possible)
            navigator.sendBeacon?.(
              url,
              new Blob([payload], { type: 'application/json' })
            );
          }
        } else {
          navigator.sendBeacon?.(
            url,
            new Blob([payload], { type: 'application/json' })
          );
        }
      }
    };
  }, []);

  return null;
}
