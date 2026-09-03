import React, { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { LeafVein } from "@/components/site/Botanical";
import { useMotion } from "@/components/site/MotionContext";

const HERO_IMG = "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/9e186c5c7_generated_b6b930d5.jpg";

export default function Hero() {
  const { reduceMotion } = useMotion();
  const [pulse, setPulse] = useState(12);

  useEffect(() => {
    // "Seeds planted today" — a gentle daily-varying metric
    const day = new Date().getDate();
    setPulse(8 + (day % 9));
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Queen Creek Botanical Gardens bathed in golden hour light"
            className="w-full h-full"
            fittingType="fill"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest/55 to-forest-deep/85" aria-hidden="true" />
        <div className="absolute inset-0 backdrop-blur-[3px]" aria-hidden="true" />
      </div>

      {/* Decorative growth stems */}
      <LeafVein className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-16 sm:w-24 text-petal/30 animate-sway" />
      <LeafVein className="absolute right-4 sm:right-10 top-1/3 w-12 sm:w-20 text-petal/20 animate-sway" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-32 pb-20 text-mist w-full">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mist/10 backdrop-blur border border-mist/20 text-mist/90 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
            <span className="w-2 h-2 rounded-full bg-petal animate-pulse-glow" />
            A program of Cultivate Goodness
          </span>

          <h1 className="mt-7 font-display font-light text-hero text-mist text-balance">
            <span className="block animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "120ms" }}>Skills.</span>
            <span className="block animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "260ms" }}>
              <span className="italic font-normal text-petal">Confidence.</span>
            </span>
            <span className="block animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "400ms" }}>Purpose.</span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-mist/85 max-w-xl leading-relaxed animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "560ms" }}>
            At Queen Creek Botanical Gardens, young adults with disabilities grow beyond the classroom
            into meaningful adult lives — one seed, one skill, one purposeful step at a time.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "700ms" }}>
            <a
              href="#involved"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-petal text-forest font-bold text-base shadow-xl shadow-petal/30 hover:bg-petal-soft transition-colors min-h-[52px]"
            >
              Join the Movement
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a
              href="#path"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-mist/10 backdrop-blur border border-mist/30 text-mist font-semibold text-base hover:bg-mist/20 transition-colors min-h-[52px]"
            >
              Explore the Path
            </a>
          </div>

          {/* Impact Pulse */}
          <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-forest-deep/50 backdrop-blur border border-petal/30 animate-bloom" style={{ animationDelay: reduceMotion ? "0ms" : "860ms" }}>
            <span className="relative grid place-items-center">
              <span className="absolute w-3 h-3 rounded-full bg-petal animate-pulse-glow" />
              <span className="w-3 h-3 rounded-full bg-petal" />
            </span>
            <span className="text-mist text-sm sm:text-base">
              <span className="font-bold text-petal">{pulse} Seeds Planted Today</span>
              <span className="text-mist/70"> — young adults in active training</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#about" aria-label="Scroll to learn more" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-mist/70 hover:text-petal transition-colors">
        <svg viewBox="0 0 24 24" className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </a>
    </section>
  );
}