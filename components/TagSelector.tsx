import React from 'react';
import { TagOption, TagCategory } from '../types';

interface TagSelectorProps {
  suggestedTags: TagOption[];
  selectedTags: TagOption[];
  onToggleTag: (tag: TagOption) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ suggestedTags, selectedTags, onToggleTag }) => {
  // Group tags by category
  const categories: TagCategory[] = React.useMemo(() => {
    const groups: { [key: string]: TagOption[] } = {};
    suggestedTags.forEach(tag => {
      if (!groups[tag.category]) {
        groups[tag.category] = [];
      }
      groups[tag.category].push(tag);
    });
    return Object.entries(groups).map(([name, tags]) => ({ name, tags }));
  }, [suggestedTags]);

  if (suggestedTags.length === 0) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">AI 推荐优化标签</h3>
      </div>
      
      <div className="bg-white/50 border border-slate-200 rounded-xl p-4 shadow-sm">
        {categories.map((category) => (
          <div key={category.name} className="mb-4 last:mb-0">
            <h4 className="text-xs font-bold text-slate-500 mb-2">{category.name}</h4>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => {
                const isSelected = selectedTags.some(t => t.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => onToggleTag(tag)}
                    className={`
                      px-3 py-1.5 text-sm rounded-full transition-all duration-200 border
                      ${isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }
                    `}
                  >
                    {tag.label}
                    {isSelected && <span className="ml-1 opacity-70">×</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;