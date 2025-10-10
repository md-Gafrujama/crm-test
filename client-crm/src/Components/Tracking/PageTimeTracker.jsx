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
    if (token && prevPath) {
      axios.post(
        `${API_BASE_URL}/api/analytics/page-time`,
        { page: prevPath, durationMs },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => { /* silent */ });
    }

    // Reset for new path
    startRef.current = now;
    pathRef.current = location.pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // On unmount, send final event
    return () => {
      const now = Date.now();
      const durationMs = now - startRef.current;
      const prevPath = pathRef.current;
      const token = localStorage.getItem("token");
      
      if (token && prevPath) {
        navigator.sendBeacon?.(
          `${API_BASE_URL}/api/analytics/page-time`,
          new Blob([
            JSON.stringify({ page: prevPath, durationMs })
          ], { type: 'application/json' })
        );
      }
    };
  }, []);

  return null;
}
