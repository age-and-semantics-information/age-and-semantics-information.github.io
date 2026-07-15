import { Box, Container, Typography, CircularProgress } from '@mui/material';
import PaperList from '../components/paperlist';
import { usePapersData } from '../hooks/usePapersData';
const HomePage: React.FC = ()=>{
  const { data, loading, error } = usePapersData();
  if (loading) return <Container sx={{ py:4, textAlign:'center' }}><CircularProgress/><Typography>Loading papers...</Typography></Container>;
  if (error) return <Box sx={{ py:6, textAlign:'center' }}><Typography color="error">Failed to load papers: {(error as Error).message}</Typography></Box>;
  if (!data) return <Box sx={{ py:6, textAlign:'center' }}><Typography>No papers found.</Typography></Box>;
  return <PaperList data={data} />;
};
export default HomePage;
