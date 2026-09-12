import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  Zap,
  ExternalLink,
  X,
  Check,
  Key,
  Settings2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved?: (key: string, model: string) => void;
}

export const ProvidersModal: React.FC<ProvidersModalProps> = ({
  isOpen,
  onClose,
  onApiKeySaved,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'groq'>('gemini');
  
  // Gemini state
  const [geminiModel, setGeminiModel] = useState<string>('gemini-3.8-flash');
  const [geminiKey, setGeminiKey] = useState<string>('');
  
  // Groq state
  const [groqModel, setGroqModel] = useState<string>('llama-3.3-70b-versatile');
  const [groqKey, setGroqKey] = useState<string>('');

  const [showKey, setShowKey] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('user_gemini_api_key') || '';
    const savedGeminiModel = localStorage.getItem('user_gemini_model') || 'gemini-3.8-flash';
    const savedGroqKey = localStorage.getItem('user_groq_api_key') || '';
    const savedGroqModel = localStorage.getItem('user_groq_model') || 'llama-3.3-70b-versatile';

    setGeminiKey(savedGeminiKey);
    setGeminiModel(savedGeminiModel);
    setGroqKey(savedGroqKey);
    setGroqModel(savedGroqModel);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentApiKey = selectedProvider === 'gemini' ? geminiKey : groqKey;
  const currentModel = selectedProvider === 'gemini' ? geminiModel : groqModel;

  const handleSave = () => {
    if (selectedProvider === 'gemini') {
      localStorage.setItem('user_gemini_api_key', geminiKey.trim());
      localStorage.setItem('user_gemini_model', geminiModel);
      if (onApiKeySaved) {
        onApiKeySaved(geminiKey.trim(), geminiModel);
      }
    } else {
      localStorage.setItem('user_groq_api_key', groqKey.trim());
      localStorage.setItem('user_groq_model', groqModel);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearKey = () => {
    if (selectedProvider === 'gemini') {
      setGeminiKey('');
      localStorage.removeItem('user_gemini_api_key');
      if (onApiKeySaved) {
        onApiKeySaved('', geminiModel);
      }
    } else {
      setGroqKey('');
      localStorage.removeItem('user_groq_api_key');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f1217] border border-[#232936] rounded-2xl w-full max-w-3xl text-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Left Sidebar: Providers */}
        <div className="w-full md:w-60 bg-[#0a0d12] border-b md:border-b-0 md:border-r border-[#1f2633] p-4 sm:p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-400 font-mono text-[11px] font-bold tracking-widest uppercase">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>PROVIDERS</span>
            </div>

            <nav className="flex flex-col gap-1.5">
              {/* Google Gemini */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('gemini');
                  setShowKey(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedProvider === 'gemini'
                    ? 'bg-[#1a202c] text-white shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131822]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="flex-1">Google Gemini</span>
              </button>

              {/* Groq Cloud */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('groq');
                  setShowKey(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedProvider === 'groq'
                    ? 'bg-[#1a202c] text-white shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131822]'
                }`}
              >
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="flex-1">Groq Cloud</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#1f2633] mt-6">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Keys are stored locally in your browser.
            </p>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* Header with Title, Badge, Get Key & Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedProvider === 'gemini' ? 'Google Gemini' : 'Groq Cloud'}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-md bg-[#0d2b1d] text-[#4ade80] border border-[#22c55e]/30 uppercase">
                    {selectedProvider === 'gemini' ? 'FREE & PAID' : 'ULTRA FAST'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedProvider === 'gemini'
                    ? "Google's advanced AI model for text and images"
                    : 'Ultra-fast LPU inference engine for lightning speed'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={
                    selectedProvider === 'gemini'
                      ? 'https://aistudio.google.com/app/apikey'
                      : 'https://console.groq.com/keys'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get API Key</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODEL Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                <Settings2 className="w-3.5 h-3.5" />
                <span>MODEL</span>
              </div>

              {selectedProvider === 'gemini' ? (
                <>
                  <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="w-full bg-[#161a22] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (Fast & Smart - Recommended)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Creative Analysis)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</option>
                  </select>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>Supports image analysis</span>
                  </div>
                </>
              ) : (
                <>
                  <select
                    value={groqModel}
                    onChange={(e) => setGroqModel(e.target.value)}
                    className="w-full bg-[#161a22] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Recommended)</option>
                    <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Ultra-fast)</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B 32k</option>
                  </select>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span>High-throughput ultra-low latency inference</span>
                  </div>
                </>
              )}
            </div>

            {/* API KEY Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>API KEY</span>
                </div>
                {currentApiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="text-[11px] text-red-400 hover:text-red-300 font-normal lowercase cursor-pointer"
                  >
                    remove key
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={selectedProvider === 'gemini' ? geminiKey : groqKey}
                    onChange={(e) => {
                      if (selectedProvider === 'gemini') setGeminiKey(e.target.value);
                      else setGroqKey(e.target.value);
                    }}
                    placeholder={selectedProvider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
                    className="w-full bg-white text-slate-950 font-mono text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-10 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  title="Save API Key"
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-lg transition-colors shrink-0 cursor-pointer"
                >
                  {isSaved ? <Check className="w-5 h-5 text-emerald-400" /> : '+'}
                </button>
              </div>
              {isSaved && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> API key and model preference saved locally!
                </span>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

