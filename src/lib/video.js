/**
 * Normalises the video URLs staff will paste into the Testimonial entity.
 * Accepts YouTube (watch / youtu.be / shorts / embed), Vimeo, or a direct file
 * URL, and reports how the player should render it.
 */

const YT_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be'];
const VIMEO_HOSTS = ['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'];

export function parseVideo(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return { kind: 'none' };

  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { kind: 'none' };
  }

  const host = url.hostname.toLowerCase();

  if (YT_HOSTS.includes(host)) {
    let id = '';
    if (host.endsWith('youtu.be')) {
      id = url.pathname.slice(1);
    } else if (url.pathname.startsWith('/shorts/')) {
      id = url.pathname.split('/')[2] || '';
    } else if (url.pathname.startsWith('/embed/')) {
      id = url.pathname.split('/')[2] || '';
    } else {
      id = url.searchParams.get('v') || '';
    }
    id = id.split('/')[0];
    if (!/^[\w-]{6,20}$/.test(id)) return { kind: 'none' };
    return {
      kind: 'iframe',
      // cc_load_policy=1 turns captions on by default — this audience needs them.
      src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&cc_load_policy=1&autoplay=1`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      id,
    };
  }

  if (VIMEO_HOSTS.includes(host)) {
    const id = (url.pathname.split('/').filter(Boolean).pop() || '').split('?')[0];
    if (!/^\d{6,12}$/.test(id)) return { kind: 'none' };
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}?autoplay=1&texttrack=en`, poster: null, id };
  }

  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url.pathname)) {
    return { kind: 'file', src: url.href, poster: null, id: url.href };
  }

  return { kind: 'none' };
}

/** mm:ss from a number of seconds, for the card badge. */
export function formatDuration(seconds) {
  const s = Number(seconds);
  if (!Number.isFinite(s) || s <= 0) return null;
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}
