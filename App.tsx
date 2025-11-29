import React, { useState, useCallback } from 'react';
import { generateGufengPrompts } from './services/geminiService';
import { GeneratedResult, TagOption, GenerationStatus } from './types';
import TagSelector from './components/TagSelector';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus('loading');
    setError(null);

    try {
      const data = await generateGufengPrompts(inputText, selectedTags);
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || '生成失败，请重试');
      setStatus('error');
    }
  }, [inputText, selectedTags]);

  const handleToggleTag = (tag: TagOption) => {
    setSelectedTags(prev => {
      const exists = prev.find(t => t.id === tag.id);
      if (exists) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setSelectedTags([]);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      
      {/* Header / Hero */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-90">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-serif-sc font-bold text-2xl">墨</span>
            </div>
            <div>
              <h1 className="text-xl font-serif-sc font-bold text-slate-900 tracking-wide">墨影提示词</h1>
              <p className="text-xs text-slate-500">古风短剧 AI 创作助手</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium border border-indigo-100">
              Gemini 2.5 Flash Powered
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Main Input Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <label htmlFor="scene-input" className="block text-sm font-medium text-slate-700 mb-2 font-serif-sc">
              场景描述
            </label>
            <textarea
              id="scene-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例如：一位身穿红衣的女侠客，站在竹林中，手中握着长剑，眼神凌厉，周围有落叶飘过..."
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none text-slate-700 text-lg transition-all shadow-inner bg-slate-50"
            />
            
            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {tag.label}
                    <button onClick={() => handleToggleTag(tag)} className="ml-1.5 hover:text-indigo-900 focus:outline-none">
                      ×
                    </button>
                  </span>
                ))}
                <button 
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-slate-400 hover:text-slate-600 underline ml-2"
                >
                  清空标签
                </button>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handleClear}
                className="text-slate-500 hover:text-slate-700 px-4 py-2 text-sm font-medium transition-colors"
              >
                重置
              </button>
              <button
                onClick={handleGenerate}
                disabled={status === 'loading' || !inputText.trim()}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform
                  ${status === 'loading' || !inputText.trim()
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-indigo-900 hover:bg-indigo-800 hover:scale-105 active:scale-95 shadow-indigo-200'
                  }
                `}
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    生成提示词
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            
            {/* Suggested Tags Column */}
            <div className="lg:col-span-1 order-2 lg:order-1">
               <TagSelector 
                  suggestedTags={result.suggestedTags} 
                  selectedTags={selectedTags} 
                  onToggleTag={handleToggleTag} 
               />
               <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 text-sm">
                  <p className="font-bold mb-1">💡 创作思路</p>
                  <p className="opacity-80">{result.explanation}</p>
               </div>
            </div>

            {/* Prompts Column */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              <ResultCard 
                title="画面提示词 (Image Prompt)" 
                content={result.imagePrompt} 
                colorClass="border-indigo-100"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <ResultCard 
                title="视频生成提示词 (Video Prompt)" 
                content={result.videoPrompt} 
                colorClass="border-rose-100"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

          </div>
        )}

        {status === 'idle' && !result && (
          <div className="text-center py-20 opacity-50">
            <div className="inline-block p-4 rounded-full bg-slate-200 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
               </svg>
            </div>
            <p className="text-slate-500 font-serif-sc text-lg">输入描述，开始创作您的古风世界</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;