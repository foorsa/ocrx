# JSON
import os
import json as json_module
import requests

from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"


def _gemini_chat(messages, temperature=0, json_mode=False):
    """Send a chat request to Gemini API.
    messages: list of dicts with 'role' and 'content' (OpenAI-style).
    Maps to Gemini's contents format.
    """
    # Build system instruction from system messages
    system_parts = []
    contents = []

    for msg in messages:
        role = msg["role"]
        content = msg["content"]

        if role == "system":
            system_parts.append(content)
        elif role == "user":
            contents.append({"role": "user", "parts": [{"text": content}]})
        elif role == "assistant":
            contents.append({"role": "model", "parts": [{"text": content}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
        },
    }

    if system_parts:
        payload["systemInstruction"] = {
            "parts": [{"text": "\n".join(system_parts)}]
        }

    if json_mode:
        payload["generationConfig"]["responseMimeType"] = "application/json"

    resp = requests.post(GEMINI_URL, json=payload, timeout=120)
    resp.raise_for_status()
    data = resp.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]


def PromptString(Doctype, AvailableDoctypes, PromptOptions):
    # Intialize an Empty string for the prompt
    Prompt = ""

    # Dynamically set the convenient prompt options for the prompt
    match Doctype:
        case "Master-Transcript-of-Marks" | "Baccalaureate-Transcript-of-Marks-V1" | "Baccalaureate-Transcript-of-Marks-V2":
            Prompt = (
                f"We are in a python project, I need help in getting precise "
                f"output from the OCR processor.\n\n"
                f"This python app gets a request with a File and a Document type.\n\n"
                f"The File could be a PDF or an Image.\n\n"
                f"The Document Type could be one of the following:\n\n"
                f"{AvailableDoctypes}\n\n"
                f"This application has already processed the file and the Document with OCR.\n\n"
                f"The OCR output is a text string containing the information about the transcript of marks.\n\n"
                f"I only need the information I will provide you in the following prompt.\n\n"
                f"This means that the RAW OCR output contains some additional information about the transcript "
                f"that we don't want to include in the output.\n\n"
                f"The OCR output is not precise, it contains some errors.\n\n"
                f"I need to correct the OCR output and get the precise information about the diploma.\n\n"
                f"The OCR output is in the variable Content.\n\n"
                f"Please read the string and convert it to something that can be used by the application.\n\n"
                f"I need the data to be shaped this way:\n\n"
                f"{PromptOptions}\n\n"
                f"Now, I need you to translate the corrected output to English.\n\n"
                f"Any value that is present in the OCR Output should be translated to English.\n\n"
                f"Do not forget to translate any single french word.\n\n"
                f"As well as the Specialization, it should be translated to English as well.\n\n"
                f"In short, any french word should be translated to English.\n\n"
                f"[Keyword: Original (No Translation)]: [Value: Translated]\n\n"
                f"Do not Translate the Keys, only the Values.\n\n"
                f"Use some intelligent logic to determine whether the values are valid  or not.\n\n"
                f"So on for any other value that is present in the OCR Output.\n\n"
                f"I need this translation to be done in the best effort and accuracy that you can possibly do.\n\n"
                f"I need the data to be shaped to a JSON Object.\n\n"
                f"NOTICE:\n"
                f"\tNo need to comment or explain, just translate it and then return it.\n"
                f"\tThis means I need a valid JSON Object as an output from your response.\n"
                f"\tAny additional text will be considered as an error.\n"
                f"\tPlease do not forget to translate each option's value accurately as well "
                f"(Obligatory: Series and Speciality from french to english).\n"
                f"\tPlease keep the same format as the example above.\n"
                f"\tDo change the name of the options.\n"
                f"\tThe object keys should be the same as the example above.\n"
                f"\tReply with the JSON object ONLY.\n"
                f"\tSo please do not add anything to the object, it is the JSON object that the application needs.\n"
                f"\tDO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.\n"
                f"\tNO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT."
            )

        case _:
            Prompt = (
                f"We are in a python project, I need help in getting precise "
                f"output from the OCR processor.\n\n"
                f"This python app gets a request with a File and a Document type.\n\n"
                f"The File could be a PDF or an Image.\n\n"
                f"The Document Type could be one of the following:\n\n"
                f"{AvailableDoctypes}\n\n"
                f"This application has already processed the file and the Document with OCR.\n\n"
                f"The OCR output is a text string containing the information about the diploma.\n\n"
                f"The OCR output is not precise, it contains some errors.\n\n"
                f"I need to correct the OCR output and get the precise information about the diploma.\n\n"
                f"The OCR output is in the variable Content.\n\n"
                f"Please read the string and convert it to something that can be used by the application.\n\n"
                f"I need the data to be shaped this way:\n\n"
                f"{PromptOptions}\n\n"
                f"Now, I need you to translate the corrected output to English.\n\n"
                f"Any value that is present in the OCR Output should be translated to English.\n\n"
                f"Do not forget to translate any single french word.\n\n"
                f"As well as the Specialization, it should be translated to English as well.\n\n"
                f"In short, any french word should be translated to English.\n\n"
                f"[Keyword: Original (No Translation)]: [Value: Translated]\n\n"
                f"Do not Translate the Keys, only the Values.\n\n"
                f"Use some intelligent logic to determine whether the values are valid  or not.\n\n"
                f"So on for any other value that is present in the OCR Output.\n\n"
                f"I need this translation to be done in the best effort and accuracy that you can possibly do.\n\n"
                f"I need the data to be shaped to a JSON Object.\n\n"
                f"NOTICE:\n"
                f"\tNo need to comment or explain, just translate it and then return it.\n"
                f"\tThis means I need a valid JSON Object as an output from your response.\n"
                f"\tAny additional text will be considered as an error.\n"
                f"\tPlease do not forget to translate each option's value accurately as well "
                f"(Obligatory: Series and Speciality from french to english).\n"
                f"\tPlease keep the same format as the example above.\n"
                f"\tDo change the name of the options.\n"
                f"\tThe object keys should be the same as the example above.\n"
                f"\tReply with the JSON object ONLY.\n"
                f"\tSo please do not add anything to the object, it is the JSON object that the application needs.\n"
                f"\tDO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.\n"
                f"\tNO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT."
            )

    return Prompt


