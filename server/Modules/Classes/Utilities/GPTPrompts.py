# JSON
import requests
import openai
import os

from dotenv import load_dotenv, find_dotenv

_ = load_dotenv(find_dotenv())

openai.api_key = os.getenv("OPENAI_API_KEY")


def PromptString(Doctype, AvailableDoctypes, PromptOptions):
    # Intialize an Empty string for the prompt
    Prompt = ""

    # Dynamically set the convenient prompt options for the prompt
    match Doctype:
        case "Master-Transcript-of-Marks" | "Baccalaureate-Transcript-of-Notes":
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


def GeneratePrompt(Doctype):
    # Options available for each Document Type
    # Load JSON From URL
    URL = "https://ocrx.vercel.app/api/documents"

    # Get the JSON Data
    Data = requests.get(URL).json()

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
    Response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0301",
        temperature=0,
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
    )
    print("[DEBUG] Response: ", str(Response.choices[0].message.content))
    return Response.choices[0].message.content


# Text Translation
def GenerateTextTranslation(Doctype, Text, RAW_OCR):
    Response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0301",
        temperature=0,
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
    )

    JSON_OBJECT = "{" + Response.choices[0].message.content.split("{", 1)[1]

    print("[INFO] Translation Response: ", str(JSON_OBJECT))
    return JSON_OBJECT


