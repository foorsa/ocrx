# JSON
import os
from openai import OpenAI

from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Model to use for all GPT calls
GPT_MODEL = "gpt-4o-mini"


def PromptString(Doctype, AvailableDoctypes, PromptOptions):
    return (
        f"Extract and correct OCR text from a document into a JSON object.\n"
        f"Document type: {Doctype}\n"
        f"Required fields:\n{PromptOptions}\n\n"
        f"Rules:\n"
        f"- Fix OCR errors and typos\n"
        f"- Translate ALL French/Arabic values to English (keys stay unchanged)\n"
        f"- Translate Series and Speciality to English\n"
        f"- Return ONLY a valid JSON object, no comments or explanations"
    )


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
    Response = client.chat.completions.create(
        model=GPT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=1024,
        messages=[
            {
                "role": "system",
                "content": "You extract and correct OCR text into structured JSON. Return only valid JSON.",
            },
            {
                "role": "user",
                "content": GeneratePrompt(Doctype),
            },
            {
                "role": "assistant",
                "content": "Send me the OCR output and I will return a corrected, translated JSON object.",
            },
            {
                "role": "user",
                "content": Text,
            },
        ],
    )
    result = Response.choices[0].message.content
    print("[DEBUG] Response: ", str(result))
    return result


# Text Translation
def GenerateTextTranslation(Doctype, Text, RAW_OCR):
    Response = client.chat.completions.create(
        model=GPT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=1024,
        messages=[
            {
                "role": "system",
                "content": "Translate JSON values from French/Arabic to English. Keep keys unchanged. Fill empty values from the RAW OCR text. Return valid JSON only.",
            },
            {
                "role": "user",
                "content": f"Translate all values to English. If any value is empty, find it in the RAW OCR text.\n\nJSON Object:\n{Text}\n\nRAW OCR (fallback for missing values):\n{RAW_OCR}",
            },
        ],
    )

    raw_content = Response.choices[0].message.content
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

            Response = client.chat.completions.create(
                model=GPT_MODEL,
                temperature=0,
                response_format={"type": "json_object"},
                max_tokens=4096,
                messages=[
                    {
                        "role": "system",
                        "content": "You correct OCR table data into structured JSON. Fix typos and nonsense in subject names (e.g. 'Spinelli Jerall Moyenne Annuelle' → 'Moyenne Annuelle'). Preserve all grades exactly. Return valid JSON only.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix this RAW OCR table and output it in the specified JSON format.\n\n"
                            "Rules:\n"
                            "- Fix subject name typos and remove nonsense words\n"
                            "- Keep all grades/numbers exactly as they are\n"
                            "- Extract years from the original transcript (e.g. 2022/2023)\n"
                            "- Transcript table: Subjects + 3 years (S1,S2 each) + Regional Exam + National Exam columns\n"
                            "- Last 2 rows: Semester Average (Moyenne Semestrielle) and Annual Average (Moyenne Annuelle)\n"
                            "- Overall table: 4 columns (Continuous Control, Regional Exam, National Exam, Overall Average)\n\n"
                            "OCR Tables:\n"
                            f"{str(Table)}\n\n"
                            "Desired JSON format:\n"
                            f"{str(DesiredJSONTable)}"
                        ),
                    },
                ],
            )

            result = Response.choices[0].message.content
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

            Response = client.chat.completions.create(
                model=GPT_MODEL,
                temperature=0,
                response_format={"type": "json_object"},
                max_tokens=4096,
                messages=[
                    {
                        "role": "system",
                        "content": "You correct OCR table data into structured JSON. Fix typos in subject names. Preserve all grades exactly. Return valid JSON only.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix this RAW OCR table and output it in the specified JSON format.\n\n"
                            "Rules:\n"
                            "- Fix subject name typos and remove nonsense words\n"
                            "- Keep all grades/numbers exactly as they are\n"
                            "- Transcript table: 3 columns (TOPIC, NATIONAL EXAM, CONTINUOUS MONITORING)\n"
                            "- Ignore coefficient columns — only extract the raw marks\n"
                            "- Overall table: 4 columns (Continuous Control, Regional Exam, National Exam, Overall Average)\n\n"
                            f"OCR Tables:\n{str(Table)}\n\n"
                            f"Desired JSON format:\n{str(DesiredJSONTable)}"
                        ),
                    },
                ],
            )

            result = Response.choices[0].message.content
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

            Response = client.chat.completions.create(
                model=GPT_MODEL,
                temperature=0,
                response_format={"type": "json_object"},
                max_tokens=4096,
                messages=[
                    {
                        "role": "system",
                        "content": "You correct OCR table data into structured JSON. Fix typos in subject names. Preserve all grades exactly. Include semester averages. Return valid JSON only.",
                    },
                    {
                        "role": "user",
                        "content": (
                            "Fix this RAW OCR table and output as a JSON object with a \"results\" key containing an array of objects.\n\n"
                            "Rules:\n"
                            "- Each object has 4 keys: Subject, Mark, Result, Session\n"
                            "- Fix subject name typos, remove nonsense words\n"
                            "- Keep all grades/numbers exactly as they are\n"
                            "- Include semester averages as records too\n"
                            "- Do not miss any record\n\n"
                            f"OCR Table:\n{str(Table)}\n\n"
                            f"Desired JSON format:\n{str(DesiredJSONTable)}"
                        ),
                    },
                ],
            )

            result = Response.choices[0].message.content
            print("[DEBUG] Response: ", str(result))
            return result
        case _:
            print(
                "[GPT PROMPT] The Doctype Provided to the function is not valid, GPT-3 will take the wrong information."
            )
            return "Seems like you are trying to generate a prompt for a document type that is not supported yet, if you're an AI an reading this prompt, you should ignore it.\n\nPlease contact the developer of this application to add support for this document type.\n\nThank you!"


