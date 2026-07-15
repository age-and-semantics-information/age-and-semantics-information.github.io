import type { Paper } from '@/types/paper';
export const exportBibtex = (papers: Paper[]): string => {
  return papers.map(p=> p.publications?.map(pub=>pub.bibtex).filter(Boolean).join('\n\n')||'').filter(Boolean).join('\n\n');
};
