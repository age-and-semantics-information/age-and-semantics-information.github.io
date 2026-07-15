import { Container, Typography, Box } from '@mui/material';
import { useMarkdownContent } from '../hooks/useMarkdownContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const MaterialPage: React.FC = ()=>{
  const { content, loading } = useMarkdownContent('/content/material.md');
  if (loading) return <Container sx={{ py:4 }}><Typography>Loading...</Typography></Container>;
  return (
    <Container maxWidth="md" sx={{ py:3 }}>
      <Box sx={{ '& a':{color:'primary.main'}, '& h2':{mt:3, mb:1}, '& ul':{pl:2} }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </Box>
    </Container>
  );
};
export default MaterialPage;
