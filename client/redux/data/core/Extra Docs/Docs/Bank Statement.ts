import { DocumentType } from "@/redux/types/states/Document Type";

export const BankStatement: DocumentType = {
    id: "ExtraDocs-Bank-Statement",
    name: "Bank Statement",
    description:
        "A certified translation of a Moroccan bank balance / account statement, confirming the account holder's name and current balance.",
    tags: ["Regular"],
    state: "Available",
    templateId: "1jNldSomjyT-Y2UFM7BpZIb4bqQGGNN-qysOGgr1PqtM",
    fields: [
        {
            name: "Bank Name",
            type: "text",
            description: "Name of the issuing bank",
            required: true,
            example: `"Attijariwafa Bank", "CIH Bank", "Banque Populaire", etc.`,
        },
        {
            name: "Branch Name",
            type: "text",
            description: "Name or location of the bank branch",
            required: true,
            example: `"Agence Rabat Centre", "Agence Fes Ville", etc.`,
        },
        {
            name: "Account Name",
            type: "text",
            description: "Full name of the account holder",
            required: true,
            example: `"Mohamed El Alami", "Fatima Zahra Bennani", etc.`,
        },
        {
            name: "Date",
            type: "text",
            description: "Date of the bank statement / certificate",
            required: true,
            example: `"01/03/2024", "15/07/2023", etc.`,
        },
        {
            name: "bank details",
            type: "text",
            description: "Bank account details such as account number or RIB",
            required: false,
            example: `"RIB: 123 456 7890123456789 01", etc.`,
        },
        {
            name: "Balance Amount",
            type: "text",
            description: "Current account balance in Moroccan Dirhams (DHS)",
            required: true,
            example: `"25,000.00 DHS", "150,000 DHS", etc.`,
        },
        {
            name: "City of issue",
            type: "text",
            description: "City where the statement was issued",
            required: true,
            example: `"Rabat", "Casablanca", "Fes", etc.`,
        },
        {
            name: "Date of issue",
            type: "text",
            description: "Official date the document was issued",
            required: true,
            example: `"01/03/2024", "15/07/2023", etc.`,
        },
    ],
};

export default BankStatement;
