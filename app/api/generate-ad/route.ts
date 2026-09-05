import { NextResponse } from 'next/server';
import { parseOfferText } from '@/utils/parser';
import { AdContent } from '@/types/ad';

function extractJsonFromText(raw: string): any {
  let text = raw.trim();
  // Strip markdown code fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(text);
}

export async function POST(req: Request) {
  let prompt = '';
  try {
    const body = await req.json();
    prompt = (body.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const base = parseOfferText(prompt);

    // Check available free or paid API keys
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    let apiUrl = '';
    let apiKey = '';
    let modelName = '';
    const extraHeaders: Record<string, string> = {};

    if (openRouterKey) {
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      apiKey = openRouterKey;
      // 100% Free models on OpenRouter:
      modelName = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
      extraHeaders['HTTP-Referer'] = 'https://veyro.app';
      extraHeaders['X-Title'] = 'Veyro Direct-Response Ad Generator';
    } else if (groqKey) {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      apiKey = groqKey;
      // 100% Free on Groq:
      modelName = 'llama-3.3-70b-versatile';
    } else if (openAiKey) {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      apiKey = openAiKey;
      modelName = 'gpt-4o-mini';
    } else {
      // Graceful fallback to built-in direct-response parser if no API key is configured yet
      return NextResponse.json({
        content: base,
        isAiGenerated: false,
        message: 'Generated using built-in parser. Add OPENROUTER_API_KEY in .env.local to activate free AI generation.',
      });
    }

    const systemPrompt = `You are a world-class direct-response advertising copywriter (Alex Hormozi / David Ogilvy style).
Given a user's offer or business idea, write high-converting copy specifically tailored for 10 ad layouts.

CRITICAL: Return ONLY a valid JSON object matching this exact schema:
{
  "audience": "ALL-CAPS target audience (e.g. 'FOR COACHES & AGENCY OWNERS', 'FOR DTC BRANDS')",
  "headline": "punchy hook focused on the big desired outcome (max 12 words)",
  "highlight": "the core 3-5 words inside the headline to highlight visually",
  "subheadline": "specific mechanism and timeline sentence",
  "guarantee": "irresistible risk-reversal guarantee ('30 calls in 30 days or you do not pay')",
  "cta": "action-oriented CTA button phrase ('Book Your 1:1 Call', 'Claim Free Audit')",
  "disclaimer": "short professional disclaimer or eligibility criteria",
  "bigStat": "bold metric ('40+', '10x', '-15 lbs', '2.4x')",
  "statDescription": "short description of what the bigStat metric represents",
  "longCopy": "2-3 punchy direct sentences addressing the root bottleneck and the proven solution",
  "xPain": "the painful old way ('Posting daily with zero booked calls')",
  "checkPromise": "the easy new way ('Calendar full of qualified buyers on autopilot')",
  "chatLead1": "a customer DM complaining about a painful problem ('I spend hours on outreach with no replies')",
  "chatYou1": "your diagnostic question ('How long has this follow-up bottleneck been hurting you?')",
  "chatLead2": "customer confirming they desperately need a fix ('Over 6 months, really need a system that works')",
  "chatYou2": "your confident solution and invite ('We install the setter and scripts in 7 days — let us talk!')",
  "chatFooterTitle": "short transformation punchline slogan ('Turn quiet calendars into booked pipelines')",
  "notesTitle": "title for a 4-step action plan ('The 7-Day Protocol')",
  "notesSubtitle": "one sentence explaining the outcome of the 4 steps",
  "notesSteps": ["step 1 description", "step 2 description", "step 3 description", "step 4 description"],
  "accentColor": "#22d3ee"
}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify({
        model: modelName,
        response_format: { type: 'json_object' },
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create direct-response ad copy for this offer: "${prompt}"` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);
      // Fall back safely to parser
      return NextResponse.json({
        content: base,
        isAiGenerated: false,
        message: 'AI provider error, fell back to built-in parser.',
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ content: base, isAiGenerated: false });
    }

    const parsed = extractJsonFromText(rawContent);

    // Merge parsed AI output with safe fallbacks
    const finalContent: AdContent = {
      audience: String(parsed.audience || base.audience).trim(),
      headline: String(parsed.headline || base.headline).trim(),
      highlight: String(parsed.highlight || base.highlight).trim(),
      subheadline: String(parsed.subheadline || base.subheadline).trim(),
      guarantee: String(parsed.guarantee || base.guarantee).trim(),
      cta: String(parsed.cta || base.cta).trim(),
      disclaimer: String(parsed.disclaimer || base.disclaimer).trim(),
      bigStat: String(parsed.bigStat || base.bigStat).trim(),
      statDescription: String(parsed.statDescription || base.statDescription).trim(),
      longCopy: String(parsed.longCopy || base.longCopy).trim(),
      xPain: String(parsed.xPain || base.xPain).trim(),
      checkPromise: String(parsed.checkPromise || base.checkPromise).trim(),
      chatLead1: String(parsed.chatLead1 || base.chatLead1).trim(),
      chatYou1: String(parsed.chatYou1 || base.chatYou1).trim(),
      chatLead2: String(parsed.chatLead2 || base.chatLead2).trim(),
      chatYou2: String(parsed.chatYou2 || base.chatYou2).trim(),
      chatFooterTitle: String(parsed.chatFooterTitle || base.chatFooterTitle).trim(),
      notesTitle: String(parsed.notesTitle || base.notesTitle).trim(),
      notesSubtitle: String(parsed.notesSubtitle || base.notesSubtitle).trim(),
      notesSteps: Array.isArray(parsed.notesSteps) && parsed.notesSteps.length >= 3
        ? parsed.notesSteps.slice(0, 4).map(String)
        : base.notesSteps,
      accentColor: parsed.accentColor || base.accentColor || '#22d3ee',
    };

    return NextResponse.json({
      content: finalContent,
      isAiGenerated: true,
      model: modelName,
    });
  } catch (error) {
    console.error('AI generation exception:', error);
    return NextResponse.json({
      content: parseOfferText(prompt || ''),
      isAiGenerated: false,
    });
  }
}