# Document field definitions (local copy to avoid external API dependency)
DOCUMENT_DEFINITIONS = [
    {
        "name": "Baccalaureate Degrees",
        "documents": [
            {
                "id": "Baccalaureate-Certificate",
                "name": "Baccalaureate Certificate",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership", "example": '"Rabat", "Casablanca-Settat", etc.'},
                    {"name": "Serial Number", "description": "Serial Number of the Baccalaureate Certificate", "example": '"C123456789", "K137260939", etc.'},
                    {"name": "Student Name", "description": "Student Name", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Date of birth", "description": "Candidate Date of Birth"},
                    {"name": "City of birth", "description": "City of the Candidate"},
                    {"name": "Institute", "description": "Institute of the Candidate", "example": '"Mohamed V", "Hassan II", etc.'},
                    {"name": "Session", "description": "Year and Month, e.g: July 2020, etc.", "example": '"July 2020", "June 2023", etc.'},
                    {"name": "Series", "description": "Series of the Baccalaureate Certificate", "example": '"Economic Sciences", "Mathematics", etc.'},
                    {"name": "Option", "description": "Specialty Name", "example": '"Economics and Management", "Physical Sciences", etc.'},
                    {"name": "Grade", "description": "Mention of the Candidate", "example": '"Excellent", "Very Good", "Good", "Good Enough", "Passable", etc.'},
                    {"name": "Date of issue", "description": "Date of the Issue of the certificate", "example": '"12/03/2002", "01/11/2003", etc.'},
                ],
            },
            {
                "id": "Baccalaureate-School-Certificate",
                "name": "School Certificate",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership", "example": '"Rabat", "Casablanca-Settat", etc.'},
                    {"name": "Region", "description": "Name of the Regional Leadership", "example": '"Rabat Sale Kenitra", "Grand Casablanca", etc.'},
                    {"name": "Year", "description": "School Year of the Student", "example": '"2020/2021", "2021/2022", etc.'},
                    {"name": "Commune", "description": "Name of the Commune", "example": '"Rabat", "Casablanca", etc.'},
                    {"name": "Institute", "description": "Institute of the Candidate", "example": '"Mohamed V", "Hassan II", etc.'},
                    {"name": "Student Name", "description": "Name of the Candidate", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Student Code", "description": "Code of the Candidate", "example": '"R131240282", "J105020120", etc.'},
                    {"name": "Date of birth", "description": "Candidate Date of Birth", "example": '"01/01/2000", "01/01/2001", etc.'},
                    {"name": "City of birth", "description": "City of the Candidate", "example": '"Rabat", "Casablanca", etc.'},
                    {"name": "Option", "description": "Option of the Candidate", "example": '"Mathematical Sciences", "Physical Sciences", etc.'},
                    {"name": "City of issue", "description": "City of issue of the School Certificate"},
                    {"name": "Date of issue", "description": "Date of issue of the School Certificate"},
                ],
            },
            {
                "id": "Baccalaureate-Transcript-of-Marks-V1",
                "name": "Transcript of Marks [V1]",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership", "example": '"Rabat", "Casablanca-Settat", etc.'},
                    {"name": "Institute", "description": "Institute of the Candidate", "example": '"Mohamed V", "Hassan II", etc.'},
                    {"name": "Year", "description": "Year of the Baccalaureate", "example": '"2002", "2003", etc.'},
                    {"name": "Student Name", "description": "Student Name", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Student Option", "description": "Student's Option", "example": '"Mathematics", "Physics", etc.'},
                    {"name": "Student National Code", "description": "Student National Code", "example": '"G123456", "K137260", etc.'},
                    {"name": "Student Level", "description": "Student's Level", "example": '"Baccalaureate in Physical Sciences", "Baccalaureate in Economic Sciences", etc.'},
                    {"name": "City of issue", "description": "City of the issue of the certificate"},
                    {"name": "Date of issue", "description": "Date of the Issue of the certificate", "example": '"12/03/2002", "01/11/2003", etc.'},
                ],
            },
            {
                "id": "Baccalaureate-Transcript-of-Marks-V2",
                "name": "Transcript of Marks [V2]",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership", "example": '"Rabat", "Casablanca-Settat", etc.'},
                    {"name": "Institute", "description": "Institute of the Candidate", "example": '"Mohamed V", "Hassan II", etc.'},
                    {"name": "Year", "description": "Year of the Baccalaureate", "example": '"2002", "2003", etc.'},
                    {"name": "Student Name", "description": "Student Name", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Student Option", "description": "Student's Option", "example": '"Mathematics", "Physics", etc.'},
                    {"name": "Student National Code", "description": "Student National Code", "example": '"G123456", "K137260", etc.'},
                    {"name": "Student Level", "description": "Student's Level", "example": '"Baccalaureate in Physical Sciences", "Baccalaureate in Economic Sciences", etc.'},
                    {"name": "City of issue", "description": "City of the issue of the certificate"},
                    {"name": "Date of issue", "description": "Date of the Issue of the certificate", "example": '"12/03/2002", "01/11/2003", etc.'},
                ],
            },
        ],
    },
    {
        "name": "Bachelor",
        "documents": [
            {
                "id": "Bachelor-Certificate",
                "name": "Bachelor Certificate",
                "fields": [
                    {"name": "University Name", "description": "University Name (required)", "example": "Al Kadi Eiyad, Hassan II, Mohammed V, etc."},
                    {"name": "University City", "description": "University City Name", "example": "Fes, Rabat, Casablanca, etc."},
                    {"name": "Faculty Name", "description": "Faculty of the Candidate", "example": "Al Kadi Eiyad, Hassan II, Mohammed V, etc."},
                    {"name": "Faculty City", "description": "Faculty of the Candidate", "example": "Fes, Rabat, Casablanca, etc."},
                    {"name": "Certificate Name", "description": "Name of the Certificate, e.g: Bachelor's Certificate, Licence Certificate, etc."},
                    {"name": "Student Name", "description": "Student's Full Name"},
                    {"name": "Date of birth", "description": "Student's Date of Birth"},
                    {"name": "City of birth", "description": "Student's City of Birth"},
                    {"name": "National Identity Card Number", "description": "CIN of the Student, e.g: J123456, etc.", "example": "AS19956, AE34355, EL34432, etc."},
                    {"name": "Student National Code", "description": "CNE of the Student, e.g: J1234567890, etc.", "example": "A199567890, A343556789, E344327890, etc."},
                    {"name": "Department", "description": "Departement of the Candidate", "example": "Computer Science, Mathematics, Physics, etc."},
                    {"name": "Option", "description": "Option of the Candidate", "example": "Computer Science, Mathematics, Physics, etc."},
                    {"name": "Mention", "description": "Mention of the Candidate", "example": "Very Good, Good, Good Enough, etc."},
                    {"name": "City of Issue", "description": "City of Issue of the Certificate."},
                    {"name": "Date of Issue", "description": "Date of Issue of the Certificate."},
                ],
            },
        ],
    },
    {
        "name": "Master",
        "documents": [
            {
                "id": "Master-Certificate",
                "name": "Master Certificate",
                "fields": [
                    {"name": "University Name", "description": "University Name (required)", "example": "Al Kadi Eiyad, Hassan II, Mohammed V, etc."},
                    {"name": "University City", "description": "University City Name", "example": "Fes, Rabat, Casablanca, etc."},
                    {"name": "Faculty Name", "description": "Faculty of the Candidate", "example": "Al Kadi Eiyad, Hassan II, Mohammed V, etc."},
                    {"name": "Faculty City", "description": "Faculty of the Candidate", "example": "Fes, Rabat, Casablanca, etc."},
                    {"name": "Certificate Name", "description": "Name of the Certificate, e.g: Master's Certificate, Licence Certificate, etc."},
                    {"name": "Student Name", "description": "Student's Full Name"},
                    {"name": "Date of birth", "description": "Student's Date of Birth"},
                    {"name": "City of birth", "description": "Student's City of Birth"},
                    {"name": "National Identity Card Number", "description": "CIN of the Student, e.g: J123456, etc.", "example": "AS19956, AE34355, EL34432, etc."},
                    {"name": "Student National Code", "description": "CNE of the Student, e.g: J1234567890, etc.", "example": "A199567890, A343556789, E344327890, etc."},
                    {"name": "Department", "description": "Departement of the Candidate", "example": "Computer Science, Mathematics, Physics, etc."},
                    {"name": "Option", "description": "Option of the Candidate", "example": "Computer Science, Mathematics, Physics, etc."},
                    {"name": "Mention", "description": "Mention of the Candidate", "example": "Very Good, Good, Good Enough, etc."},
                    {"name": "City of Issue", "description": "City of Issue of the Certificate."},
                    {"name": "Date of Issue", "description": "Date of Issue of the Certificate."},
                ],
            },
            {
                "id": "Master-Transcript-of-Marks",
                "name": "Transcript of Marks",
                "fields": [
                    {"name": "Start Semester", "description": "Start Semester of the Transcript", "example": "S1, S2, S3, S4, S5, S6, etc."},
                    {"name": "End Semester", "description": "End Semester of the Transcript", "example": "S1, S2, S3, S4, S5, S6, etc."},
                    {"name": "University Name", "description": "Name of the University", "example": "University Qadi Ayyad, University Mohamed V, etc."},
                    {"name": "University City", "description": "City of the University", "example": "Rabat, Sale, Temara, Casablanca, etc."},
                    {"name": "Student Name", "description": "Name of the Student", "example": "Salma Hayyani, Yassine Chettouch, etc."},
                    {"name": "City of birth", "description": "City of birth of the Student"},
                    {"name": "Date of birth", "description": "Date of birth of the Student"},
                    {"name": "Student National Code", "description": "National Code of the Student", "example": "G132424556, J100033719, etc."},
                    {"name": "Student Number", "description": "Number Code of the Student", "example": "1234567, 3454567, 2425353, etc."},
                    {"name": "Option", "description": "Option of the Student", "example": "Mathematics, Physics, Chemistry, etc."},
                    {"name": "City of issue", "description": "City of issue of the Transcript of Marks"},
                    {"name": "Date of issue", "description": "Date of issue of the Transcript of Marks"},
                ],
            },
            {
                "id": "Master-Certificate-of-Schooling",
                "name": "Certificate of Schooling",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership"},
                    {"name": "Serial Number", "description": "Serial Number of the Certificate, e.g: 123456, etc."},
                    {"name": "Student Name", "description": "Student's Full Name"},
                    {"name": "University", "description": "University of the Candidate"},
                    {"name": "City of birth", "description": "Student's City of Birth"},
                    {"name": "Date of birth", "description": "Student's Date of Birth"},
                    {"name": "Sector Session", "description": "Sector Session of the Candidate, e.g: 2019, 2020, etc."},
                    {"name": "Sector Year", "description": "Sector Year of the Candidate, e.g: Third Year, Second Year, etc."},
                    {"name": "Sector Name", "description": "Sector Name of the Candidate, e.g: Computer Science, etc."},
                    {"name": "Certificate Due Date", "description": "Certificate Date, e.g: 2019, etc."},
                    {"name": "Certificate Due City", "description": "Certificate City, e.g: Rabat, etc."},
                ],
            },
            {
                "id": "Master-Certificate-of-Success-at-Diploma",
                "name": "Certificate of Success at Diploma",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership"},
                    {"name": "University", "description": "University of the Candidate"},
                    {"name": "Student Name", "description": "Student's Full Name"},
                    {"name": "Student Number", "description": "Student's Number"},
                    {"name": "City of birth", "description": "Student's City of Birth"},
                    {"name": "Date of birth", "description": "Student's Date of Birth"},
                    {"name": "Option", "description": "Option of the Candidate", "example": "Mathematical Sciences, Physical Sciences, etc."},
                    {"name": "Grade", "description": "Grade of the Candidate", "example": "Good Enough, Good, Very Good, etc."},
                    {"name": "Year", "description": "Year of the Certificate, e.g: 2019, etc."},
                    {"name": "Certificate City", "description": "City of the Certificate"},
                    {"name": "Certificate Date", "description": "Year of the Certificate"},
                ],
            },
        ],
    },
    {
        "name": "Extra Documents",
        "documents": [
            {
                "id": "ExtraDocs-Police-Record-Checks",
                "name": "Police Record Checks",
                "fields": [
                    {"name": "Province", "description": "Name of the Provincial Leadership", "example": "Fes, Rabat, Casablanca, etc."},
                    {"name": "Start Date", "description": "Start Date of the Police Record Checks"},
                    {"name": "End Date", "description": "End Date of the Police Record Checks"},
                    {"name": "Identity Card Number", "description": "Identity Card Number of the Candidate", "example": "EE123456, AS23244, AE22424, EL23244"},
                    {"name": "First Name", "description": "First Name of the Candidate"},
                    {"name": "Last Name", "description": "Last Name of the Candidate"},
                    {"name": "Student Name", "description": "Full Name of the Candidate (First Name + Last Name)"},
                    {"name": "Date of birth", "description": "Date of Birth of the Candidate"},
                    {"name": "Place of birth", "description": "Place of Birth of the Candidate"},
                    {"name": "Address", "description": "Address of the Candidate"},
                ],
            },
            {
                "id": "ExtraDocs-Statement-of-Penalties-Issued-by-Deprivation-of-Liberty",
                "name": "Statement of penalties issued by deprivation of liberty",
                "fields": [
                    {"name": "Order Number", "description": "Order Number of the penalty issued by deprivation of liberty.", "example": "K622957, E232456, etc."},
                    {"name": "Identity Card Number", "description": "Identity Card Number of the Candidate"},
                    {"name": "First Name", "description": "First Name of the Candidate"},
                    {"name": "Second Name", "description": "Second Name of the Candidate"},
                    {"name": "Student Name", "description": "Full Name of the Candidate"},
                    {"name": "Date of Birth", "description": "Date of Birth of the Candidate"},
                    {"name": "Place of Birth", "description": "Place of Birth of the Candidate"},
                    {"name": "Address", "description": "Address of the Candidate"},
                    {"name": "Occupation", "description": "Occupation of the Candidate", "example": "Mostly Student."},
                    {"name": "City of issue", "description": "City of issue of the Statement of penalties issued by deprivation of liberty."},
                    {"name": "Date of issue", "description": "Date of issue of the Statement of penalties issued by deprivation of liberty."},
                ],
            },
            {
                "id": "ExtraDocs-Registration-Certificate",
                "name": "Registration Certificate",
                "fields": [
                    {"name": "University Name", "description": "University Name of the Student"},
                    {"name": "University City", "description": "University City of the Student"},
                    {"name": "Faculty Name", "description": "University Name of the Student"},
                    {"name": "Faculty City", "description": "Faculty City of the Student"},
                    {"name": "Student Name", "description": "Name of the Candidate", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Date of birth", "description": "Candidate Date of Birth", "example": '"01/01/2000", "01/01/2001", etc.'},
                    {"name": "City of birth", "description": "City of the Candidate", "example": '"Rabat", "Casablanca", etc.'},
                    {"name": "National Identity Card", "description": "National Identity Card of the Candidate", "example": '"AS14457", "FG45458", etc.'},
                    {"name": "Student National Code", "description": "Code of the student in the National Student Registry", "example": '"R131240282", "J105020120", etc.'},
                    {"name": "Academic Year", "description": "Academic Year of the Candidate", "example": '"2020-2021", "2021-2022", etc.'},
                    {"name": "Diploma Name", "description": "Name of the Diploma of the Candidate", "example": '"Bachelor", "Master", etc.'},
                    {"name": "Diploma Grade", "description": "Diploma Grade of the Candidate", "example": '"Good", "Very Good", etc.'},
                    {"name": "Diploma Option", "description": "Diploma Sector of the Candidate", "example": '"Computer Science", "Mathematics", etc.'},
                    {"name": "Diploma Year", "description": "Diploma Sector of the Candidate", "example": '"2nd Year Mathematical Sciences", "3rd Year", etc.'},
                    {"name": "City of issue", "description": "City of issue of the Registration Certificate"},
                    {"name": "Date of issue", "description": "Date of issue of the Registration Certificate"},
                ],
            },
            {
                "id": "ExtraDocs-Technical-University-Degree",
                "name": "Technical University Degree",
                "fields": [
                    {"name": "University Name", "description": "University Name of the Student"},
                    {"name": "University City", "description": "University City of the Student"},
                    {"name": "Student Name", "description": "Name of the Candidate", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Date of birth", "description": "Candidate Date of Birth", "example": '"01/01/2000", "01/01/2001", etc.'},
                    {"name": "City of birth", "description": "City of the Candidate", "example": '"Rabat", "Casablanca", etc.'},
                    {"name": "National Identity Card", "description": "National Identity Card of the Candidate", "example": '"AS14457", "FG45458", etc.'},
                    {"name": "Student National Code", "description": "Code of the student in the National Student Registry", "example": '"R131240282", "J105020120", etc.'},
                    {"name": "Diploma Name", "description": "Name of the Diploma of the Candidate", "example": '"Bachelor", "Master", etc.'},
                    {"name": "Diploma Grade", "description": "Diploma Grade of the Candidate", "example": '"Good", "Very Good", etc.'},
                    {"name": "Diploma Sector", "description": "Diploma Sector of the Candidate", "example": '"Computer Science", "Mathematics", etc.'},
                    {"name": "City of issue", "description": "City of issue of the Technical University Degree"},
                    {"name": "Date of issue", "description": "Date of issue of the Technical University Degree"},
                ],
            },
            {
                "id": "ExtraDocs-Certificate-of-Achievement",
                "name": "Certificate of Achievement",
                "fields": [
                    {"name": "University Name", "description": "University Name of the Student"},
                    {"name": "University City", "description": "University City of the Student"},
                    {"name": "Student Name", "description": "Name of the Candidate", "example": '"Mohamed Ali", "Yassine Chettouch", etc.'},
                    {"name": "Registration Number", "description": "Registration Number of the Candidate", "example": '"131240282", "105020120", etc.'},
                    {"name": "National Identity Card", "description": "National Identity Card of the Candidate", "example": '"AS14457", "FG45458", etc.'},
                    {"name": "Student National Code", "description": "Code of the student in the National Student Registry", "example": '"R131240282", "J105020120", etc.'},
                    {"name": "Date of birth", "description": "Candidate Date of Birth", "example": '"01/01/2000", "01/01/2001", etc.'},
                    {"name": "City of birth", "description": "City of the Candidate", "example": '"Rabat", "Casablanca", etc.'},
                    {"name": "Academic Year", "description": "Academic Year of the Candidate", "example": '"2019/2020", "2020/2021", etc.'},
                    {"name": "Diploma Name", "description": "Name of the Diploma of the Candidate", "example": '"Bachelor", "Master", etc.'},
                    {"name": "Major", "description": "Major of the Candidate", "example": '"Mathematical Sciences", "Physical Sciences", etc.'},
                    {"name": "City of issue", "description": "City of issue of the School Certificate"},
                    {"name": "Date of issue", "description": "Date of issue of the School Certificate"},
                ],
            },
        ],
    },
]


def GeneratePrompt(Doctype):
    # Use local document definitions instead of external API call
    Data = DOCUMENT_DEFINITIONS

    AvailableDoctypes = []
    PromptOptions = []

    for Category in Data:
        for Document in Category["documents"]:
            AvailableDoctypes.append(f'{Document["name"]}.')

            if Document["id"] == Doctype:
                # Get the fields of the document
                Fields = Document["fields"]

                # Loop through the fields and append them to the PromptOptions list
                for Field in Fields:
                    FieldInformation = f'{Field["name"]}: {Field["description"]}'

                    # Check if the field has a Property named "example"
                    if "example" in Field:
                        FieldInformation += f' Example: {Field["example"]}'

                    PromptOptions.append(FieldInformation)

    AvailableDoctypes = "\n \n".join(AvailableDoctypes)
    PromptOptions = "\n \n".join(PromptOptions)

    Prompt = None

    # Generate the Prompt String
    Prompt = PromptString(Doctype, AvailableDoctypes, PromptOptions)

    return Prompt


# Text Correction
def GenerateTextCorrection(Doctype, Text):
    result = _gemini_chat(
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that only speaks JSON. Do not write normal text.",
            },
            {
                "role": "user",
                "content": GeneratePrompt(Doctype),
            },
            {
                "role": "assistant",
                "content": """
                    Sure, What is the OCR output?

                    I will provide you with the information extracted from the OCR as a JSON object without any comments.

                    I will also translate the OCR output into English.

                    Including any keyword in french or arabic, it will be translated into English with Accuracy.

                    I will also provide you with the OCR output as a JSON format that is valid to copy and use directly from my text response.
                    """,
            },
            {
                "role": "user",
                "content": Text,
            },
        ],
        temperature=0,
    )
    print("[DEBUG] Response: ", str(result))
    return result


