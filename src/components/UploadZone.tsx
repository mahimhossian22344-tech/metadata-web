import React, { useRef, useState } from 'react';
import { Upload, Layers, Sparkles, Plus } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  onLoadSampleFiles: () => void;
  fileCount?: number;
  onGenerate?: () => void;
  isGenerating?: boolean;
  isProcessing?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  onLoadSampleFiles,
  fileCount = 0,
  onGenerate,
  isGenerating = false,
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      // Reset input so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const displayCount = fileCount > 0 ? fileCount : 1;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.eps,.ai,.svg,video/*"
        onChange={handleFileInputChange}
        className="hidden"
        id="metadata-file-uploader"
      />

      {/* Main Upload Card */}
      <div
        id="upload-dropzone-card"
        onClick={handleCardClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        className={`w-full max-w-xl cursor-pointer select-none rounded-[28px] bg-white transition-all duration-200 border text-center p-8 sm:p-12 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/30 ring-4 ring-blue-100 scale-[1.01]'
            : 'border-slate-100/90 shadow-[0_12px_40px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_48px_rgb(0,0,0,0.06)] hover:border-slate-200'
        }`}
      >
        {/* Upload Icon Box */}
        <div className="w-14 h-14 bg-blue-50/90 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-105">
          <Upload className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Batch Limit Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50/90 border border-slate-100 text-slate-500 text-[11px] font-semibold tracking-wider rounded-full mb-4">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>BATCH LIMIT: 500 FILES</span>
        </div>

        {/* Main Text */}
        <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 leading-snug">
          Drag and drop files to extract metadata
        </h3>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm mt-1 mb-5">
          or click to browse files
        </p>

        {/* Supported Formats Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-slate-100/80 text-slate-600 text-[11px] font-medium rounded-full">
            JPG/PNG/WEBP
          </span>
          <span className="px-3 py-1 bg-slate-100/80 text-slate-600 text-[11px] font-medium rounded-full">
            EPS/AI/SVG
          </span>
          <span className="px-3 py-1 bg-slate-100/80 text-slate-600 text-[11px] font-medium rounded-full">
            VIDEOS
          </span>
        </div>

        {isProcessing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
            <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
            <span>Extracting EXIF & IPTC metadata...</span>
          </div>
        )}
      </div>

      {/* Floating Generate split button matching user screenshot (✨ Generate | +) */}
      <div className="mt-5 flex flex-col items-center relative z-10">
        <div className="inline-flex items-stretch rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all">
          <button
            type="button"
            id="generate-images-primary-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onGenerate) {
                onGenerate();
              } else {
                onLoadSampleFiles();
              }
            }}
            disabled={isGenerating}
            className="flex items-center gap-2 pl-6 pr-4 py-2.5 sm:py-3 text-sm font-semibold hover:bg-white/10 rounded-l-full transition-colors cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>

          <div className="w-[1px] bg-white/25 self-stretch my-2" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-3.5 flex items-center justify-center hover:bg-white/10 rounded-r-full transition-colors cursor-pointer"
            title="Add more files"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
