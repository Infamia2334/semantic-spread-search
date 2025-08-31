import type { MultipartFile } from "@fastify/multipart";
import type { IMetadata, ISearchAPIReq } from "../dto/api.dto.ts";
import xlsx from "xlsx";
import type { ISheetContext, ISheetData } from "../dto/llm.dto.ts";
import { formatContextForLLM } from "../utils/formatter.ts";

export default class FileParser {
  private file: Buffer;
  private metadata: IMetadata;

  constructor(file: Buffer, metadata: IMetadata) {
    this.file = file;
    this.metadata = metadata;
  }

  async parseSheet(): Promise<ISheetContext[]> {
    if (this.metadata.mimetype !== "xlsx") {
      console.error("It is not a spreadsheet, terminating parsing");
      throw new Error(
        `Invalid file type, parseSheet() was invoked on ${this.metadata.mimetype} file`
      );
    }

    const workbook = xlsx.read(this.file, { cellFormula: true });

    const sheetNames = workbook.SheetNames;

    const sheetsContext = sheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]!;
      const data: ISheetData[] = [];
      let headers: string[] = [];

      const range = worksheet["!ref"];
      if (range) {
        const { s: start, e: end } = xlsx.utils.decode_range(range);

        // --- 1. Find the first populated row to use as the header row ---
        let headerRowIndex = -1;
        for (let row = start.r; row <= end.r; row++) {
          let isRowPopulated = false;
          for (let col = start.c; col <= end.c; col++) {
            const cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
            if (cell && cell.v) {
              isRowPopulated = true;
              break; // Found content in this row, no need to check other columns
            }
          }
          if (isRowPopulated) {
            headerRowIndex = row;
            break;
          }
        }

        if (headerRowIndex !== -1) {
          for (let col = start.c; col <= end.c; col++) {
            const cellAddress = xlsx.utils.encode_cell({
              r: headerRowIndex,
              c: col,
            });
            const cell = worksheet[cellAddress];
            headers.push(cell && cell.v ? String(cell.v) : "");
          }

          for (let row = headerRowIndex + 1; row <= end.r; row++) {
            for (let col = start.c; col <= end.c; col++) {
              const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
              const cell = worksheet[cellAddress];
              if (cell) {
                data.push({
                  cell: cellAddress,
                  value: cell.v as string,
                  formula: cell.f as string,
                  context: "",
                });
              }
            }
          }
        }
      }

      return {
        sheetName,
        summary: "",
        headers,
        data,
      };
    });

    return sheetsContext;
  }
}
