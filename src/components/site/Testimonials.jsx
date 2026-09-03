import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, AlertTriangle, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { parseVideo, formatDuration } from '@/lib/video';
import { links } from '@/lib/siteConfig';
import VideoModal from './VideoModal';

/**
 * Video testimonials.
 *
 * Stories are read from the `Testimonial` entity so staff can add them from the
 * Base44 dashboard without touching code.
 *
 * ⚠️  SoloUp has no recorded testimonials yet, and inventing quotes from
 *     disabled young adults or naming real employers would be dishonest. So the
 *     gallery ships with four SAMPLE cards that describe the *kind* of story
 *     that belongs in each slot. They carry a visible amber "SAMPLE" badge and
 *     an editor notice above the grid. Publish real records (is_sample: false)
 *     and the samples disappear automatically.
 */

const SAMPLE_STORIES = [
  {
    id: 'sample-participant',
    name: 'Participant story',
    role: 'SoloUp participant',
    category: 'participant',
    quote:
      'A participant describes what changed for them — the first shift they worked, the routine they built, the thing they can now do alone.',
    transcript:
      'PLACEHOLDER — no real person is quoted here. This slot is for a 60–90 second clip of a participant in their own words: what they were doing before SoloUp, one concrete thing they can do now, and what they are working toward next. Record it where they actually work. Add the video URL and a full transcript to this record in the Base44 dashboard.',
    is_sample: true,
    published: true,
    sort_order: 1,
  },
  {
    id: 'sample-family',
    name: 'Family story',
    role: 'Parent or guardian',
    category: 'family',
    quote:
      'A parent talks about the drop-off after graduation — and what it meant to find a program that kept going when school stopped.',
    transcript:
      'PLACEHOLDER — no real person is quoted here. This slot is for a parent or guardian describing the gap that opens when school support ends, and what changed once their young adult joined SoloUp. Parents speaking to other parents is the strongest recruitment this page can carry.',
    is_sample: true,
    published: true,
    sort_order: 2,
  },
  {
    id: 'sample-employer',
    name: 'Employer story',
    role: 'Partner employer',
    category: 'employer',
    quote:
      'A local employer explains how a supported job trial worked in practice, and what their team gained from it.',
    transcript:
      'PLACEHOLDER — no real business is quoted here. This slot is for a partner employer answering the question every other employer is silently asking: what did this actually cost me, and was it worth it. Name the business only with written permission.',
    is_sample: true,
    published: true,
    sort_order: 3,
  },
  {
    id: 'sample-volunteer',
    name: 'Volunteer story',
    role: 'Garden volunteer',
    category: 'volunteer',
    quote:
      'A volunteer or coach describes a moment in the garden when something clicked for the person they were working alongside.',
    transcript:
      'PLACEHOLDER — no real person is quoted here. This slot is for a volunteer or job coach describing one specific moment, not a general endorsement. Specifics persuade; adjectives do not.',
    is_sample: true,
    published: true,
    sort_order: 4,
  },
];

const FILTERS = [
  { key: 'all', label: 'All stories' },
  { key: 'participant', label: 'Participants' },
  { key: 'family', label: 'Families' },
  { key: 'employer', label: 'Employers' },
  { key: 'volunteer', label: 'Volunteers' },
];

