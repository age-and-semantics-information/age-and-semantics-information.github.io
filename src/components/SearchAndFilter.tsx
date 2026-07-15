import { useState, useEffect, ChangeEvent } from 'react';
import { TextField, InputAdornment, IconButton, Box, Stack, Collapse } from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';
import FilterGroup from './FilterGroup';

interface Props {
  searchQuery: string;
  onSearchChange: (q:string)=>void;
  selectedLabels: string[];
  onLabelsChange: (labels: string[]|((prev:string[])=>string[]))=>void;
  availableLabels: string[];
  specialLabels: readonly string[];
}

const SearchAndFilter: React.FC<Props> = ({ searchQuery, onSearchChange, selectedLabels, onLabelsChange, availableLabels, specialLabels })=>{
  const [localSearch, setLocalSearch]=useState(searchQuery);
  const [open,setOpen]=useState(false);
  useEffect(()=>setLocalSearch(searchQuery),[searchQuery]);
  useEffect(()=>{
    const id=setTimeout(()=>onSearchChange(localSearch),300);
    return ()=>clearTimeout(id);
  },[localSearch]);

  const handleToggle = (label:string)=>{
    onLabelsChange((prev:string[])=>{
      if (prev.includes(label)) return prev.filter(l=>l!==label);
      return [label, ...prev];
    });
  };

  return (
    <Box sx={{ px:{xs:1, md:0} }}>
      <Stack spacing={1.5}>
        <TextField fullWidth size="small" variant="outlined" placeholder="Search papers by title, authors, keywords, venue..."
          value={localSearch} onChange={(e:ChangeEvent<HTMLInputElement>)=>setLocalSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search color="action" fontSize="small"/></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                {localSearch && <IconButton size="small" onClick={()=>{setLocalSearch(''); onSearchChange('');}}><Clear fontSize="small"/></IconButton>}
                {(availableLabels.length>0 || specialLabels.length>0) && (
                  <IconButton size="small" onClick={()=>setOpen(!open)} color={open?'primary':'default'}><FilterList fontSize="small"/></IconButton>
                )}
              </InputAdornment>
            )
          }}
          sx={{ '& .MuiOutlinedInput-root':{ bgcolor:'background.paper', borderRadius:1 } }}
        />
        <Collapse in={open}>
          <Box sx={{ bgcolor:'background.paper', border:1, borderColor:'divider', borderRadius:1, p:1.5 }}>
            <Stack spacing={1.5}>
              <FilterGroup title="Primary Categories" labels={[...specialLabels]} selected={selectedLabels} onToggle={handleToggle} color="primary"/>
              <FilterGroup title="Additional Tags" labels={availableLabels} selected={selectedLabels} onToggle={handleToggle} color="secondary"/>
            </Stack>
          </Box>
        </Collapse>
      </Stack>
    </Box>
  );
};
export default SearchAndFilter;
