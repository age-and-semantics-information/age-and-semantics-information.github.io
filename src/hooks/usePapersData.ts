import { useQuery } from '@tanstack/react-query';
import type { Paper } from '@/types';
const fetchPapersData = async (): Promise<Paper[]> => {
  const base = import.meta.env.BASE_URL || '/';
  const url = base.endsWith('/') ? base + 'papers.json' : base + '/papers.json';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load papers: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Invalid data format');
  return data as Paper[];
};
export const usePapersData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['papers'],
    queryFn: fetchPapersData,
    staleTime: 10*60*1000,
    gcTime: 30*60*1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { data: data??null, loading: isLoading, error: error??null };
};
