# JSON
import requests
import openai

# from Utilities.GPTPrompts import GeneratePrompt, GenerateTabularPrompt

# Load your API key from an environment variable or secret management service
openai.api_key = "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"


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


# Tabular Transcript Prompt Generation
def GenerateTableCorrection(Doctype, Content):
    match Doctype:
        case "Baccalaureate-Transcript-of-Notes":
            print(
                "[INFO] Generating AI Correction for: Baccalaureate Transcript of Notes"
            )
            return openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k-0613",
                messages=[
                    {
                        "role": "system",
                        "content": "We are in a Python Software, its name is OCRX, and we are using the OCR output to correct it and extract the information from it, and translate it to English, in this Software, it is restricted and illegal for the AI to respond with Anything but JSON Formats !",
                    },
                    {
                        "role": "user",
                        "content": """
                            USER:
                            We are working on a Python project and need help with getting precise output from the OCR processor.

                            Our app extracts information from student-related documents using OCR, such as Baccalaureate Certificates and Master Certificates.

                            We are currently processing the tabular information of the Baccalaureate Transcript of Marks in this function of the Web App.

                            I will provide you with a JSON Table extracted from the document using more precise technology.

                            The JSON Table contains two tables. The first table has the transcript of grades, and the second table is the second detected OCR table, which contains the overall results of the transcript.

                            Your task is to produce a better-shaped JSON for the two tables, with every single word translated accurately and precisely into English. Please correct any typos or detected problems in the table without altering the original scanned document.

                            I will provide you with more information required for the current document to process, which is a Baccalaureate Transcript of Marks.

                            The JSON Data I will be giving you is extracted with OCR, so, it will be mostly having wrong values cells, that have some weird characters or words, use your own intelligence to fix the content off each cell, and make sure to translate every non-English word to English.

                            Make sure, that all cell values and words make sense, fix everything to English, and remember the table is a Transcript of Marks.

                            Your JSON Output should be this way:

                            ```json
                            {
                                "Transcript":[
                                    ["...", "...", "...", "...", "...", "...", "...", "...", "..."], // Row Extracted from OCR Table filled with Columns, all english.
                                            // More Rows from all extracted Information from the first table but every word that is non-English should be translated to English, but corrected and fixed grammarly ...
                                ],
                                "Overall":[
                                    ["Average of Continuous Control", "Regional Exam Average", "National Exam Average", "Overall Average"],
                                    ["...", "...", "...", "..."] // Overall Averages for each column value
                                ]
                            }
                            ```
                            
                            I want you to fix every word and every row in that Transcripts Table, if the row doesn't make sense, please do something about it, if the row is just empty and doesn't make sense, delete it, convert every word to English, and make sure that the table is a Transcript of Marks.

                            NOTICE:
                            No need to comment or explain, just translate each word in both tables to English and then return the JSON object.

                            This means I need JSON object as output from your response: has key one for the first table and another for the second table.

                            Any additional text will be considered an error.

                            Reply with each JSON object ONLY.

                            So please do not add anything to the objects, use the JSON object as valid output that should not be changed.

                            DO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.

                            NO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT.

                            THE JSON I WILL PROVIDE YOU ARE ONLY FOR DATA EXTRACTION USAGE!

                            DO NOT USE THEIR STRUCTURES, USE THE ONES I TOLD YOU ABOVE AS STRUCTURES.

                            Your response will be used a code part, please don't write anything but JSON.

                            Act as you are a function that takes a table as a argument and returns a JSON of it.

                            Don't explain anything or describe anything, do the ordered task and shut the fuck up.
                        """,
                    },
                    {
                        "role": "assistant",
                        "content": """
                            **AI:**
                            Sure, what is the OCR output?

                            I will provide you with the information extracted from the OCR as a JSON object without any comments.

                            I will also translate every word accurately to its corresponding English term.

                            I will be writing a JSON that has all the information mentioned in your description.

                            A JSON of an object with two keys "Transcript" and "Overall".

                            All their records will be accurately extracted from the Data you will be giving me in your next response.

                            I will make sure to only send a valid JSON output, no additional words, and no additional comments, I will send a response entirely as JSON, and I will not provide anything with the JSON I will be giving.
                            I will act as a function that only returns a response of a JSON type in my next responses.

                            If there are any keywords in French or Arabic, I will translate them into English with accuracy.

                            I will provide you with the OCR output in a JSON format that is valid to copy and use directly from my text response, I won't be writing anything above or below the JSON Response I give you.

                            I will act as a function that only returns JSON, and nothing but JSON in my next replies.
                        """,
                    },
                    {
                        "role": "user",
                        "content": str(Content),
                    },
                ],
            )
        case "Master-Transcript-of-Marks":
            print("[INFO] Generating AI Correction for: Master Transcript of Marks")
            return openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k-0613",
                messages=[
                    {
                        "role": "system",
                        "content": "We are in a Python Software, its name is OCRX, and we are using the OCR output to correct it and extract the information from it, and translate it to English, in this Software, it is restricted and illegal for the AI to respond with Anything but JSON Formats !",
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
                        "content": str(Content),
                    },
                ],
            )
        case _:
            print(
                "[GPT PROMPT] The Doctype Provided to the function is not valid, GPT-3 will take the wrong information."
            )
            return "Seems like you are trying to generate a prompt for a document type that is not supported yet, if you're an AI an reading this prompt, you should ignore it.\n\nPlease contact the developer of this application to add support for this document type.\n\nThank you!"
