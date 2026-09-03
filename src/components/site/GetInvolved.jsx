import React from "react";
import { Sprout } from "@/components/site/Botanical";

const WAYS = [
  {
    title: "Donate",
    desc: "Every gift plants a seed — supplies, stipends, and seeds themselves for a young adult in training.",
    cta: "Give today",
    href: "#donate",
    accent: "bg-petal text-forest",
  },
  {
    title: "Volunteer",
    desc: "Share a skill in the garden, kitchen, or market. A few hours a month changes a trajectory.",
    cta: "Lend a hand",
    href: "#volunteer",
    accent: "bg-terracotta text-forest",
  },
  {
    title: "Enroll",
    desc: "Know a young adult ready to grow beyond the classroom? Let's walk the path together.",
    cta: "Start the journey",
    href: "#enroll",
    accent: "bg-forest text-mist",
  },
];

export default function GetInvolved() {
  return (
    <section id="involved" className="relative bg-gradient-to-b from-mist to-forest/5 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-petal font-semibold uppercase tracking-[0.2em] text-xs">Plant a Seed</span>
          <h2 className="mt-3 font-display font-light text-display text-forest text-balance">
            Be part of the <span className="italic text-terracotta">unfolding</span>.
          </h2>
          <p className="mt-5 text-lg text-forest/70">
            However you join, you help a young adult bloom into a life of skills, confidence, and purpose.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {WAYS.map((w) => (
            <div key={w.title} className="group rounded-[2rem] bg-white border border-forest/10 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
              <span className={`grid place-items-center w-14 h-14 rounded-2xl ${w.accent} mb-5`}>
                <Sprout className="w-7 h-7" />
              </span>
              <h3 className="font-display text-2xl font-semibold text-forest">{w.title}</h3>
              <p className="mt-3 text-forest/70 leading-relaxed flex-1">{w.desc}</p>
              <a
                href={w.href}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-forest text-mist font-semibold hover:bg-forest-deep transition-colors min-h-[48px]"
              >
                {w.cta}
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2.5rem] bg-forest text-mist p-8 sm:p-12 text-center shadow-2xl shadow-forest/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #FFD166 0, transparent 45%)" }} />
          <p className="relative font-display text-2xl sm:text-3xl font-light text-balance max-w-2xl mx-auto">
            "Every seed we plant is a young adult stepping into a life of <span className="text-petal italic">purpose</span>."
          </p>
          <p className="relative mt-4 text-mist/70">— The SoloUp Team at Cultivate Goodness</p>
        </div>
      </div>
    </section>
  );
}