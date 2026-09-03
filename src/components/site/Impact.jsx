import React, { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/site/MotionContext";

const STATS = [
  { value: 48, suffix: "+", label: "Young adults growing with us" },
  { value: 92, suffix: "%", label: "Gain a community role within a year" },
  { value: 1200, suffix: "+", label: "Seedlings planted & harvested" },
  { value: 15, suffix: "", label: "Community partners standing with us" },
];

function CountUp({ end, suffix, reduceMotion }) {
  const [n, setN] = useState(reduceMotion ? end : 0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    if (reduceMotion) { setN(end); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true;
          const duration = 1600;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, reduceMotion]);

  const display = n >= 1000 ? `${(n / 1000).toFixed(n >= 1200 ? 0 : 1)}k` : n;
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Impact() {
  const { reduceMotion } = useMotion();
  return (
    <section id="impact" className="relative bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-terracotta font-semibold uppercase tracking-[0.2em] text-xs">Our Impact</span>
          <h2 className="mt-3 font-display font-light text-display text-forest text-balance">
            Growth you can <span className="italic text-terracotta">measure</span>.
          </h2>
          <p className="mt-5 text-lg text-forest/70">
            Every number here is a young adult stepping into a life of confidence and purpose.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-[2rem] bg-white border border-forest/10 p-7 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <p className="font-display text-4xl sm:text-5xl font-semibold text-forest">
                <CountUp end={s.value} suffix={s.suffix} reduceMotion={reduceMotion} />
              </p>
              <p className="mt-3 text-forest/65 text-sm sm:text-base leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}