# Table Correction
def GenerateTableCorrection(Doctype, Table):
    match Doctype:
        case "Baccalaureate-Transcript-of-Notes":
            print(
                "[INFO] Generating AI Correction for: Baccalaureate Transcript of Notes"
            )

            DesiredJSONTable = (
                "{"
                + '\n    "Transcript": {'
                + '\n        "Columns": ['
                + '\n            "Subjects",'
                + '\n            "2019/2020 S1",'
                + '\n            "2019/2020 S2",'
                + '\n            "2020/2021 S1",'
                + '\n            "2020/2021 S2",'
                + '\n            "2021/2022 S1",'
                + '\n            "2021/2022 S2",'
                + '\n            "Regional Exam",'
                + '\n            "National Exam"'
                + "\n        ],"
                + '\n        "Rows": ['
                + "\n            ["
                + '\n                "LANGUE ARABE",'
                + '\n                "08,00",'
                + '\n                "",'
                + '\n                "13,56",'
                + '\n                "13,16",'
                + '\n                "18,53",'
                + '\n                "",'
                + '\n                "14,00",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "LANGUE FRANCAISE",'
                + '\n                "10,70",'
                + '\n                "",'
                + '\n                "10,85",'
                + '\n                "11,20",'
                + '\n                "19,15",'
                + '\n                "",'
                + '\n                "05,00",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "LANGUE ANGLAISE",'
                + '\n                "15,75",'
                + '\n                "",'
                + '\n                "12,80",'
                + '\n                "15,80",'
                + '\n                "18,48",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "HISTOIRE GEOGRAPHIE",'
                + '\n                "10,78",'
                + '\n                "",'
                + '\n                "16,50",'
                + '\n                "17,62",'
                + '\n                "19,31",'
                + '\n                "",'
                + '\n                "04,00",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "MATHEMATIQUES",'
                + '\n                "12,50",'
                + '\n                "",'
                + '\n                "09,00",'
                + '\n                "14,33",'
                + '\n                "20,00",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "SC. DE LA VIE ET DE LA TERRE",'
                + '\n                "07,06",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "PHYSIQUE CHIMIE",'
                + '\n                "05,00",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "INSTRUCTION ISLAMIQUE",'
                + '\n                "10,00",'
                + '\n                "",'
                + '\n                "15,00",'
                + '\n                "11,38",'
                + '\n                "19,38",'
                + '\n                "",'
                + '\n                "08,00",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "EDUCATION PHYSIQUE",'
                + '\n                "15,00",'
                + '\n                "",'
                + '\n                "18,00",'
                + '\n                "17,83",'
                + '\n                "20,00",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "INFORMATIQUE",'
                + '\n                "10,80",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "PHILOSOPHIE",'
                + '\n                "10,88",'
                + '\n                "",'
                + '\n                "12,50",'
                + '\n                "14,50",'
                + '\n                "17,44",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "ASSIDUITE ET CONDUITE",'
                + '\n                "20,00",'
                + '\n                "",'
                + '\n                "20,00",'
                + '\n                "20,00",'
                + '\n                "20,00",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "DROIT",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "13,56",'
                + '\n                "15,12",'
                + '\n                "19,22",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "COMPTA. ET MATHS. FINANCIERES",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "14,06",'
                + '\n                "14,38",'
                + '\n                "19,06",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "ECO. GENERALE ET STATISTIQUES",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "12,38",'
                + '\n                "13,38",'
                + '\n                "18,75",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "ECO. ET ORG. ADMIN. ENTREPRISE",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "15,19",'
                + '\n                "13,31",'
                + '\n                "18,03",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "INFORMATIQUE DE GESTION",'
                + '\n                "",'
                + '\n                "",'
                + '\n                "18,00",'
                + '\n                "17,88",'
                + '\n                "19,25",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "Moyenne Semestrielle",'
                + '\n                "10,60",'
                + '\n                "10,67",'
                + '\n                "13,47",'
                + '\n                "14,34",'
                + '\n                "19,09",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ],"
                + "\n            ["
                + '\n                "Moyenne Annuelle",'
                + '\n                "",'
                + '\n                "10,67",'
                + '\n                "",'
                + '\n                "13,90",'
                + '\n                "",'
                + '\n                "",'
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
                + '\n                "",'
                + '\n                "",'
                + '\n                "",'
                + '\n                ""'
                + "\n            ]"
                + "\n        ]"
                + "\n    }"
                + "\n}"
            )

            Response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0301",
                temperature=0,
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
                            "Let’s break down the content of the first Table, Transcript.\n\n"
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
            )

            print("[DEBUG] Response: ", str(Response.choices[0].message.content))
            return Response.choices[0].message.content

        case "Master-Transcript-of-Marks":
            print("[INFO] Generating AI Correction for: Master Transcript of Marks")
            Response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0301",
                temperature=0,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an assistant that only speaks JSON. Do not write normal text.",
                    },
                    {
                        "role": "user",
                        "content": """
                            USER:
                            We are working on a Python project and need help with getting precise output from the OCR processor.

                            Our app extracts information from student-related documents using OCR, such as Baccalaureate Certificates and Master Certificates.

                            We are currently processing the tabular information of the Transcript of Notes in this function of the Web App.

                            For regular documents without tables, we use OCR to extract raw output, give it to ChatGPT, and returns a translated and corrected JSON object with the values.

                            However, in this case, I will not be giving you a RAW OCR output. Instead, I will give you a JSON Table extracted from the document with more precise technology.

                            What I need is a better-shaped JSON for the table, with every single word in English, translated accurately and precisely.

                            If there are any typos or detected problems in the table, whether it is a misspelled word or wrong data format, please correct it to the correct format, without leading to a difference to the original scanned document from which we extracted this JSON table.

                            I will provide you with more information required for the current document to process, which could be a Master Transcript of Marks or a Baccalaureate Transcript of Notes.

                            In this case, we are dealing with a Transcript of Marks for a Master's Student.

                            With the JSON Table, I provide, I need every cell translated to English, and every typo or detected problem corrected.

                            Simply, the JSON Data I will be giving you is extracted with OCR, so we only need to use it as a valid data source, not a structure, we only take what we need out of it, which is an array with objects of 4 keys: Subject, Mark, Result, Session.

                            So your JSON Output should be this way:

                            ```json
                            [
                                {
                                    "Subject": "...", // Subject Name
                                    "Mark": "...", // Mark Grade N/20
                                    "Result": "...", // Result of the Subject (Validated, Not Validated, ...)
                                    "Session": "..." // Session Identification (S1, S2, ...)
                                },
                                // More Results from all extracted grades from the table...
                            ]
                            ```
                            
                            I mention again, the table that the OCR returns would be wrong, so just figure out what the data source should be and what the data source should look like, and then return it in the correct format for the application to process it.
                            
                            Also do not change the order of the grades. This is because the order is not guaranteed by the application to be the same as the order of the grades in the table.
                            
                            Whatever the given result is, it should be translated to English.
                            
                            Mention that the information should be transformed importantly to the format I provided, so please do not change the format of the JSON object.
                            
                            The JSON object should be an array of objects, each object has 4 keys: Subject, Mark, Result, Session.
                            
                            The Subject is the name of the Subject, it should be translated to English.
                            
                            The Mark is the value of the mark, it should be formatted as a number out of 20, for example: 15/20, 13.2/20, ans so on.
                            
                            Remember, sometimes the table containes a Subject named "Semester 1" or whatever semester it is, that row is important, it should be also contained in the corrected table, so if you see something like Semester (X) or (X) Semester, please add it to the table, if you can't find the information of it, just calculate it.
                            
                            What I mean, is that the "Semestre 1, or Semestre 2, etc.", is the result of each semester, and it should be translated to English as well, all French words should be translated to English, whatever they are Subjects, Sessions, or Results, or anything, I don't want to see any french word in your output.
                            
                            Remember, you should never let an empty cell !
                            
                            Always use your intelligence to fill the cells with the correct information, if you can't find the information, just calculate it. 
                            
                            If somehow the OCR is not correct, use your intelligence to fill the values of the object correctly.
                            
                            The Result is the decision of the Subject, it should be translated to English, mostly it could be "Validated" or "Not Validated", and so on, so you can use your intelligence to
                            fill the values of the object correctly.
                            
                            The Session is the session of the exam, it should be translated to English, mostly it could be "S1, S3, etc." and so on, so you can use your intelligence to fill the values of the object correctly.
                            
                            Keep in mind that each object is unique for one single Subject, so please don't fill a Mark key with a Subject Name.
                            
                            For example, this is one subject's object that is correct:
                            
                            ```json
                            {
                                "Subject": "Algebra",
                                "Mark": "15/20",
                                "Result": "Validated",
                                "Session": "S1"
                            }
                            ```
                            
                            This is a wrong object:

                            ```json
                            {
                                "Subject": "Algebra",
                                "Mark": "Mathematics",
                                "Result": "Physics",
                                "Session": "Chemistry"
                            }
                            ```
                            
                            So please, be careful when filling the values of the object, they must be correct.
                            
                            Mostly, the OCR is returning and extracting the data correctly, so you don't need to worry about it, just use that data and fill the values of the object correctly, even if you need to calculate the values, just do so.
                            
                            Please, whatever subject name the OCR Table has, include it in your response, sometimes, the OCR Scanned Document wouldn't have the information same as what we need, but be sure to determine the correct information required to fill the Array of Objects we need, and translate all subjects to English.
                            
                            The OCR is always giving a list of Columns, not rows, so don't get confused if you see the data in a column, not a row, but in all cases I want the formula to be the same, an array of objects, each object has 4 keys: Subject, Mark, Result, Session, with the values filled correctly.

                            **NOTICE:**
                            No need to comment or explain, just translate it and then return it.

                            This means I need a valid JSON object as an output from your response.
                            Any additional text will be considered an error.

                            Reply with the JSON object ONLY.

                            So please do not add anything to the object, it is the JSON object that the application needs.

                            DO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.

                            NO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT.

                            THE JSON I WILL PROVIDE YOU IS ONLY FOR DATA EXTRACTION USAGE!

                            DO NOT USE ITS STRUCTURE, USE THE ONE I TOLD YOU THAT HAS ARRAY VALUES FOR EACH ROW! 

                            I REPEAT, DO NOT WRITE OR REPLY BY ANYTHING EXCEPT A JSON-VALID OBJECT.

                            DO NOT CHANGE THE JSON SHAPE, I NEED A JSON SHAPE JUST AS I MENTIONED ABOVE AS A STRUCTURE :

                            **[{"Subject": "Subject X", "Mark": "Mark X (N/20)", "Result": "Result X (Validated, Not Validated, etc.)", "Session": "Session X (S1 2016/17, S2 2016/17, etc.)"}, *// More Results from all extracted Information from the table ...*];**

                            THE OBJECT SHOULD BE EXACTLY LIKE THE SHAPE I MENTIONED.

                            Do not add any other key than the four keys in each object (Subject, Mark, Result, Session).

                            Please stick to the JSON OUTPUT given to you, use it as a valid output that should not be changed.

                            PLEASE TRANSLATE EVERY SINGLE FRENCH WORD TO ENGLISH, AND FIX ALL TYPOS OR WEIRD TEXT.

                            TRANSLATE THE ENTIRE WORDS TO ENGLISH.
                        """,
                    },
                    {
                        "role": "assistant",
                        "content": """
                            AI:
                            Sure, what is the OCR output?

                            I will provide you with the information extracted from the OCR as a JSON object without any comments.

                            I will also translate every word accurately to its corresponding English term.

                            I will be writing a JSON that has all the information mentioned in your description.

                            An array of objects, each object has 4 keys: Subject, Mark, Result, and Session.

                            All their records will be accurately extracted from the Data you will be giving me in your next response.

                            I will make sure to only send a valid JSON output, no additional words, and no additional comments, I will send a response entirely as JSON, I will not provide anything with the JSON I will be giving.
                            
                            I will act as a function that only returns a response of a JSON type in my next responses.

                            If there are any keywords in French or Arabic, I will translate them into English with accuracy.

                            I will provide you with the OCR output in a JSON format that is valid to copy and use directly from my text response, I won't be writing anything above or below the JSON Response I give you.
                        """,
                    },
                    {
                        "role": "user",
                        "content": str(Table),
                    },
                ],
            )

            print("[DEBUG] Response: ", str(Response.choices[0].message.content))
            return Response.choices[0].message.content
        case _:
            print(
                "[GPT PROMPT] The Doctype Provided to the function is not valid, GPT-3 will take the wrong information."
            )
            return "Seems like you are trying to generate a prompt for a document type that is not supported yet, if you're an AI an reading this prompt, you should ignore it.\n\nPlease contact the developer of this application to add support for this document type.\n\nThank you!"


# Table Translation
def GenerateTableTranslation(Doctype, Table):
    print("[GPT] Generating AI Table Translation...")
    match Doctype:
        case "Baccalaureate-Transcript-of-Notes":
            # Baccalaureate-Transcript-of-Notes Prompt Generation
            TableResponse = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0301",
                temperature=0,
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
            )
            print("[DEBUG] Response: ", str(TableResponse.choices[0].message.content))

            return TableResponse.choices[0].message.content

        case "Master-Transcript-of-Marks":
            # Master-Transcript-of-Marks Prompt Generation
            TableResponse = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-0301",
                temperature=0,
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
            )

            print("[DEBUG] Response: ", str(TableResponse.choices[0].message.content))
            return TableResponse.choices[0].message.content
        case _:
            print(
                "[GPT PROMPT] The Doctype Provided to the function is not valid, GPT-3 will take the wrong information."
            )
            return "Seems like you are trying to generate a prompt for a document type that is not supported yet, if you're an AI an reading this prompt, you should ignore it.\n\nPlease contact the developer of this application to add support for this document type.\n\nThank you!"