export default function Testimonials() {
  const [stories, setStories] = useState(SAMPLE_STORIES);
  const [filter, setFilter] = useState('all');
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await base44.entities.Testimonial.filter({ published: true }, 'sort_order', 50);
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        const real = rows.filter((r) => !r.is_sample);
        // Real stories win outright; otherwise keep the labelled samples.
        setStories(real.length ? real : rows);
      } catch {
        /* Entity not reachable (e.g. first preview) — samples stay. */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? stories : stories.filter((s) => s.category === filter)),
    [stories, filter],
  );

  const showingSamples = stories.some((s) => s.is_sample);

  return (
    <section id="stories" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="container-brand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf">In Their Words</p>
          <h2 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight text-carbon sm:text-5xl">
            Hear it from the people living it.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            Short videos from participants, families, employers and volunteers. Every story includes
            captions and a full transcript.
          </p>
        </div>

        {showingSamples && (
          <div
            role="note"
            className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border-2 border-gold/60 bg-gold/10 p-5 text-left"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-[0.95rem] leading-relaxed text-ink">
              <strong className="font-bold">For SoloUp staff:</strong> these are placeholder cards showing
              the kind of story that belongs in each slot — no real person is quoted. Add real videos
              under <strong>Testimonial</strong> in the Base44 dashboard and set{' '}
              <code className="rounded bg-white px-1.5 py-0.5 text-sm font-semibold">published</code> to
              true; the placeholders disappear on their own.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter stories">
          {FILTERS.map((f) => {
            const on = filter === f.key;
            const count = f.key === 'all' ? stories.length : stories.filter((s) => s.category === f.key).length;
            if (count === 0 && f.key !== 'all') return null;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={on}
                className={[
                  'rounded-full px-5 py-2.5 text-[0.95rem] font-bold transition-colors',
                  on ? 'bg-carbon text-white' : 'border-2 border-carbon/15 text-carbon hover:bg-sky',
                ].join(' ')}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s, i) => {
            const video = parseVideo(s.video_url);
            const poster = s.poster_url || video.poster;
            const duration = formatDuration(s.duration_seconds);
            const playable = video.kind !== 'none' || Boolean(s.transcript);

            return (
              <motion.li
                key={s.id || s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06 }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-carbon/10 bg-white shadow-brand">
                  <div className="relative aspect-video overflow-hidden bg-sky">
                    {poster ? (
                      <img
                        src={poster}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grad-deep flex h-full w-full items-center justify-center">
                        <Video className="h-12 w-12 text-white/45" aria-hidden="true" />
                      </div>
                    )}

                    {s.is_sample && (
                      <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-wider text-carbon">
                        Sample
                      </span>
                    )}
                    {duration && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-carbon/85 px-2.5 py-1 text-xs font-bold text-white">
                        {duration}
                      </span>
                    )}

                    {playable && (
                      <button
                        type="button"
                        onClick={() => setOpenItem(s)}
                        className="absolute inset-0 flex items-center justify-center bg-carbon/25 opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-brand-lg">
                          <Play className="ml-1 h-7 w-7 text-carbon" aria-hidden="true" fill="currentColor" />
                        </span>
                        <span className="sr-only">
                          {s.is_sample ? `Open the ${s.name} placeholder` : `Play the story from ${s.name}`}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-extrabold text-carbon">{s.name}</h3>
                    {s.role && <p className="mt-0.5 text-sm font-semibold text-stone">{s.role}</p>}
                    {s.quote && (
                      <p className="mt-4 flex-1 leading-relaxed text-ink">
                        {s.is_sample ? s.quote : `“${s.quote}”`}
                      </p>
                    )}
                    {playable && (
                      <button
                        type="button"
                        onClick={() => setOpenItem(s)}
                        className="mt-5 inline-flex items-center gap-2 self-start py-1 text-[0.95rem] font-bold text-ocean hover:text-carbon"
                      >
                        {s.is_sample ? 'What belongs here' : 'Watch the story'}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ul>

        {/* Share your story */}
        <div className="mt-14 rounded-[1.75rem] grad-lime p-8 text-center sm:p-10">
          <h3 className="font-display text-2xl font-black text-carbon sm:text-3xl">
            Been part of SoloUp? Tell people what it did.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink">
            A ninety-second video from a participant, parent or employer does more to move someone
            than any page of copy. If you have a story, we would love to record it.
          </p>
          <a
            href={links.interestForm}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-carbon px-7 py-3.5 text-lg font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5"
          >
            Share your story
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <VideoModal item={openItem} onClose={() => setOpenItem(null)} />
    </section>
  );
}
