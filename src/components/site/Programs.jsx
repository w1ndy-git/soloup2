import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { Sprout } from "@/components/site/Botanical";
import { useMotion } from "@/components/site/MotionContext";

const PROGRAMS = [
  {
    id: "horticulture",
    title: "Horticulture",
    tagline: "Hands in the soil, roots in purpose.",
    img: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/b5596ae5c_generated_202cd9be.jpg",
    blurb:
      "Students learn the full growing cycle — from seed to harvest — in the living classroom of the botanical gardens. They cultivate patience, responsibility, and pride as what they tend begins to bloom.",
    skills: ["Greenhouse & propagation", "Harvest & market prep", "Plant care & ecology", "Tool safety & teamwork"],
    accent: "bg-forest text-mist",
  },
  {
    id: "life-skills",
    title: "Life Skills",
    tagline: "Everyday confidence, one recipe at a time.",
    img: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/24236dfb3_generated_c8b42827.jpg",
    blurb:
      "From the teaching kitchen to budgeting and self-advocacy, students build the practical muscles of independent adult life — grounded in their own goals and pace.",
    skills: ["Culinary & nutrition", "Budgeting & finance", "Communication & self-advocacy", "Health & wellbeing"],
    accent: "bg-petal text-forest",
  },
  {
    id: "community",
    title: "Community Outreach",
    tagline: "Giving back grows everyone.",
    img: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/870bdf61d_generated_0980d344.jpg",
    blurb:
      "Students step into the wider community — running market booths, volunteering, and building relationships — discovering that their contributions are valued and valued deeply.",
    skills: ["Farmers market sales", "Volunteer projects", "Customer & social skills", "Mentorship & leadership"],
    accent: "bg-terracotta text-forest",
  },
];

export default function Programs() {
  const [active, setActive] = useState(null);
  const { reduceMotion } = useMotion();
  const current = PROGRAMS.find((p) => p.id === active);

  return (
    <section id="path" className="relative bg-forest py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #FFD166 0, transparent 40%), radial-gradient(circle at 80% 70%, #E29578 0, transparent 40%)" }} />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-petal font-semibold uppercase tracking-[0.2em] text-xs">The Path to Purpose</span>
          <h2 className="mt-3 font-display font-light text-display text-mist text-balance">
            Stepping stones from classroom to <span className="italic text-petal">life</span>.
          </h2>
          <p className="mt-5 text-lg text-mist/70">
            Tap a stone to step deeper into the journey. Each program unfolds into its full curriculum.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {PROGRAMS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className="group text-left rounded-[2rem] overflow-hidden bg-forest-deep/60 border border-mist/10 hover:border-petal/40 transition-all duration-500 hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
              style={{ animationDelay: reduceMotion ? "0ms" : `${i * 100}ms` }}
            >
              <div className="relative h-56 overflow-hidden">
                <Image src={p.img} alt={`${p.title} program`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/30 to-transparent" />
                <span className={`absolute top-4 left-4 grid place-items-center w-11 h-11 rounded-full ${p.accent} font-display font-bold text-lg shadow-lg`}>
                  {i + 1}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-mist">{p.title}</h3>
                <p className="mt-1.5 text-mist/70 text-sm">{p.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-petal font-semibold text-sm">
                  Step into it
                  <svg viewBox="0 0 24 24" className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Expanded deep-dive overlay */}
      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-forest-deep/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title} program details`}
        >
          <div
            className="relative w-full max-w-3xl bg-mist rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-full bg-forest text-mist hover:bg-forest-deep transition-colors min-w-[44px]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="relative h-56 sm:h-72">
              <Image src={current.img} alt={current.title} className="w-full h-full object-cover" fittingType="fill" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep to-transparent" />
              <div className="absolute bottom-5 left-6 text-mist">
                <span className="text-petal font-semibold uppercase tracking-[0.18em] text-xs">Program</span>
                <h3 className="font-display text-3xl sm:text-4xl font-semibold">{current.title}</h3>
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-xl text-forest/80 font-display italic">{current.tagline}</p>
              <p className="mt-4 text-lg text-forest/75 leading-relaxed">{current.blurb}</p>
              <h4 className="mt-8 font-display text-xl font-semibold text-forest flex items-center gap-2">
                <Sprout className="w-6 h-6 text-terracotta" />
                What students cultivate
              </h4>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                {current.skills.map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-2xl bg-white/70 border border-forest/10 px-4 py-3">
                    <span className="grid place-items-center w-7 h-7 rounded-full bg-petal text-forest shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    </span>
                    <span className="text-forest/85 font-medium">{s}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#involved"
                onClick={() => setActive(null)}
                className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-forest text-mist font-bold shadow-lg hover:bg-forest-deep transition-colors min-h-[52px]"
              >
                Enroll or learn more
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}