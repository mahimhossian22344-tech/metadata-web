import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ClipboardCopy,
} from 'lucide-react';
import { StockFileItem, PngPlatformData } from '../types';

interface PngPlatformFormProps {
  item: StockFileItem;
  onUpdate: (updated: StockFileItem) => void;
  onGenerateAI: (item: StockFileItem) => Promise<void>;
  isGenerating?: boolean;
}

const AI_PLATFORM_NAMES = [
  'Midjourney',
  'Ideogram',
  'Leonardo AI',
  'Adobe Firefly',
  'DALL-E 3',
  'Stable Diffusion',
  'Flux.1',
];

export const PngPlatformForm: React.FC<PngPlatformFormProps> = ({
  item,
  onUpdate,
  onGenerateAI,
  isGenerating = false,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Initialize pngData if not present
  const pngData: PngPlatformData = item.pngData || {
    category1: 'BACKGROUND',
    category2: 'Texture',
    mainKeywords: item.keywords.slice(0, 3),
    secondaryKeywords: item.keywords.slice(3, 23),
    promptKeywords: item.description || item.title || 'Clean isolated commercial stock photo.',
    aiPlatformName: 'Midjourney',
    aiPlatformUrl: 'https://www.midjourney.com',
    uploadId: Math.floor(10000000 + Math.random() * 90000000).toString(),
  };

  const currentAiName =
    pngData.aiPlatformName ||
    (pngData.aiPlatformUrl?.includes('leonardo')
      ? 'Leonardo AI'
      : pngData.aiPlatformUrl?.includes('ideogram')
      ? 'Ideogram'
      : 'Midjourney');

  const updatePngData = (patch: Partial<PngPlatformData>) => {
    const updatedData: PngPlatformData = {
      ...pngData,
      ...patch,
    };

    onUpdate({
      ...item,
      pngData: updatedData,
    });
  };

  const copyField = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const copyAllSubmissionData = () => {
    const fullText = `Title: ${item.title}
Main Keywords (2-3): ${pngData.mainKeywords.join(', ')}
Secondary Keywords (${pngData.secondaryKeywords.length}/20): ${pngData.secondaryKeywords.join(', ')}
Keywords used to create the image: ${pngData.promptKeywords || item.description}
AI platform name: ${currentAiName}`;

    navigator.clipboard.writeText(fullText);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Main keywords string
  const mainKeywordsStr = pngData.mainKeywords.join(', ');
  const secondaryKeywordsStr = pngData.secondaryKeywords.join(', ');

  const handleMainKeywordsChange = (val: string) => {
    const arr = val.split(/[,;\n]+/).map((k) => k.trim()).filter(Boolean);
    updatePngData({ mainKeywords: arr.slice(0, 3) });
  };

  const handleSecondaryKeywordsChange = (val: string) => {
    const arr = val.split(/[,;\n]+/).map((k) => k.trim()).filter(Boolean);
    updatePngData({ secondaryKeywords: arr.slice(0, 20) });
  };

  const promptWordCount = (pngData.promptKeywords || item.description || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-5 text-slate-700 font-sans">
      {/* Top Header with One-Click Actions */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Selected Asset: <strong className="text-slate-800">{item.filename}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyAllSubmissionData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {copiedKey === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">All Copied!</span>
              </>
            ) : (
              <>
                <ClipboardCopy className="w-3.5 h-3.5" />
                <span>Copy All Fields</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onGenerateAI(item)}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Auto-Fill with AI'}</span>
          </button>
        </div>
      </div>

      {/* 1. Title Field - Sample Style */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-slate-800">
            Title
          </label>
          <button
            type="button"
            onClick={() => copyField(item.title, 'title')}
            className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
          >
            {copiedKey === 'title' ? (
              <span className="text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
          {item.title || 'No title generated yet'}
        </p>
      </div>

      {/* 2. Main keywords (2-3 keywords) - Sample Style Tag Chips */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[13px] text-slate-700">
            <span className="font-semibold text-slate-800">Main keywords</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-emerald-600 font-semibold ml-1">
              ({pngData.mainKeywords.length}/3)
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyField(mainKeywordsStr, 'main')}
            className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
          >
            {copiedKey === 'main' ? (
              <span className="text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        {/* Main keywords tag chips */}
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {pngData.mainKeywords.length > 0 ? (
            pngData.mainKeywords.map((k, i) => (
              <span
                key={`main-${k}-${i}`}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#e6f7ef] text-[#00875a] border border-[#a3e6cd] text-xs font-semibold select-none"
              >
                {k}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No main keywords</span>
          )}
        </div>
      </div>

      {/* 3. Secondary keywords (10-20 keywords) - Sample Style Tag Chips */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[13px] text-slate-700">
            <span className="font-semibold text-slate-800">Secondary keywords</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`text-xs font-semibold ml-1 ${
                pngData.secondaryKeywords.length >= 10 && pngData.secondaryKeywords.length <= 20
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {pngData.secondaryKeywords.length}/20
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyField(secondaryKeywordsStr, 'sec')}
            className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
          >
            {copiedKey === 'sec' ? (
              <span className="text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        {/* Secondary keywords tag chips */}
        <div className="flex flex-wrap gap-1.5 mt-0.5 max-h-36 overflow-y-auto pr-1">
          {pngData.secondaryKeywords.map((k, i) => (
            <span
              key={`sec-${k}-${i}`}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0] text-xs font-medium select-none"
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Keywords used to create the image (Short Min Description) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] text-slate-700">
            <span className="font-semibold text-slate-800">
              Keywords used to create the image
            </span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          <button
            type="button"
            onClick={() => copyField(pngData.promptKeywords || item.description, 'prompt')}
            className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 shrink-0 font-medium transition-colors cursor-pointer"
          >
            {copiedKey === 'prompt' ? (
              <span className="text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>
        <textarea
          rows={3}
          value={pngData.promptKeywords ?? item.description}
          onChange={(e) => updatePngData({ promptKeywords: e.target.value })}
          placeholder="Please enter the short description (10-15 words) used when creating images on the AI platform."
          className="w-full text-xs sm:text-[13px] px-3 py-2.5 rounded-md border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400 bg-white resize-none overflow-hidden leading-relaxed min-h-[76px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        />
      </div>

      {/* 5. AI platform name */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] text-slate-700">
            <span className="font-semibold text-slate-800">AI platform name</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <button
            type="button"
            onClick={() => copyField(currentAiName, 'aiName')}
            className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
          >
            {copiedKey === 'aiName' ? (
              <span className="text-emerald-600 font-semibold">Copied!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Name</span>
              </>
            )}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentAiName}
            onChange={(e) => updatePngData({ aiPlatformName: e.target.value })}
            placeholder="Please enter the name of the AI platform (e.g. Midjourney, Ideogram, Leonardo AI)"
            className="flex-1 text-xs sm:text-[13px] px-3 py-2.5 rounded-md border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400 bg-white"
          />
        </div>
        {/* Quick select AI platform name chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          <span className="text-[11px] text-slate-400">Quick Select:</span>
          {AI_PLATFORM_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => updatePngData({ aiPlatformName: name })}
              className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-colors ${
                currentAiName.toLowerCase() === name.toLowerCase()
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
