export const formatAuthors = (authors?: string | string[] | undefined): string => {
  if (!authors) return '';
  let list: string[] = [];
  if (typeof authors === 'string') list = authors.split(',').map(s=>s.trim()).filter(Boolean);
  else list = authors;
  if (list.length > 6) return list.slice(0,5).join(', ') + ` + ${list.length-5} more`;
  return list.join(', ');
};
export const getFullAuthorList = (authors?: string | string[] | undefined): string => {
  if (!authors) return '';
  if (typeof authors === 'string') return authors;
  return authors.join(', ');
};
export const hasBibtex = (pubs?: any[]): boolean => {
  if (!pubs) return false;
  return pubs.some(p=>!!p.bibtex);
};
export const openInNewTab = (url: string) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
};
