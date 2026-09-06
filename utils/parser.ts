import { AdContent, CreativeItem, OfferIntelligence, PresetOffer, TemplateId } from '../types/ad';

export const PRESETS: PresetOffer[] = [
  {
    id: 'coaching',
    name: 'Coaching & Agency',
    icon: 'Users',
    description: 'Lead gen & setter placement offer for high-ticket service providers',
    rawOffer: "We help coaches and agency owners get 40 sales calls a month without chasing leads. We place a trained setter in your business in 7 days. 30 calls in 30 days or you don't pay.",
    content: {
      audience: 'FOR COACHES & AGENCY OWNERS',
      headline: 'Get 40 sales calls a month without chasing leads',
      highlight: '40 sales calls a month',
      subheadline: 'We place a trained setter in your business in 7 days.',
      guarantee: "30 calls in 30 days or you don't pay.",
      cta: 'Book Your 1:1 Call',
      disclaimer: 'Results vary. Guarantee terms apply.',
      bigStat: '40',
      statDescription: 'booked calls for coaches in the next 30 days',
      longCopy: 'You do not have a lead problem. You have a follow-up problem. We install the setter, the scripts and the follow-up so the calls actually land on your calendar.',
      xPain: 'Posting daily and still no calls booked',
      checkPromise: '30 booked calls in the next 30 days',
      chatLead1: "I'm stuck with low revenue, can't even hire a setter",
      chatYou1: 'How long have you been stuck at this level?',
      chatLead2: '2 years now, and I really want to scale to $50k/mo',
      chatYou2: "That's a follow-up bottleneck — let's fix it!",
      chatFooterTitle: 'Stuck coaches get unstuck in 30 days',
      notesTitle: 'The 7-day setup',
      notesSubtitle: "For coaches with a quiet calendar: 30 booked calls in 30 days, or you don't pay.",
      notesSteps: [
        'We audit your existing leads',
        'We place a trained setter',
        'Scripts + follow-up go live',
        'Calls land on your calendar',
      ],
      accentColor: '#22d3ee',
    },
  },
  {
    id: 'saas',
    name: 'SaaS & AI Tool',
    icon: 'Zap',
    description: 'B2B Software or AI automation offer with instant free trial',
    rawOffer: 'Turn 1 article into 10 viral video scripts in 30 seconds. Designed for B2B marketers & founders who want to dominate LinkedIn and X. Try 14 days free.',
    content: {
      audience: 'FOR FOUNDERS & B2B MARKETERS',
      headline: 'Turn 1 article into 10 viral videos in 30 seconds',
      highlight: '10 viral videos in 30 seconds',
      subheadline: 'Repurpose long-form blogs into high-performing short video scripts automatically.',
      guarantee: '14 days free trial — cancel anytime with 1 click.',
      cta: 'Start Free 14-Day Trial',
      disclaimer: 'No credit card required. Setup takes under 2 minutes.',
      bigStat: '10x',
      statDescription: 'more content reach in under 30 seconds',
      longCopy: 'Writing daily content is exhausting. Stop starting from scratch when AI can convert your existing top articles into scroll-stopping video hooks instantly.',
      xPain: 'Spending 5 hours writing scripts every week',
      checkPromise: 'Generate 10 video scripts in 30 seconds',
      chatLead1: 'We spend thousands on video editors and still post late',
      chatYou1: 'What if you could turn articles into ready scripts instantly?',
      chatLead2: 'That would save our marketing team 20+ hours a week',
      chatYou2: 'Try our 14-day free trial right now!',
      chatFooterTitle: 'Automate your video script engine today',
      notesTitle: 'The 30-Second Content Workflow',
      notesSubtitle: 'For busy founders: 10x your organic video reach without hiring a scriptwriter.',
      notesSteps: [
        'Paste your blog link or article text',
        'AI extracts top viral hooks & angles',
        '10 custom video scripts generated instantly',
        'Export directly to Teleprompter or Notion',
      ],
      accentColor: '#22d3ee',
    },
  },
];

