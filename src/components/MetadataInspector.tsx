import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Plus,
  X,
  ArrowUpDown,
  FileCheck,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  StockFileItem,
  PlatformConfig,
  MetadataCustomizationSettings,
  FeatureSettings,
} from '../types';

interface MetadataInspectorProps {
  item: StockFileItem;
  platform: PlatformConfig;
  customization: MetadataCustomizationSettings;
  settings: FeatureSettings;
  onUpdate: (updated: StockFileItem) => void;
  onGenerateAI: (item: StockFileItem) => Promise<void>;
  onDelete: (id: string) => void;
  isGenerating?: boolean;
}

export const MetadataInspector: React.FC<MetadataInspectorProps> = ({
  item,
  platform,
  customization,
  settings,
  onUpdate,
  onGenerateAI,
  onDelete,
  isGenerating = false,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 1800);
  };

  // Word count calculations
  const titleWordsCount = item.title.trim()
    ? item.title.trim().split(/\s+/).length
    : 0;
  const descWordsCount = item.description.trim()
    ? item.description.trim().split(/\s+/).length
    : 0;
  const keywordsCount = item.keywords.length;

  const isTitleWordCountValid =
    titleWordsCount >= customization.minTitleWords &&
    titleWordsCount <= customization.maxTitleWords;

  const isDescWordCountValid =
    descWordsCount >= customization.minDescriptionWords &&
    descWordsCount <= customization.maxDescriptionWords;

  const isKeywordsCountValid =
    keywordsCount >= customization.minKeywords &&
    keywordsCount <= customization.maxKeywords;

  // Keyword operations
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;

    // Handle comma-separated tag pasting
    const newTags = trimmed
      .split(/[,;\n]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && !item.keywords.map((k) => k.toLowerCase()).includes(t));

    if (newTags.length > 0) {
      onUpdate({
        ...item,
        keywords: [...item.keywords, ...newTags],
      });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedKeywords = item.keywords.filter((_, idx) => idx !== indexToRemove);
    onUpdate({ ...item, keywords: updatedKeywords });
  };

  const handleSortAlphabetical = () => {
    const sorted = [...item.keywords].sort((a, b) => a.localeCompare(b));
    onUpdate({ ...item, keywords: sorted });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-5">
      {/* Top Asset Meta Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
            <img
              src={item.previewUrl}
              alt={item.filename}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md" title={item.filename}>
              {item.filename}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{(item.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              {item.dimensions && (
                <>
                  <span>•</span>
                  <span>
                    {item.dimensions.width} × {item.dimensions.height} px
                  </span>
                </>
              )}
              <span>•</span>
              <span className="capitalize font-medium text-slate-500">
                Source: {item.source || 'Uploaded'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onGenerateAI(item)}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Analyzing...' : 'Generate AI'}</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Remove item"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform Checklist Pill */}
      <div className="flex items-center justify-between bg-slate-50/80 px-3.5 py-2 rounded-xl text-xs border border-slate-150">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span>Target Platform: {platform.name}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span
            className={`font-semibold flex items-center gap-1 ${
              isTitleWordCountValid ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            Title: {titleWordsCount} words ({customization.minTitleWords}–{customization.maxTitleWords})
          </span>
          <span
            className={`font-semibold flex items-center gap-1 ${
              isKeywordsCountValid ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            Keywords: {keywordsCount} tags ({customization.minKeywords}–{customization.maxKeywords})
          </span>
        </div>
      </div>

      {/* Title Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
            <span>Title</span>
            <span
              className={`text-[11px] font-normal px-2 py-0.5 rounded-full ${
                isTitleWordCountValid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {titleWordsCount} words (Target: {customization.minTitleWords}–{customization.maxTitleWords})
            </span>
          </label>
          <button
            type="button"
            onClick={() => copyToClipboard(item.title, 'title')}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            {copiedSection === 'title' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Title</span>
              </>
            )}
          </button>
        </div>
        <input
          type="text"
          value={item.title}
          onChange={(e) => onUpdate({ ...item, title: e.target.value })}
          placeholder="e.g. Modern creative workspace with laptop isolated on white background"
          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden text-slate-900 bg-white"
        />
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
            <span>Description</span>
            <span
              className={`text-[11px] font-normal px-2 py-0.5 rounded-full ${
                isDescWordCountValid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {descWordsCount} words (Target: {customization.minDescriptionWords}–{customization.maxDescriptionWords})
            </span>
          </label>
          <button
            type="button"
            onClick={() => copyToClipboard(item.description, 'description')}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            {copiedSection === 'description' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>
        <textarea
          value={item.description}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          rows={2}
          placeholder="Detailed commercial description..."
          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-hidden text-slate-900 bg-white resize-y"
        />
      </div>

      {/* Keywords Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Keywords
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isKeywordsCountValid
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {keywordsCount} keywords (Target: {customization.minKeywords}–{customization.maxKeywords})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSortAlphabetical}
              title="Sort Alphabetically"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-md"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>A-Z</span>
            </button>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(item.keywords.join(', '), 'keywords')
              }
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-medium bg-slate-100 px-2.5 py-1 rounded-md transition-colors"
            >
              {copiedSection === 'keywords' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Keywords</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add keywords (press enter or paste comma-separated)..."
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Keywords Cloud */}
        <div className="p-3 bg-slate-50/70 border border-slate-150 rounded-xl min-h-[90px] flex flex-wrap gap-1.5 items-start max-h-60 overflow-y-auto">
          {item.keywords.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              No keywords added yet. Click &quot;Generate AI&quot; or type above.
            </p>
          ) : (
            item.keywords.map((kw, idx) => {
              const isSingleWord = !kw.trim().includes(' ');
              const violatesSingleWord = settings.singleWordKeywords && !isSingleWord;

              return (
                <span
                  key={`${kw}-${idx}`}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    violatesSingleWord
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : idx < 10
                      ? 'bg-blue-50 text-blue-800 border border-blue-200/90 font-semibold'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                  title={
                    idx < 10
                      ? 'Top keyword (high algorithmic relevance)'
                      : violatesSingleWord
                      ? 'Violates Single Word Keywords setting'
                      : undefined
                  }
                >
                  <span className="text-[10px] text-slate-400 mr-0.5">{idx + 1}</span>
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-slate-400 hover:text-slate-700 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
