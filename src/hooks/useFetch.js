import { useState, useEffect, useCallback, useRef } from "react";

// Custom Hook reutilizable: fetch con async/await, AbortController, caché simple
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // useRef: caché en memoria que NO provoca re-render
  const cacheRef = useRef({});

  const fetchData = useCallback(
    async (signal) => {
      if (!url) return;

      // Si ya está en caché, usar sin fetch
      if (cacheRef.current[url]) {
        setData(cacheRef.current[url]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        cacheRef.current[url] = json; // guardar en caché
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  useEffect(() => {
    const controller = new AbortController();
    // Limpiar datos obsoletos del URL anterior si no hay caché para el nuevo URL
    if (!cacheRef.current[url]) {
      setData(null);
    }
    fetchData(controller.signal);
    // Función de limpieza: aborta si el componente desmonta o url cambia
    return () => controller.abort();
  }, [fetchData, url]);

  return { data, loading, error };
}