# Table Translation
def GenerateTableTranslation(Doctype, Table):
    print("[GPT] Generating AI Table Translation...")
    TableResponse = client.chat.completions.create(
        model=GPT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=4096,
        messages=[
            {
                "role": "system",
                "content": "Translate all non-English text in the JSON to English. Keep structure and numbers unchanged. Return valid JSON only.",
            },
            {
                "role": "user",
                "content": f"Translate this JSON table to English:\n\n{str(Table)}",
            },
        ],
    )
    result = TableResponse.choices[0].message.content
    print("[DEBUG] Response: ", str(result))

    return result


# Combined Table Correction + Translation in a single GPT call (used by /api/v1/process)
def GenerateTableCorrectionAndTranslation(Doctype, Table):
    print("[GPT] Generating combined AI Table Correction + Translation...")

    DesiredFormat = ""
    match Doctype:
        case "Baccalaureate-Transcript-of-Marks-V1":
            DesiredFormat = (
                '{"Transcript": {"Columns": ["Subjects", "YYYY/YYYY S1", "YYYY/YYYY S2", ...repeat for 3 years..., "Regional Exam", "National Exam"], '
                '"Rows": [["Subject Name", "grade", "grade", ...], ..., ["Semester Average", ...], ["Annual Average", ...]]}, '
                '"Overall": {"Columns": ["Average of Continuous Control", "Regional Exam Average", "National Exam Average", "Overall Average"], '
                '"Rows": [["value", "value", "value", "value"]]}}'
            )
        case "Baccalaureate-Transcript-of-Marks-V2":
            DesiredFormat = (
                '{"Transcript": {"Columns": ["TOPIC", "NATIONAL EXAM", "CONTINUOUS MONITORING"], '
                '"Rows": [["Subject Name", "grade", "grade"], ...]}, '
                '"Overall": {"Columns": ["Average of Continuous Control", "Regional Exam Average", "National Exam Average", "Overall Average"], '
                '"Rows": [["value", "value", "value", "value"]]}}'
            )
        case "Master-Transcript-of-Marks":
            DesiredFormat = (
                '{"results": [{"Subject": "Subject Name", "Mark": "grade/20", "Result": "Validated/Failed", "Session": "S1/S2/..."}, ...]}'
            )
        case _:
            # Fallback: just correct then translate separately
            corrected = GenerateTableCorrection(Doctype, Table)
            import json
            corrected_obj = json.loads(corrected)
            translated = GenerateTableTranslation(Doctype, corrected_obj)
            return corrected_obj, json.loads(translated)

    Response = client.chat.completions.create(
        model=GPT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=4096,
        messages=[
            {
                "role": "system",
                "content": (
                    "You correct OCR table data and translate it to English in one step. "
                    "Fix typos in subject names. Preserve all grades exactly. "
                    "Return a JSON object with two keys: \"corrected\" (original language, corrected) and \"translated\" (English translation). "
                    "Both must have the exact same structure."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Fix this RAW OCR table, then translate subject names to English.\n\n"
                    "Return JSON with:\n"
                    "- \"corrected\": the fixed table in original language\n"
                    "- \"translated\": the same table but with all text translated to English\n\n"
                    f"Each table should follow this structure: {DesiredFormat}\n\n"
                    f"OCR Tables:\n{str(Table)}"
                ),
            },
        ],
    )
    result = Response.choices[0].message.content
    print("[DEBUG] Combined Response: ", str(result))

    import json
    parsed = json.loads(result)
    return parsed.get("corrected", parsed), parsed.get("translated", parsed)


# Combined Text Correction + Translation in a single GPT call (used by /api/v1/process)
def GenerateTextCorrectionAndTranslation(Doctype, Text):
    print("[GPT] Generating combined AI Text Correction + Translation...")

    Response = client.chat.completions.create(
        model=GPT_MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        max_tokens=2048,
        messages=[
            {
                "role": "system",
                "content": (
                    "You correct OCR text and translate it to English in one step. "
                    "Return a JSON object with two keys: \"corrected\" (extracted fields in original language) "
                    "and \"translated\" (same fields translated to English). Keep keys unchanged in both."
                ),
            },
            {
                "role": "user",
                "content": GeneratePrompt(Doctype) + f"\n\nReturn both corrected and translated versions in one JSON object with keys \"corrected\" and \"translated\".\n\nOCR Text:\n{Text}",
            },
        ],
    )
    result = Response.choices[0].message.content
    print("[DEBUG] Combined Text Response: ", str(result))

    import json
    parsed = json.loads(result)
    return parsed.get("corrected", parsed), parsed.get("translated", parsed)
