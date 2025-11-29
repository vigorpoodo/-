import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  colorClass: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content, icon, colorClass }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${colorClass}`}>
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-serif-sc font-bold text-lg text-slate-800">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>已复制</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>复制提示词</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-slate-50">
        <p className="text-slate-600 text-sm leading-relaxed font-mono whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;