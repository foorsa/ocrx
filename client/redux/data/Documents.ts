// Field Type

import { Doctype } from "../types/states/Document Type";
import Baccalaureate from "./core/Baccalaureate";

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

export const BaccalaureateObject = Baccalaureate;

