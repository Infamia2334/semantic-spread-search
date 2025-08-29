import type { MultipartFile } from "@fastify/multipart";
import type { IMetadata, ISearchAPIReq } from "../dto/api.dto.ts";
import xlsx from "xlsx";
import type { ISheetData } from "../dto/llm.dto.ts";

export default class FileParser {
    private file: Buffer;
    private metadata: IMetadata

    constructor (file: Buffer, metadata: IMetadata) {
        this.file = file;
        this.metadata = metadata
    }

    async parseSheet() {
        if (this.metadata.mimetype !== 'xlsx') {
            console.error("It is not a spreadsheet, terminating parsing");
            throw new Error(`Invalid file type, parseSheet() was invoked on ${this.metadata.mimetype} file`);
        }

        const workbook = xlsx.read(this.file, { cellFormula: true });

        const sheetNames = workbook.SheetNames;

        const sheetsRawJson = sheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName];

            const data: ISheetData[] = [];
            for (const cellIndex in worksheet) {
                const cell = worksheet[cellIndex];
                const value = cell.v as string;
                const formula = cell.f as string;

                const sheetData = { cell: cellIndex, value, formula, context: '' };
                
                data.push(sheetData);
            }
            
            return {
                sheetName,
                summary: '',
                headers: [''],
                data,
            }
        });

        return sheetsRawJson;
    }
}