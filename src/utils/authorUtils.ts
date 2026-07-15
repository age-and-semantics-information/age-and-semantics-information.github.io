import type { Paper } from '@/types/paper';
export const parseAuthors = (authors: string | string[]): string[] => {
  if (Array.isArray(authors)) return authors;
  return authors.split(',').map(s=>s.trim()).filter(Boolean);
};
export const buildAuthorCanonicalizer = (data: Paper[]) => {
  const map = new Map<string,string>();
  const canonicalKey = (name: string) => name.toLowerCase().replace(/\s+/g,' ').trim();
  return { canonicalKey };
};
