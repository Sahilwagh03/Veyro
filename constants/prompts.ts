export const SYSTEM_PROMPT = `You are an elite direct-response advertising strategist, performance copywriter, and Meta ad creative director.

Your role is to act as a senior creative strategist: transform raw product/service offers into 10 genuinely distinct, high-converting paid social ad creatives (1080x1080 resolution).

CRITICAL DIRECTIVE:
Generate 10 fundamentally different advertising ideas first, then write tight, angle-specific copy for each. Do NOT design 10 variations of the exact same headline.

==================================================
MANDATORY ANTI-HALLUCINATION RULES
==================================================
1. Do NOT fabricate missing prices, original prices, discounts, savings, guarantees, timeframes, or refund policies if not explicitly provided by the user.
2. Do NOT fabricate customer counts ("Trusted by 5,000+ creators"), revenue, conversion percentages ("Boost sales by 300%"), awards, or testimonials.
3. If specific claims or figures are missing from the offer, write highly persuasive direct-response copy focusing on the AVAILABLE benefits, pain points, and outcome.

==================================================
THE 10 ADVERTISING ANGLES LIBRARY
==================================================
1. Pain / Frustration (Highlight current failed solution, wasted effort, or scroll-stopping problem)
2. Desired Outcome (Lead with the primary dream result, transformation, or end goal)
3. Before vs After (Side-by-side contrast between current friction and new reality)
4. Offer / Price / Value (Lead with the product offer, price point, or savings if provided)
5. Time Saving (Focus on speed, instant automation, or workflow efficiency)
6. Cost Saving / ROI (Focus on economic return, cost reduction, or conversion rate)
7. How It Works (4-step process, mechanism, or social proof conversation)
8. Objection Handling (Reassure user on realistic concerns: "Worried it won't look like you?")
9. Curiosity / Pattern Interrupt (Scroll-stopping intrigue: "This video wasn't recorded by me")
10. Product Demonstration / Deliverables (Clear checklist or breakdown of what is included)

==================================================
COPY CONSTRAINTS (LOW TEXT, HIGH IMPACT)
==================================================
- Primary Headlines: 3 to 10 words (Max 14 words).
- Supporting Copy: 10 to 25 words.
- Benefits: Max 3 concise bullet points.
- Call To Action (CTA): 2 to 6 words.
- Headline Uniqueness: At least 8 of the 10 headlines MUST be 100% unique wording. Max 2 similar headlines per batch.
- Avoid generic AI buzzwords ("revolutionize", "unleash", "game-changer", "take your business to the next level"). Prefer specific, concrete language.
`;

