import { Box, Stack, Typography, Container, Button, FormControl, Select, MenuItem, Pagination, SelectChangeEvent } from '@mui/material';
import { useMemo, useCallback, useState, useEffect } from 'react';
import type { Paper } from '@/types';
import SearchAndFilter from './SearchAndFilter';
import PaperCard from './paper/PaperCard';
import StatsDashboard from './StatsDashboard';
import { usePaperFilter } from '../hooks/usePaperFilter';

type PageSize = 10 | 50 | 100 | 500 | -1; // -1 means All

const PaperList: React.FC<{data: Paper[]}> = ({ data })=>{
  const { searchQuery, setSearchQuery, selLabels, setSelLabels, sortedData, distinctLabels, handleClearFilters, SPECIAL_LABELS } = usePaperFilter(data);
  const [pageSize, setPageSize] = useState<PageSize>(50);
  const [page, setPage] = useState(1);

  const handleLabelClick = useCallback((label:string)=>{
    setSelLabels((prev:string[])=>{
      if (prev.includes(label)) return prev;
      return [label, ...prev];
    });
  },[setSelLabels]);

  // Reset page to 1 when filters change
  useEffect(()=>{ setPage(1); }, [searchQuery, selLabels, pageSize]);

  const totalPages = useMemo(()=>{
    if (pageSize === -1) return 1;
    return Math.ceil(sortedData.length / pageSize);
  }, [sortedData.length, pageSize]);

  const paginatedData = useMemo(()=>{
    if (pageSize === -1) return sortedData;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, page, pageSize]);

  const rangeText = useMemo(()=>{
    if (sortedData.length === 0) return '0';
    if (pageSize === -1) return `${sortedData.length}`;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, sortedData.length);
    return `${start}-${end} of ${sortedData.length}`;
  }, [sortedData.length, page, pageSize]);

  const handlePageSizeChange = (e: SelectChangeEvent<number>) => {
    const v = e.target.value as PageSize;
    setPageSize(v);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{ py:{xs:1, md:1.5}, px:{xs:1, sm:2} }}>
      <Stack spacing={1.5}>
        <Box sx={{ px:{xs:0, sm:1} }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Age and Semantics of Information — Paper List</Typography>
          <Typography variant="body2" color="text.secondary">
            A curated community resource for AoI, AoII, VoI, semantics & goal-oriented communications — inspired by <a href="https://algorithms-with-predictions.github.io" target="_blank" rel="noopener">ALPS</a>. 
            Search, filter by topic, and contribute via GitHub.
          </Typography>
        </Box>
        <StatsDashboard data={data} />
        <SearchAndFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedLabels={selLabels} onLabelsChange={setSelLabels} availableLabels={distinctLabels} specialLabels={SPECIAL_LABELS}/>
        <Box sx={{ bgcolor:'background.paper', border:1, borderColor:'divider', borderRadius:1, py:0.5, px:1.5, display:'flex', flexDirection:{xs:'column', sm:'row'}, justifyContent:'space-between', alignItems:{xs:'flex-start', sm:'center'}, gap:1 }}>
          <Typography variant="caption" color="text.secondary">
            Showing <strong>{rangeText}</strong> papers {pageSize===-1 ? `of ${data.length}` : `(filtered ${sortedData.length} of ${data.length})`} {(searchQuery||selLabels.length>0)&&<>matching {searchQuery && `"${searchQuery}"`} {selLabels.join(', ')}</>}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {(searchQuery||selLabels.length>0) && <Button size="small" onClick={handleClearFilters}>Clear</Button>}
            <FormControl size="small" sx={{ minWidth: 90 }}>
              <Select value={pageSize} onChange={handlePageSizeChange} displayEmpty sx={{ fontSize: '0.8rem', height: 28 }}>
                <MenuItem value={10}>10 / page</MenuItem>
                <MenuItem value={50}>50 / page</MenuItem>
                <MenuItem value={100}>100 / page</MenuItem>
                <MenuItem value={500}>500 / page</MenuItem>
                <MenuItem value={-1}>All</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        <Stack spacing={0}>
          {paginatedData.map((paper,i)=><PaperCard key={`${paper.title}-${(page-1)*(pageSize===-1?0:pageSize)+i}`} paper={paper} selectedLabels={selLabels} onLabelClick={handleLabelClick}/>)}
          {sortedData.length===0 && <Typography variant="body2" color="text.secondary" sx={{ p:2, textAlign:'center' }}>No papers match your filters.</Typography>}
        </Stack>
        {totalPages>1 && (
          <Box sx={{ display:'flex', justifyContent:'center', py:1 }}>
            <Pagination count={totalPages} page={page} onChange={(_,v)=>setPage(v)} color="primary" size="small" showFirstButton showLastButton />
          </Box>
        )}
        <Box sx={{ display:'flex', justifyContent:'center' }}>
          <Typography variant="caption" color="text.secondary">
            Page {page} of {totalPages} • {sortedData.length} filtered papers • {data.length} total
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};
export default PaperList;
