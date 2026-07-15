import { TYPE_LABELS, PRIOR_LABEL } from '../constants';
export type LabelColorKey = 'typeLabels' | 'labels' | 'default';
export const getLabelColor = (label: string): LabelColorKey => {
  if ((TYPE_LABELS as readonly string[]).includes(label)) return 'typeLabels';
  if (label === PRIOR_LABEL) return 'default';
  return 'labels';
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