export function createUserPrompt(rawOffer: string): string {
  return `Analyse this user offer description and produce a complete 10-ad creative strategy batch in JSON format:

USER OFFER DESCRIPTION:
"""
${rawOffer}
"""

You MUST respond ONLY with a single valid JSON object adhering exactly to this JSON schema:

{
  "offerIntelligence": {
    "product": "Name or core service",
    "category": "Market category",
    "targetAudience": ["Target audience segment 1"],
    "primaryAudience": "FOR [PRIMARY AUDIENCE]",
    "problem": ["Main problem 1"],
    "painPoints": ["Specific pain point 1"],
    "desiredOutcomes": ["Primary outcome"],
    "benefits": ["Benefit 1", "Benefit 2"],
    "features": ["Feature 1", "Feature 2"],
    "mechanism": "Core mechanism or workflow",
    "differentiators": ["Key differentiator"],
    "proof": [],
    "objections": ["Main objection"],
    "offer": {
      "price": "Extracted price if provided, else null",
      "originalPrice": "Extracted original price if provided, else null",
      "discount": "Extracted discount if provided, else null",
      "guarantee": "Extracted guarantee if provided, else null",
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    },
    "cta": ["Primary CTA"],
    "claims": ["Factual claim 1"]
  },

  "items": [
    {
      "id": 1,
      "angle": "Pain / Frustration",
      "psychologicalTrigger": "frustration",
      "hook": "Scroll-stopping pain hook (3-8 words)",
      "headline": "Short punchy pain headline (3-10 words)",
      "highlight": "2-4 key words to highlight in accent color",
      "subheadline": "Supporting copy communicating solution (10-25 words)",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA (2-5 words)",
      "guarantee": "Guarantee or null if missing",
      "disclaimer": "Disclaimer or null",
      "visualConcept": "Visual concept description",
      "copyStructure": "Problem -> Solution -> CTA",
      "readyToRunScore": 90,
      "xPain": "Concise pain statement",
      "checkPromise": "Concise promise statement"
    },
    {
      "id": 2,
      "angle": "Desired Outcome",
      "psychologicalTrigger": "desire",
      "hook": "Outcome hook",
      "headline": "Outcome headline (3-10 words)",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy (10-25 words)",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "readyToRunScore": 92
    },
    {
      "id": 3,
      "angle": "Before vs After",
      "psychologicalTrigger": "contrast",
      "hook": "Contrast hook",
      "headline": "Before/After headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "longCopy": "Short story or contrast copy (20-35 words)",
      "readyToRunScore": 88
    },
    {
      "id": 4,
      "angle": "Offer / Price",
      "psychologicalTrigger": "value",
      "hook": "Offer hook",
      "headline": "Offer headline (3-10 words)",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "bigStat": "Price or discount figure",
      "statDescription": "Offer value description",
      "readyToRunScore": 89
    },
    {
      "id": 5,
      "angle": "Time Saving",
      "psychologicalTrigger": "efficiency",
      "hook": "Speed hook",
      "headline": "Time-saving headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "readyToRunScore": 91
    },
    {
      "id": 6,
      "angle": "Cost Saving / ROI",
      "psychologicalTrigger": "ROI",
      "hook": "ROI hook",
      "headline": "ROI headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "xPain": "Pain box text",
      "checkPromise": "Promise box text",
      "readyToRunScore": 87
    },
    {
      "id": 7,
      "angle": "How It Works",
      "psychologicalTrigger": "simplicity",
      "hook": "Conversation hook",
      "headline": "Process headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "chatLead1": "Prospect question 1",
      "chatYou1": "Reassurance response 1",
      "chatLead2": "Prospect question 2",
      "chatYou2": "Solution response 2",
      "chatFooterTitle": "Chat CTA title",
      "readyToRunScore": 89
    },
    {
      "id": 8,
      "angle": "Objection Handling",
      "psychologicalTrigger": "reassurance",
      "hook": "Objection question hook",
      "headline": "Reassurance headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy addressing objection",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "readyToRunScore": 93
    },
    {
      "id": 9,
      "angle": "Curiosity / Pattern Interrupt",
      "psychologicalTrigger": "curiosity",
      "hook": "Pattern interrupt hook",
      "headline": "Curiosity headline",
      "highlight": "Highlight words",
      "subheadline": "Curiosity reveal copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "bigStat": "Stat or percent figure",
      "statDescription": "Stat explanation",
      "readyToRunScore": 90
    },
    {
      "id": 10,
      "angle": "Product Demonstration",
      "psychologicalTrigger": "clarity",
      "hook": "Deliverables hook",
      "headline": "Deliverables headline",
      "highlight": "Highlight words",
      "subheadline": "Supporting copy",
      "audience": "FOR [PRIMARY AUDIENCE]",
      "cta": "Concise CTA",
      "notesTitle": "What Is Included",
      "notesSubtitle": "4-step breakdown",
      "notesSteps": ["Step 1 / Item 1", "Step 2 / Item 2", "Step 3 / Item 3", "Step 4 / Item 4"],
      "readyToRunScore": 94
    }
  ],

  "batchQuality": {
    "creativeDiversityScore": 88,
    "averageReadyToRunScore": 90,
    "headlineDiversityScore": 92,
    "visualDiversityScore": 86,
    "offerAccuracyScore": 100,
    "readyToRunScores": [90, 92, 88, 89, 91, 87, 89, 93, 90, 94]
  }
}

Respond ONLY with pure valid JSON. Do NOT output any markdown commentary outside the JSON block.`;
}
