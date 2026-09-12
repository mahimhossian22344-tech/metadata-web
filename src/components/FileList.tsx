import React from 'react';
import {
  Download,
  Sparkles,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { StockFileItem, PlatformConfig } from '../types';

interface FileListProps {
  items: StockFileItem[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onGenerateAll: () => Promise<void>;
  onExportCSV: () => void;
  onClearAll: () => void;
  isBatchGenerating: boolean;
  platform: PlatformConfig;
}

export const FileList: React.FC<FileListProps> = ({
  items,
  selectedId,
  onSelectItem,
  onRemoveItem,
  onGenerateAll,
  onExportCSV,
  onClearAll,
  isBatchGenerating,
  platform,
}) => {
  if (items.length === 0) {
    return null;
  }

  const readyCount = items.filter((i) => i.keywords.length > 0).length;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-3">
      {/* Batch Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-900">
            Batch Queue ({items.length} files)
          </span>
          <span className="text-xs text-slate-400">
            • {readyCount} completed
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Generate All Button */}
          <button
            type="button"
            onClick={onGenerateAll}
            disabled={isBatchGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBatchGenerating ? 'Processing...' : 'Generate All AI'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export {platform.name} CSV</span>
          </button>

          {/* Clear All */}
          <button
            type="button"
            onClick={onClearAll}
            title="Clear Queue"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items Scrollable List */}
      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-400'
                  : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100/60 hover:border-slate-200'
              }`}
            >
              {/* Left thumbnail & title */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img
                    src={item.previewUrl}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                    {item.title || item.filename}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.keywords.length} keywords • {(item.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {/* Status and remove */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {item.status === 'generating' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                    <span className="animate-spin w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full" />
                    AI Generating
                  </span>
                ) : item.status === 'error' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3 h-3" />
                    Error
                  </span>
                ) : item.keywords.length > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    Idle
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="text-slate-300 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
