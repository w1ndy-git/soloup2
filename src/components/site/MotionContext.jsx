import React, { createContext, useContext, useEffect, useState } from "react";

const MotionContext = createContext({ reduceMotion: false, toggle: () => {} });

export function MotionProvider({ children }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("soloup-reduce-motion");
    if (stored === "true") setReduceMotion(true);
    else if (stored === null && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    localStorage.setItem("soloup-reduce-motion", String(reduceMotion));
  }, [reduceMotion]);

  const toggle = () => setReduceMotion((v) => !v);

  return (
    <MotionContext.Provider value={{ reduceMotion, toggle }}>
      {children}
    </MotionContext.Provider>
  );
}

export const useMotion = () => useContext(MotionContext);