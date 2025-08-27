export interface ISheetData {
    cell: string,
    value: string,
    formula: string,
    context: string,
}

export interface ISheetContext {
    sheetName: string,
    summary: string,
    headers: string[],
    data: ISheetData[]
}

export interface ISheetRelations {
    concept: string,
    location: ISearchLocation,
    description: string,
}

export interface ISearchLocation {
    sheet: string,
    cell: string
}

export interface ISearchResult {
    concept: string,
    location: ISearchLocation
    value: string,
    formula: string,
    explanation: string,
    reasoning: string,
    relationships: ISheetRelations[]
}