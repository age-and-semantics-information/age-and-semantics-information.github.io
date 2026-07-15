export const TYPE_LABELS = [
  'survey / tutorial',
  'theory / fundamentals',
  'queueing analysis',
  'scheduling / optimization',
  'sampling / updating',
  'learning / RL',
  'energy harvesting',
  'multi-source / multi-hop',
  'edge / IoT / UAV',
  'estimation / control',
  'security / privacy',
  'game theory / pricing',
  'semantics / goal-oriented',
  'VoI / AoII / QAoI',
  'applications',
] as const;
export const PRIOR_LABEL = 'prior / related work' as const;
export const SPECIAL_LABELS = [...TYPE_LABELS, PRIOR_LABEL] as const;
export type TypeLabel = typeof TYPE_LABELS[number];

export const GRAPH_CONFIG = {
  CHARGE_STRENGTH: -75,
  LINK_DISTANCE_BASE: 5,
  LINK_DISTANCE_FACTOR: 2,
  COLLISION_RADIUS_MULTIPLIER: 5,
  COLLISION_STRENGTH: 0.8,
  WARMUP_TICKS: 500,
  ALPHA_DECAY: 0.01,
  VELOCITY_DECAY: 0.4,
  BOUNDARY_STRENGTH: 0.7,
  EDGE_MIN_WIDTH: 1,
  EDGE_MAX_WIDTH: 8,
} as const;
