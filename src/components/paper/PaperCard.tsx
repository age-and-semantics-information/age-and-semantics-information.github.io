import { useEffect, useRef, memo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import PaperCardDesktop from './PaperCardDesktop';
import PaperCardMobile from './PaperCardMobile';
import type { Paper } from '@/types/paper';

export interface PaperCardProps { paper: Paper; selectedLabels?: string[]; onLabelClick?: ((label:string)=>void)|null; layout?: 'desktop'|'mobile'; }

const PaperCardWrapper: React.FC<PaperCardProps & { isMobile: boolean }> = ({ paper, selectedLabels=[], onLabelClick=null, isMobile }) => {
  const CardComp = isMobile ? PaperCardMobile : PaperCardDesktop;
  return <CardComp paper={paper} selectedLabels={selectedLabels} onLabelClick={onLabelClick}/>;
};

const ResponsivePaperCard: React.FC<PaperCardProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return <PaperCardWrapper {...props} isMobile={isMobile}/>;
};

const PaperCard: React.FC<PaperCardProps> = (props) => {
  if (props.layout) return <PaperCardWrapper {...props} isMobile={props.layout==='mobile'}/>;
  return <ResponsivePaperCard {...props}/>;
};

export default memo(PaperCard);
