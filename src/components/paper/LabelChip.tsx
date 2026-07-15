import { Chip } from '@mui/material';
import { getLabelColor } from '../../utils/labelUtils';
interface Props { label: string; isSelected?: boolean; onLabelClick?: ((label: string)=>void)|null; paperTitle?: string; }
const LabelChip: React.FC<Props> = ({ label, isSelected=false, onLabelClick=null, paperTitle='' }) => {
  const labelColor = getLabelColor(label);
  const handleClick = () => { if (onLabelClick) onLabelClick(label); };
  return (
    <Chip
      label={label}
      size="small"
      variant={isSelected ? 'filled' : 'outlined'}
      color={labelColor as any}
      clickable
      onClick={handleClick}
      sx={(theme:any)=>{
        const palette = labelColor==='typeLabels' ? theme.palette.typeLabels : labelColor==='labels' ? theme.palette.labels : null;
        const base = palette ? { bgcolor: isSelected ? palette.main : palette.light, color: isSelected ? palette.contrastText : palette.dark, borderColor: isSelected ? palette.main : palette.light } : { bgcolor: isSelected ? 'text.secondary' : 'action.hover', color: isSelected ? 'background.paper' : 'text.secondary', borderColor: 'divider' };
        return { ...base, borderRadius: 1, fontSize: '0.72rem', height: 22, px: 0.25, borderWidth: 1, cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { borderColor: labelColor==='typeLabels' ? 'typeLabels.main' : labelColor==='labels' ? 'labels.main' : 'text.secondary' }, ...(isSelected && { fontWeight: 700 }) };
      }}
    />
  );
};
export default LabelChip;
