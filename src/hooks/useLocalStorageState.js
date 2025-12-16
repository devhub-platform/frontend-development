import { useEffect, useState } from "react";

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // لو المتصفح منع التخزين لأي سبب، نتجاهل
    }
  }, [key, value]);

  return [value, setValue];
}
