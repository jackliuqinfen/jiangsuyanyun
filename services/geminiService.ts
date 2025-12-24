import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}

export const geminiService = {
  /**
   * Performs a grounded search using Gemini 3 Flash to get latest industry info.
   */
  searchIndustryNews: async (query: string): Promise<SearchResult> => {
    if (!apiKey) {
      return {
        text: "API Key not configured. Unable to fetch live data.",
        sources: []
      };
    }

    try {
      const model = 'gemini-3-flash-preview';
      const response = await ai.models.generateContent({
        model,
        contents: `Find the latest official construction industry news, bidding announcements, or policy changes in Jiangsu Province related to: ${query}. Summarize the key points clearly for a professional audience.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "No results found.";
      
      // Extract grounding metadata safely
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web && chunk.web.uri)
        .map((chunk: any) => ({
          uri: chunk.web.uri,
          title: chunk.web.title || "Source Link"
        }));

      // Deduplicate sources based on URI
      const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values());

      return {
        text,
        sources: uniqueSources as { uri: string; title: string }[]
      };

    } catch (error) {
      console.error("Gemini Search Error:", error);
      return {
        text: "An error occurred while searching for industry news. Please try again later.",
        sources: []
      };
    }
  }
};
