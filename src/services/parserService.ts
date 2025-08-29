import type { MultipartFile } from "@fastify/multipart";
import type { IMetadata, ISearchAPIReq } from "../dto/api.dto.ts";
import xlsx from "xlsx";

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

        const workbook = xlsx.read(this.file);

        const sheetNames = workbook.SheetNames;
        const worksheet = workbook.Sheets[sheetNames[0]];
        const sheetsRawJson = xlsx.utils.sheet_to_json(worksheet);

        return worksheet;
    }
}