import React, { useState } from 'react';
import {
  PlatformId,
  PlatformConfig,
  MetadataCustomizationSettings,
  FeatureSettings,
  StockFileItem,
} from './types';
import { PLATFORMS, PlatformSelector } from './components/PlatformSelector';
import { UploadZone } from './components/UploadZone';
import { MetadataCustomization } from './components/MetadataCustomization';
import { SettingsToggles } from './components/SettingsToggles';
import { GeneratedDataView } from './components/GeneratedDataView';
import { ProvidersModal } from './components/ProvidersModal';
import { DEMO_STOCK_FILES } from './data/demoAssets';
import { extractFileMetadata } from './utils/exifExtractor';
import { generateStockCSV, downloadCSV } from './utils/csvExporter';
import { Sparkles, Image as ImageIcon, Key, Layers } from 'lucide-react';

const DEFAULT_CUSTOMIZATION: MetadataCustomizationSettings = {
  minTitleWords: 7,
  maxTitleWords: 15,
  minKeywords: 25,
  maxKeywords: 35,
  minDescriptionWords: 10,
  maxDescriptionWords: 20,
};

const DEFAULT_SETTINGS: FeatureSettings = {
  singleWordKeywords: false,
  whiteBackground: false,
  transparentBackground: false,
  silhouette: false,
  customPromptEnabled: false,
  customPrompt: '',
  prohibitedWordsEnabled: false,
  prohibitedWords: ['brand', 'logo', 'trademark'],
};

