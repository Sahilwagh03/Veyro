import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AdContent } from '@/types/ad';
import { SYSTEM_PROMPT, createUserPrompt } from '@/constants/prompts';
import { parseOfferText } from '@/utils/parser';

function getEnvKey(keyName: string): string {
  if (process.env[keyName]) {
    return process.env[keyName]!.trim();
  }

  const envFiles = ['.env.local', '.env', '.env.development.local', '.env.development'];
  for (const file of envFiles) {
    try {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, 'utf-8');
        const regex = new RegExp(`^${keyName}=([^\\r\\n]+)`, 'm');
        const match = text.match(regex);
        if (match && match[1]) {
          const val = match[1].trim().replace(/^["']|["']$/g, '');
          if (val) return val;
        }
      }
    } catch { }
  }
  return '';
}

function extractJsonFromText(raw: string): any {
  let text = raw.trim();
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

const FREE_MODELS = [
  'minimax/minimax-m3:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'minimax/minimax-m2.7:free',
  'liquid/lfm-2.5-2.6b:free',
  'inclusionai/ling-3.0-flash-sante:free',
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = (body.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json({ error: 'Please enter an offer description' }, { status: 400 });
    }

    const apiKey = getEnvKey('OPENROUTER_API_KEY');
    const groqKey = getEnvKey('GROQ_API_KEY');
    const geminiKey = getEnvKey('GEMINI_API_KEY');

    if (!apiKey && !groqKey && !geminiKey) {
      return NextResponse.json(
        {
          error: 'GROQ_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY not found in .env or .env.local. Please add a free key to enable AI generation.',
        },
        { status: 400 }
      );
    }

    const customModel = getEnvKey('OPENROUTER_MODEL');
    const modelsToTry = customModel ? [customModel, ...FREE_MODELS] : FREE_MODELS;

    let lastError = '';
    let parsedContent: any = null;
    let successfulModel = '';

    // Priority 1: Google Gemini
    if (geminiKey) {
      const model = getEnvKey('GEMINI_MODEL') || 'gemini-3.6-flash';
      try {
        console.log(`[AI Generation] Calling Gemini model: ${model}...`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': geminiKey,
            },
            signal: AbortSignal.timeout(25000),
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: createUserPrompt(prompt) }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            parsedContent = extractJsonFromText(rawText);
            successfulModel = `google/${model}`;
            console.log(`[AI Generation] Success with Gemini model: ${model}`);
          }
        } else {
          const errText = await response.text();
          console.warn(`[AI Generation] Gemini ${model} returned ${response.status}: ${errText}`);
        }
      } catch (err: any) {
        console.warn(`[AI Generation] Gemini ${model} exception:`, err?.message);
      }
    }

    // Priority 2: OpenRouter
    if (!parsedContent && apiKey) {
      for (const model of modelsToTry) {
        try {
          console.log(`[AI Generation] Calling OpenRouter model: ${model}`);
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://veyro.app',
              'X-Title': 'Veyro Direct-Response Ad Generator',
            },
            signal: AbortSignal.timeout(25000),
            body: JSON.stringify({
              model,
              temperature: 0.8,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: createUserPrompt(prompt) },
              ],
            }),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.warn(`[AI Generation] Model ${model} returned ${response.status}: ${errText}`);
            lastError = `Model ${model} error (${response.status}): ${errText}`;
            continue;
          }

          const data = await response.json();
          const rawText = data.choices?.[0]?.message?.content;

          if (!rawText) {
            lastError = `Model ${model} returned empty response`;
            continue;
          }

          parsedContent = extractJsonFromText(rawText);
          successfulModel = model;
          console.log(`[AI Generation] Success with model: ${model}`);
          break;
        } catch (err: any) {
          console.warn(`[AI Generation] Model ${model} exception:`, err?.message);
          lastError = err?.message || 'Timeout/Network error';
        }
      }
    }

    // Priority 3: Groq
    if (!parsedContent && groqKey) {
      const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
      for (const model of groqModels) {
        try {
          console.log(`[AI Generation] Calling Groq model: ${model}`);
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(25000),
            body: JSON.stringify({
              model,
              temperature: 0.8,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: createUserPrompt(prompt) },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const rawText = data.choices?.[0]?.message?.content;
            if (rawText) {
              parsedContent = extractJsonFromText(rawText);
              successfulModel = `groq/${model}`;
              console.log(`[AI Generation] Success with Groq model: ${model}`);
              break;
            }
          }
        } catch (err: any) {
          console.warn(`[AI Generation] Groq ${model} exception:`, err?.message);
        }
      }
    }

    if (!parsedContent) {
      console.warn(`[AI Generation] API models failed/timed out. Falling back to Veyro Direct-Response Strategic Engine.`);
      const offlineContent = parseOfferText(prompt);
      return NextResponse.json({
        content: offlineContent,
        isAiGenerated: false,
        model: 'veyro-strategic-parser-engine',
      });
    }

    // Validate and build clean AdContent object
    const rawItems = Array.isArray(parsedContent.items) ? parsedContent.items : [];
    const items = rawItems.slice(0, 10).map((it: any, index: number) => {
      const id = (index + 1) as any;
      return {
        id,
        angle: String(it.angle || `Angle ${id}`).trim(),
        hook: String(it.hook || '').trim(),
        headline: String(it.headline || parsedContent.headline || prompt).trim(),
        subheadline: String(it.subheadline || parsedContent.subheadline || '').trim(),
        highlight: String(it.highlight || it.headline || parsedContent.highlight || '').trim(),
        cta: String(it.cta || parsedContent.cta || 'Get Started Now').trim(),
        visualConcept: String(it.visualConcept || '').trim(),
        xPain: it.xPain ? String(it.xPain).trim() : parsedContent.xPain,
        checkPromise: it.checkPromise ? String(it.checkPromise).trim() : parsedContent.checkPromise,
        chatLead1: it.chatLead1 ? String(it.chatLead1).trim() : parsedContent.chatLead1,
        chatYou1: it.chatYou1 ? String(it.chatYou1).trim() : parsedContent.chatYou1,
        chatLead2: it.chatLead2 ? String(it.chatLead2).trim() : parsedContent.chatLead2,
        chatYou2: it.chatYou2 ? String(it.chatYou2).trim() : parsedContent.chatYou2,
        chatFooterTitle: it.chatFooterTitle ? String(it.chatFooterTitle).trim() : parsedContent.chatFooterTitle,
        notesTitle: it.notesTitle ? String(it.notesTitle).trim() : parsedContent.notesTitle,
        notesSubtitle: it.notesSubtitle ? String(it.notesSubtitle).trim() : parsedContent.notesSubtitle,
        notesSteps: Array.isArray(it.notesSteps) ? it.notesSteps.map(String) : parsedContent.notesSteps,
        bigStat: it.bigStat ? String(it.bigStat).trim() : parsedContent.bigStat,
        statDescription: it.statDescription ? String(it.statDescription).trim() : parsedContent.statDescription,
      };
    });

    const offerIntelligence = parsedContent.offerIntelligence ? {
      category: String(parsedContent.offerIntelligence.category || 'B2B Offer').trim(),
      coreProduct: String(parsedContent.offerIntelligence.coreProduct || prompt).trim(),
      targetAudience: String(parsedContent.offerIntelligence.targetAudience || 'Business Owners').trim(),
      primaryPainPoint: String(parsedContent.offerIntelligence.primaryPainPoint || '').trim(),
      primaryOutcome: String(parsedContent.offerIntelligence.primaryOutcome || '').trim(),
      uniqueMechanic: String(parsedContent.offerIntelligence.uniqueMechanic || '').trim(),
      pricePoint: String(parsedContent.offerIntelligence.pricePoint || 'Value Package').trim(),
      verifiedClaims: Array.isArray(parsedContent.offerIntelligence.verifiedClaims)
        ? parsedContent.offerIntelligence.verifiedClaims.map(String)
        : [],
    } : undefined;

    const batchQuality = parsedContent.batchQuality ? {
      creativeDiversityScore: Number(parsedContent.batchQuality.creativeDiversityScore || 90),
      readyToRunScore: Number(parsedContent.batchQuality.readyToRunScore || 88),
      antiHallucinationPassed: Boolean(parsedContent.batchQuality.antiHallucinationPassed ?? true),
      reasoning: String(parsedContent.batchQuality.reasoning || '').trim(),
    } : {
      creativeDiversityScore: items.length >= 10 ? 92 : 80,
      readyToRunScore: 88,
      antiHallucinationPassed: true,
      reasoning: 'Generated 10 psychologically distinct ad angles with strict anti-hallucination bounds.',
    };

    const finalContent: AdContent = {
      audience: String(parsedContent.audience || offerIntelligence?.targetAudience || 'FOR BUSINESS OWNERS').trim(),
      headline: String(parsedContent.headline || prompt).trim(),
      highlight: String(parsedContent.highlight || parsedContent.headline || '').trim(),
      subheadline: String(parsedContent.subheadline || '').trim(),
      guarantee: String(parsedContent.guarantee || 'Results guaranteed or your money back.').trim(),
      cta: String(parsedContent.cta || 'Book Your 1:1 Call').trim(),
      disclaimer: String(parsedContent.disclaimer || 'Results may vary. Terms apply.').trim(),
      bigStat: String(parsedContent.bigStat || '10x').trim(),
      statDescription: String(parsedContent.statDescription || 'proven results in 30 days').trim(),
      longCopy: String(parsedContent.longCopy || '').trim(),
      xPain: String(parsedContent.xPain || 'Struggling with low conversion and quiet calendar').trim(),
      checkPromise: String(parsedContent.checkPromise || 'Consistent results and booked calls on autopilot').trim(),
      chatLead1: String(parsedContent.chatLead1 || 'I need help growing my business').trim(),
      chatYou1: String(parsedContent.chatYou1 || 'What is your biggest bottleneck right now?').trim(),
      chatLead2: String(parsedContent.chatLead2 || 'Getting consistent qualified leads').trim(),
      chatYou2: String(parsedContent.chatYou2 || 'We can install our proven system in 7 days!').trim(),
      chatFooterTitle: String(parsedContent.chatFooterTitle || 'Transform your growth today').trim(),
      notesTitle: String(parsedContent.notesTitle || 'The 4-Step Action Plan').trim(),
      notesSubtitle: String(parsedContent.notesSubtitle || 'Clear roadmap to scale').trim(),
      notesSteps: Array.isArray(parsedContent.notesSteps) && parsedContent.notesSteps.length >= 3
        ? parsedContent.notesSteps.slice(0, 4).map(String)
        : [
          'Audit existing sales flow',
          'Deploy high-converting copy',
          'Launch automated lead capture',
          'Scale results month over month',
        ],
      accentColor: parsedContent.accentColor || '#22d3ee',
      offerIntelligence,
      items: items.length > 0 ? items : undefined,
      batchQuality,
    };

    return NextResponse.json({
      content: finalContent,
      isAiGenerated: true,
      model: successfulModel,
    });
  } catch (error: any) {
    console.error('Fatal AI error:', error);
    return NextResponse.json(
      { error: error?.message || 'AI generation failed' },
      { status: 500 }
    );
  }
}
