import React, { useState } from "react";
import { Image } from "@/components/ui/image";

const TESTIMONIALS = [
  {
    id: "maya",
    name: "Maya",
    role: "Horticulture Graduate",
    quote: "I planted my first tomato and it grew. Now I know I can grow too.",
    poster: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/332e9b109_generated_97f67ad3.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    caption: "Maya harvests her first tomatoes and beams with pride at the garden.",
    transcript:
      "Before SoloUp, I didn't think I could do much on my own. Here, I planted my first tomato from a tiny seed. I watered it every day. And it grew! When I held that tomato in my hand, I felt proud — like, really proud. Now I help the new students plant their seeds. I know I can grow too.",
  },
  {
    id: "diego",
    name: "Diego",
    role: "Life Skills Student",
    quote: "I cooked dinner for my family for the first time. They cried happy tears.",
    poster: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/ee92e9b7f_generated_f37f27fa.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    caption: "Diego chops fresh vegetables in the teaching kitchen, focused and smiling.",
    transcript:
      "In the teaching kitchen I learned to plan a meal, shop for it, and cook it. Last month I made dinner for my whole family — pasta with garden veggies. My mom cried, but happy tears. I never thought I'd say 'I made this.' Now I say it all the time.",
  },
  {
    id: "aaliyah",
    name: "Aaliyah",
    role: "Community Ambassador",
    quote: "People at the market know my name now. I belong out there.",
    poster: "https://media.base44.com/images/public/6a98e133ceb86cb304e163c7/483fd9a6a_generated_4a055439.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "Aaliyah sells produce at the farmers market, greeting a regular customer.",
    transcript:
      "I used to be scared to talk to strangers. At the farmers market booth, I learned to greet people, tell them about our plants, and make change. Now regulars come looking for me. They know my name. I belong out there — and that changes everything.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(null);
  const [showCaption, setShowCaption] = useState(true);
  const [showTranscript, setShowTranscript] = useState(null);
  const current = TESTIMONIALS.find((t) => t.id === active);

  const shareJoy = async (t) => {
    const shareData = {
      title: "SoloUp — Voices of Growth",
      text: `${t.name}: "${t.quote}" — SoloUp helps young adults with disabilities grow beyond the classroom. Seeds of Limitless Opportunities.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Story copied — paste it anywhere to share the joy!");
      }
    } catch {
      /* user cancelled share — no action needed */
    }
  };

  return (
    <section id="voices" className="relative bg-mist py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-terracotta font-semibold uppercase tracking-[0.2em] text-xs">Voices of Growth</span>
          <h2 className="mt-3 font-display font-light text-display text-forest text-balance">
            Real stories, <span className="italic text-terracotta">real blooms</span>.
          </h2>
          <p className="mt-5 text-lg text-forest/70">
            Hover a story to watch it bloom. Every voice here is a seed of inspiration — share it forward.
          </p>
        </div>

        {/* Filmstrip */}
        <div className="mt-12 flex gap-5 overflow-x-auto pb-6 -mx-5 px-5 sm:-mx-8 sm:px-8 snap-x snap-mandatory">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="group snap-center shrink-0 w-[80vw] sm:w-[340px] rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-forest/10 border border-forest/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <button
                onClick={() => setActive(t.id)}
                className="block w-full text-left"
                aria-label={`Play ${t.name}'s video testimonial`}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image src={t.poster} alt={`${t.name}, ${t.role}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                  {/* Play button */}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid place-items-center w-16 h-16 rounded-full bg-petal text-forest shadow-2xl transition-transform duration-500 group-hover:scale-110 animate-pulse-glow">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 ml-1" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                  {/* Caption bloom on hover */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-forest-deep/85 backdrop-blur translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-mist text-sm font-medium leading-snug">{t.caption}</p>
                  </div>
                </div>
              </button>
              <div className="p-5">
                <p className="font-display text-lg text-forest italic leading-snug">"{t.quote}"</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forest">{t.name}</p>
                    <p className="text-sm text-forest/60">{t.role}</p>
                  </div>
                  <button
                    onClick={() => shareJoy(t)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-forest/5 text-forest font-semibold text-sm hover:bg-petal transition-colors min-h-[44px]"
                    aria-label={`Share ${t.name}'s story`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>
                    Share the Joy
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Video modal with captions + transcript */}
      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-forest-deep/80 backdrop-blur"
          onClick={() => { setActive(null); setShowTranscript(null); }}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.name}'s video testimonial`}
        >
          <div className="relative w-full max-w-3xl bg-mist rounded-[2rem] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setActive(null); setShowTranscript(null); }}
              aria-label="Close video"
              className="absolute top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-full bg-forest text-mist hover:bg-forest-deep transition-colors min-w-[44px]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="relative bg-forest-deep">
              <video
                src={current.video}
                poster={current.poster}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video object-cover"
              />
              {showCaption && (
                <div className="absolute bottom-4 inset-x-4 text-center">
                  <span className="inline-block bg-forest-deep/90 text-mist px-4 py-2 rounded-lg text-base font-medium leading-snug">
                    {current.caption}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-semibold text-forest">{current.name}</p>
                  <p className="text-forest/60">{current.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowCaption((v) => !v)}
                    className="px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-forest/15 text-forest hover:bg-forest/5 transition-colors min-h-[44px]"
                  >
                    {showCaption ? "Hide captions" : "Show captions"}
                  </button>
                  <button
                    onClick={() => setShowTranscript(showTranscript ? null : current.id)}
                    className="px-4 py-2.5 rounded-full text-sm font-semibold border-2 border-forest/15 text-forest hover:bg-forest/5 transition-colors min-h-[44px]"
                  >
                    {showTranscript === current.id ? "Hide transcript" : "Read transcript"}
                  </button>
                </div>
              </div>
              {showTranscript === current.id && (
                <p className="mt-4 text-forest/80 leading-relaxed bg-white/70 rounded-2xl p-4 border border-forest/10">
                  {current.transcript}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}