# Text Translation
def GenerateTextTranslation(Doctype, Text, RAW_OCR):
    raw_content = _gemini_chat(
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that only speaks JSON. Do not write normal text.",
            },
            {
                "role": "user",
                "content": """
                    We are working on a Python project and need help with translating a non-English JSON object to English.

                    Your task is to translate every non-English, French, or Arabic word in the JSON object to English while keeping the same object format and keys. If you encounter any errors, typos, or empty values, correct them to make the object valid and meaningful.

                    Your function should take a JSON object as input and return the translated JSON object in English.

                    Please ensure that all object values are correct, and if any value is empty or invalid, replace it with a valid value, do not leave anything empty, PLEASE!

                    Remember to translate every non-English, French, or Arabic word to English accurately.

                    Respond with the translated JSON object only, without adding any additional arguments or comments.

                    Your response should be in the form of a JSON object.

                    Example input JSON:
                    {
                        "Student Name": "Salma Salhi",
                        "Age": "25 ans",
                        "Address": "123 Rue de la Liberté",
                        "Language": "Français",
                        "Grade": "",
                        "Option": "Bac Sciences Physiques",
                        "Date of birth": "01/01/1996",
                        "City of birth": "Casablanca",
                    }

                    Expected output JSON:
                    {
                        "Name": "SALMA SALHI",
                        "Age": "25 YEARS",
                        "Address": "123 LIBERTY STREET",
                        "Language": "FRENCH",
                        "Grade": "NULL",
                        "Option": "BACCALAUREATE IN PHYSICAL SCIENCES",
                        "Date of birth": "01/01/1996",
                        "City of birth": "Casablanca",
                    }

                    Note that I will also provide you with the RAW OCR Text, so you can use it in case a value is missing in the JSON Object.

                    I don't want to have any missing values in the JSON Object, so please make sure that all the values are valid and make sense.

                    I don't want any comments or explanations, just translate it and return it.

                    Translate all the values from Non-English to English, and make sure the output JSON is valid and well-formatted.

                    Please, do not change the object keys, just translate the values.

                    I don't want any comments or explanations, just translate it and return it.

                    Act as if you are a function that takes a JSON Object and returns the same JSON Object but translated to English, and haves valid data that actually makes sense.
                """,
            },
            {
                "role": "assistant",
                "content": """
                    Sure, What is the JSON Object?

                    I will read the RAW OCR Text to use it in case a value is missing in the JSON Object.

                    I will keep the same object as it is, I will not change the object keys or anything except the value of each key.

                    I will translate the values of the object from non-English to English.

                    I will also provide you with the translated result as a JSON format that is valid to copy and use directly from my text response.

                    I will act as if I am a function that takes a JSON Object and returns the same JSON Object but translated to English, and haves valid data that actually makes sense.

                    Please, send me the JSON object, and I will translate it and return it to you, as a valid JSON Object.

                    Whatever "UNKNOWN" or "NULL" or "EMPTY" or "INVALID", and any other form of empty value indication, I will replace it with the right information from the RAW OCR Text, I will never leave any value undefined.

                    I will not add any comments or explanations, I will just translate it and return it, as a valid JSON Object, I don't speak any human language, I only speak JSON.
                    """,
            },
            {
                "role": "user",
                "content": f"""
                    JSON Object:
                    {Text}

                    Text String (RAW OCR to use as Data Fallback, in case of missing values in the JSON Object):
                    {RAW_OCR}
                """,
            },
        ],
        temperature=0,
    )

    JSON_OBJECT = "{" + raw_content.split("{", 1)[1]

    print("[INFO] Translation Response: ", str(JSON_OBJECT))
    return JSON_OBJECT


