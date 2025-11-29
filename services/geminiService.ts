import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { GeneratedResult, TagOption } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Define the response schema for structured output
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    imagePrompt: {
      type: Type.STRING,
      description: "Detailed prompt for image generation. Must provide BOTH English and Chinese versions. Format:\n[English Prompt]\n\n[Chinese Translation]",
    },
    videoPrompt: {
      type: Type.STRING,
      description: "Prompt for video generation. Must provide BOTH English and Chinese versions. Format:\n[English Prompt]\n\n[Chinese Translation]",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief explanation in Chinese of how this prompt captures the Gufeng aesthetic.",
    },
    suggestedTags: {
      type: Type.ARRAY,
      description: "A list of suggested modification tags categorized by type (e.g. Lighting, Camera, Atmosphere).",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Display label in Chinese (e.g. '侧逆光')" },
          value: { type: Type.STRING, description: "Prompt keyword in English (e.g. 'rim lighting')" },
          category: { type: Type.STRING, description: "Category in Chinese (e.g. '光影')" }
        },
        required: ["label", "value", "category"]
      }
    }
  },
  required: ["imagePrompt", "videoPrompt", "explanation", "suggestedTags"],
};

export const generateGufengPrompts = async (
  userInput: string,
  selectedTags: TagOption[]
): Promise<GeneratedResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Construct context from selected tags
  const tagContext = selectedTags.length > 0 
    ? `用户已选择的附加风格/元素: ${selectedTags.map(t => `${t.category}:${t.value}`).join(', ')}`
    : "无附加选项";

  const prompt = `
    你是一位顶级的中国古风（Gufeng/Xianxia）影视视觉导演和提示词工程师。
    你的任务是根据用户的简单描述，生成适用于顶级AI绘图工具（如Midjourney v6, Stable Diffusion XL）和AI视频工具（如Runway Gen-2, Pika）的专业提示词。
    
    用户描述: "${userInput}"
    ${tagContext}

    请遵循以下原则：
    1. **审美风格**: 中国古典美学，构图讲究留白或深邃，光影要有电影质感（Cinematic lighting），服饰需符合历史或仙侠设定（Hanfu, intricate embroidery）。
    2. **画面提示词 (Image Prompt)**: 必须包含中英文双语。首先提供英文Prompt（Midjourney/SD格式），包含主体描述、环境细节、光影、色彩色调、镜头参数（如 85mm lens, f/1.8, bokeh）、胶片质感（Kodak Portra, film grain）以及画质词（8k, masterpiece, ultra-detailed）。然后换行提供中文翻译。
    3. **视频提示词 (Video Prompt)**: 必须包含中英文双语。首先提供英文Prompt（Runway/Pika格式），专注于动态描述（如 slow motion, camera pan right, wind blowing hair, petals falling）。然后换行提供中文翻译。
    4. **推荐标签 (Tags)**: 根据当前场景，联想出5-8个可以进一步优化画面的选项。例如：如果场景是悲伤的，推荐“雨天(Rainy)”、“冷色调(Cool tone)”；如果是打斗，推荐“动态模糊(Motion blur)”、“低角度(Low angle)”。

    请以JSON格式返回。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const parsedData = JSON.parse(jsonText);
    
    // Map the raw JSON to our TypeScript interface strictly
    const result: GeneratedResult = {
      imagePrompt: parsedData.imagePrompt,
      videoPrompt: parsedData.videoPrompt,
      explanation: parsedData.explanation,
      suggestedTags: parsedData.suggestedTags.map((tag: any, index: number) => ({
        id: `gen-tag-${index}-${Date.now()}`,
        label: tag.label,
        value: tag.value,
        category: tag.category
      }))
    };

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate prompts. Please try again.");
  }
};