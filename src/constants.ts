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
