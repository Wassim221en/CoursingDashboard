function normalizeOrigin(url: string | undefined): string | null {
  if (typeof url !== 'string' || !url.trim()) return null;
  const t = url.trim();
  return t.endsWith('/') ? t : `${t}/`;
}

const FALLBACK_ORIGIN = 'https://api.course-ing.com/';

const origin =
  normalizeOrigin(import.meta.env.VITE_API_ORIGIN) ?? FALLBACK_ORIGIN;

export const SERVER_BASE_URL = origin;
export const API_BASE_URL = `${origin}api`;
