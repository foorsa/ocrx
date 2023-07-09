# JSON
import requests


def PromptString(PromptVersion, AvailableDoctypes, PromptOptions):
    return f"""
                We are in a python project, I need help in getting precise
                output from the OCR processor.

                This python app gets a request with a File and a Document type.

                The File could be a PDF or an Image.

                The Document Type could be one of the following: 
                
                {AvailableDoctypes}

                This application has already processed the file and the Document with OCR.

                The OCR output is a text string containing the information about the diploma.

                The OCR output is not precise, it contains some errors.

                I need to correct the OCR output and get the precise information about the diploma.

                The OCR output is in the variable Content.

                Please read the string and convert it to something that can be used by the application.

                I need the data to be shaped this way:
            
                {PromptOptions}
                
                Now, I need you to translate the corrected output to English.
                
                Any value that is present in the OCR Output should be translated to English.
                
                Do not forget to translate any single french word.
                
                As well as the Specialization, it should be translated to English as well.
                
                In short, any french word should be translated to English.
                
                [Keyword: Original (No Translation)]: [Value: Translated]
                
                Do not Translate the Keys, only the Values.
                    
                Use some intelligent logic to determine whether the values are valid  or not.
                
                So on for any other value that is present in the OCR Output. 
                
                I need this translation to be done in the best effort and accuracy that you can possibly do.
                
                I need the data to be shaped to a JSON Object.
                
                NOTICE: 
                    No need to comment or explain, just translate it and then return it.
                    This means I need a valid JSON Object as an output from your response.
                    Any additional text will be considered as an error.
                    Please do not forget to translate each option's value accurately as well (Obligatory: Series and Speciality from french to english).
                    Please keep the same format as the example above.
                    Do change the name of the options.
                    The object keys should be the same as the example above.
                    Reply with the JSON object ONLY.
                    So please do not add anything to the object, it is the JSON object that the application needs.
                    DO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.
                    NO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT.
            """


def GeneratePrompt(Doctype):
    # Options available for each Document Type
    # Load JSON From URL
    URL = "https://ocrx.foorsa.co/api/documents"

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
                    PromptOptions.append(f"{Field['name']}: {Field['description']}")

    AvailableDoctypes = "\n \n".join(AvailableDoctypes)
    PromptOptions = "\n \n".join(PromptOptions)

    Prompt = PromptString(2, AvailableDoctypes, PromptOptions)

    return Prompt
