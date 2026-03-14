// Field Type

// Used for the fields in the document type to correct the template generation

// Like: "Name" -> "name" - "First Name" -> "firstName" - "Last Name" -> "lastName"
// "Date of Birth" -> "dateOfBirth" - "Date of Birth (DD/MM/YYYY)" -> "dateOfBirth"

// But for our Case, the fields should vary based on the document type

/* 
    Baccalaureate: 
        "Candidate": string
        "Date of birth": Date
        "City": string
        "Insitute": string
        "Cycle": string 
        "Speciality": string
        "Mention": string

    // Other document types will be added later
*/


export type Field = {
    name: string;
    type: string;
    description: string;
    example?: string;
    required: boolean;
}


type TagType = "Regular" | "Tabular";
type StateType = "Available" | "Unavailable";


export type TableLayoutOptions = {
    autoFitCells: boolean;
    fontSize: number;
    cellPadding: number;
    maxColumnWidth?: number;
    fitToPageWidth: boolean;
};

export const DEFAULT_TABLE_OPTIONS: TableLayoutOptions = {
    autoFitCells: true,
    fontSize: 8,
    cellPadding: 2,
    fitToPageWidth: true,
};

export type DocumentType = {
    name: string;
    id: string;
    description: string;
    tags?: TagType[];
    state: StateType;
    templateId: string;
    fields: Field[];
    tableOptions?: TableLayoutOptions;
}

export type DocumentsGroupType = {
    name: string;
    description: string;
    id: string;
    documents: DocumentType[]
}

export type Doctype = DocumentType | null;