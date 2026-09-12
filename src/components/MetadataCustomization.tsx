import React from 'react';
import { RotateCcw } from 'lucide-react';
import { MetadataCustomizationSettings } from '../types';

interface MetadataCustomizationProps {
  settings: MetadataCustomizationSettings;
  onChange: (newSettings: MetadataCustomizationSettings) => void;
  onReset: () => void;
}

export const MetadataCustomization: React.FC<MetadataCustomizationProps> = ({
  settings,
  onChange,
  onReset,
}) => {
  const updateSetting = (key: keyof MetadataCustomizationSettings, value: number) => {
    const updated = { ...settings, [key]: value };

    // Keep min <= max
    if (key === 'minTitleWords' && value > updated.maxTitleWords) {
      updated.maxTitleWords = value;
    } else if (key === 'maxTitleWords' && value < updated.minTitleWords) {
      updated.minTitleWords = value;
    } else if (key === 'minKeywords' && value > updated.maxKeywords) {
      updated.maxKeywords = value;
    } else if (key === 'maxKeywords' && value < updated.minKeywords) {
      updated.minKeywords = value;
    } else if (key === 'minDescriptionWords' && value > updated.maxDescriptionWords) {
      updated.maxDescriptionWords = value;
    } else if (key === 'maxDescriptionWords' && value < updated.minDescriptionWords) {
      updated.minDescriptionWords = value;
    }

    onChange(updated);
  };

  const sliderItems = [
    {
      id: 'min-title-words',
      label: 'Min Title Words',
      value: settings.minTitleWords,
      unit: 'words',
      min: 3,
      max: 20,
      step: 1,
      onChange: (val: number) => updateSetting('minTitleWords', val),
    },
    {
      id: 'max-title-words',
      label: 'Max Title Words',
      value: settings.maxTitleWords,
      unit: 'words',
      min: 5,
      max: 30,
      step: 1,
      onChange: (val: number) => updateSetting('maxTitleWords', val),
    },
    {
      id: 'min-keywords',
      label: 'Min Keywords',
      value: settings.minKeywords,
      unit: 'keywords',
      min: 5,
      max: 40,
      step: 1,
      onChange: (val: number) => updateSetting('minKeywords', val),
    },
    {
      id: 'max-keywords',
      label: 'Max Keywords',
      value: settings.maxKeywords,
      unit: 'keywords',
      min: 15,
      max: 50,
      step: 1,
      onChange: (val: number) => updateSetting('maxKeywords', val),
    },
    {
      id: 'min-description-words',
      label: 'Min Description Words',
      value: settings.minDescriptionWords,
      unit: 'words',
      min: 5,
      max: 30,
      step: 1,
      onChange: (val: number) => updateSetting('minDescriptionWords', val),
    },
    {
      id: 'max-description-words',
      label: 'Max Description Words',
      value: settings.maxDescriptionWords,
      unit: 'words',
      min: 10,
      max: 50,
      step: 1,
      onChange: (val: number) => updateSetting('maxDescriptionWords', val),
    },
  ];

  return (
    <div className="w-full">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Metadata Customization
        </h2>
        <button
          type="button"
          onClick={onReset}
          title="Reset to defaults"
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Sliders Container */}
      <div className="flex flex-col gap-2.5">
        {sliderItems.map((item) => {
          // Calculate percentage for custom track fill
          const percentage = ((item.value - item.min) / (item.max - item.min)) * 100;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-150 p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-xs"
            >
              {/* Label & Value */}
              <div className="flex items-center justify-between text-[13px] mb-2 font-medium">
                <span className="text-slate-800">{item.label}</span>
                <span className="text-slate-500 font-normal">
                  {item.value} {item.unit}
                </span>
              </div>

              {/* Slider Track with fill */}
              <div className="relative flex items-center w-full h-4">
                <input
                  id={item.id}
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={item.value}
                  onChange={(e) => item.onChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-hidden"
                  style={{
                    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
