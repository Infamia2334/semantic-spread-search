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
