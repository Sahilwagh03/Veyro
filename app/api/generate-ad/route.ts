import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AdContent } from '@/types/ad';
import { SYSTEM_PROMPT, createUserPrompt } from '@/constants/prompts';

// Dynamically read environment variables to ensure live reload without restarting dev server
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
  // Strip markdown code fences
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

// Active free models on OpenRouter prioritized for fast response + balanced DR copy quality
const FREE_MODELS = [
  'minimax/minimax-m2.7:free',          // ~1.9s fast response, excellent schema adherence
  'minimax/minimax-m3:free',            // ~3.6s fast response, deeper strategic reasoning
  'liquid/lfm-2.5-2.6b:free',           // Lightweight instant fallback
  'dots-studio/dots-3-note-preview:free',
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

    if (!apiKey && !groqKey) {
      return NextResponse.json(
        {
          error: 'OPENROUTER_API_KEY or GROQ_API_KEY not found in .env or .env.local. Please add your key to enable AI generation.',
        },
        { status: 400 }
      );
    }

    // Select preferred models list
    const customModel = getEnvKey('OPENROUTER_MODEL');
    const modelsToTry = customModel ? [customModel, ...FREE_MODELS] : FREE_MODELS;

    let lastError = '';
    let parsedContent: any = null;
    let successfulModel = '';

    // 1. If Groq API key is available, attempt ultra-fast generation first (<1-2s)
    if (groqKey) {
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
            signal: AbortSignal.timeout(10000),
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

    // 2. OpenRouter models with 12s timeout per model to prevent long hangs
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
            signal: AbortSignal.timeout(12000), // 12s timeout per model prevents indefinite hanging
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
            continue; // Try next fast model
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
          break; // Successfully got JSON!
        } catch (err: any) {
          console.warn(`[AI Generation] Model ${model} exception:`, err?.message);
          lastError = err?.message || 'Timeout/Network error';
        }
      }
    }

    if (!parsedContent) {
      // User explicitly asked for NO FALLBACK: Return error so user knows exact issue
      return NextResponse.json(
        {
          error: `AI generation failed across all free models: ${lastError}`,
        },
        { status: 502 }
      );
    }

    // Validate and build clean AdContent object
    const finalContent: AdContent = {
      audience: String(parsedContent.audience || 'FOR BUSINESS OWNERS').trim(),
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
