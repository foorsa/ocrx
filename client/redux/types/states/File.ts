// File Type

// Used for the file to correct the template generation

// Typical File type but with the addition of the document type and preview

export interface FileType {
    file: File;
    name: string;
    size: number;
    type: string;
    preview: string;
}