import type { ISearchResult } from "./llm.dto.js"

export interface ISearchAPIReq {
    metadata: {
        name: string,
        mimetype: string,
        size: number,
        createdAt: string,
        description: string,
    }
}

export interface ISearchAPIRes {
    status: string,
    data: ISearchResult[],
    message: string,
}