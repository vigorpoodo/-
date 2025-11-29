export interface TagOption {
  id: string;
  label: string; // The text shown to user (e.g., "烟雨江南")
  value: string; // The prompt value (e.g., "misty jiangnan scenery, rain")
  category: string;
}

export interface GeneratedResult {
  imagePrompt: string;
  videoPrompt: string;
  explanation: string; // Short explanation of the scene design
  suggestedTags: TagOption[];
}

export interface TagCategory {
  name: string;
  tags: TagOption[];
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';
