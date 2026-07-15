import {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from 'react';
import {
  Box,
  Typography,
  Skeleton,
  useTheme,
  CircularProgress,
  Container,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import type { ForceGraphMethods } from 'react-force-graph-2d';
import { usePapersData } from '../hooks/usePapersData';
import { buildAuthorGraph } from '../utils/graphUtils';
import { useThemeMode } from '../contexts/ThemeContext';
import { GRAPH_CONFIG } from '../constants';
import type { AuthorNode, CollaborationLink } from '../utils/graphUtils';
import type { ForceLink, ForceManyBody } from 'd3-force';
import * as d3Force from 'd3-force';

const ForceGraph2D = lazy(() => import('../components/ForceGraphWrapper'));

const AuthorGraphPage: React.FC = () => {
  const { data, loading, error } = usePapersData();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const [selectedNode, setSelectedNode] = useState<AuthorNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<AuthorNode | null>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - 100 : 600,
  });
  const fgRef = useRef<ForceGraphMethods<AuthorNode, CollaborationLink> | undefined>(undefined);

  const graphData = useMemo(() => {
    if (!data || data.length === 0) return null;
    return buildAuthorGraph(data);
  }, [data]);

  const forcesConfiguredRef = useRef(false);
  const initialZoomDoneRef = useRef(false);

  const configureForces = useCallback(() => {
    const fg = fgRef.current;
    if (!fg || forcesConfiguredRef.current) return;
    forcesConfiguredRef.current = true;
    const chargeForce = fg.d3Force('charge') as ForceManyBody<AuthorNode> | undefined;
    chargeForce?.strength(GRAPH_CONFIG.CHARGE_STRENGTH);
    const linkForce = fg.d3Force('link') as ForceLink<AuthorNode, CollaborationLink> | undefined;
    linkForce?.distance((link: CollaborationLink) => GRAPH_CONFIG.LINK_DISTANCE_BASE + (link.value || 1) * GRAPH_CONFIG.LINK_DISTANCE_FACTOR);
    const getNodeRadius = (node: AuthorNode) => Math.sqrt(Math.sqrt(node.paperCount)) * 3 * GRAPH_CONFIG.COLLISION_RADIUS_MULTIPLIER + 5;
    fg.d3Force('collision', d3Force.forceCollide<AuthorNode>().radius(getNodeRadius).strength(GRAPH_CONFIG.COLLISION_STRENGTH).iterations(3));
    fg.d3ReheatSimulation();
  }, []);

  const enforceBoundaries = useCallback(() => {
    if (!graphData) return;
    const maxDistance = 2000;
    const strength = GRAPH_CONFIG.BOUNDARY_STRENGTH;
    for (const node of graphData.nodes) {
      if (node.x !== undefined && node.y !== undefined) {
        const dist = Math.sqrt(node.x * node.x + node.y * node.y);
        if (dist > maxDistance) {
          const factor = ((dist - maxDistance) / dist) * strength * 0.1;
          node.vx = (node.vx || 0) - node.x * factor;
          node.vy = (node.vy || 0) - node.y * factor;
          if (dist > 3000) {
            const scale = 3000 / dist;
            node.x *= scale;
            node.y *= scale;
          }
        }
      }
    }
  }, [graphData]);

  const handleEngineTick = useCallback(() => {
    configureForces();
    enforceBoundaries();
  }, [configureForces, enforceBoundaries]);

  useEffect(() => {
    forcesConfiguredRef.current = false;
    initialZoomDoneRef.current = false;
    if (fgRef.current) configureForces();
  }, [configureForces]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight - 100 });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getEdgeWidth = useCallback((link: CollaborationLink): number => {
    if (!graphData || graphData.maxCollaboration === 0) return 1;
    const minWidth = GRAPH_CONFIG.EDGE_MIN_WIDTH;
    const maxWidth = GRAPH_CONFIG.EDGE_MAX_WIDTH;
    return (link.value / graphData.maxCollaboration) * (maxWidth - minWidth) + minWidth;
  }, [graphData]);

  if (loading) return <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}><Skeleton variant="circular" width={60} height={60} /><Skeleton variant="text" width={200} height={24} /></Box>;
  if (error) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><Typography color="error">Failed to load papers.</Typography></Box>;
  if (!graphData || graphData.nodes.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><Typography color="text.secondary">No author data.</Typography></Box>;

  const nodeColor = isDark ? theme.palette.primary.light : theme.palette.primary.main;
  const selectedNodeColor = isDark ? theme.palette.secondary.light : theme.palette.secondary.main;
  const edgeColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)';
  const highlightEdgeColor = isDark ? theme.palette.secondary.light : theme.palette.secondary.main;
  const backgroundColor = theme.palette.background.default;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>Author Collaboration Graph</Typography>
          <Typography variant="body2" color="text.secondary">
            {graphData.nodes.length} authors, {graphData.links.length} collaborations from {data?.length} papers. Click a node to highlight its collaborations. Node size ∝ paper count.
          </Typography>
          {selectedNode && (
            <Paper variant="outlined" sx={{ p: 1, display: 'inline-flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}>
              <Chip label={selectedNode.name} color="primary" size="small" />
              <Typography variant="caption">{selectedNode.paperCount} papers</Typography>
              <Chip label="Clear" size="small" variant="outlined" onClick={() => setSelectedNode(null)} />
            </Paper>
          )}
        </Stack>
      </Container>
      <Box sx={{ width: '100%', height: 'calc(100vh - 180px)', position: 'relative', borderTop: 1, borderColor: 'divider' }}>
        <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>}>
          <ForceGraph2D
            ref={fgRef as any}
            graphData={graphData}
            nodeLabel={(node: AuthorNode) => `${node.name} (${node.paperCount})`}
            nodeRelSize={8}
            nodeColor={(node: AuthorNode) => {
              if (selectedNode && node.id === selectedNode.id) return selectedNodeColor;
              if (hoveredNode && node.id === hoveredNode.id) return selectedNodeColor;
              if (selectedNode) {
                const isConnected = graphData.links.some(link => {
                  const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
                  const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
                  return (sourceId === selectedNode.id && targetId === node.id) || (targetId === selectedNode.id && sourceId === node.id);
                });
                if (isConnected) return isDark ? theme.palette.secondary.light : theme.palette.secondary.main;
              }
              return nodeColor;
            }}
            nodeVal={(node: AuthorNode) => Math.sqrt(Math.sqrt(node.paperCount)) * 3}
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, ctx, globalScale) => {
              if (!selectedNode || node.id !== selectedNode.id) return;
              const label = (node as AuthorNode).name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = theme.palette.text.primary;
              const yOffset = (10 + fontSize) / globalScale;
              ctx.fillText(label, (node as any).x!, (node as any).y! + yOffset);
            }}
            linkColor={(link: any) => {
              if (selectedNode) {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return sourceId === selectedNode.id || targetId === selectedNode.id ? highlightEdgeColor : edgeColor;
              }
              return edgeColor;
            }}
            linkWidth={getEdgeWidth as any}
            onNodeHover={(node: any) => setHoveredNode(node || null)}
            onNodeClick={(node: any) => setSelectedNode(node)}
            onBackgroundClick={() => setSelectedNode(null)}
            backgroundColor={backgroundColor}
            cooldownTicks={GRAPH_CONFIG.WARMUP_TICKS}
            d3AlphaDecay={GRAPH_CONFIG.ALPHA_DECAY}
            d3VelocityDecay={GRAPH_CONFIG.VELOCITY_DECAY}
            onEngineTick={handleEngineTick}
            onEngineStop={() => {
              if (!initialZoomDoneRef.current && fgRef.current) {
                initialZoomDoneRef.current = true;
                (fgRef.current as any).zoomToFit?.(400);
              }
            }}
            width={dimensions.width}
            height={dimensions.height}
          />
        </Suspense>
      </Box>
    </Box>
  );
};
export default AuthorGraphPage;