export default function App() {
  const [selectedPlatformId, setSelectedPlatformId] = useState<PlatformId>('pngplatform');
  const [customization, setCustomization] =
    useState<MetadataCustomizationSettings>(DEFAULT_CUSTOMIZATION);
  const [settings, setSettings] = useState<FeatureSettings>(DEFAULT_SETTINGS);

  // Pre-seed with demo assets so the user immediately sees the requested view (Image 1)
  const [files, setFiles] = useState<StockFileItem[]>(DEMO_STOCK_FILES);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(DEMO_STOCK_FILES[0].id);
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [generatingFileId, setGeneratingFileId] = useState<string | null>(null);
  const [isProvidersModalOpen, setIsProvidersModalOpen] = useState(false);

  const activePlatform: PlatformConfig =
    PLATFORMS.find((p) => p.id === selectedPlatformId) || PLATFORMS[0];

  const selectedFile = files.find((f) => f.id === selectedFileId) || files[0] || null;

  // Handle uploading files and extracting embedded EXIF/IPTC
  const handleFilesSelected = async (newFiles: File[]) => {
    setIsProcessingUploads(true);
    const newItems: StockFileItem[] = [];

    for (const file of newFiles) {
      const previewUrl = URL.createObjectURL(file);
      // Attempt client EXIF / IPTC extraction
      const extracted = await extractFileMetadata(file);

      const newItem: StockFileItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        dimensions: extracted.width && extracted.height ? { width: extracted.width, height: extracted.height } : undefined,
        status: extracted.title || (extracted.keywords && extracted.keywords.length > 0) ? 'ready' : 'idle',
        source: extracted.title || (extracted.keywords && extracted.keywords.length > 0) ? 'exif' : 'manual',
        title: extracted.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
        description: extracted.description || '',
        keywords: extracted.keywords || [],
        category: 'General',
      };

      newItems.push(newItem);
    }

    setFiles((prev) => [...prev, ...newItems]);
    if (!selectedFileId && newItems.length > 0) {
      setSelectedFileId(newItems[0].id);
    }
    setIsProcessingUploads(false);
  };

  // Load sample demo assets
  const handleLoadSampleFiles = () => {
    setFiles(DEMO_STOCK_FILES);
    setSelectedFileId(DEMO_STOCK_FILES[0].id);
  };

  // Convert image file or preview URL to base64 for Gemini vision
  const fileToBase64 = async (file?: File): Promise<string | null> => {
    if (!file) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Extract clean raster base64 from file or previewUrl so Gemini Vision can analyze image
  const getAssetBase64 = async (item: StockFileItem): Promise<{ base64: string | null; mimeType: string }> => {
    if (item.file) {
      const b64 = await fileToBase64(item.file);
      return { base64: b64, mimeType: item.file.type || 'image/jpeg' };
    }
    if (item.previewUrl) {
      if (item.previewUrl.startsWith('data:image/jpeg') || item.previewUrl.startsWith('data:image/png') || item.previewUrl.startsWith('data:image/webp')) {
        const mime = item.previewUrl.split(';')[0].replace('data:', '');
        return { base64: item.previewUrl, mimeType: mime };
      }
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          img.src = item.previewUrl;
        });
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width || 800, 1024);
        canvas.height = Math.min(img.height || 800, 1024);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          return { base64: canvas.toDataURL('image/jpeg', 0.88), mimeType: 'image/jpeg' };
        }
      } catch (e) {
        console.warn('Could not rasterize previewUrl to base64:', e);
      }
    }
    return { base64: null, mimeType: item.fileType || 'image/jpeg' };
  };

  // Call server-side API to generate AI metadata with Gemini
  const handleGenerateAI = async (item: StockFileItem) => {
    setGeneratingFileId(item.id);
    setFiles((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, status: 'generating' } : f))
    );

    try {
      const { base64: base64Data, mimeType } = await getAssetBase64(item);

      const customApiKey = localStorage.getItem('user_gemini_api_key') || '';
      const customModel = localStorage.getItem('user_gemini_model') || 'gemini-3.8-flash';

      const payload = {
        imageData: base64Data,
        mimeType: mimeType || item.fileType || 'image/jpeg',
        filename: item.filename,
        platform: activePlatform.name,
        minTitleWords: customization.minTitleWords,
        maxTitleWords: customization.maxTitleWords,
        minKeywords: customization.minKeywords,
        maxKeywords: customization.maxKeywords,
        minDescWords: customization.minDescriptionWords,
        maxDescWords: customization.maxDescriptionWords,
        singleWordKeywords: settings.singleWordKeywords,
        whiteBackground: settings.whiteBackground,
        transparentBackground: settings.transparentBackground,
        silhouette: settings.silhouette,
        customPrompt: settings.customPromptEnabled ? settings.customPrompt : '',
        prohibitedWords: settings.prohibitedWordsEnabled ? settings.prohibitedWords : [],
        customApiKey,
        customModel,
      };

      const res = await fetch('/api/generate-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { Authorization: `Bearer ${customApiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.metadata) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  title: data.metadata.title || f.title,
                  description: data.metadata.description || f.description,
                  keywords: data.metadata.keywords || f.keywords,
                  category: data.metadata.category || f.category,
                  status: 'ready',
                  source: 'gemini',
                  pngData: data.metadata.pngData || f.pngData,
                }
              : f
          )
        );
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (err: any) {
      console.error('Error generating AI metadata:', err);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, status: 'error', errorMessage: err?.message } : f
        )
      );
    } finally {
      setGeneratingFileId(null);
    }
  };

  // Generate for all files in queue sequentially
  const handleGenerateAll = async () => {
    setIsBatchGenerating(true);
    for (const item of files) {
      await handleGenerateAI(item);
    }
    setIsBatchGenerating(false);
  };

  // Export CSV in the active platform's specific microstock format
  const handleExportCSV = () => {
    if (files.length === 0) return;
    const csvContent = generateStockCSV(files, activePlatform.id);
    const dateStr = new Date().toISOString().slice(0, 10);
    const exportFilename = `${activePlatform.id}_metadata_${dateStr}.csv`;
    downloadCSV(csvContent, exportFilename);
  };

  // Export single item CSV
  const handleExportSingleCSV = (item: StockFileItem) => {
    const csvContent = generateStockCSV([item], activePlatform.id);
    const exportFilename = `${item.filename.replace(/\.[^/.]+$/, '')}_${activePlatform.id}.csv`;
    downloadCSV(csvContent, exportFilename);
  };

  // Update item in local state
  const handleUpdateItem = (updated: StockFileItem) => {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  // Patch update item
  const handlePatchItem = (id: string, patch: Partial<StockFileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (selectedFileId === id) {
        setSelectedFileId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setFiles([]);
    setSelectedFileId(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                Microstock Metadata Studio
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                AI Tagging & Metadata Customization for Stock Creators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Image 3: API Key Option Button */}
            <button
              type="button"
              onClick={() => setIsProvidersModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1217] hover:bg-[#1a202c] text-slate-100 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all shadow-xs"
              title="Configure AI Providers & API Key"
            >
              <Key className="w-3.5 h-3.5 text-orange-400" />
              <span>API Key</span>
            </button>

            {files.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                Export CSV All
              </button>
            )}

            <button
              type="button"
              onClick={handleLoadSampleFiles}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{files.length === 0 ? 'Load Demo Files' : 'Reload Demo'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Metadata Customization & Settings */}
          <aside className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
            <section aria-label="Metadata Customization">
              <MetadataCustomization
                settings={customization}
                onChange={setCustomization}
                onReset={() => setCustomization(DEFAULT_CUSTOMIZATION)}
              />
            </section>

            <section aria-label="Feature Settings">
              <SettingsToggles settings={settings} onChange={setSettings} />
            </section>
          </aside>

          {/* Right Column: Platform Selection, Upload & Extracted Data Views */}
          <section className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
            {/* Image 2: PLATFORMS Header & Platform Row */}
            <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <PlatformSelector
                selectedPlatform={selectedPlatformId}
                onSelectPlatform={setSelectedPlatformId}
              />

              {/* Upload Dropzone Card */}
              <div className="mt-6">
                <UploadZone
                  onFilesSelected={handleFilesSelected}
                  onLoadSampleFiles={handleLoadSampleFiles}
                  fileCount={files.length}
                  onGenerate={handleGenerateAll}
                  isGenerating={isBatchGenerating || !!generatingFileId}
                  isProcessing={isProcessingUploads}
                />
              </div>
            </div>

            {/* Generated Data View (Image Preview & Metadata) - Direct View */}
            {files.length > 0 && (
              <GeneratedDataView
                items={files}
                selectedId={selectedFile?.id || null}
                platform={activePlatform}
                onSelectItem={setSelectedFileId}
                onUpdateItem={handlePatchItem}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onDownloadCsvAll={handleExportCSV}
                onDownloadCsvSingle={handleExportSingleCSV}
                onGenerateAI={handleGenerateAI}
                isGenerating={generatingFileId === selectedFile?.id}
              />
            )}
          </section>
        </div>
      </main>

      {/* Image 3: Providers & API Key Modal */}
      <ProvidersModal
        isOpen={isProvidersModalOpen}
        onClose={() => setIsProvidersModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/70 py-4 px-6 text-center text-xs text-slate-400 mt-auto">
        <p>
          Microstock Metadata Studio • Compatible with Pngtree, Lovepik, Adobe Stock, Shutterstock, Freepik, Vecteezy, Dreamstime, 123RF, and Depositphotos.
        </p>
      </footer>
    </div>
  );
}
