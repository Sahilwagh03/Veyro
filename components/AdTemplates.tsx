import React from 'react';
import { Pencil, Copy, Download } from 'lucide-react';
import { AdContent, TemplateId, TemplateMeta } from '../types/ad';

export const TEMPLATE_METAS: TemplateMeta[] = [
  { id: 1, name: 'Bold black + neon', description: 'High contrast dark card with neon cyan accents', tag: 'High-Converting' },
  { id: 2, name: 'Bold black — big statement', description: 'Massive uppercase headline with white block CTA', tag: 'Aggressive' },
  { id: 3, name: 'Maroon long copy', description: 'Deep maroon background with persuasive long text', tag: 'Storytelling' },
  { id: 4, name: 'Gold serif one-liner', description: 'Elegant luxury gold layout with classic serif font', tag: 'Premium' },
  { id: 5, name: 'Blue paragraph', description: 'Clean royal blue layout with readable paragraph text', tag: 'Authority' },
  { id: 6, name: 'X vs check split', description: 'Side-by-side pain vs promise split comparison boxes', tag: 'Problem/Solution' },
  { id: 7, name: 'Chat screenshot mock', description: 'Realistic WhatsApp / iMessage chat conversation', tag: 'Social Proof' },
  { id: 8, name: 'White bold headline', description: 'Minimalist white card with huge typography and arrow', tag: 'Minimalist' },
  { id: 9, name: 'Red big number', description: 'Vibrant red layout led by giant stat percentage/number', tag: 'Stat-Driven' },
  { id: 10, name: 'Notes app mock', description: 'iOS Notes app layout with 4-step checklist', tag: 'Organized' },
];

interface AdSquareProps {
  id: TemplateId;
  content: AdContent;
  onEdit?: (id: TemplateId) => void;
  onDownload?: (id: TemplateId) => void;
  onCopy?: (id: TemplateId) => void;
}

