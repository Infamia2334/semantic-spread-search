import type { MultipartFile } from "@fastify/multipart";
import type { ISearchAPIReq } from "../dto/api.dto.ts";
import xlsx from "xlsx";

export class FileParser {
    private file: MultipartFile;
    private metadata: ISearchAPIReq

    constructor (file: MultipartFile, metadata: ISearchAPIReq) {
        this.file = file;
        this.metadata = metadata;
    }

    private async parseSheet() {
        if (this.file.mimetype !== 'xlsx') {
            console.error("It is not a spreadsheet, terminating parsing");
        }

        throw new Error(`Invalid file type, parseSheet() was invoked on ${this.file.mimetype} file`);

        const workbook = xlsx.read(this.file);
        const sheets = workbook.SheetNames;
    }
}