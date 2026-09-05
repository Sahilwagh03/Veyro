import { AdContent, PresetOffer } from '../types/ad';

export const PRESETS: PresetOffer[] = [
  {
    id: 'coaching',
    name: 'Coaching & Agency',
    icon: 'Users',
    description: 'Lead gen & setter placement offer for high-ticket service providers',
    rawOffer: 'We help coaches and agency owners get 40 sales calls a month without chasing leads. We place a trained setter in your business in 7 days. 30 calls in 30 days or you don\'t pay.',
    content: {
      audience: 'FOR COACHES & AGENCY OWNERS',
      headline: 'Get 40 sales calls a month without chasing leads',
      highlight: '40 sales calls a month',
      subheadline: 'We place a trained setter in your business in 7 days.',
      guarantee: '30 calls in 30 days or you don\'t pay.',
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
      notesSubtitle: 'For coaches with a quiet calendar: 30 booked calls in 30 days, or you don\'t pay.',
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
  {
    id: 'ecommerce',
    name: 'E-Commerce & Brands',
    icon: 'ShoppingBag',
    description: 'DTC product offer with discount or free shipping guarantee',
    rawOffer: 'Double your online store sales without buying more ads. We optimize your product page copy and checkout flow in 14 days or full refund.',
    content: {
      audience: 'FOR SHOPIFY & DTC BRAND OWNERS',
      headline: 'Double your online store sales without buying more ads',
      highlight: 'Double your store sales',
      subheadline: 'High-converting product page optimization delivered in 14 days.',
      guarantee: '2x ROI in 30 days or 100% money back guarantee.',
      cta: 'Claim Free Audit Call',
      disclaimer: 'Valid for DTC brands generating $20k+/month.',
      bigStat: '+114%',
      statDescription: 'average conversion increase in 30 days',
      longCopy: 'Driving Facebook ad traffic to a low-converting product page burns money. We rewrite your offer headlines, redesign your trust badges, and fix checkout drop-offs.',
      xPain: 'Paying high ad cost with low conversion rate',
      checkPromise: '2x conversion rate with optimized sales page',
      chatLead1: 'Our Facebook ads get clicks but customers leave at cart',
      chatYou1: 'Where is your biggest drop-off happening right now?',
      chatLead2: 'Right on the checkout page after seeing shipping costs',
      chatYou2: "We'll overhaul your checkout flow in 14 days!",
      chatFooterTitle: 'Fix your checkout leaks in 14 days',
      notesTitle: 'The Conversion Overhaul Plan',
      notesSubtitle: 'For Shopify store owners: double your sales from existing ad traffic.',
      notesSteps: [
        'Heatmap & drop-off audit of your product page',
        'High-converting headline & offer rewrite',
        '1-click checkout optimization installed',
        'Watch your conversion rate double',
      ],
      accentColor: '#22d3ee',
    },
  },
  {
    id: 'fitness',
    name: 'Fitness & Health',
    icon: 'Activity',
    description: 'Transformation coaching offer with body fat loss guarantee',
    rawOffer: 'Lose 15 lbs of belly fat in 60 days without giving up your favorite foods. Designed for busy executives. Guaranteed results or 100% money back.',
    content: {
      audience: 'FOR BUSY PROFESSIONALS & EXECUTIVES',
      headline: 'Lose 15 lbs of belly fat in 60 days without strict diets',
      highlight: 'Lose 15 lbs in 60 days',
      subheadline: 'Custom 30-minute workout routine tailored to your busy work schedule.',
      guarantee: 'Lose 15 lbs in 60 days or you pay nothing.',
      cta: 'Claim Your Custom Plan',
      disclaimer: 'Individual results vary based on commitment.',
      bigStat: '-15 lbs',
      statDescription: 'average fat loss in 60 days without crash diets',
      longCopy: 'You do not need to spend 2 hours in the gym or starve on salad leaves. Our 3-step executive protocol burns stubborn fat while fitting into your 60-hour workweek.',
      xPain: 'Exhausted after work and skipping workouts',
      checkPromise: 'Drop 2 pant sizes in 60 days with 30-min workouts',
      chatLead1: "I work 10 hours a day, I don't have time for complex meals",
      chatYou1: 'How many days a week can you spare 30 minutes?',
      chatLead2: '3 days easily if it actually works',
      chatYou2: "That's all we need! Let's get your custom plan started.",
      chatFooterTitle: 'Get executive fit in 60 days',
      notesTitle: 'The 60-Day Executive Fat Loss Plan',
      notesSubtitle: 'Drop 15 lbs of fat while keeping your high-stress career on track.',
      notesSteps: [
        'Metabolic & lifestyle assessment',
        'Custom 30-minute workout protocol',
        'Flexible nutrition plan with your favorite foods',
        'Weekly 1:1 accountability check-ins',
      ],
      accentColor: '#22d3ee',
    },
  },
  {
    id: 'realestate',
    name: 'Real Estate Leads',
    icon: 'Home',
    description: 'Local real estate agent lead generation system',
    rawOffer: 'Get 25 exclusive buyer and seller leads every month in your local neighborhood on autopilot. We build and run your local ad campaigns for you.',
    content: {
      audience: 'FOR REALTORS & REAL ESTATE AGENTS',
      headline: 'Get 25 exclusive buyer leads every month on autopilot',
      highlight: '25 exclusive buyer leads',
      subheadline: 'We setup, launch, and manage local Facebook & Google ad campaigns for you.',
      guarantee: 'At least 15 verified leads in month one guaranteed.',
      cta: 'Check Local Availability',
      disclaimer: 'Only 1 agent accepted per zip code.',
      bigStat: '25+',
      statDescription: 'exclusive local leads delivered every single month',
      longCopy: 'Stop buying shared Zillow leads that 5 other agents are calling at the exact same time. We generate exclusive local buyers interested specifically in your listings.',
      xPain: 'Chasing cold leads that never pick up the phone',
      checkPromise: 'Pre-qualified buyers calling you directly',
      chatLead1: 'Zillow leads are getting too expensive and cold',
      chatYou1: 'Are you looking for exclusive local buyers in your territory?',
      chatLead2: 'Yes! I need buyers ready to close in the next 90 days.',
      chatYou2: "We lock down your zip code today! Let's talk.",
      chatFooterTitle: 'Dominate your local zip code',
      notesTitle: 'The Exclusive Lead Engine',
      notesSubtitle: 'For agents looking to close 2-3 extra deals every single month.',
      notesSteps: [
        'Zip code availability check',
        'Custom hyper-local ad campaign launch',
        'Automated SMS follow-up sequence setup',
        'Qualified buyers booked on your phone calendar',
      ],
      accentColor: '#22d3ee',
    },
  }
];

export function parseOfferText(rawText: string): AdContent {
  const clean = rawText.trim();
  if (!clean) return PRESETS[0].content;

  // Extract key sentences
  const sentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  
  const audience = extractAudience(clean) || 'FOR BUSINESS OWNERS & LEADERS';
  const headline = sentences[0] || 'Get high-converting results for your business';
  const highlight = extractHighlight(headline);
  const subheadline = sentences[1] || 'Transform your offer with proven high-converting ad copy.';
  const guarantee = sentences[2] || 'Guaranteed results or your money back.';
  const cta = extractCTA(clean) || 'Book Your 1:1 Call';
  
  // Numbers matching
  const numberMatch = clean.match(/(\d+\s*(?: calls| lbs|%|x|k| days)?)/i);
  const bigStat = numberMatch ? numberMatch[1].toUpperCase() : '10x';

  return {
    audience: audience.toUpperCase(),
    headline,
    highlight,
    subheadline,
    guarantee,
    cta,
    disclaimer: 'Results vary. Terms and conditions apply.',
    bigStat,
    statDescription: `${headline.toLowerCase()} in the next 30 days`,
    longCopy: `Most offers do not fail because of product quality. They fail because of poor follow-up. ${subheadline} ${guarantee}`,
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
  // Pick middle 3-5 words
  return words.slice(Math.floor(words.length / 3), Math.floor(words.length / 3) + 4).join(' ');
}

function extractCTA(text: string): string | null {
  if (/trial/i.test(text)) return 'Start Free Trial';
  if (/book|call|schedule/i.test(text)) return 'Book Your 1:1 Call';
  if (/buy|shop|order/i.test(text)) return 'Claim Your Offer Now';
  if (/download|get/i.test(text)) return 'Get Instant Access';
  return null;
}