export const AdSquare: React.FC<AdSquareProps> = ({
  id,
  content,
  onEdit,
  onDownload,
  onCopy,
}) => {
  const accent = content.accentColor || '#22d3ee';
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number>(0.3333);

  const updateScale = React.useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.getBoundingClientRect().width;
      if (w > 0) {
        setScale(w / 1080);
      }
    }
  }, []);

  React.useLayoutEffect(() => {
    updateScale();
    const timerId = setTimeout(updateScale, 50);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      clearTimeout(timerId);
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale]);

  const renderInnerContent = () => {
    switch (id) {
      case 1:
        // Bold Black + Neon
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="bg-[#000000] py-[34px] px-[48px] text-center text-[30px] font-extrabold tracking-[4px] uppercase border-b border-[#1f1f23]">
              {content.audience}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-[40px] px-[80px] text-center">
              <h1 className="text-[78px] font-extrabold leading-[1.08] m-0">
                {renderHighlightedText(content.headline, content.highlight, accent)}
              </h1>
              <p className="text-[38px] font-semibold leading-[1.35] m-0 text-[#c9d1dc]">
                {content.subheadline}
              </p>
              <div
                className="text-white text-[36px] font-extrabold tracking-[2px] uppercase py-[34px] px-[48px] rounded-lg shadow-lg w-full"
                style={{ backgroundColor: accent }}
              >
                {content.cta}
              </div>
            </div>

            <div className="pb-[54px] px-[90px] text-center text-[20px] leading-[1.5] text-[#8b95a3]">
              {content.disclaimer}
            </div>
          </div>
        );

      case 2:
        // Bold Black — Big Statement
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex-1 flex flex-col justify-center px-[76px] gap-[44px]">
              <div
                className="text-[26px] font-extrabold tracking-[5px] uppercase"
                style={{ color: accent }}
              >
                {content.audience}
              </div>
              <h1 className="text-[104px] font-extrabold leading-[0.98] m-0 uppercase tracking-[-2px]">
                {renderHighlightedText(content.headline, content.highlight, accent)}
              </h1>
              <div className="w-[180px] h-[8px]" style={{ backgroundColor: accent }} />
              <p className="text-[36px] font-medium leading-[1.35] m-0 text-[#b9c2cf]">
                {content.guarantee}
              </p>
            </div>

            <div className="bg-white text-[#0a0a0a] py-[42px] px-[48px] text-center text-[38px] font-extrabold tracking-[1px] uppercase">
              {content.cta}
            </div>
          </div>
        );

      case 3:
        // Maroon Long Copy
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#5e1b1b] text-white flex flex-col justify-center items-center overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex-1 flex flex-col justify-center gap-[34px] px-[92px] text-center">
              <h1 className="text-[54px] font-extrabold leading-[1.15] m-0">
                {content.headline}
              </h1>
              <p className="text-[37px] font-normal leading-[1.42] m-0 text-[#f3d0d0]">
                {content.longCopy}
              </p>
              <p className="text-[38px] font-extrabold m-0 text-[#ffffff] underline underline-offset-8">
                {content.cta}
              </p>
            </div>
          </div>
        );

      case 4:
        // Gold Serif One-Liner
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#c8992e] text-[#fdfaf3] flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-[36px] px-[108px] text-center">
              <div
                className="text-[28px] tracking-[4px] uppercase font-extrabold text-[#fff6df]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {content.audience}
              </div>
              <h1 className="text-[76px] font-normal leading-[1.24] m-0">
                {content.headline}
              </h1>
              <p
                className="text-[34px] m-0 font-medium text-[#fff6df]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {content.guarantee}
              </p>
            </div>

            <div
              className="bg-[#1a1206] text-white py-[38px] px-[48px] text-center text-[36px] font-extrabold tracking-[2px] uppercase"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {content.cta}
            </div>
          </div>
        );

      case 5:
        // Blue Paragraph
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#3388ff] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-[34px] px-[100px] text-center">
              <div className="text-[28px] font-extrabold tracking-[4px] uppercase text-[#dbeafe]">
                {content.audience}
              </div>
              <p className="text-[52px] font-normal leading-[1.32] m-0">
                {content.longCopy}
              </p>
              <p className="text-[32px] font-bold m-0 opacity-90 text-[#bfdbfe]">
                {content.guarantee}
              </p>
            </div>

            <div className="bg-[#0a1f45] py-[38px] px-[48px] text-center text-[36px] font-extrabold tracking-[2px] uppercase">
              {content.cta}
            </div>
          </div>
        );

      case 6:
        // X vs Check Split
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="bg-[#000000] py-[30px] px-[48px] text-center text-[28px] font-extrabold tracking-[4px] uppercase">
              {content.audience}
            </div>

            <div className="flex-1 bg-[#1c110f] flex items-center gap-[44px] px-[74px]">
              <div className="w-[116px] h-[116px] rounded-full bg-[#e53935] text-white flex items-center justify-center text-[60px] font-bold shrink-0 leading-none">
                ✕
              </div>
              <p className="text-[52px] font-bold leading-[1.2] m-0 text-[#f6dcd8]">
                {content.xPain}
              </p>
            </div>

            <div className="flex-1 bg-[#0d1d15] flex items-center gap-[44px] px-[74px]">
              <div className="w-[116px] h-[116px] rounded-full bg-[#17944f] text-white flex items-center justify-center text-[60px] font-bold shrink-0 leading-none">
                ✓
              </div>
              <p className="text-[52px] font-bold leading-[1.2] m-0 text-white">
                {content.checkPromise}
              </p>
            </div>

            <div
              className="py-[38px] px-[48px] text-center text-[34px] font-extrabold tracking-[2px] uppercase text-black"
              style={{ backgroundColor: accent }}
            >
              {content.cta}
            </div>
          </div>
        );

      case 7:
        // Chat Screenshot Mock (Exact easyimagecreator spacing and WhatsApp pattern)
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#0b141a] text-[#111b21] flex flex-col overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            {/* Top Bar */}
            <div
              className="shrink-0 flex items-center gap-[22px] px-[34px] py-[24px] bg-[#075e54]"
            >
              <div className="text-[42px] text-[#cfe9e3] font-light -mr-[4px]">‹</div>
              <div className="w-[74px] h-[74px] rounded-full bg-[#cfd6da] text-[#4a5257] flex items-center justify-center text-[38px] font-bold">
                Y
              </div>
              <div className="flex-1">
                <div className="text-[34px] font-semibold text-white">Your leads</div>
              </div>
              <div className="text-[32px] text-[#cfe9e3]">⋮</div>
            </div>

            {/* Chat Body with WhatsApp Pattern and Balanced Spacing */}
            <div
              className="flex-1 flex flex-col gap-[18px] px-[30px] py-[24px] justify-center"
              style={{
                background:
                  'radial-gradient(circle at 20% 15%, rgba(0,0,0,0.035) 0 3px, transparent 4px), radial-gradient(circle at 70% 55%, rgba(0,0,0,0.035) 0 3px, transparent 4px), #ece5dd',
                backgroundSize: '160px 160px, 210px 210px, auto',
              }}
            >
              {/* Lead message 1 */}
              <div className="flex items-end gap-[14px] justify-start">
                <div className="w-[50px] h-[50px] rounded-full bg-[#b9c3c7] text-white text-[24px] font-bold flex items-center justify-center shrink-0">
                  L
                </div>
                <div className="relative max-w-[72%] bg-white rounded-[20px] rounded-bl-[4px] p-[16px_22px_32px_22px] text-[30px] font-medium leading-[1.3] text-[#111b21] shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
                  <div className="text-[18px] font-extrabold tracking-[1px] uppercase mb-[4px] text-[#8a9aa2]">
                    Lead
                  </div>
                  {content.chatLead1}
                  <span className="absolute right-[18px] bottom-[7px] text-[18px] text-[#8a9aa2] whitespace-nowrap">
                    9:12
                  </span>
                </div>
              </div>

              {/* You message 1 */}
              <div className="flex items-end gap-[14px] justify-end">
                <div className="relative max-w-[72%] bg-[#25d366] rounded-[20px] rounded-br-[4px] p-[16px_22px_32px_22px] text-[30px] font-medium leading-[1.3] text-[#05271c] shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
                  <div className="text-[18px] font-extrabold tracking-[1px] uppercase mb-[4px] text-[#0b6b4a]">
                    You
                  </div>
                  {content.chatYou1}
                  <span className="absolute right-[18px] bottom-[7px] text-[18px] text-[#0b6b4a] whitespace-nowrap">
                    10:29 ✓✓
                  </span>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-[#075e54] text-white text-[24px] font-bold flex items-center justify-center shrink-0">
                  Y
                </div>
              </div>

              {/* Lead message 2 */}
              <div className="flex items-end gap-[14px] justify-start">
                <div className="w-[50px] h-[50px] rounded-full bg-[#b9c3c7] text-white text-[24px] font-bold flex items-center justify-center shrink-0">
                  L
                </div>
                <div className="relative max-w-[72%] bg-white rounded-[20px] rounded-bl-[4px] p-[16px_22px_32px_22px] text-[30px] font-medium leading-[1.3] text-[#111b21] shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
                  <div className="text-[18px] font-extrabold tracking-[1px] uppercase mb-[4px] text-[#8a9aa2]">
                    Lead
                  </div>
                  {content.chatLead2}
                  <span className="absolute right-[18px] bottom-[7px] text-[18px] text-[#8a9aa2] whitespace-nowrap">
                    12:46
                  </span>
                </div>
              </div>

              {/* You message 2 */}
              <div className="flex items-end gap-[14px] justify-end">
                <div className="relative max-w-[72%] bg-[#25d366] rounded-[20px] rounded-br-[4px] p-[16px_22px_32px_22px] text-[30px] font-medium leading-[1.3] text-[#05271c] shadow-[0_2px_3px_rgba(0,0,0,0.16)]">
                  <div className="text-[18px] font-extrabold tracking-[1px] uppercase mb-[4px] text-[#0b6b4a]">
                    You
                  </div>
                  {content.chatYou2}
                  <span className="absolute right-[18px] bottom-[7px] text-[18px] text-[#0b6b4a] whitespace-nowrap">
                    14:03 ✓✓
                  </span>
                </div>
                <div className="w-[50px] h-[50px] rounded-full bg-[#075e54] text-white text-[24px] font-bold flex items-center justify-center shrink-0">
                  Y
                </div>
              </div>
            </div>

            {/* Bottom CTA Card */}
            <div
              className="shrink-0 py-[28px] px-[44px] text-center text-white"
              style={{ backgroundColor: accent }}
            >
              <div className="text-[40px] font-extrabold uppercase tracking-[1px] text-black leading-tight">
                {content.chatFooterTitle}
              </div>
              <div className="text-[26px] font-semibold mt-[8px] text-black/90">
                {content.subheadline}
              </div>
              <div className="mt-[16px] inline-block bg-white text-[#0a0a0a] rounded-full py-[16px] px-[44px] text-[28px] font-extrabold uppercase tracking-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                {content.cta}
              </div>
            </div>
          </div>
        );

      case 8:
        // White Bold Headline
        return (
          <div
            className="w-[1080px] h-[1080px] bg-white text-[#0a0a0a] flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex-1 flex flex-col justify-center items-center gap-[40px] px-[84px] text-center">
              <h1 className="text-[90px] font-extrabold leading-[1.05] m-0 tracking-[-2px]">
                {renderHighlightedText(content.headline, content.highlight, accent)}
              </h1>
              <p className="text-[38px] font-medium leading-[1.35] m-0 text-[#4b5563]">
                {content.subheadline}
              </p>
              <div className="text-[96px] leading-none font-extrabold" style={{ color: accent }}>
                ↓
              </div>
              <div className="border-[4px] border-[#0a0a0a] rounded-full py-[24px] px-[56px] text-[34px] font-extrabold uppercase tracking-[1px]">
                {content.cta}
              </div>
            </div>
          </div>
        );

      case 9:
        // Red Big Number
        return (
          <div
            className="w-[1080px] h-[1080px] bg-[#d61f26] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex-1 flex flex-col justify-center items-center gap-[36px] px-[80px] text-center">
              <div className="text-[116px] font-extrabold leading-none tracking-[-3px] uppercase">
                {content.bigStat}
              </div>
              <div className="w-[200px] h-[8px] bg-white opacity-90" />
              <h1 className="text-[58px] font-bold leading-[1.2] m-0">
                {content.statDescription}
              </h1>
              <div className="mt-[12px] bg-white text-[#d61f26] rounded-full py-[26px] px-[60px] text-[36px] font-extrabold uppercase tracking-[1px] shadow-xl">
                {content.cta}
              </div>
            </div>
          </div>
        );

      case 10:
        // Notes App Mock
        return (
          <div
            className="w-[1080px] h-[1080px] bg-black text-[#f2f2f2] flex flex-col justify-between overflow-hidden relative"
            style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            <div className="flex items-center justify-between px-[44px] pt-[34px] text-[26px]">
              <span className="text-[#e0a010] font-medium">‹ All iCloud Notes</span>
              <span className="text-[#8a8a8a]">Notes</span>
            </div>

            <div className="flex-1 p-[34px_56px_40px] flex flex-col gap-[30px]">
              <div
                className="text-[26px] font-extrabold tracking-[4px] uppercase"
                style={{ color: accent }}
              >
                {content.audience}
              </div>
              <h1 className="text-[58px] font-extrabold m-0 text-white">{content.notesTitle}</h1>
              <p className="text-[34px] leading-[1.45] m-0 text-[#e6e6e6]">
                {content.notesSubtitle}
              </p>
              <div className="text-[34px] font-bold text-white">How we do this:</div>
              <ol className="m-0 pl-[46px] flex flex-col gap-[20px]">
                {content.notesSteps.map((step, idx) => (
                  <li key={idx} className="text-[32px] leading-[1.4] font-semibold text-[#f4f4f5]">
                    {step}
                  </li>
                ))}
              </ol>
              <div className="text-[30px] font-bold text-[#b9b9b9]">{content.guarantee}</div>
            </div>

            <div
              className="py-[38px] px-[48px] text-center text-[36px] font-extrabold tracking-[2px] uppercase text-black"
              style={{ backgroundColor: accent }}
            >
              {content.cta}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
      {/* 1080x1080 Scaled Canvas Wrapper */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square overflow-hidden bg-slate-900"
      >
        <div
          id={`ad-canvas-${id}`}
          className="absolute top-0 left-0"
          style={{
            width: '1080px',
            height: '1080px',
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {renderInnerContent()}
        </div>
      </div>

      {/* Caption & Action Bar */}
      <figcaption className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 flex items-center justify-between gap-2">
        <span className="capitalize text-slate-800 truncate text-[11px] sm:text-xs">
          {TEMPLATE_METAS[id - 1].name}
        </span>
        <div className="flex items-center gap-1.5 font-sans shrink-0">
          <button
            onClick={() => onEdit?.(id)}
            title="Edit creative text & styling"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs text-[11px] font-medium"
          >
            <Pencil className="w-3 h-3 text-slate-500" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onCopy?.(id)}
            title="Copy image to clipboard"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs text-[11px] font-medium"
          >
            <Copy className="w-3 h-3 text-slate-500" />
            <span>Copy</span>
          </button>
          <button
            onClick={() => onDownload?.(id)}
            title="Download full 1080×1080 PNG creative"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-white font-bold transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-2xs text-[11px]"
            style={{
              background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
            }}
          >
            <Download className="w-3 h-3" />
            <span>PNG</span>
          </button>
        </div>
      </figcaption>
    </figure>
  );
};

// Helper function to color highlight words in headlines
function renderHighlightedText(text: string, highlightText: string, accentColor: string) {
  if (!highlightText || !text.toLowerCase().includes(highlightText.toLowerCase())) {
    return text;
  }
  const regex = new RegExp(`(${escapeRegExp(highlightText)})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlightText.toLowerCase() ? (
          <span key={i} style={{ color: accentColor }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
