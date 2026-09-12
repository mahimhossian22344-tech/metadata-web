import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { FeatureSettings } from '../types';

interface SettingsTogglesProps {
  settings: FeatureSettings;
  onChange: (newSettings: FeatureSettings) => void;
}

export const SettingsToggles: React.FC<SettingsTogglesProps> = ({
  settings,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newProhibitedWord, setNewProhibitedWord] = useState('');

  const toggle = (key: keyof FeatureSettings) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleAddProhibitedWord = () => {
    const trimmed = newProhibitedWord.trim().toLowerCase();
    if (trimmed && !settings.prohibitedWords.includes(trimmed)) {
      onChange({
        ...settings,
        prohibitedWords: [...settings.prohibitedWords, trimmed],
      });
      setNewProhibitedWord('');
    }
  };

  const handleRemoveProhibitedWord = (word: string) => {
    onChange({
      ...settings,
      prohibitedWords: settings.prohibitedWords.filter((w) => w !== word),
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-800">
          <Settings className="w-4 h-4 text-slate-600 stroke-[2.2]" />
          <span className="text-[13px] font-bold tracking-[0.06em] uppercase">
            SETTINGS
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 flex flex-col divide-y divide-slate-100">
          {/* 1. SINGLE WORD KEYWORDS */}
          <div className="py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              SINGLE WORD KEYWORDS
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.singleWordKeywords}
              onClick={() => toggle('singleWordKeywords')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.singleWordKeywords ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  settings.singleWordKeywords ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 2. WHITE BACKGROUND */}
          <div className="py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              WHITE BACKGROUND
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.whiteBackground}
              onClick={() => toggle('whiteBackground')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.whiteBackground ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  settings.whiteBackground ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 3. TRANSPARENT BACKGROUND */}
          <div className="py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              TRANSPARENT BACKGROUND
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.transparentBackground}
              onClick={() => toggle('transparentBackground')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.transparentBackground ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  settings.transparentBackground ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 4. SILHOUETTE */}
          <div className="py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 tracking-wide">
              SILHOUETTE
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.silhouette}
              onClick={() => toggle('silhouette')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.silhouette ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                  settings.silhouette ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 5. CUSTOM PROMPT */}
          <div className="py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                CUSTOM PROMPT
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.customPromptEnabled}
                onClick={() => toggle('customPromptEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.customPromptEnabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    settings.customPromptEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            {settings.customPromptEnabled && (
              <div className="mt-1">
                <textarea
                  value={settings.customPrompt}
                  onChange={(e) =>
                    onChange({ ...settings, customPrompt: e.target.value })
                  }
                  placeholder="e.g. Focus on modern corporate technology, include lighting and camera angle tags..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          {/* 6. PROHIBITED WORDS */}
          <div className="pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                PROHIBITED WORDS
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.prohibitedWordsEnabled}
                onClick={() => toggle('prohibitedWordsEnabled')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.prohibitedWordsEnabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ${
                    settings.prohibitedWordsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {settings.prohibitedWordsEnabled && (
              <div className="mt-1 flex flex-col gap-2">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newProhibitedWord}
                    onChange={(e) => setNewProhibitedWord(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProhibitedWord();
                      }
                    }}
                    placeholder="Add banned word (e.g. apple, nike)..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddProhibitedWord}
                    className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {settings.prohibitedWords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {settings.prohibitedWords.map((word) => (
                      <span
                        key={word}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100 text-[11px] font-medium"
                      >
                        {word}
                        <button
                          type="button"
                          onClick={() => handleRemoveProhibitedWord(word)}
                          className="hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
