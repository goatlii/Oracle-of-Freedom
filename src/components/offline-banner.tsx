"use client";

import { useEffect, useState } from "react";
import { useStudioCopy } from "@/components/studio-lang";

export function OfflineBanner() {
  const t = useStudioCopy();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const markOffline = () => setOffline(true);
    const markOnline = () => setOffline(false);
    setOffline(!navigator.onLine);
    window.addEventListener("offline", markOffline);
    window.addEventListener("online", markOnline);
    return () => {
      window.removeEventListener("offline", markOffline);
      window.removeEventListener("online", markOnline);
    };
  }, []);

  if (!offline) return null;
  return (
    <p className="mt-4 rounded-2xl bg-clay px-4 py-3 text-sm text-terracotta-ink" role="status">
      {t.offline}
    </p>
  );
}
