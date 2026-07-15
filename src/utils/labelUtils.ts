import { TYPE_LABELS, PRIOR_LABEL } from '../constants';

export type LabelColorKey = 'typeLabels' | 'labels' | 'default';

// Distinct colors per category for better visual differentiation
const CATEGORY_COLORS: Record<string, { light: string; main: string; dark: string; contrastText: string }> = {
  'survey / tutorial': { light: '#e3f2fd', main: '#1976d2', dark: '#0d47a1', contrastText: '#fff' },
  'theory / fundamentals': { light: '#f3e5f5', main: '#7b1fa2', dark: '#4a148c', contrastText: '#fff' },
  'queueing analysis': { light: '#e8f5e9', main: '#388e3c', dark: '#1b5e20', contrastText: '#fff' },
  'scheduling / optimization': { light: '#fff3e0', main: '#f57c00', dark: '#e65100', contrastText: '#fff' },
  'sampling / updating': { light: '#fce4ec', main: '#c2185b', dark: '#880e4f', contrastText: '#fff' },
  'learning / RL': { light: '#e0f7fa', main: '#0097a7', dark: '#006064', contrastText: '#fff' },
  'energy harvesting': { light: '#f1f8e9', main: '#689f38', dark: '#33691e', contrastText: '#fff' },
  'multi-source / multi-hop': { light: '#ede7f6', main: '#512da8', dark: '#311b92', contrastText: '#fff' },
  'edge / IoT / UAV': { light: '#e0f2f1', main: '#00796b', dark: '#004d40', contrastText: '#fff' },
  'estimation / control': { light: '#fff8e1', main: '#ffa000', dark: '#ff6f00', contrastText: '#fff' },
  'security / privacy': { light: '#ffebee', main: '#d32f2f', dark: '#b71c1c', contrastText: '#fff' },
  'game theory / pricing': { light: '#efebe9', main: '#5d4037', dark: '#3e2723', contrastText: '#fff' },
  'semantics / goal-oriented': { light: '#e8eaf6', main: '#303f9f', dark: '#1a237e', contrastText: '#fff' },
  'VoI / AoII / QAoI': { light: '#fbe9e7', main: '#e64a19', dark: '#bf360c', contrastText: '#fff' },
  'applications': { light: '#e0f2f1', main: '#00695c', dark: '#004d40', contrastText: '#fff' },
  'prior / related work': { light: '#f5f5f5', main: '#9e9e9e', dark: '#616161', contrastText: '#fff' },
};

export const getLabelColor = (label: string): LabelColorKey => {
  if ((TYPE_LABELS as readonly string[]).includes(label)) return 'typeLabels';
  if (label === PRIOR_LABEL) return 'default';
  return 'labels';
};

export const getLabelStyle = (label: string, isSelected: boolean) => {
  const colors = CATEGORY_COLORS[label] || CATEGORY_COLORS['theory / fundamentals'];
  if (isSelected) {
    return { bgcolor: colors.main, color: colors.contrastText, borderColor: colors.main };
  }
  return { bgcolor: colors.light, color: colors.dark, borderColor: colors.light };
};

export const sortLabels = (labels: string[] | undefined): string[] => {
  if (!labels) return [];
  return [...labels].sort((a,b)=>{
    const aIsType = (TYPE_LABELS as readonly string[]).includes(a);
    const bIsType = (TYPE_LABELS as readonly string[]).includes(b);
    const aIsPrior = a===PRIOR_LABEL;
    const bIsPrior = b===PRIOR_LABEL;
    if (aIsType && !bIsType) return -1;
    if (!aIsType && bIsType) return 1;
    if (aIsPrior && !bIsPrior) return 1;
    if (!aIsPrior && bIsPrior) return -1;
    return 0;
  });
};
