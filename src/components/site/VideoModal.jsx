import React, { useEffect, useRef, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { parseVideo } from '@/lib/video';

/**
 * Accessible video dialog: labelled, Escape to close, focus trapped inside,
 * focus returned to the trigger on close, backdrop click closes.
 * Every testimonial can carry a transcript, shown inline — captions alone are
 * not enough for people who use a screen reader.
 */
export default function VideoModal({ item, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const video = parseVideo(item?.video_url);

  useEffect(() => {
    if (!item) return;
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, iframe, video, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-carbon/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-white shadow-brand-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-carbon/10 p-5 sm:p-6">
          <div className="min-w-0">
            <h2 id="video-modal-title" className="text-xl font-extrabold text-carbon">
              {item.name}
            </h2>
            {item.role && <p className="mt-0.5 text-sm font-semibold text-stone">{item.role}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-carbon/15 text-carbon transition-colors hover:bg-sky"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-carbon">
          {video.kind === 'iframe' && (
            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={video.src}
                title={`Video testimonial from ${item.name}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {video.kind === 'file' && (
            <video src={video.src} controls autoPlay playsInline className="w-full" style={{ aspectRatio: '16 / 9' }}>
              {item.captions_url && <track kind="captions" src={item.captions_url} srcLang="en" label="English" default />}
            </video>
          )}

          {video.kind === 'none' && (
            <div className="flex items-center justify-center px-6 py-16 text-center text-white/80">
              <p>
                No video file is attached to this story yet.
                {item.quote ? ' The written version is below.' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {item.quote && (
            <blockquote className="border-l-4 border-gold pl-4 text-lg leading-relaxed text-ink">
              “{item.quote}”
            </blockquote>
          )}

          {item.transcript && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowTranscript((v) => !v)}
                aria-expanded={showTranscript}
                aria-controls="video-transcript"
                className="inline-flex items-center gap-2 rounded-full border-2 border-carbon/15 px-4 py-2 text-sm font-bold text-carbon transition-colors hover:bg-sky"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {showTranscript ? 'Hide transcript' : 'Read transcript'}
              </button>
              <div
                id="video-transcript"
                hidden={!showTranscript}
                className="mt-4 max-h-64 overflow-y-auto rounded-2xl bg-sky p-5 text-[0.95rem] leading-relaxed text-ink"
              >
                {item.transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
