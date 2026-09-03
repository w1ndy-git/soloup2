import React from "react";
import { Image } from "@/components/ui/image";
import { SunArc } from "@/components/site/Botanical";

const ABOUT_IMG = "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/d82343a31_generated_5cb11931.jpg";

export default function About() {
  return (
    <section id="about" className="relative bg-mist py-24 sm:py-32 overflow-hidden">
      <SunArc className="absolute top-10 left-1/2 -translate-x-1/2 w-64 text-petal/40" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-petal/30 to-terracotta/20 blur-2xl" aria-hidden="true" />
              <div className="relative mask-pebble overflow-hidden rounded-[2.5rem] shadow-2xl shadow-forest/20">
                <Image
                  src={ABOUT_IMG}
                  alt="A serene garden pathway at Queen Creek Botanical Gardens"
                  className="w-full aspect-[3/2] object-cover"
                  fittingType="fill"
                />
              </div>
              <div className="absolute -bottom-5 -right-2 sm:-right-5 bg-forest text-mist rounded-2xl px-5 py-4 shadow-xl">
                <p className="font-display text-3xl font-semibold leading-none text-petal">100%</p>
                <p className="text-xs mt-1 text-mist/80 max-w-[7rem]">person-centered growth</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-petal font-semibold uppercase tracking-[0.2em] text-xs">Our Story</span>
            <h2 className="mt-3 font-display font-light text-display text-forest text-balance">
              Where potential is <span className="italic text-terracotta">cultivated</span>, not contained.
            </h2>
            <p className="mt-6 text-lg text-forest/75 leading-relaxed">
              SoloUp is a program of <strong className="text-forest">Cultivate Goodness</strong> at Queen Creek
              Botanical Gardens. We believe the transition from classroom to adult life should feel like a
              majestic unfolding — not a cliff edge.
            </p>
            <p className="mt-4 text-lg text-forest/75 leading-relaxed">
              Through hands-on horticulture, life skills, and community connection, young adults with
              disabilities discover their own rhythm of growth. Here, every seed planted is a step toward
              confidence, capability, and a life of purpose.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { k: "Belong", v: "A community that roots for you" },
                { k: "Become", v: "Skills that bloom into mastery" },
                { k: "Believe", v: "Purpose that lasts a lifetime" },
              ].map((b) => (
                <div key={b.k} className="rounded-2xl bg-white/70 border border-forest/10 p-4">
                  <p className="font-display text-lg font-semibold text-forest">{b.k}</p>
                  <p className="text-sm text-forest/65 mt-1">{b.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}