import ForceGraph2D from 'react-force-graph-2d';
import type { AuthorNode, CollaborationLink } from '../utils/graphUtils';
const ForceGraphWrapper = ForceGraph2D<AuthorNode, CollaborationLink>;
export default ForceGraphWrapper;
