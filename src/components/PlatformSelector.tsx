import React from 'react';
import { PlatformId, PlatformConfig } from '../types';
import { PngSubmitIcon } from './icons/PngSubmitIcon';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'pngplatform',
    name: 'Pngtree',
    shortName: 'Pngtree',
    badge: 'PNG',
    maxKeywords: 23,
    minKeywords: 12,
    maxTitleWords: 15,
    descriptionRequired: false,
    notes: 'Pngtree / Lovepik format: Category 1 & 2, Main (2-3), Secondary (10-20), AI Prompt & AI URL',
  },
  {
    id: 'freepik',
    name: 'Freepik',
    shortName: 'Freepik',
    badge: 'FR',
    maxKeywords: 50,
    minKeywords: 10,
    maxTitleWords: 15,
    descriptionRequired: false,
    notes: 'Prioritizes first 10 keywords. Title under 100 characters.',
  },
  {
    id: 'adobestock',
    name: 'Adobe Stock',
    shortName: 'St',
    badge: 'St',
    maxKeywords: 50,
    minKeywords: 15,
    maxTitleWords: 20,
    descriptionRequired: true,
    notes: 'First 5-10 keywords carry the highest algorithmic weight.',
  },
  {
    id: 'shutterstock',
    name: 'Shutterstock',
    shortName: 'SST',
    badge: '[ , ]',
    maxKeywords: 50,
    minKeywords: 15,
    maxTitleWords: 25,
    descriptionRequired: true,
    notes: 'Requires minimum 7 words in description. Exactly 50 max keywords.',
  },
  {
    id: 'vecteezy',
    name: 'Vecteezy',
    shortName: 'Vecteezy',
    badge: 'v',
    maxKeywords: 40,
    minKeywords: 10,
    maxTitleWords: 15,
    descriptionRequired: false,
    notes: 'Ideal for vector illustrations, EPS, and SVGs.',
  },
  {
    id: 'dreamstime',
    name: 'Dreamstime',
    shortName: 'Dreamstime',
    badge: 'd',
    maxKeywords: 50,
    minKeywords: 10,
    maxTitleWords: 18,
    descriptionRequired: true,
    notes: 'Accepts high-res photos and vector illustrations.',
  },
  {
    id: '123rf',
    name: '123RF',
    shortName: '123RF',
    badge: '123RF',
    maxKeywords: 50,
    minKeywords: 15,
    maxTitleWords: 15,
    descriptionRequired: false,
    notes: 'Fast indexing microstock marketplace.',
  },
  {
    id: 'depositphotos',
    name: 'Depositphotos',
    shortName: 'Deposit',
    badge: 'DP',
    maxKeywords: 50,
    minKeywords: 15,
    maxTitleWords: 20,
    descriptionRequired: true,
    notes: 'Strong global reach with multi-language search support.',
  },
];

interface PlatformSelectorProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (platformId: PlatformId) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onSelectPlatform,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-3">
        <span className="text-[13px] font-bold tracking-[0.08em] text-slate-900 uppercase">
          PLATFORMS
        </span>
      </div>

      {/* Platform Icons Row (Image 2 style) */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap px-2">
        {/* 1. PNG Platform / Pngtree - Graphical Vector Icon (No text) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('pngplatform')}
          title="Pngtree (Lovepik & PNG Marketplaces)"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'pngplatform'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <PngSubmitIcon className="w-6 h-6" />
        </button>

        {/* 2. Freepik (8-point asterisk star) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('freepik')}
          title="Freepik"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'freepik'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="5.64" y2="18.36" />
          </svg>
        </button>

        {/* 3. Adobe Stock ("St") */}
        <button
          type="button"
          onClick={() => onSelectPlatform('adobestock')}
          title="Adobe Stock"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'adobestock'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <span className="font-serif font-black text-xl leading-none tracking-tight text-white select-none">
            St
          </span>
        </button>

        {/* 4. Shutterstock (Camera viewfinder corners + center dot) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('shutterstock')}
          title="Shutterstock"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'shutterstock'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <div className="relative w-5 h-5 flex items-center justify-center text-white">
            {/* 4 corner brackets */}
            <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-white rounded-[1px]"></span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-white rounded-[1px]"></span>
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-white rounded-[1px]"></span>
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-white rounded-[1px]"></span>
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </div>
        </button>

        {/* 5. Vecteezy (fluid calligraphic italic "v") */}
        <button
          type="button"
          onClick={() => onSelectPlatform('vecteezy')}
          title="Vecteezy"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'vecteezy'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <span className="font-serif italic font-extrabold text-2xl leading-none text-white -mt-0.5 select-none">
            v
          </span>
        </button>

        {/* 6. Dreamstime (circle with "d") */}
        <button
          type="button"
          onClick={() => onSelectPlatform('dreamstime')}
          title="Dreamstime"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'dreamstime'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white">
            <span className="font-sans font-bold text-xs leading-none -mt-0.5">d</span>
          </div>
        </button>

        {/* 7. 123RF (bold 123RF logo text) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('123rf')}
          title="123RF"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === '123rf'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <span className="font-sans font-black text-[11px] text-white tracking-tighter leading-none select-none">
            123RF
          </span>
        </button>

        {/* 8. Depositphotos (concentric target / aperture circle) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('depositphotos')}
          title="Depositphotos"
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 shadow-xs ${
            selectedPlatform === 'depositphotos'
              ? 'bg-[#12161f] text-white ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white scale-105 shadow-md'
              : 'bg-[#12161f] text-slate-300 hover:text-white hover:scale-102 opacity-95 hover:opacity-100'
          }`}
        >
          <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Selected Platform Label & Guidelines Badge */}
      <div className="mt-2.5 flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
          Active: {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {PLATFORMS.find((p) => p.id === selectedPlatform)?.notes}
        </span>
      </div>

      {/* Subtle Horizontal Divider */}
      <div className="w-full max-w-2xl mt-5 border-b border-slate-200/80"></div>
    </div>
  );
};
