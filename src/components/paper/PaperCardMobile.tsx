import { memo, useMemo } from 'react';
import { Card, CardContent, Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import LabelChip from './LabelChip';
import PublicationBadge from './PublicationBadge';
import AuthorLine from './AuthorLine';
import { sortLabels } from '../../utils/labelUtils';
import type { Paper } from '@/types/paper';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': { borderColor: theme.palette.primary.main },
}));

interface Props { paper: Paper; selectedLabels?: string[]; onLabelClick?: ((label:string)=>void)|null; }

const PaperCardMobile: React.FC<Props> = ({ paper, selectedLabels=[], onLabelClick=null }) => {
  const sortedLabels = useMemo(()=> sortLabels(paper.labels), [paper.labels]);
  return (
    <StyledCard>
      <CardContent sx={{ py: 1, px: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.25, mb: 0.5 }}>{paper.title}</Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 0.5 }}>
          {paper.publications?.map((pub, idx:number)=>(
            <PublicationBadge key={`pub-${idx}`} publication={pub} paperTitle={paper.title}/>
          ))}
        </Stack>
        <AuthorLine authors={paper.authors} sx={{ mb: 0.5 }} />
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          {sortedLabels.map((label:string)=>(
            <LabelChip key={label} label={label} isSelected={selectedLabels.includes(label)} onLabelClick={onLabelClick}/>
          ))}
        </Stack>
      </CardContent>
    </StyledCard>
  );
};
export default memo(PaperCardMobile);
