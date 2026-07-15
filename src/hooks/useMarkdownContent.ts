import { useEffect, useState } from 'react';
export const useMarkdownContent = (path: string)=>{
  const [content,setContent]=useState(''); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  useEffect(()=>{
    const base = import.meta.env.BASE_URL || '/';
    const url = base.endsWith('/') ? base + path.replace(/^\//,'') : base + '/' + path.replace(/^\//,'');
    fetch(url).then(r=>{ if(!r.ok) throw new Error('Failed'); return r.text(); }).then(t=>{ setContent(t); setLoading(false); }).catch(e=>{ setError(e); setLoading(false); });
  },[path]);
  return { content, loading, error };
};
