import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2, ThumbsUp, ThumbsDown, ExternalLink, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildPrompt, SUGGESTED } from '@/lib/knowledge';
import { links, org } from '@/lib/siteConfig';

/**
 * "Ask SoloUp" — a grounded assistant for the site.
 *
 * Built on base44.integrations.Core.InvokeLLM rather than the agents API,
 * because the agents API needs a dashboard-configured agent and an
 * authenticated user; most visitors here are anonymous.
 *
 * The whole design goal is that it cannot make things up. Its entire world is
 * `src/lib/knowledge.js`, every fact in which came from a page the customer
 * supplied. Eligibility, cost, dates, staff and contact details are explicitly
 * fenced off, because a wrong answer to a parent about whether their young
 * adult qualifies is worse than no answer at all.
 */

const OPENING =
  "Hi — I can answer questions about SoloUp: what the programme does, how the phases work, how to get involved, and how giving works. I only know what's published on this site, so I'll tell you plainly when something needs a person instead.";

/* Phrases the model uses when it hits the edge of its knowledge. Used to flag
   content gaps for staff, not to alter the answer. */
const UNANSWERED_HINTS = [
  "doesn't list", 'does not list', "doesn't say", 'does not say', "isn't published",
  'is not published', "doesn't publish", 'does not publish', "can't tell you",
  'cannot tell you', "don't have that", 'do not have that',
];

function newSessionRef() {
  try {
    return crypto.randomUUID().slice(0, 12);
  } catch {
    return Math.random().toString(36).slice(2, 14);
  }
}

export default function AskSoloUp() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: OPENING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sessionRef = useRef(newSessionRef());
  const turnRef = useRef(0);

  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  /* Dialog behaviour: Escape closes, Tab is trapped, focus starts in the box. */
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const f = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!f?.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  /* Keep the newest message in view. */
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const ask = async (question) => {
    const q = question.trim();
    if (!q || busy) return;

    setError('');
    setInput('');
    setBusy(true);
    const history = messages;
    setMessages((m) => [...m, { role: 'user', content: q }]);

    try {
      const reply = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(history, q),
        model: 'claude-sonnet-5',
      });

      const answer =
        typeof reply === 'string' ? reply.trim() : String(reply?.text ?? reply ?? '').trim();

      if (!answer) throw new Error('empty response');

      setMessages((m) => [...m, { role: 'assistant', content: answer, rateable: true }]);

      turnRef.current += 1;
      const lower = answer.toLowerCase();
      base44.entities.AskSoloUpLog
        .create({
          question: q,
          answer,
          was_unanswered: UNANSWERED_HINTS.some((h) => lower.includes(h)),
          turn_index: turnRef.current,
          session_ref: sessionRef.current,
          helpful: 'unrated',
        })
        .catch(() => {});
    } catch {
      setError(
        "That didn't go through. Try again in a moment — or use the interest form, which reaches a person directly.",
      );
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const rate = (index, value) => {
    setMessages((m) => m.map((msg, i) => (i === index ? { ...msg, rated: value } : msg)));
    base44.entities.AskSoloUpLog
      .filter({ session_ref: sessionRef.current }, '-created_date', 1)
      .then((rows) => {
        if (rows?.[0]?.id) return base44.entities.AskSoloUpLog.update(rows[0].id, { helpful: value });
        return null;
      })
      .catch(() => {});
  };

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="ask-soloup-panel"
        className={[
          'fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2.5 rounded-full bg-carbon px-5 py-4 font-black text-white',
          'shadow-brand-lg transition-transform hover:-translate-y-0.5 sm:bottom-7 sm:right-7',
          open ? 'pointer-events-none opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Ask about SoloUp</span>
        <span className="sm:hidden">Ask</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed inset-0 z-[75] flex items-end justify-end bg-carbon/40 p-0 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            id="ask-soloup-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-soloup-title"
            className="flex h-[100dvh] w-full flex-col bg-cream sm:h-[min(42rem,88vh)] sm:w-[27rem] sm:rounded-[1.5rem] sm:border-[3px] sm:border-carbon"
          >
            {/* Header */}
            <div className="on-dark flex items-start justify-between gap-3 bg-carbon px-5 py-4 sm:rounded-t-[1.25rem]">
              <div className="min-w-0">
                <h2 id="ask-soloup-title" className="text-lg font-black text-white">
                  Ask SoloUp
                </h2>
                <p className="mt-0.5 text-sm text-white/70">
                  Answers drawn only from this site
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close Ask SoloUp"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Transcript */}
            <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <ul className="space-y-4" aria-live="polite" aria-atomic="false">
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <li key={i} className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-carbon px-4 py-3 text-white">
                        <span className="sr-only">You asked: </span>
                        {m.content}
                      </p>
                    </li>
                  ) : (
                    <li key={i}>
                      <div className="max-w-[92%] rounded-2xl rounded-bl-sm border-2 border-carbon/10 bg-white px-4 py-3">
                        <span className="sr-only">Ask SoloUp replied: </span>
                        <p className="whitespace-pre-wrap leading-relaxed text-ink">{m.content}</p>
                      </div>
                      {m.rateable && (
                        <div className="mt-2 flex items-center gap-2">
                          {m.rated ? (
                            <span className="text-xs font-bold text-stone">Thanks — noted.</span>
                          ) : (
                            <>
                              <span className="text-xs font-bold text-stone">Did that help?</span>
                              <button
                                type="button"
                                onClick={() => rate(i, 'yes')}
                                aria-label="That answer helped"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-carbon/15 text-carbon hover:bg-lime"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => rate(i, 'no')}
                                aria-label="That answer did not help"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-carbon/15 text-carbon hover:bg-sky"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ),
                )}
              </ul>

              {busy && (
                <p className="flex items-center gap-2 text-sm font-bold text-stone" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Thinking…
                </p>
              )}

              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              {messages.length === 1 && !busy && (
                <div className="pt-1">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-stone">Try asking</p>
                  <ul className="mt-2.5 space-y-2">
                    {SUGGESTED.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => ask(s)}
                          className="w-full rounded-2xl border-2 border-carbon/15 bg-white px-4 py-3 text-left text-[0.95rem] font-semibold text-carbon transition-colors hover:bg-sky"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Always-visible human handoff */}
            <div className="border-t-2 border-carbon/10 px-5 py-3">
              <p className="text-xs leading-relaxed text-stone">
                Need a person?{' '}
                <a
                  href={links.interestForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-ocean underline hover:text-carbon"
                >
                  Use the interest form
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                . Please don’t type personal or medical details here.
              </p>
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-end gap-2 border-t-2 border-carbon/10 bg-white px-4 py-4 sm:rounded-b-[1.25rem]"
            >
              <label htmlFor="ask-soloup-input" className="sr-only">
                Ask a question about {org.name}
              </label>
              <textarea
                id="ask-soloup-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask a question…"
                className="max-h-32 flex-1 resize-none rounded-2xl border-2 border-carbon/15 px-4 py-3 text-ink placeholder:text-stone/60 focus:border-carbon"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-carbon transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
