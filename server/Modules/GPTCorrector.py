import json
import os
import openai

# Load your API key from an environment variable or secret management service
openai.api_key = "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"


class GPTCorrector:
    def __init__(self, gpt_model):
        self.gpt_model = gpt_model

    def Correct(self, text, doctype):
        Reponse = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": GeneratePrompt(doctype),
                },
                {
                    "role": "assistant",
                    "content": """
                    Sure, What is the OCR output?
                    
                    I will provide you with the information extracted from the OCR as a JSON object without any comments.
                    
                    I will also translate the OCR output into English.
                    
                    Including any keyword in french, it will be translated into English with Accuracy.
                    """,
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
        )

        Corrected = Reponse.choices[0].message.content.strip()
        return Corrected

    def Parse(self, Corrected):
        def Convert_To_Json(Corrected):
            return json.loads(Corrected)

        return Convert_To_Json(Corrected)


def GeneratePrompt(Doctype):
    # Options available for each Document Type

    BaccalaureateOptions = f"""
        "Type": Baccalaureate Diploma
        "Serial Number": Baccalaureate Diploma Id Number (Mandatory 10 Characters Long), e.g. LXXXXXXXXX, L123456789, etc. 
        "Candidate": Candidate Name
        "Date of birth": Date of Birth
        "City": City Name
        "Insitute": Institute Name
        "Province": Name of the Provincial Leadership
        "Session": Year and Month, example: July 2020, etc.
        "Series": Speciality Name, example: Services Option Services et Restaurant, Science Physiques, Sciences de la vie et de la terre, etc.
        "Mention": Mention Name, example: "Passable, Assez Bien, Bien, Tres Bien, etc".
    """
    LanguageOptions = """"""

    MasterOptions = """"""

    # Prompt

    Prompt = f"""
        We are in a python project, I need help in getting precise
        output from the OCR processor.

        This python app gets a request with a File and a Document type.

        The File could be a PDF or an Image.

        The Document Type could be: Baccalaureate Diploma, Language Diploma, or a Master Diploma.

        This application has already processed the file and the Document with OCR.

        The OCR output is a text string containing the information about the diploma.

        The OCR output is not precise, it contains some errors.

        I need to correct the OCR output and get the precise information about the diploma.

        The OCR output is in the variable Content.

        Please read the string and convert it to something that can be used by the application.

        I need the data to be shaped this way:
        {Doctype == "Baccalaureate Diploma" and BaccalaureateOptions}
        {Doctype == "Language Diploma" and LanguageOptions}
        {Doctype == "Master Diploma" and MasterOptions}
        
        Now, I need you to translate the corrected output to English.
        
        Any value that is present in the OCR Output should be translated to English.
        
        Do not forget to translate any single french word.
        
        This means that if there is a value of:
        "Institut": ""LYCEE Hassan II"
        
        It should be translated to English to:
        "Institute": "Hassan II High School"
        
        So on for any other value that is present in the OCR Output. 
        
        I need this translation to be done in the best effort and accuracy that you can possibly do.
        
        I need the data to be shaped to a JSON Object.
        
        NOTICE: 
            No need to comment or explain, just translate it and then return it.
            This means I need a valid JSON Object as an output from your response.
            Any additional text will be considered as an error.
            Please do not forget to translate each option's value accurately as well (Obligatory: Series and Speciality from french to english).
            Please keep the same format as the example above.
            Do not change the name of the options.
            The object keys should be the same as the example above.
            Reply with the JSON object ONLY.
            So please do not add anything to the object, it is the JSON object that the application needs.
            DO NOT ADD ANYTHING TO THE JSON OBJECT, JUST TRANSLATE IT AND RETURN IT.
            NO COMMENTS, NO EXPLANATIONS, NO ADDITIONAL TEXT.
    """

    return Prompt
