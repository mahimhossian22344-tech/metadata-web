export type PlatformId =
  | 'pngplatform'
  | 'adobestock'
  | 'freepik'
  | 'shutterstock'
  | 'vecteezy'
  | 'dreamstime'
  | '123rf'
  | 'depositphotos';

export interface PngPlatformData {
  category1: string;
  category2: string;
  mainKeywords: string[]; // 2-3 keywords
  secondaryKeywords: string[]; // 10-20 keywords
  promptKeywords: string; // keywords used to create image (short min description)
  aiPlatformName: string; // e.g. Midjourney, Ideogram, Leonardo AI
  aiPlatformUrl?: string;
  uploadId?: string;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  badge: string;
  maxKeywords: number;
  minKeywords: number;
  maxTitleWords: number;
  descriptionRequired: boolean;
  notes: string;
}

export interface MetadataCustomizationSettings {
  minTitleWords: number;
  maxTitleWords: number;
  minKeywords: number;
  maxKeywords: number;
  minDescriptionWords: number;
  maxDescriptionWords: number;
}

export interface FeatureSettings {
  singleWordKeywords: boolean;
  whiteBackground: boolean;
  transparentBackground: boolean;
  silhouette: boolean;
  customPromptEnabled: boolean;
  customPrompt: string;
  prohibitedWordsEnabled: boolean;
  prohibitedWords: string[];
}

export interface StockFileItem {
  id: string;
  file?: File;
  previewUrl: string;
  filename: string;
  fileSize: number;
  fileType: string;
  dimensions?: { width: number; height: number };
  status: 'idle' | 'extracting' | 'generating' | 'ready' | 'error';
  errorMessage?: string;
  title: string;
  description: string;
  keywords: string[];
  category?: string;
  source?: 'exif' | 'gemini' | 'manual' | 'sample';
  pngData?: PngPlatformData;
}
