import { parseAuthors, buildAuthorCanonicalizer } from './authorUtils';
import type { Paper } from '@/types/paper';
export interface VenueStats { name: string; count: number; }
export interface PaperStats {
  totalPapers: number;
  totalAuthors: number;
  totalVenues: number;
  yearDistribution: Record<number, number>;
  venueStats: VenueStats[];
}
export const calculateStats = (data: Paper[]): PaperStats => {
  const canonicalizer = buildAuthorCanonicalizer(data);
  const totalPapers = data.length;
  const allAuthors = new Set<string>();
  data.forEach(paper=>{
    if (paper.authors) {
      const list = parseAuthors(paper.authors);
      list.forEach(a=> allAuthors.add(canonicalizer.canonicalKey(a)));
    }
  });
  const uniqueVenues = new Set<string>();
  data.forEach(paper=>{
    paper.publications?.forEach(pub=>{
      if (pub.name && pub.name!=='arXiv') uniqueVenues.add(pub.name);
    });
  });
  const yearDistribution = data.reduce<Record<number,number>>((acc,paper)=>{
    const years = paper.publications?.map(p=>p.year).filter((y):y is number=> typeof y==='number')||[];
    if (years.length>0) { const y=Math.min(...years); acc[y]=(acc[y]||0)+1; }
    else if (paper.year) { acc[paper.year]=(acc[paper.year]||0)+1; }
    return acc;
  },{});
  const allVenues = data.flatMap(p=> (p.publications||[]).map(pub=>pub.name).filter(n=>n && n!=='arXiv') as string[]);
  const venueCounts = allVenues.reduce<Record<string,number>>((acc,v)=>{acc[v]=(acc[v]||0)+1; return acc;},{});
  const venueStats = Object.entries(venueCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,8);
  return { totalPapers, totalAuthors: allAuthors.size, totalVenues: uniqueVenues.size, yearDistribution, venueStats };
};
