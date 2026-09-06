export interface OfferIntelligence {
  product?: string;
  coreProduct?: string;
  category?: string;
  targetAudience?: string | string[];
  primaryAudience?: string;
  problem?: string | string[];
  painPoints?: string | string[];
  primaryPainPoint?: string;
  desiredOutcomes?: string | string[];
  primaryOutcome?: string;
  benefits?: string | string[];
  features?: string | string[];
  mechanism?: string;
  uniqueMechanic?: string;
  differentiators?: string | string[];
  proof?: string | string[];
  objections?: string | string[];
  offer?: {
    price?: string;
    originalPrice?: string;
    discount?: string;
    duration?: string;
    guarantee?: string;
    deliverables?: string[];
  };
  pricePoint?: string;
  urgency?: string;
  cta?: string | string[];
  claims?: string | string[];
  verifiedClaims?: string[];
  forbiddenClaims?: string | string[];
}

export interface CreativeStrategy {
  angle: string;
  psychologicalTrigger: string;
  hook: string;
  promise: string;
  visualConcept: string;
  copyStructure: string;
  proofElement?: string;
  offerTreatment: string;
  cta: string;
  readyToRunScore?: number;
}

export interface BatchQuality {
  creativeDiversityScore: number; // Target >= 85
  averageReadyToRunScore?: number; // Target >= 85
  readyToRunScore?: number;
  headlineDiversityScore?: number; // Target >= 85
  visualDiversityScore?: number;   // Target >= 85
  offerAccuracyScore?: number;     // Target 100
  readyToRunScores?: number[];     // Score per creative (1-10)
  antiHallucinationPassed?: boolean;
  reasoning?: string;
}

export interface CreativeItem {
  id: TemplateId;
  angle: string;
  psychologicalTrigger?: string;
  hook?: string;
  headline: string;
  highlight: string;
  subheadline: string;
  audience: string;
  cta: string;
  guarantee?: string;
  disclaimer?: string;
  visualConcept?: string;
  copyStructure?: string;
  readyToRunScore?: number;

  // Specific layout fields
  xPain?: string;
  checkPromise?: string;
  chatLead1?: string;
  chatYou1?: string;
  chatLead2?: string;
  chatYou2?: string;
  chatFooterTitle?: string;
  notesTitle?: string;
  notesSubtitle?: string;
  notesSteps?: string[];
  bigStat?: string;
  statDescription?: string;
  longCopy?: string;
  accentColor?: string;
}

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

  // Batch items & quality metrics
  items?: CreativeItem[];
  batchQuality?: BatchQuality;
  offerIntelligence?: OfferIntelligence;
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
  angle: string;
}
