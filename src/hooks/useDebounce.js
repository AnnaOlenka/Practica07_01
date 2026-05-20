import { useState, useEffect } from "react";

// Custom Hook: retrasa el valor hasta que el usuario deje de escribir
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Limpieza: cancela el timer si value cambia antes del delay
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
