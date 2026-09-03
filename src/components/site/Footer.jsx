import React from "react";
import { Sprout } from "@/components/site/Botanical";

export default function Footer() {
  return (
    <footer className="relative bg-forest-deep text-mist pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-petal/40 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-petal text-forest">
                <Sprout className="w-6 h-6" />
              </span>
              <span className="font-display font-semibold text-2xl">SoloUp</span>
            </div>
            <p className="mt-5 text-mist/70 max-w-sm leading-relaxed">
              A program of Cultivate Goodness at Queen Creek Botanical Gardens — helping young adults with
              disabilities grow beyond the classroom into meaningful adult lives.
            </p>
            <p className="mt-4 font-display italic text-petal text-lg">Seeds of Limitless Opportunities</p>
          </div>

          <div>
            <h3 className="font-semibold text-petal uppercase tracking-[0.15em] text-xs">Explore</h3>
            <ul className="mt-4 space-y-3">
              {[
                { l: "Our Path", h: "#path" },
                { l: "Voices", h: "#voices" },
                { l: "Grow the Movement", h: "#share" },
                { l: "Impact", h: "#impact" },
                { l: "Plant a Seed", h: "#involved" },
              ].map((i) => (
                <li key={i.h}>
                  <a href={i.h} className="text-mist/75 hover:text-petal transition-colors min-h-[44px] inline-flex items-center">{i.l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-petal uppercase tracking-[0.15em] text-xs">Visit & Connect</h3>
            <ul className="mt-4 space-y-3 text-mist/75">
              <li>Queen Creek Botanical Gardens</li>
              <li>Queen Creek, Arizona</li>
              <li>
                <a href="mailto:hello@soloup.org" className="hover:text-petal transition-colors min-h-[44px] inline-flex items-center">hello@soloup.org</a>
              </li>
              <li>
                <a href="https://soloup.org" className="hover:text-petal transition-colors min-h-[44px] inline-flex items-center">soloup.org</a>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {["Instagram", "Facebook", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#share"
                  aria-label={s}
                  className="grid place-items-center w-11 h-11 rounded-full bg-mist/10 border border-mist/20 hover:bg-petal hover:text-forest transition-colors min-w-[44px] text-xs font-bold"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-mist/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mist/55">
          <p>© {new Date().getFullYear()} SoloUp · A program of Cultivate Goodness. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-petal transition-colors min-h-[44px] inline-flex items-center">Privacy</a>
            <a href="#" className="hover:text-petal transition-colors min-h-[44px] inline-flex items-center">Terms</a>
            <a href="#" className="hover:text-petal transition-colors min-h-[44px] inline-flex items-center">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}