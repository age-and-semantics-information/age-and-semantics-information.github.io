import { Grid, Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { useMemo } from 'react';
import { calculateStats } from '../utils/statsUtils';
import type { Paper } from '@/types/paper';

const StatsDashboard: React.FC<{data: Paper[]}> = ({ data })=>{
  const stats = useMemo(()=>calculateStats(data),[data]);
  return (
    <Box sx={{ px:{xs:1, sm:2, md:3}, mb:1 }}>
      <Grid container spacing={1.5}>
        <Grid size={{xs:12, sm:4}}>
          <Card variant="outlined" sx={{ height:'100%' }}>
            <CardContent sx={{ py:1.5 }}>
              <Typography variant="h5" fontWeight={700}>{stats.totalPapers}</Typography>
              <Typography variant="caption" color="text.secondary">Papers indexed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:6, sm:4}}>
          <Card variant="outlined" sx={{ height:'100%' }}>
            <CardContent sx={{ py:1.5 }}>
              <Typography variant="h5" fontWeight={700}>{stats.totalAuthors}</Typography>
              <Typography variant="caption" color="text.secondary">Unique authors</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:6, sm:4}}>
          <Card variant="outlined" sx={{ height:'100%' }}>
            <CardContent sx={{ py:1.5 }}>
              <Typography variant="h5" fontWeight={700}>{stats.totalVenues}</Typography>
              <Typography variant="caption" color="text.secondary">Venues (excl. arXiv)</Typography>
            </CardContent>
          </Card>
        </Grid>
        {stats.venueStats.length>0 && (
          <Grid size={{xs:12}}>
            <Card variant="outlined">
              <CardContent sx={{ py:1, px:1.5 }}>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" gap={0.5}>
                  <Typography variant="caption" fontWeight={700} sx={{ mr:0.5 }}>Top venues:</Typography>
                  {stats.venueStats.map(v=> <Chip key={v.name} label={`${v.name} (${v.count})`} size="small" variant="outlined" />)}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default StatsDashboard;
