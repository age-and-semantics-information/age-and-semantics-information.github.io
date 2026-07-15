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
  boxShadow: 'inset 3px 0 0 transparent',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  margin: 0,
  '&:hover': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.mode === 'dark' ? '#1d1f1f' : '#fffdf6', boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}` },
}));

const PaperTitle = styled(Typography)(() => ({ fontWeight: 700, lineHeight: 1.25, fontSize: '1rem' }));

interface Props { paper: Paper; selectedLabels?: string[]; onLabelClick?: ((label:string)=>void)|null; }

const PaperCardDesktop: React.FC<Props> = ({ paper, selectedLabels=[], onLabelClick=null }) => {
  const sortedLabels = useMemo(()=> sortLabels(paper.labels), [paper.labels]);
  const dedupedPubs = useMemo(()=>{
    const seen = new Set<string>();
    return (paper.publications||[]).filter((p:any)=>{
      const u = p.url || '';
      if (u && seen.has(u)) return false;
      if (u) seen.add(u);
      return true;
    });
  }, [paper.publications]);
  return (
    <StyledCard>
      <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
        <Stack spacing={0.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <PaperTitle variant="subtitle1">{paper.title}</PaperTitle>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, pt: 0.2 }}>
              {dedupedPubs.map((pub, idx:number)=>(
                <PublicationBadge key={`pub-${idx}`} publication={pub} paperTitle={paper.title}/>
              ))}
            </Stack>
          </Stack>
          {sortedLabels.length>0 && (
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {sortedLabels.map((label:string)=>(
                <LabelChip key={`label-${label}`} label={label} isSelected={selectedLabels.includes(label)} onLabelClick={onLabelClick} paperTitle={paper.title}/>
              ))}
            </Stack>
          )}
          <AuthorLine authors={paper.authors} />
        </Stack>
      </CardContent>
    </StyledCard>
  );
};
export default memo(PaperCardDesktop);
