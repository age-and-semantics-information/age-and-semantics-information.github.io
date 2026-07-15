import { Box, Stack, Typography, Container, Button } from '@mui/material';
import { useMemo, useCallback } from 'react';
import type { Paper } from '@/types';
import SearchAndFilter from './SearchAndFilter';
import PaperCard from './paper/PaperCard';
import StatsDashboard from './StatsDashboard';
import { usePaperFilter } from '../hooks/usePaperFilter';

const PaperList: React.FC<{data: Paper[]}> = ({ data })=>{
  const { searchQuery, setSearchQuery, selLabels, setSelLabels, sortedData, distinctLabels, handleClearFilters, SPECIAL_LABELS } = usePaperFilter(data);
  const handleLabelClick = useCallback((label:string)=>{
    setSelLabels((prev:string[])=>{
      if (prev.includes(label)) return prev;
      return [label, ...prev];
    });
  },[setSelLabels]);

  return (
    <Container maxWidth="lg" disableGutters sx={{ py:{xs:1, md:1.5}, px:{xs:1, sm:2} }}>
      <Stack spacing={1.5}>
        <Box sx={{ px:{xs:0, sm:1} }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Age and Semantics of Information — Paper List</Typography>
          <Typography variant="body2" color="text.secondary">
            A curated community resource for AoI, AoII, VoI, semantics & goal-oriented communications — inspired by — inspired by <a href="https://algorithms-with-predictions.github.io" target="_blank" rel="noopener">ALPS</a>. 
            Search, filter by topic, and contribute via GitHub.
          </Typography>
        </Box>
        <StatsDashboard data={data} />
        <SearchAndFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedLabels={selLabels} onLabelsChange={setSelLabels} availableLabels={distinctLabels} specialLabels={SPECIAL_LABELS}/>
        <Box sx={{ bgcolor:'background.paper', border:1, borderColor:'divider', borderRadius:1, py:0.5, px:1.5, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Typography variant="caption" color="text.secondary">Showing <strong>{sortedData.length} of {data.length}</strong> papers {(searchQuery||selLabels.length>0)&&<>matching {searchQuery && `"{searchQuery}"`} {selLabels.join(', ')}</>}</Typography>
          {(searchQuery||selLabels.length>0) && <Button size="small" onClick={handleClearFilters}>Clear</Button>}
        </Box>
        <Stack spacing={0}>
          {sortedData.map((paper,i)=><PaperCard key={`${paper.title}-${i}`} paper={paper} selectedLabels={selLabels} onLabelClick={handleLabelClick}/>)}
          {sortedData.length===0 && <Typography variant="body2" color="text.secondary" sx={{ p:2, textAlign:'center' }}>No papers match your filters.</Typography>}
        </Stack>
      </Stack>
    </Container>
  );
};
export default PaperList;
