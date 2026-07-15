import { Chip, Tooltip } from '@mui/material';
import { openInNewTab } from '../../utils/paperUtils';
import type { Publication } from '@/types/paper';
interface Props { publication: Publication; paperTitle?: string; }
const PublicationBadge: React.FC<Props> = ({ publication, paperTitle='' }) => {
  const { name, year, url } = publication;
  const isArxiv = name?.toLowerCase().includes('arxiv');
  const displayLabel = `${name}${year ? " '" + String(year).slice(-2) : ''}`;
  const tooltipTitle = `${name}${year ? ' ' + year : ''}${url ? ' - Click to view' : ''}`;
  const handleClick = () => { if (url) openInNewTab(url); };
  return (
    <Tooltip title={tooltipTitle}>
      <Chip
        label={displayLabel}
        size="small"
        variant={isArxiv ? 'outlined' : 'filled'}
        color={isArxiv ? 'default' : 'primary'}
        onClick={handleClick}
        sx={{
          cursor: url ? 'pointer' : 'default',
          borderRadius: 1,
          borderWidth: 1,
          bgcolor: isArxiv ? 'action.hover' : 'primary.light',
          borderColor: isArxiv ? 'divider' : 'primary.light',
          color: isArxiv ? 'text.primary' : 'primary.dark',
          '&:hover': url ? { bgcolor: isArxiv ? 'background.paper' : 'background.paper', borderColor: isArxiv ? 'text.secondary' : 'primary.main' } : {},
          height: 22,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      />
    </Tooltip>
  );
};
export default PublicationBadge;
