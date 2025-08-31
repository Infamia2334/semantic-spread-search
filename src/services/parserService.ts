import type { MultipartFile } from "@fastify/multipart";
import type { IMetadata, ISearchAPIReq } from "../dto/api.dto.ts";
import xlsx from "xlsx";
import type { ISheetContext, ISheetData } from "../dto/llm.dto.ts";
import { formatContextForLLM } from "../utils/formatter.ts";

export default class FileParser {
    private file: Buffer;
    private metadata: IMetadata

    constructor (file: Buffer, metadata: IMetadata) {
        this.file = file;
        this.metadata = metadata
    }

    async parseSheet(): Promise<ISheetContext[]> {
        if (this.metadata.mimetype !== 'xlsx') {
            console.error("It is not a spreadsheet, terminating parsing");
            throw new Error(`Invalid file type, parseSheet() was invoked on ${this.metadata.mimetype} file`);
        }

        const workbook = xlsx.read(this.file, { cellFormula: true });

        const sheetNames = workbook.SheetNames;

        const sheetsContext = sheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName]!;

            const data: ISheetData[] = [];
            const range = worksheet['!ref'];
                if (range) {
                  const { s, e } = xlsx.utils.decode_range(range);
                  for (let row = s.r; row <= e.r; row++) {
                    for (let col = s.c; col <= e.c; col++) {
                      const cellAddress = xlsx.utils.encode_cell({
                        r: row,
                        c: col,
                      });
                      const cell = worksheet[cellAddress];
                      if (cell) {
                        const value = cell.v as string;
                        const formula = cell.f as string;
                        const sheetData = {
                          cell: cellAddress,
                          value,
                          formula,
                          context: "",
                        };
                        data.push(sheetData);
                      }
                    }
                  }
                }
            
            return {
                sheetName,
                summary: '',
                headers: [''],
                data,
            }
        });

        return sheetsContext;
    }
}