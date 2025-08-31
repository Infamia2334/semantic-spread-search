import { GoogleGenAI } from '@google/genai';
import { createSearchPrompt, formatContextForLLM } from '../utils/formatter.ts';
import type { ISheetContext } from '../dto/llm.dto.ts';

export default class LLMService {
    private ai: GoogleGenAI;

    constructor (apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

 async generateSemanticSearch(sheetsContext: ISheetContext[], searchQuery: string): Promise<any> {
        const formattedContext = formatContextForLLM(sheetsContext);
        const searchPrompt = createSearchPrompt(formattedContext, searchQuery);

        try {
            const result = await this.ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: searchPrompt,
            });
            
            if (!result) {
                throw new Error(`Error Generating AI result, please retry`);
            }

            const rawText = result.text as string;

            if (!rawText) {
                return null;
            }
            
            let jsonString = rawText;
            const markdownMatch = rawText.match(/```(json)?\s*([\s\S]*?)\s*```/);
            if (markdownMatch && markdownMatch[2]) {
                jsonString = markdownMatch[2];
            }

            const sanitizedString = jsonString.replace(/\u00A0/g, ' ').trim();

            return JSON.parse(sanitizedString);
        } catch (error) {
            console.error("Error generating or parsing LLM response:", error);
            throw new Error("Failed to get a valid response from the AI model.");
        }
    }
}