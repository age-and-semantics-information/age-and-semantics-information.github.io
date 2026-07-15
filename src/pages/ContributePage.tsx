import { Container, Box } from '@mui/material';
import { useMarkdownContent } from '../hooks/useMarkdownContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const ContributePage: React.FC = ()=>{
  const { content, loading } = useMarkdownContent('/content/contribute.md');
  if (loading) return <Container sx={{ py:4 }}>Loading...</Container>;
  return (
    <Container maxWidth="md" sx={{ py:3 }}>
      <Box sx={{ '& a':{color:'primary.main'} }}><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></Box>
    </Container>
  );
};
export default ContributePage;
