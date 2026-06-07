"use client";

import { useEffect, useState } from "react";

/**
 * API에서 데이터를 가져오고, 실패하면(예: DB 미연결 로컬 환경) fallback을 보여준다.
 * isLive=false면 데모 데이터임을 UI에서 배지로 표시할 수 있다.
 */
export function useApi<T>(
  url: string | null,
  fallback: T,
  pick?: (json: unknown) => T | null | undefined,
) {
  const [data, setData] = useState<T>(fallback);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(url !== null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const picked = pick ? pick(json) : (json as T);
        if (picked === null || picked === undefined) throw new Error("empty");
        setData(picked);
        setIsLive(true);
      })
      .catch(() => {
        if (cancelled) return;
        setData(fallback);
        setIsLive(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, isLive, loading };
}
