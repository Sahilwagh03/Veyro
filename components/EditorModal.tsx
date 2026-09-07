import React from 'react';
import { X, Check } from 'lucide-react';
import { AdContent, TemplateId } from '@/types/ad';
import { TEMPLATE_METAS } from '@/components/AdTemplates';

interface EditorModalProps {
  isOpen: boolean;
  templateId: TemplateId | null;
  content: AdContent;
  onChange: (updatedContent: AdContent) => void;
  onClose: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  templateId,
  content,
  onChange,
  onClose,
}) => {
  if (!isOpen || templateId === null) return null;

  const meta = TEMPLATE_METAS[templateId - 1];
  const item = Array.isArray(content.items) ? content.items[templateId - 1] : undefined;

  const getValue = (field: keyof AdContent): any => {
    if (item && field in item && (item as any)[field] !== undefined) {
      return (item as any)[field];
    }
    return (content as any)[field] ?? '';
  };

  const handleTextChange = (field: keyof AdContent, value: string) => {
    const updatedContent: AdContent = {
      ...content,
      [field]: value,
    };

    if (Array.isArray(content.items) && templateId !== null && content.items[templateId - 1]) {
      const updatedItems = [...content.items];
      updatedItems[templateId - 1] = {
        ...updatedItems[templateId - 1],
        [field]: value,
      };
      updatedContent.items = updatedItems;
    }

    onChange(updatedContent);
  };

  const handleStepChange = (index: number, value: string) => {
    const currentSteps = (item?.notesSteps || content.notesSteps || []) as string[];
    const updatedSteps = [...currentSteps];
    updatedSteps[index] = value;

    const updatedContent: AdContent = {
      ...content,
      notesSteps: updatedSteps,
    };

    if (Array.isArray(content.items) && templateId !== null && content.items[templateId - 1]) {
      const updatedItems = [...content.items];
      updatedItems[templateId - 1] = {
        ...updatedItems[templateId - 1],
        notesSteps: updatedSteps,
      };
      updatedContent.items = updatedItems;
    }

    onChange(updatedContent);
  };

  const stepsList = (item?.notesSteps || content.notesSteps || []) as string[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{meta.name}</h2>
            <p className="text-xs text-slate-500">{meta.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md bg-transparent hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Audience Badge
              </label>
              <input
                type="text"
                value={getValue('audience')}
                onChange={(e) => handleTextChange('audience', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={getValue('cta')}
                onChange={(e) => handleTextChange('cta', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Main Headline
            </label>
            <textarea
              rows={2}
              value={getValue('headline')}
              onChange={(e) => handleTextChange('headline', e.target.value)}
              style={{ resize: 'none' }}
              className="w-full resize-none bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Highlighted Words
              </label>
              <input
                type="text"
                value={getValue('highlight')}
                onChange={(e) => handleTextChange('highlight', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={content.accentColor || '#22d3ee'}
                  onChange={(e) => handleTextChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={content.accentColor || '#22d3ee'}
                  onChange={(e) => handleTextChange('accentColor', e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Subheadline / Detail
            </label>
            <textarea
              rows={2}
              value={getValue('subheadline')}
              onChange={(e) => handleTextChange('subheadline', e.target.value)}
              style={{ resize: 'none' }}
              className="w-full resize-none bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Guarantee / Risk Reversal
            </label>
            <input
              type="text"
              value={getValue('guarantee')}
              onChange={(e) => handleTextChange('guarantee', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
            />
          </div>

          {(templateId === 3 || templateId === 5) && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Long Paragraph Copy
              </label>
              <textarea
                rows={3}
                value={getValue('longCopy')}
                onChange={(e) => handleTextChange('longCopy', e.target.value)}
                style={{ resize: 'none' }}
                className="w-full resize-none bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#f02508] text-sm"
              />
            </div>
          )}

          {templateId === 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-red-600 mb-1">
                  ✕ Pain Point (Red Box)
                </label>
                <input
                  type="text"
                  value={getValue('xPain')}
                  onChange={(e) => handleTextChange('xPain', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-600 mb-1">
                  ✓ Promise / Solution (Green Box)
                </label>
                <input
                  type="text"
                  value={getValue('checkPromise')}
                  onChange={(e) => handleTextChange('checkPromise', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                />
              </div>
            </div>
          )}

          {templateId === 7 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Lead Message 1
                  </label>
                  <input
                    type="text"
                    value={getValue('chatLead1')}
                    onChange={(e) => handleTextChange('chatLead1', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-600 mb-1">
                    Your Response 1
                  </label>
                  <input
                    type="text"
                    value={getValue('chatYou1')}
                    onChange={(e) => handleTextChange('chatYou1', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Lead Message 2
                  </label>
                  <input
                    type="text"
                    value={getValue('chatLead2')}
                    onChange={(e) => handleTextChange('chatLead2', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-600 mb-1">
                    Your Response 2
                  </label>
                  <input
                    type="text"
                    value={getValue('chatYou2')}
                    onChange={(e) => handleTextChange('chatYou2', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {templateId === 9 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Giant Stat Number
                </label>
                <input
                  type="text"
                  value={getValue('bigStat')}
                  onChange={(e) => handleTextChange('bigStat', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Stat Description
                </label>
                <input
                  type="text"
                  value={getValue('statDescription')}
                  onChange={(e) => handleTextChange('statDescription', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                />
              </div>
            </div>
          )}

          {templateId === 10 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Checklist Steps
              </label>
              {stepsList.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-bold text-slate-500">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500">
            Changes apply live across all templates
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-white font-bold text-xs rounded-md transition-all hover:brightness-105 active:scale-95 cursor-pointer shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #f02508 0%, #fc964c 100%)',
              boxShadow: '0 2px 8px rgba(240, 37, 8, 0.25)',
            }}
          >
            <Check className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
