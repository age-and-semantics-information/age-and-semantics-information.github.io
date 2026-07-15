export interface Publication {
  name: string;
  year?: number;
  month?: number;
  day?: number;
  url?: string;
  bibtex?: string;
  dblp_key?: string;
}
export interface Paper {
  title?: string;
  authors?: string | string[];
  labels?: string[];
  publications?: Publication[];
  abstract?: string;
  year?: number;
}
