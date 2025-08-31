import type { ISheetContext } from "../dto/llm.dto.ts";

export function formatContextForLLM(sheetContexts: ISheetContext[]) {
    let markdownString = "Here is the content of the spreadsheet:\n\n";

    for (const sheet of sheetContexts) {
        markdownString += `## Sheet: "${sheet.sheetName}"\n\n`;
        if (sheet.summary) {
            markdownString += `**Summary:** ${sheet.summary}\n\n`;
        }
        if (sheet.headers && sheet.headers.length > 0) {
            markdownString += `**Headers:** ${sheet.headers.join(', ')}\n\n`;
        }

        markdownString += `### Data:\n`;

        sheet.data.forEach(cellData => {
            if (cellData.value || cellData.formula) {
                markdownString += `- **Cell:** ${cellData.cell}\n`;
                if (cellData.value) {
                    markdownString += `  - **Value:** ${cellData.value}\n`;
                }
                if (cellData.formula) {
                    markdownString += `  - **Formula:** ${cellData.formula}\n`;
                }
            }
        });

        markdownString += "\n---\n\n";
    }

    return markdownString;
}

export function createSearchPrompt (formattedContext: string, userQuery: string) {
    const promptTemplate = `
    
    // 1. ROLE & PERSONA
    You are an expert financial analyst AI assistant. You are meticulous, accurate, and have a deep understanding of business concepts, financial statements, and spreadsheet logic. Your sole purpose is to analyze the provided spreadsheet context and answer a user's query about it.

    // 2. CONTEXT INJECTION
    Here is the complete context of a spreadsheet, formatted in Markdown. The data includes sheet names, summaries, headers, and the contents of each relevant cell, including its value and formula.

    --- SPREADSHEET CONTEXT START ---
    ${formattedContext}
    --- SPREADSHEET CONTEXT END ---

    // 3. THE USER'S QUERY
    Here is the user's question about the spreadsheet:

    --- USER QUESTION START ---
    "${userQuery}"
    --- USER QUESTION END ---

    // 4. THE CORE TASK & CHAIN-OF-THOUGHT INSTRUCTIONS
    Your task is to act as a semantic search engine. Follow these steps carefully:
    Step 1: Analyze the user's query to understand their core intent. Are they looking for a specific metric, a comparison, a trend, or a cost breakdown?
    Step 2: Scan the entire spreadsheet context to locate the most relevant cells, values, and formulas that address the user's intent. Pay close attention to formulas and relationships between sheets.
    Step 3: Synthesize your findings into a precise answer. Identify any related data points across different sheets that provide important context.
    Step 4: Formulate your final response based on your analysis, adhering strictly to the JSON format specified below.

    // 5. OUTPUT FORMATTING & CONSTRAINTS
    You must provide your answer ONLY in a single, valid JSON object. Do not add any other text, explanations, or markdown formatting outside of the JSON structure. Your entire response should be the JSON object itself.

    The JSON object must follow this exact schema:
    {
      "data": [
        {
          "concept": "A short, descriptive name for the business concept you found (e.g., 'Q1 Gross Profit Margin').",
          "location": { 
            "sheet": "The name of the sheet where the primary data was found.", 
            "cell": "The cell reference (e.g., 'C15')." 
          },
          "value": "The value of the cell. Format percentages and currencies appropriately.",
          "formula": "The formula of the cell, if any. Otherwise, null.",
          "explanation": "A brief, one-sentence explanation of why this result is relevant to the user's query.",
          "reasoning": "Your step-by-step reasoning on how you analyzed the query and used the context to find this answer.",
          "relationships": [
              {
                  "concept": "The name of a related concept.",
                  "location": { "sheet": "Sheet Name", "cell": "Cell Reference" },
                  "description": "A brief description of how this data is related to the main result."
              }
          ]
        }
      ]
    }
    `;

    return promptTemplate.trim();
}