# Table Correction
def GenerateTableCorrection(Doctype, Table):
    match Doctype:
        case "Baccalaureate-Transcript-of-Marks-V1":
            print(
                "[INFO] Generating AI Correction for: Baccalaureate Transcript of Notes"
            )

            DesiredJSONTable = (
                "{"
                + '\n    "Transcript": {'
                + '\n        "Columns": ['
                + '\n            "Subjects",'
                + '\n            "{{ First Year, E.g. 2020/2021 }} S1",'
                + '\n            "{{ First Year, E.g. 2020/2021 }} S2",'
                + '\n            "{{ Second Year, E.g. 2021/2022 }} S1",'
                + '\n            "{{ Second Year, E.g. 2021/2022 }} S2",'
                + '\n            "{{ Third Year, E.g. 2022/2023 }} S1",'
                + '\n            "{{ Third Year, E.g. 2022/2023 }} S2",'
                + '\n            "Regional Exam",'
                + '\n            "National Exam"'
                + "\n        ],"
                + '\n        "Rows": ['
                + "\n            ["
                + '\n                "{{SUBJECT 1, E.g. French, Mathematics, etc.}}",'
                + '\n                "{{MARK OF SUBJECT 2, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF SUBJECT 1, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + '\n                "{{MARK OF SUBJECT 1}}",'
                + "\n            ],"
                + "\n            ["
                + '\n                "{{SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF SUBJECT 2, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + '\n                "{{MARK OF SUBJECT 2}}",'
                + "\n            ],"
                + "\n            // More Subjects ..."
                + "\n            ["
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + "\n            ],"
                + "\n            // Semestrial Averages"
                + "\n            ["
                + '\n                "Moyenne Semestrielle",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "{{...}}",'
                + '\n                "",'
                + '\n                "",'
                + "\n            ],"
                + "\n            ["
                + '\n                "Moyenne Annuelle",'
                + '\n                "",'
                + '\n                "{{...}}",'
                + '\n                "",'
                + '\n                "{{...}}",'
                + '\n                "",'
                + '\n                "{{...}}",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ]"
                + "\n        ]"
                + "\n    },"
                + '\n    "Overall" : {'
                + '\n        "Columns": ['
                + '\n            "Average of Continuous Control",'
                + '\n            "Regional Exam Average",'
                + '\n            "National Exam Average",'
                + '\n            "Overall Average"'
                + "\n        ],"
                + '\n        "Rows": ['
                + "\n            ["
                + '\n                "{{Continuous Control Average ...}}",'
                + '\n                "{{Regional Exam Average ...}}",'
                + '\n                "{{National Exam Average ...}}",'
                + '\n                "{{Overall Average ...}}"'
                + "\n            ]"
                + "\n        ]"
                + "\n    }"
                + "\n}"
            )

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an assistant that only speaks JSON. Do not write normal text.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Please take the following RAW OCR table as input, which might contain errors, typos, and incorrect formatting. "
                            "Your task is to fix any issues while preserving the grades intact. Once set, provide the resulting Table in the specified JSON format without explanations. Treat this as a functional task.\n\n"
                            "Please be careful; sometimes, the OCR_TABLE could have multiple arrays of tables; we only need a valid JSON, precisely like the Desired JSON Output Format.\n\n"
                            "This OCR Tables Extraction is not per-processed grammatically; there is a high chance the Subject Names will be messed up; You have to fix everything, typos and non-sense words to be removed, or any off-context comments inside each cell.\n\n"
                            "E.g. 'Spinelli Jerall Moyenne Annuelle' Should be fixed to 'Moyenne Annuelle', 'Moyenne Ex. Régional SHN Ulaisy Jies' Should be fixed to 'Moyenne Ex. Régional', 'Sugar Iseall Moyenne Semestrielle' Should be set to 'Moyenne Semestrielle', 'ECO. ET ORG. ADMIN. ENTREPRISE or tell' should be fixed to 'ECO. ET ORG. ADMIN. ENTERPRISE', etc.\n\n"
                            "Any non-sense-related cells should be corrected; we only need the information required to fill the two tables inside the desired JSON Format.\n\n"
                            "The desired JSON Format is an Object with two keys; the first is [Transcript], which contains information about each of the three high-school years and then the regional and national exam grades.\n\n"
                            "Let's break down the content of the first Table, Transcript.\n\n"
                            "The columns should be as follows: Subjects, 2019/2020 S1, 2019/2020 S2, 2020/2021 S1, 2020/2021 S2, 2021/2022 S1, 2021/2022 S2, Regional Exam, and National Exam.\n\n"
                            "The years should be extracted from the original transcript, E.g., 2022/2023, 2023/2024, etc.\n\n"
                            "And then, there are the rows of the first table.\n\n"
                            "These rows should have the information about the subjects, first their names, and then the grades convenient to each column; the last row cell belongs to the National Exam.\n\n"
                            "The last 2 rows of the transcript table are special; the last row is for the Annual Average for each year and the regional and national exams, and then the one before the last row is for the semestrial average of each year; each year has 2 semesters.\n\n"
                            "The second table in the desired JSON Output has the key [Overall].\n\n"
                            "It is a table of 4 columns: Average of Continuous Control, Regional Exam Average, National Exam Average, and Overall Average.\n\n"
                            "And have one row containing the grade that belongs to each Average.\n\n"
                            "Note that the desired JSON Table Output format that I will provide you is just for you to have an idea of the Object Strcture, and not to take the data, you should include the Grades and the Subjects or any other information from the given OCR Data to you.\n\n"
                            "Now, I will provide you with the OCR Table and the Desired JSON Format; all you have to do is act as a functional task and execute what is ordered in this prompt without messing or forgetting anything ordered above.\n\n"
                            "OCR Tables Extraction:\n\n"
                            f"{str(Table)}\n\n"
                            "Desired JSON Table Output Format (Example):\n\n"
                            f"{str(DesiredJSONTable)}\n\n"
                        ),
                    },
                ],
                temperature=0,
            )
            print("[DEBUG] Response: ", str(result))
            return result
        case "Baccalaureate-Transcript-of-Marks-V2":
            print(
                "[DEBUG] Generating AI Correction for: Baccalaureate-Transcript-of-Marks-V2"
            )

            DesiredJSONTable = (
                "{"
                + '\n    "Transcript": {'
                + '\n        "Columns": ['
                + '\n            "TOPIC",'
                + '\n            "NATIONAL EXAM",'
                + '\n            "CONTINUOUS MONITORING",'
                + "\n        ],"
                + '\n        "Rows": ['
                + "\n            ["
                + '\n                "{{TOPIC 1, E.g. French, Mathematic, etc.}}",'
                + '\n                "{{MARK OF TOPIC 1 IN NATIONAL EXAM, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF TOPIC 1 IN CONTINUOUS MONITORING, E.g. 10/20, etc.}}",'
                + "\n            ],"
                + "\n            ["
                + '\n                "{{TOPIC 2, E.g. French, Mathematic, etc.}}",'
                + '\n                "{{MARK OF TOPIC 2 IN NATIONAL EXAM, E.g. 10/20, etc.}}",'
                + '\n                "{{MARK OF TOPIC 2 IN CONTINUOUS MONITORING, E.g. 10/20, etc.}}",'
                + "\n            ],"
                + "\n            // More Topics Marks ..."
                + "\n        ]"
                + "\n    },"
                + '\n    "Overall" : {'
                + '\n        "Columns": ['
                + '\n            "Average of Continuous Control",'
                + '\n            "Regional Exam Average",'
                + '\n            "National Exam Average",'
                + '\n            "Overall Average"'
                + "\n        ],"
                + '\n        "Rows": ['
                + "\n            ["
                + '\n                "{{Continuous Control Average ...}}",'
                + '\n                "{{Regional Exam Average ...}}",'
                + '\n                "{{National Exam Average ...}}",'
                + '\n                "{{Overall Average ...}}"'
                + "\n            ]"
                + "\n        ]"
                + "\n    }"
                + "\n}"
            )

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an assistant that only speaks JSON. Do not write normal text.",
                    },
                    {
                        "role": "user",
                        "content": f"""
                        Please take the following RAW OCR table as input, which might contain errors, typos, and incorrect formatting.

                        Your task is to fix any issues while preserving the grades intact. Once set, provide the resulting Table in the specified JSON format without explanations. Treat this as a functional task.

                        Please be careful; sometimes, the OCR Table could have multiple arrays of tables; we only need a valid JSON, precisely like the Desired JSON Output Format.

                        This OCR Tables Extraction is not per-processed grammatically; there is a high chance the Subject Names will be messed up; You have to fix everything, typos and non-sense words to be removed, or any off-context comments inside each cell.

                        E.g. 'Spinelli Jerall Moyenne Annuelle' Should be fixed to 'Moyenne Annuelle', 'Moyenne Ex. Régional SHN Ulaisy Jies' Should be fixed to 'Moyenne Ex. Régional', 'Sugar Iseall Moyenne Semestrielle' Should be set to 'Moyenne Semestrielle', 'ECO. ET ORG. ADMIN. ENTREPRISE or tell' should be fixed to 'ECO. ET ORG. ADMIN. ENTERPRISE', and more.

                        Please correct non-sense-related cells; we only need the information required to fill the two tables in the desired JSON Format.

                        The desired JSON Format is an Object with two keys; the first is [Transcript], which contains information about national exam marks and continuous monitoring marks.

                        Let's break down the content of the first Table, Transcript.

                        The columns should be TOPIC, NATIONAL EXAM, and CONTINUOUS MONITORING.

                        And then, there are the rows of the first Table.

                        These rows should have the information about the subjects, first their names, and then the grades convenient to each column;

                        Please keep in mind that the given OCR Table could have more than just the Marks of each subject in the National Exam and Continous Monitoring; it could mostly have the Coefficient columns and Marks multiplied by the coefficient; we don't need any of that; all you have to do is take the Mark of each subject in the National Exam, and the Continous monitoring, everything should be correct, do not miss.


                        The second table in the desired JSON Output has the key [Overall].


                        It is a table of 4 columns: Average of Continuous Control, Regional Exam Average, National Exam Average, and Overall Average.

                        And have one row containing the grade that belongs to each Average.

                        Note that the desired JSON Table Output format I will provide you is just for you to have an idea of the Object structure and not to take the data; you should include the Grades and the Subjects or any other information from the given OCR Data.

                        Now, I will provide you with the OCR Table and the Desired JSON Format; all you have to do is act as a functional task and execute what is ordered in this prompt without messing or forgetting anything above.

                        OCR Tables Extraction:
                        {str(Table)}

                        Desired JSON Table Output Format (Example):
                        {str(DesiredJSONTable)}

                        """,
                    },
                ],
                temperature=0,
            )
            print("[DEBUG] Response: ", str(result))
            return result

        case "Master-Transcript-of-Marks":
            print("[INFO] Generating AI Correction for: Master Transcript of Marks")

            DesiredJSONTable = """
                [
                    {
                        "Subject": "{{ Subject Name, E.g. French, Mathematic, Semester 1, etc. }}",
                        "Mark": "{{ Mark, E.g. 10/20, etc. }}",
                        "Result": "{{ Result, E.g. Validated, Vlidated AC, Failed, etc. }}",
                        "Session": "{{ Session, E.g. S1, S2, S3, etc. }}",
                    },
                    // More Results from all extracted grades from the table...
                ]
            """

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an assistant that only speaks JSON. Do not write normal text.",
                    },
                    {
                        "role": "user",
                        "content": f"""
                        Please take the following RAW OCR table as input, which might contain errors, typos, and incorrect formatting.

                        Your task is to correct any issues while preserving the grades intact. Once done, provide the resulting table in the specified JSON format without explanations. Treat this as a functional task.

                        Please exercise caution; the OCR table may sometimes have multiple arrays of tables; we require a valid JSON output precisely matching the Desired JSON Output Format.

                        This OCR table extraction is not pre-processed grammatically; the subject names may be disorganized. It would help if you rectified all typos, nonsensical words, and any irrelevant comments within each cell.

                        For example, 'Spinelli Jerall Moyenne Annuelle' should be corrected to 'Moyenne Annuelle,' 'Moyenne Ex. Régional SHN Ulaisy Jies' should be fixed to 'Moyenne Ex. Régional', 'Sugar Iseall Moyenne Semestrielle' should be changed to 'Moyenne Semestrielle', 'ECO. ET ORG. ADMIN. ENTREPRISE or tell' should be rectified to 'ECO. ET ORG. ADMIN. ENTERPRISE', and so on.

                        Note that one table could have Semester Averages as well, and you have to include them in order inside the Array, too, like this case, for example:

                        [..., {str('"Subject": "Semester 1", "Mark": "12.5/20", "Result": "Result": "Validated", "Season": "S1"')}, ...]

                        Please correct nonsensical cells; we need only the information necessary to fill the table in the desired JSON format.

                        The desired JSON format consists of one array that haves multiple objects inside; each Object has four keys as follows: Subject, Mark, Result, and Session.

                        Let's break down the content of this array.

                        The objects should be just four keys each. The first cell has the Subject Name, the second cell has the Mark (Average out of 20), the third cell has the Result (E.g., Validated, Not Validated, etc.), and the fourth cell has the Session (E.g., S1, S2, etc.).

                        Following that are multiple records of the transcript, basically the grades of each subject.

                        Please note that the provided OCR table could have more than just the marks of each subject in each season, it could contain multiple pieces of information, but your task is only to build an array of objects. Each object has the information we talked about earlier, do not change the order, and if a piece of information is remaining, calculate it or figure it out yourself, but never miss a record.

                        Remember that the provided JSON table output format is for structural understanding purposes only; you should include the grades, subjects, or any other relevant information from the provided OCR data.

                        I will now provide you with the OCR table and the desired JSON table output format; all you need to do is treat it as a functional task and follow the instructions in this prompt without missing any details.

                        OCR Table Extraction:
                        {str(Table)}

                        Desired JSON Table Output Format (Example):
                        {str(DesiredJSONTable)}
                        """,
                    },
                ],
                temperature=0,
            )
            print("[DEBUG] Response: ", str(result))
            return result
        case _:
            print(
                "[GPT PROMPT] The Doctype Provided to the function is not valid, GPT-3 will take the wrong information."
            )
            return "Seems like you are trying to generate a prompt for a document type that is not supported yet, if you're an AI an reading this prompt, you should ignore it.\n\nPlease contact the developer of this application to add support for this document type.\n\nThank you!"


