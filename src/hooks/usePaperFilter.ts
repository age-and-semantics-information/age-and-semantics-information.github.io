import { useState, useMemo } from 'react';
import { SPECIAL_LABELS } from '../constants';
import type { Paper, Publication } from '@/types';

function stringCmp(a:string,b:string){ return a.toLowerCase().localeCompare(b.toLowerCase()); }
const EMPTY_PUB: Publication = { name:'', year:0 };
const comparePubDate = (a:Publication,b:Publication)=>{
  const yd=(a.year||0)-(b.year||0); if (yd!==0) return yd;
  const md=(a.month||0)-(b.month||0); if (md!==0) return md;
  return (a.day||0)-(b.day||0);
};
const getLatestPublication = (paper:Paper): Publication=>{
  if (!paper.publications||paper.publications.length===0) return EMPTY_PUB;
  let latest: Publication|undefined;
  let latestNonArxiv: Publication|undefined;
  for (const pub of paper.publications){
    if (!latest || comparePubDate(pub,latest)>0) latest=pub;
    if (pub.name.toLowerCase()!=='arxiv' && (!latestNonArxiv || comparePubDate(pub,latestNonArxiv)>0)) latestNonArxiv=pub;
  }
  return latestNonArxiv??latest??EMPTY_PUB;
};
const comparePapers = (a:Paper,b:Paper):number=>{
  const pubA=getLatestPublication(a), pubB=getLatestPublication(b);
  const yd=(pubB.year||0)-(pubA.year||0); if (yd!==0) return yd;
  const hasA=(pubA.month||0)>0||(pubA.day||0)>0, hasB=(pubB.month||0)>0||(pubB.day||0)>0;
  if (hasA&&!hasB) return -1; if (!hasA&&hasB) return 1;
  if (hasA&&hasB){
    const md=(pubB.month||0)-(pubA.month||0); if (md!==0) return md;
    const dd=(pubB.day||0)-(pubA.day||0); if (dd!==0) return dd;
  }
  return stringCmp(a.title||'', b.title||'');
};

export const usePaperFilter = (data: Paper[]|null)=>{
  const [searchQuery,setSearchQuery]=useState('');
  const [selLabels,setSelLabels]=useState<string[]>([]);

  const distinctLabels = useMemo(()=>{
    if (!data) return [];
    const all = data.flatMap(p=>p.labels||[]);
    const distinct=[...new Set(all)]; distinct.sort(stringCmp);
    return distinct.filter(el=>!(SPECIAL_LABELS as readonly string[]).includes(el));
  },[data]);

  const sortedData = useMemo(()=>{
    if (!data) return [];
    let filtered=data;
    if (searchQuery){
      const q=searchQuery.toLowerCase();
      filtered=filtered.filter(p=>
        p.title?.toLowerCase().includes(q) ||
        (typeof p.authors==='string'?p.authors.toLowerCase().includes(q):p.authors?.some(a=>a.toLowerCase().includes(q))) ||
        p.labels?.some(l=>l.toLowerCase().includes(q)) ||
        p.publications?.some(pub=> pub.name?.toLowerCase().includes(q) || pub.year?.toString().includes(q))
      );
    }
    if (selLabels.length>0){
      filtered=filtered.filter(p=> selLabels.every(l=>p.labels?.includes(l)));
    }
    return [...filtered].sort(comparePapers);
  },[data,searchQuery,selLabels]);

  const handleClearFilters=()=>{ setSearchQuery(''); setSelLabels([]); };

  return { searchQuery, setSearchQuery, selLabels, setSelLabels, sortedData, distinctLabels, handleClearFilters, SPECIAL_LABELS };
};
