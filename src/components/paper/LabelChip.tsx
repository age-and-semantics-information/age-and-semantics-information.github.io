import { Chip } from '@mui/material';
interface Props { label: string; selected?: boolean; onClick?: (label:string)=>void; size?: 'small'|'medium'; }
const LabelChip: React.FC<Props> = ({ label, selected, onClick, size='small' })=>{
  const isPrimary = ['survey / tutorial','theory / fundamentals','queueing analysis','scheduling / optimization'].includes(label);
  return (
    <Chip label={label} size={size} color={selected ? (isPrimary?'primary':'secondary') : 'default'} variant={selected ? 'filled' : 'outlined'}
      onClick={onClick ? ()=>onClick(label) : undefined} sx={{ fontSize:'0.7rem', cursor: onClick?'pointer':'default' }} />
  );
};
export default LabelChip;
