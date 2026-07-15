import { Box, Chip, Typography, Stack } from '@mui/material';
interface Props {
  title: string;
  labels: string[];
  selected: string[];
  onToggle: (label: string)=>void;
  color?: 'primary'|'secondary'|'default';
}
const FilterGroup: React.FC<Props> = ({ title, labels, selected, onToggle, color='primary' })=>{
  if (labels.length===0) return null;
  return (
    <Box>
      <Typography variant="caption" sx={{ fontWeight:700, textTransform:'uppercase', color:'text.secondary', mb:0.5, display:'block' }}>{title}</Typography>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
        {labels.map(label=>{
          const isSelected = selected.includes(label);
          return (
            <Chip key={label} label={label} size="small"
              color={isSelected ? color : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              onClick={()=>onToggle(label)}
              sx={{ fontSize:'0.75rem', cursor:'pointer' }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
export default FilterGroup;
