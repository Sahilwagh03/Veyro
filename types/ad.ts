export interface AdContent {
  audience: string;
  headline: string;
  highlight: string;
  subheadline: string;
  guarantee: string;
  cta: string;
  disclaimer: string;
  bigStat: string;
  statDescription: string;
  longCopy: string;
  xPain: string;
  checkPromise: string;
  chatLead1: string;
  chatYou1: string;
  chatLead2: string;
  chatYou2: string;
  chatFooterTitle: string;
  notesTitle: string;
  notesSubtitle: string;
  notesSteps: string[];
  accentColor?: string;
  bgColor?: string;
}

export interface PresetOffer {
  id: string;
  name: string;
  icon: string;
  description: string;
  rawOffer: string;
  content: AdContent;
}

export type TemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  tag: string;
}
