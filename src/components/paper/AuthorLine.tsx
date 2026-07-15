import { Typography, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { formatAuthors, getFullAuthorList } from '../../utils/paperUtils';
interface Props { authors?: string | string[]; sx?: SxProps<Theme>; }
const AuthorLine: React.FC<Props> = ({ authors, sx={} }) => {
  const formatted = formatAuthors(authors);
  const full = getFullAuthorList(authors);
  const showTooltip = formatted !== full;
  const text = <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.2, ...sx }}>{formatted}</Typography>;
  if (showTooltip) return <Tooltip title={full} placement="top" arrow>{text}</Tooltip>;
  return text;
};
export default AuthorLine;