export function parseOfferIntelligence(rawText: string): OfferIntelligence {
  const clean = rawText.trim();
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  const priceMatch = clean.match(/(?:₹|\$|USD|INR)\s*[\d,]+/gi);
  const price = priceMatch ? priceMatch[priceMatch.length - 1] : undefined;
  const originalPrice = priceMatch && priceMatch.length > 1 ? priceMatch[0] : undefined;

  const guaranteeMatch = clean.match(/([^.!?]*(?:guarantee|don't pay|money back|refund)[^.!?]*)/i);

  return {
    product: sentences[0] || 'High-Converting Solution',
    category: 'Direct Response Service',
    targetAudience: [extractAudience(clean) || 'Business Owners & Growth Teams'],
    primaryAudience: extractAudience(clean) || 'FOR BUSINESS OWNERS',
    problem: ['Low conversion rates', 'Inconsistent qualified leads'],
    painPoints: ['Spending hours on manual tasks with low ROI', 'Unpredictable calendar and high ad costs'],
    desiredOutcomes: [sentences[0] || 'Consistent growth and high-converting results'],
    benefits: ['10x speed', 'Instant automation', 'Done-for-you workflow'],
    features: ['Custom AI scripts', 'Instant rendering', 'Exportable PNG creatives'],
    mechanism: 'Direct-Response System',
    differentiators: ['No manual setup required', 'Built for high ROI'],
    proof: [],
    objections: ['Will this work for my niche?', 'Is setup difficult?'],
    offer: {
      price,
      originalPrice,
      guarantee: guaranteeMatch ? guaranteeMatch[1].trim() : undefined,
      deliverables: ['10 Ad Creatives', 'Editable Copy', '1080x1080 PNG Export'],
    },
    cta: [extractCTA(clean) || 'Get Started Now'],
    claims: [sentences[0] || 'Get high-converting results'],
    forbiddenClaims: [],
  };
}

export function generate10AngleItems(base: AdContent, intel: OfferIntelligence): CreativeItem[] {
  const problems = Array.isArray(intel.problem) ? intel.problem : typeof intel.problem === 'string' ? [intel.problem] : [];
  const painPoints = Array.isArray(intel.painPoints) ? intel.painPoints : typeof intel.painPoints === 'string' ? [intel.painPoints] : [];
  const desiredOutcomes = Array.isArray(intel.desiredOutcomes) ? intel.desiredOutcomes : typeof intel.desiredOutcomes === 'string' ? [intel.desiredOutcomes] : [];
  const price = intel.offer?.price || intel.pricePoint || '';
  const product = intel.product || intel.coreProduct || base.headline;
  const guarantee = intel.offer?.guarantee || base.guarantee;

  const items: CreativeItem[] = [
    // 1. Pain / Frustration
    {
      id: 1,
      angle: 'Pain / Frustration',
      psychologicalTrigger: 'frustration',
      hook: `Still struggling with ${problems[0] || intel.primaryPainPoint || 'low conversion'}?`,
      headline: `Stop Burning Money On ${problems[0] || intel.primaryPainPoint || 'Ads That Do Not Convert'}`,
      highlight: `Stop Burning Money`,
      subheadline: `Replace manual effort with a proven direct-response workflow.`,
      audience: base.audience,
      cta: 'Stop Wasting Time',
      disclaimer: base.disclaimer,
      xPain: painPoints[0] || intel.primaryPainPoint || 'Manual setup taking hours',
      checkPromise: desiredOutcomes[0] || intel.primaryOutcome || 'Automated high-converting output',
    },
    // 2. Desired Outcome
    {
      id: 2,
      angle: 'Desired Outcome',
      psychologicalTrigger: 'desire',
      hook: `Achieve ${desiredOutcomes[0] || intel.primaryOutcome || 'consistent growth'} without chasing leads`,
      headline: base.headline,
      highlight: base.highlight,
      subheadline: base.subheadline,
      audience: base.audience,
      cta: base.cta,
      disclaimer: base.disclaimer,
    },
    // 3. Before vs After
    {
      id: 3,
      angle: 'Before vs After',
      psychologicalTrigger: 'contrast',
      hook: `Before vs After: Transform your results in minutes`,
      headline: `The Shift From Struggling To Scaled`,
      highlight: `Struggling To Scaled`,
      subheadline: base.subheadline,
      audience: base.audience,
      cta: 'See The Difference',
      longCopy: base.longCopy,
    },
    // 4. Offer / Price
    {
      id: 4,
      angle: 'Offer / Price',
      psychologicalTrigger: 'value',
      hook: price ? `Get ${product} for ${price}` : `Claim Your Exclusive Offer Today`,
      headline: price
        ? `${product} — Only ${price}`
        : `High-Converting ${product}`,
      highlight: price || product,
      subheadline: guarantee,
      audience: base.audience,
      cta: 'Claim Offer Now',
      bigStat: price || base.bigStat,
      statDescription: guarantee || 'Risk-free guarantee',
    },
    // 5. Time Saving
    {
      id: 5,
      angle: 'Time Saving',
      psychologicalTrigger: 'efficiency',
      hook: `Save hours every week with automated generation`,
      headline: `Generate 10 Ready-To-Run Ads In 60 Seconds`,
      highlight: `60 Seconds`,
      subheadline: `Stop starting from scratch. Get 10 scroll-stopping ad layouts instantly.`,
      audience: base.audience,
      cta: 'Save Time Now',
    },
    // 6. Cost Saving / ROI
    {
      id: 6,
      angle: 'Cost Saving / ROI',
      psychologicalTrigger: 'ROI',
      hook: `2x your return without buying more ads`,
      headline: `Double Your Sales From The Same Ad Spend`,
      highlight: `Double Your Sales`,
      subheadline: `High-converting copy engineered specifically to boost ROI.`,
      audience: base.audience,
      cta: 'Maximize Your ROI',
      xPain: 'High customer acquisition cost',
      checkPromise: '2x conversion rate on existing traffic',
    },
    // 7. How It Works / Social Proof
    {
      id: 7,
      angle: 'How It Works',
      psychologicalTrigger: 'simplicity',
      hook: `How top brands generate high-performing ads in 4 steps`,
      headline: `4 Simple Steps To Scroll-Stopping Ads`,
      highlight: `4 Simple Steps`,
      subheadline: `Paste offer → AI Strategist → 10 Layouts → Export PNG.`,
      audience: base.audience,
      cta: 'See How It Works',
      chatLead1: `I need high-converting ads without spending hours on copy`,
      chatYou1: `What if you could generate 10 proven layouts in seconds?`,
      chatLead2: `That would save our marketing team tons of time!`,
      chatYou2: `Let's launch your first batch right now!`,
      chatFooterTitle: `Launch your first batch in under 60 seconds`,
    },
    // 8. Objection Handling
    {
      id: 8,
      angle: 'Objection Handling',
      psychologicalTrigger: 'reassurance',
      hook: `Worried about low conversion or hard-to-use tools?`,
      headline: `No Complex Setup. No Marketing Degree Needed.`,
      highlight: `No Complex Setup`,
      subheadline: base.guarantee || `Designed for rapid execution with zero friction.`,
      audience: base.audience,
      cta: 'Try Risk-Free',
    },
    // 9. Curiosity / Pattern Interrupt
    {
      id: 9,
      angle: 'Curiosity / Pattern Interrupt',
      psychologicalTrigger: 'curiosity',
      hook: `Guess why 90% of social media ads get ignored?`,
      headline: `Your Ads Don't Have A Budget Problem. They Have A Hook Problem.`,
      highlight: `A Hook Problem`,
      subheadline: `Stop writing generic marketing copy. Use proven direct-response angles.`,
      audience: base.audience,
      cta: 'Fix Your Ads Today',
      bigStat: '90%',
      statDescription: 'of ads fail because of weak headlines',
    },
    // 10. Product Demonstration / Deliverables
    {
      id: 10,
      angle: 'Product Demonstration',
      psychologicalTrigger: 'clarity',
      hook: `1 Offer input. 10 complete 1080x1080 PNG ad creatives.`,
      headline: `Your 10-Ad Creative Batch Is Ready`,
      highlight: `10-Ad Creative Batch`,
      subheadline: `Everything included: copy, headlines, hooks, and editable cards.`,
      audience: base.audience,
      cta: 'Download All 10 Creatives',
      notesTitle: 'What You Get In Every Batch',
      notesSubtitle: '10 distinct direct-response ad squares ready for Meta & Instagram.',
      notesSteps: [
        '10 psychologically unique advertising angles',
        '100% editable copy, headlines & CTAs',
        'Full 1080×1080 high-resolution PNG export',
        'Bulk ZIP archive download in 1 click',
      ],
    },
  ];

  return items;
}

export function parseOfferText(rawText: string): AdContent {
  const clean = rawText.trim();

  // If empty, return first preset
  if (!clean) {
    const base = PRESETS[0].content;
    const intel = parseOfferIntelligence(PRESETS[0].rawOffer);
    return {
      ...base,
      items: generate10AngleItems(base, intel),
      offerIntelligence: intel,
    };
  }

  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const audience = extractAudience(clean) || 'FOR BUSINESS OWNERS & LEADERS';

  // Extract concise headline <= 10 words
  const rawHeadline = sentences[0] || 'Get high-converting results for your business';
  const shortProduct = rawHeadline.split(':')[0].trim();
  const headline = shortProduct.split(/\s+/).length <= 8
    ? shortProduct
    : rawHeadline.split(/\s+/).slice(0, 7).join(' ');

  const highlight = extractHighlight(headline);
  const subheadline = sentences[1] || sentences[0] || 'Transform your offer with proven high-converting ad copy.';
  const guarantee = sentences[2] || 'Guaranteed results or your money back.';
  const cta = extractCTA(clean) || 'Book Your 1:1 Call';

  const numberMatch = clean.match(/(\d+\s*(?: calls| lbs|%|x|k| days)?)/i);
  const bigStat = numberMatch ? numberMatch[1].toUpperCase() : '10x';

  const intel = parseOfferIntelligence(clean);

  const baseContent: AdContent = {
    audience: audience.toUpperCase(),
    headline,
    highlight,
    subheadline,
    guarantee,
    cta,
    disclaimer: 'Results vary. Terms and conditions apply.',
    bigStat,
    statDescription: `${headline} in the next 30 days`,
    longCopy: `Most offers do not fail because of product quality. They fail because of poor messaging. ${subheadline} ${guarantee}`,
    xPain: `Struggling with low conversion and quiet calendar`,
    checkPromise: `Consistent results and booked calls on autopilot`,
    chatLead1: `I'm spending time and money but not seeing consistent growth`,
    chatYou1: `How long have you been looking for a solution?`,
    chatLead2: `Several months now, I need something that actually works`,
    chatYou2: `That's why we built this system! Let's connect today.`,
    chatFooterTitle: `Transform your business growth in 30 days`,
    notesTitle: `The Action Plan`,
    notesSubtitle: `Clear roadmap to achieve: ${headline}`,
    notesSteps: [
      'Audit existing sales & marketing flow',
      'Deploy high-converting copy & templates',
      'Launch automated lead capture system',
      'Scale results consistently month over month',
    ],
    accentColor: '#22d3ee',
  };

  return {
    ...baseContent,
    items: generate10AngleItems(baseContent, intel),
    offerIntelligence: intel,
  };
}

function extractAudience(text: string): string | null {
  const match = text.match(/(?:for|help)\s+([a-z0-9\s&,-]{4,40})(?:\s+get|\s+to|\s+who|\.|\,)/i);
  if (match) {
    return `FOR ${match[1].trim()}`;
  }
  return null;
}

function extractHighlight(headline: string): string {
  const words = headline.split(' ');
  if (words.length <= 3) return headline;
  return words.slice(Math.floor(words.length / 3), Math.floor(words.length / 3) + 4).join(' ');
}

function extractCTA(text: string): string | null {
  if (/trial/i.test(text)) return 'Start Free Trial';
  if (/book|call|schedule/i.test(text)) return 'Book Your 1:1 Call';
  if (/buy|shop|order/i.test(text)) return 'Claim Your Offer Now';
  if (/download|get/i.test(text)) return 'Get Instant Access';
  return null;
}