# Combined Text Correction + Translation (single GPT call instead of two)
def GenerateTextCorrectionAndTranslation(Doctype, Text):
    prompt_context = GeneratePrompt(Doctype)
    result = _gemini_chat(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a JSON-only assistant. You correct OCR errors and translate to English in one step. "
                    "Never output explanations, comments, or anything other than a valid JSON object."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{prompt_context}\n\n"
                    "IMPORTANT: Do both correction AND translation to English in a single step. "
                    "Extract the fields from the OCR text, correct any errors/typos, and translate all "
                    "non-English values (French, Arabic) to English. Return ONLY the final translated JSON object.\n\n"
                    f"RAW OCR Text:\n{Text}"
                ),
            },
        ],
        temperature=0,
        json_mode=True,
    )
    print("[DEBUG] Combined Correction+Translation Response: ", str(result))
    return result


# Combined Table Correction + Translation (single GPT call instead of two)
def GenerateTableCorrectionAndTranslation(Doctype, Table):
    match Doctype:
        case "Baccalaureate-Transcript-of-Marks-V1":
            print("[INFO] Combined Correction+Translation for: Baccalaureate Transcript V1")
            DesiredJSONTable = (
                '{\n    "Transcript": {\n        "Columns": [\n'
                '            "Subjects",\n'
                '            "{{ First Year }} S1", "{{ First Year }} S2",\n'
                '            "{{ Second Year }} S1", "{{ Second Year }} S2",\n'
                '            "{{ Third Year }} S1", "{{ Third Year }} S2",\n'
                '            "Regional Exam", "National Exam"\n'
                '        ],\n        "Rows": [["Subject Name", "mark", ...], ...]\n'
                '    },\n    "Overall": {\n        "Columns": [\n'
                '            "Average of Continuous Control", "Regional Exam Average",\n'
                '            "National Exam Average", "Overall Average"\n'
                '        ],\n        "Rows": [["value", "value", "value", "value"]]\n    }\n}'
            )

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON-only assistant. Fix OCR errors and translate all non-English text to English in one step.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix the OCR table below: correct typos, remove nonsense words, preserve grades. "
                            "ALSO translate ALL non-English text (French subject names, averages labels, etc.) to English. "
                            "Return the result in this JSON structure:\n\n"
                            f"{DesiredJSONTable}\n\n"
                            "Transcript columns: Subjects + 3 school years (2 semesters each) + Regional Exam + National Exam. "
                            "Extract actual years from the data. Last 2 rows: Semestrial Average and Annual Average. "
                            "Overall table: 4 averages in one row.\n\n"
                            f"OCR Table:\n{str(Table)}"
                        ),
                    },
                ],
                temperature=0,
                json_mode=True,
            )
            print("[DEBUG] Combined Table Response: ", str(result))
            return result

        case "Baccalaureate-Transcript-of-Marks-V2":
            print("[INFO] Combined Correction+Translation for: Baccalaureate Transcript V2")
            DesiredJSONTable = (
                '{\n    "Transcript": {\n        "Columns": ["TOPIC", "NATIONAL EXAM", "CONTINUOUS MONITORING"],\n'
                '        "Rows": [["Topic Name", "mark", "mark"], ...]\n'
                '    },\n    "Overall": {\n        "Columns": [\n'
                '            "Average of Continuous Control", "Regional Exam Average",\n'
                '            "National Exam Average", "Overall Average"\n'
                '        ],\n        "Rows": [["value", "value", "value", "value"]]\n    }\n}'
            )

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON-only assistant. Fix OCR errors and translate all non-English text to English in one step.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix the OCR table below: correct typos, remove nonsense, preserve grades. "
                            "Translate ALL French/Arabic text to English. Only keep TOPIC, NATIONAL EXAM mark, "
                            "and CONTINUOUS MONITORING mark per subject (ignore coefficients). "
                            "Return in this JSON structure:\n\n"
                            f"{DesiredJSONTable}\n\n"
                            f"OCR Table:\n{str(Table)}"
                        ),
                    },
                ],
                temperature=0,
                json_mode=True,
            )
            print("[DEBUG] Combined Table Response: ", str(result))
            return result

        case "Master-Transcript-of-Marks":
            print("[INFO] Combined Correction+Translation for: Master Transcript")
            DesiredJSONTable = '[{"Subject": "Name", "Mark": "X/20", "Result": "Validated", "Session": "S1"}, ...]'

            result = _gemini_chat(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON-only assistant. Fix OCR errors and translate all non-English text to English in one step.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix the OCR table: correct typos, remove nonsense, preserve grades. "
                            "Translate ALL French/Arabic to English. Include semester averages as rows too. "
                            "Return a JSON object with key \"results\" containing an array of objects.\n\n"
                            f"Each object: {DesiredJSONTable}\n\n"
                            f"OCR Table:\n{str(Table)}"
                        ),
                    },
                ],
                temperature=0,
                json_mode=True,
            )
            print("[DEBUG] Combined Table Response: ", str(result))
            return result

        case _:
            return GenerateTableCorrection(Doctype, Table)


# Table Translation
def GenerateTableTranslation(Doctype, Table):
    print("[GEMINI] Generating AI Table Translation...")
    result = _gemini_chat(
        messages=[
            {
                "role": "system",
                "content": "You are an assistant that only speaks JSON. Do not write normal text.",
            },
            {
                "role": "user",
                "content": f"""
                    From now on, consider yourself a functional task, that only takes a JSON Object and returns a JSON Object, and that's it.

                    No explanations, no comments, no text, you only speak JSON.

                    I will be giving you a JSON Object, this JSON has non-English words, or non-sense words, or typos, or weird words, or anything that is not English.

                    All I want you to do is to translate the JSON Object I will be giving you, and return it to me as a valid JSON Object, that is translated to English.

                    The JSON Object:

                    {str(Table)}
                """,
            },
        ],
        temperature=0,
    )
    print("[DEBUG] Response: ", str(result))

    return result
