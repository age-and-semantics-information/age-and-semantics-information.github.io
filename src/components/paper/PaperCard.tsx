import { Card, CardContent, Typography, Box, Stack, Link, Chip } from '@mui/material';
import { useMemo } from 'react';
import type { Paper } from '@/types/paper';
import LabelChip from './LabelChip';

interface Props {
  paper: Paper;
  selectedLabels?: string[];
  onLabelClick?: (label:string)=>void;
}

const getLatestYear = (paper: Paper)=>{
  const years = paper.publications?.map(p=>p.year).filter((y):y is number=>typeof y==='number')||[];
  return years.length ? Math.max(...years) : paper.year || 0;
};

const PaperCard: React.FC<Props> = ({ paper, selectedLabels=[], onLabelClick })=>{
  const latestPub = useMemo(()=>{
    if (!paper.publications||paper.publications.length===0) return null;
    return [...paper.publications].sort((a,b)=>(b.year||0)-(a.year||0))[0];
  },[paper.publications]);

  const authorsStr = typeof paper.authors==='string' ? paper.authors : paper.authors?.join(', ') || '';

  return (
    <Card variant="outlined" sx={{ mx:{xs:0, sm:0}, mb:1, '&:hover':{borderColor:'primary.main'} }}>
      <CardContent sx={{ py:1.2, px:1.5, '&:last-child':{pb:1.2} }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight:1.3 }}>
            {paper.title}
          </Typography>
          {authorsStr && <Typography variant="caption" color="text.secondary" sx={{ lineHeight:1.2 }}>{authorsStr}</Typography>}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} alignItems="center">
            {latestPub && (
              <>
                {latestPub.url ? (
                  <Link href={latestPub.url} target="_blank" rel="noopener" underline="hover" sx={{ fontSize:'0.75rem', fontWeight:600 }}>
                    {latestPub.name} {latestPub.year}
                  </Link>
                ) : (
                  <Chip label={`${latestPub.name} ${latestPub.year||''}`.trim()} size="small" variant="outlined" sx={{ height:20, fontSize:'0.7rem' }} />
                )}
                {paper.publications && paper.publications.length>1 && (
                  <Typography variant="caption" color="text.secondary">+{paper.publications.length-1} more</Typography>
                )}
              </>
            )}
            {!latestPub && paper.year && <Chip label={String(paper.year)} size="small" variant="outlined" sx={{ height:20 }} />}
          </Stack>
          {paper.labels && paper.labels.length>0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt:0.5 }}>
              {paper.labels.map(label=>(
                <LabelChip key={label} label={label} selected={selectedLabels.includes(label)} onClick={onLabelClick} />
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default PaperCard;
