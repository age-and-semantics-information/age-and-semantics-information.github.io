import { Chip } from '@mui/material';
import { getLabelStyle } from '../../utils/labelUtils';
interface Props { label: string; isSelected?: boolean; onLabelClick?: ((label: string)=>void)|null; paperTitle?: string; }
const LabelChip: React.FC<Props> = ({ label, isSelected=false, onLabelClick=null }) => {
  const style = getLabelStyle(label, isSelected);
  const handleClick = () => { if (onLabelClick) onLabelClick(label); };
  return (
    <Chip
      label={label}
      size="small"
      variant={isSelected ? 'filled' : 'outlined'}
      clickable
      onClick={handleClick}
      sx={{
        ...style,
        borderRadius: 1,
        fontSize: '0.72rem',
        height: 22,
        px: 0.25,
        borderWidth: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: style.borderColor, filter: 'brightness(0.95)' },
        ...(isSelected && { fontWeight: 700 }),
      }}
    />
  );
};
export default LabelChip;
