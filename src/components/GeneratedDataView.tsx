import React, { useState } from 'react';
import {
  Code2,
  Download,
  X,
  Edit2,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { StockFileItem, PlatformConfig, PngPlatformData } from '../types';

interface GeneratedDataViewProps {
  items: StockFileItem[];
  selectedId: string | null;
  platform: PlatformConfig;
  onSelectItem: (id: string) => void;
  onUpdateItem: (id: string, patch: Partial<StockFileItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onDownloadCsvAll: () => void;
  onDownloadCsvSingle: (item: StockFileItem) => void;
  onGenerateAI?: (id: string) => void;
  isGenerating?: boolean;
}

const AI_PLATFORM_OPTIONS = [
  'Midjourney',
  'Ideogram',
  'Leonardo AI',
  'Adobe Firefly',
  'DALL-E 3',
  'Stable Diffusion',
  'Flux.1',
];

export const GeneratedDataView: React.FC<GeneratedDataViewProps> = ({
  items,
  selectedId,
  platform,
  onSelectItem,
  onUpdateItem,
  onRemoveItem,
  onClearAll,
  onDownloadCsvAll,
  onDownloadCsvSingle,
  onGenerateAI,
  isGenerating = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'description' | 'keywords' | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('JPG / PNG');
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [embedSuccessMessage, setEmbedSuccessMessage] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedId) || items[0] || null;

  const isPngPlatform = platform.id === 'pngplatform';

  // Counts
  const uploadedCount = items.length;
  const pendingCount = items.filter((i) => i.status === 'idle' || i.status === 'generating').length;
  const successfulCount = items.filter((i) => i.status === 'ready' || i.keywords.length > 0).length;

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      // Fallback
    }
  };

  // Ensure pngData exists with smart fallbacks
  const getPngData = (item: StockFileItem): PngPlatformData => {
    if (item.pngData) {
      return item.pngData;
    }
    return {
      category1: 'ILLUSTRATION',
      category2: 'Nature',
      mainKeywords: item.keywords.slice(0, 3),
      secondaryKeywords: item.keywords.slice(3, 23),
      promptKeywords: item.description || item.title || '',
      aiPlatformName: 'Midjourney',
      aiPlatformUrl: 'https://www.midjourney.com',
      uploadId: '22263531',
    };
  };

  const currentPngData = selectedItem ? getPngData(selectedItem) : null;

  const handleUpdatePngData = (patch: Partial<PngPlatformData>) => {
    if (!selectedItem || !currentPngData) return;
    const updated: PngPlatformData = {
      ...currentPngData,
      ...patch,
    };
    onUpdateItem(selectedItem.id, { pngData: updated });
  };

  const handleStartEdit = (field: 'title' | 'description' | 'keywords') => {
    if (!selectedItem) return;
    if (field === 'title') setEditTitle(selectedItem.title);
    if (field === 'description') setEditDesc(selectedItem.description);
    setEditingField(field);
  };

  const handleSaveEdit = (field: 'title' | 'description') => {
    if (!selectedItem) return;
    if (field === 'title') {
      onUpdateItem(selectedItem.id, { title: editTitle.trim() });
    } else if (field === 'description') {
      onUpdateItem(selectedItem.id, { description: editDesc.trim() });
    }
    setEditingField(null);
  };

  const handleAddKeyword = () => {
    if (!selectedItem || !newKeyword.trim()) return;
    const clean = newKeyword.trim().toLowerCase();
    if (!selectedItem.keywords.includes(clean)) {
      onUpdateItem(selectedItem.id, {
        keywords: [...selectedItem.keywords, clean],
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    if (!selectedItem) return;
    onUpdateItem(selectedItem.id, {
      keywords: selectedItem.keywords.filter((k) => k !== kwToRemove),
    });
  };

  // Simulate Metadata Embedding (EXIF/IPTC) & file download
  const handleEmbedFile = (item: StockFileItem) => {
    const metadataInfo = `File: ${item.filename}
Title: ${item.title}
Description: ${item.description}
Keywords: ${item.keywords.join(', ')}`;

    const blob = new Blob([metadataInfo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.filename.replace(/\.[^/.]+$/, '')}_metadata.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setEmbedSuccessMessage(`Metadata embedded into ${item.filename}!`);
    setTimeout(() => setEmbedSuccessMessage(null), 3000);
  };

  const handleEmbedAll = () => {
    setEmbedSuccessMessage(`All ${items.length} files successfully embedded with metadata!`);
    setTimeout(() => setEmbedSuccessMessage(null), 3500);
  };

  if (!selectedItem && items.length === 0) {
    return null;
  }

  // Word count for PNG prompt
  const pngPromptWordCount = currentPngData
    ? (currentPngData.promptKeywords || selectedItem?.description || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* Top Bar (Exact layout from Screenshot 1) */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-slate-50/40">
        {/* Title & Status Counts */}
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Generated Data
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>
              Uploaded: <strong className="text-blue-600 font-bold">{uploadedCount}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Pending: <strong className="text-amber-600 font-bold">{pendingCount}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Successful: <strong className="text-emerald-600 font-bold">{successfulCount}</strong>
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* File Format Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-2xs transition-colors"
            >
              <span>File format</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isFormatMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs text-slate-700">
                {['JPG / PNG', 'EPS / Vector', 'TIFF / PSD', 'CSV Export'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(fmt);
                      setIsFormatMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>{fmt}</span>
                    {selectedFormat === fmt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Embed All Button */}
          <button
            type="button"
            onClick={handleEmbedAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e66f5] hover:bg-[#1855c9] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>Embed All</span>
            <Code2 className="w-3.5 h-3.5" />
          </button>

          {/* Download Csv All Button */}
          <button
            type="button"
            onClick={onDownloadCsvAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e66f5] hover:bg-[#1855c9] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>Download Csv All</span>
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Embedded Notification Banner */}
      {embedSuccessMessage && (
        <div className="bg-blue-50 border-b border-blue-100 px-5 py-2 text-xs font-semibold text-blue-700 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-blue-600" />
          <span>{embedSuccessMessage}</span>
        </div>
      )}

      {/* Main Split Body (Left: Image Preview, Right: Generated Metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Column: Image Preview - Vertically Centered in the middle of metadata */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white">
          <div className="my-auto flex flex-col items-center justify-center w-full">
            <div className="w-full flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-800 tracking-tight">
                Image Preview
              </h3>
              {selectedItem && (
                <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                  {selectedItem.filename}
                </span>
              )}
            </div>

            {/* High-res Image Preview - Centered in middle */}
            <div className="w-full aspect-4/3 max-h-[440px] rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-center p-4 shadow-xs overflow-hidden">
              {selectedItem?.previewUrl ? (
                <img
                  src={selectedItem.previewUrl}
                  alt={selectedItem.filename}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-xs hover:scale-102 transition-transform duration-200"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <p className="text-xs">No preview available</p>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Carousel if multiple items */}
          {items.length > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Uploaded Assets ({items.length})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedItem?.filename}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {items.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onSelectItem(it.id)}
                    className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      it.id === selectedItem?.id
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105'
                        : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={it.previewUrl}
                      alt={it.filename}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Generated Metadata */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div className="flex flex-col gap-5">
            {/* Header with Golden/Amber Title and Action Buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#e59b20] tracking-tight">
                  Generated Metadata
                </h3>
                {onGenerateAI && selectedItem && (
                  <button
                    type="button"
                    onClick={() => onGenerateAI(selectedItem.id)}
                    disabled={isGenerating}
                    title="Regenerate with AI"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium"
                  >
                    <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Embed File Button */}
                <button
                  type="button"
                  onClick={() => selectedItem && handleEmbedFile(selectedItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e66f5] hover:bg-[#1855c9] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <span>Embed File</span>
                  <Code2 className="w-3.5 h-3.5" />
                </button>

                {/* Download Csv Button */}
                <button
                  type="button"
                  onClick={() => selectedItem && onDownloadCsvSingle(selectedItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e66f5] hover:bg-[#1855c9] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <span>Download Csv</span>
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {selectedItem && (
              <>
                {/* ========================================================= */}
                {/* CASE A: PNG PLATFORM (PNG SUBMIT) - EXACT FORMAT FROM USER */}
                {/* ========================================================= */}
                {isPngPlatform ? (
                  <div className="flex flex-col gap-4">
                    {/* 1. Title - Sample Style (Clean text, no raw input box) */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[13px] font-semibold text-slate-800">
                            Title
                          </label>
                          <button
                            type="button"
                            onClick={() => handleStartEdit('title')}
                            title="Edit Title"
                            className="text-slate-400 hover:text-slate-600 transition-colors ml-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedItem.title, 'png_title')}
                          className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                        >
                          {copiedField === 'png_title' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {editingField === 'title' ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-xs sm:text-[13px] px-3 py-1.5 border border-emerald-500 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingField(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit('title')}
                              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-[13px] text-slate-800 font-medium leading-relaxed">
                          {selectedItem.title || 'No title generated yet'}
                        </p>
                      )}
                    </div>

                    {/* 2. Main keywords (2-3 keywords) - Sample Style Tag Chips (No raw input box) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[13px] text-slate-700">
                          <span className="font-semibold text-slate-800">Main keywords</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-emerald-600 font-semibold ml-1">
                            ({currentPngData?.mainKeywords?.length || 0}/3)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              (currentPngData?.mainKeywords || []).join(', '),
                              'png_main'
                            )
                          }
                          className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                        >
                          {copiedField === 'png_main' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Sample Style Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {currentPngData && currentPngData.mainKeywords.length > 0 ? (
                          currentPngData.mainKeywords.map((kw, i) => (
                            <span
                              key={`main-chip-${kw}-${i}`}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#e6f7ef] text-[#00875a] border border-[#a3e6cd] text-xs font-semibold select-none"
                            >
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No main keywords generated</span>
                        )}
                      </div>
                    </div>

                    {/* 3. Secondary keywords (10-20 keywords) - Sample Style Tag Chips Only (No raw input box) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[13px] text-slate-700">
                          <span className="font-semibold text-slate-800">Secondary keywords</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-emerald-600 font-semibold ml-1">
                            {currentPngData?.secondaryKeywords?.length || 0}/20
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              (currentPngData?.secondaryKeywords || []).join(', '),
                              'png_sec'
                            )
                          }
                          className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                        >
                          {copiedField === 'png_sec' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Secondary keywords tags - Sample style chips */}
                      {currentPngData && currentPngData.secondaryKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mt-0.5 max-h-36 overflow-y-auto pr-1">
                          {currentPngData.secondaryKeywords.map((kw, i) => (
                            <span
                              key={`sec-chip-${kw}-${i}`}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0] text-xs font-medium select-none"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No secondary keywords generated</span>
                      )}
                    </div>

                    {/* 4. Keywords used to create the image (Prompt / Description) */}
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
                          onClick={() =>
                            copyToClipboard(
                              currentPngData?.promptKeywords || selectedItem.description || '',
                              'png_prompt'
                            )
                          }
                          className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 shrink-0 font-medium transition-colors cursor-pointer"
                        >
                          {copiedField === 'png_prompt' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
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
                        value={currentPngData?.promptKeywords ?? selectedItem.description}
                        onChange={(e) => handleUpdatePngData({ promptKeywords: e.target.value })}
                        placeholder="Please enter the short description (10-15 words) used when creating images on the AI platform."
                        className="w-full text-xs sm:text-[13px] px-3 py-2.5 rounded-md border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400 bg-white resize-none overflow-hidden leading-relaxed min-h-[76px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      />
                    </div>

                    {/* 5. AI platform name & Quick Select Pills */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[13px] text-slate-700">
                          <span className="font-semibold text-slate-800">AI platform name</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              currentPngData?.aiPlatformName || 'Midjourney',
                              'png_ai'
                            )
                          }
                          className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                        >
                          {copiedField === 'png_ai' ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Name</span>
                            </>
                          )}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={currentPngData?.aiPlatformName || 'Midjourney'}
                        onChange={(e) => handleUpdatePngData({ aiPlatformName: e.target.value })}
                        className="w-full text-xs sm:text-[13px] px-3 py-2 rounded-md border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden text-slate-800 placeholder:text-slate-400 bg-white"
                      />

                      {/* Quick Select Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                        <span className="text-slate-400 font-normal text-xs mr-0.5">
                          Quick Select:
                        </span>
                        {AI_PLATFORM_OPTIONS.map((aiName) => {
                          const isSelected =
                            (currentPngData?.aiPlatformName || 'Midjourney') === aiName;
                          return (
                            <button
                              key={aiName}
                              type="button"
                              onClick={() => handleUpdatePngData({ aiPlatformName: aiName })}
                              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                                isSelected
                                  ? 'border border-emerald-500 text-emerald-800 bg-emerald-50 font-semibold shadow-2xs'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              {aiName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ========================================================= */
                  /* CASE B: ALL OTHER PLATFORMS (Adobe, Freepik, Shutterstock, etc.) */
                  /* STANDARD MICROSTOCK FORMAT (Screenshot 1 Layout)          */
                  /* ========================================================= */
                  <div className="flex flex-col gap-4">
                    {/* 1. Filename */}
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-[#e59b20]">
                        Filename:
                      </span>
                      <p className="text-sm text-slate-800 font-medium break-all">
                        {selectedItem.filename}
                      </p>
                    </div>

                    {/* 2. Title */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#e59b20]">
                          Title:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit('title')}
                            title="Edit Title"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedItem.title, 'title')}
                            title="Copy Title"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {copiedField === 'title' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {editingField === 'title' ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-sm px-3 py-1.5 border border-blue-400 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingField(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit('title')}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                          {selectedItem.title || 'No title generated yet'}
                        </p>
                      )}
                    </div>

                    {/* 3. Description */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#e59b20]">
                          Description:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit('description')}
                            title="Edit Description"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedItem.description, 'description')}
                            title="Copy Description"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {copiedField === 'description' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {editingField === 'description' ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={3}
                            className="w-full text-sm px-3 py-1.5 border border-blue-400 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
                            autoFocus
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingField(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit('description')}
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedItem.description || 'No description generated yet'}
                        </p>
                      )}
                    </div>

                    {/* 4. Keywords (Solid Rich Blue Pills matching Image 1) */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#e59b20]">
                            Keywords:
                          </span>
                          <span className="text-xs text-slate-400">
                            ({selectedItem.keywords.length})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit('keywords')}
                            title="Add Keyword"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(selectedItem.keywords.join(', '), 'keywords')
                            }
                            title="Copy All Keywords"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {copiedField === 'keywords' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Add Keyword Input if editing */}
                      {editingField === 'keywords' && (
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                            placeholder="Add new keyword..."
                            className="flex-1 text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddKeyword}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField(null)}
                            className="text-xs text-slate-500 hover:text-slate-700 px-1"
                          >
                            Done
                          </button>
                        </div>
                      )}

                      {/* Solid Blue Keyword Pills */}
                      <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1 py-1">
                        {selectedItem.keywords.length > 0 ? (
                          selectedItem.keywords.map((kw, idx) => (
                            <span
                              key={`${kw}-${idx}`}
                              className="inline-flex items-center gap-1.5 bg-[#1e66f5] hover:bg-[#1855c9] text-white text-xs font-medium px-3 py-1 rounded-full shadow-2xs transition-colors group select-none"
                            >
                              <span>{kw}</span>
                              {editingField === 'keywords' && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveKeyword(kw)}
                                  className="text-blue-200 hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            No keywords generated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
