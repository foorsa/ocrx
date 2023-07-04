# /Modules/Classes/GPTCorrector.py

import openai
from typing import Dict

from Modules.Classes.Utilities.GPTPrompts import GeneratePrompt

# Load your API key from an environment variable or secret management service
openai.api_key = "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"


class GPTCorrector:
    def __init__(self):
        pass

    def Correct(self, text, doctype):
        Response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k-0613",
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
                    
                    Including any keyword in french or arabic, it will be translated into English with Accuracy.
                    
                    I will also provide you with the OCR output as a JSON format that is valid to copy and use directly from my text response.
                    """,
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
        )

        Corrected = Response.choices[0].message.content.strip()
        return Corrected

    def Describe(self, text, doctype):
        # TODO:
        # Return a paragraph containing the correct information about the document.
        # Options available for each Document Type

        BaccalaureateOptions = """
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

        DocumentTypes = "Baccalaureate Diploma, Language Diploma, or a Master Diploma."

        Response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                        I need help in getting precise output from the OCR processor.
                        This python app gets a request with a File and a Document type.
                        
                        The File could be a PDF or an Image.
                        
                        The Document Type could be: {DocumentTypes}.
                        
                        I already have created the precise JSON representation of the Document.
                        
                        I need help in getting a paragraph containing the correct information about the document.
                        
                        Please provide a description as you are the Web App itself.
                        
                        You got the file and document type and you generated information.
                        
                        The Web app is called OCRX.
                        
                        
                        More information:
                        
                        The OCRX is a web app that extracts exact information from a document.
                        
                        The current document type is {doctype}.
                        
                        The OCRX has already processed the file and the Document with OCR.
                        
                        These are the options that are mandatory for the {doctype}:
                        
                        {doctype == "Baccalaureate Diploma" and BaccalaureateOptions}
                        {doctype == "Language Diploma" and LanguageOptions}
                        {doctype == "Master Diploma" and MasterOptions}
                    """,
                },
                {
                    "role": "assistant",
                    "content": """
                    Sure, What is the OCR output?
                    
                    I will provide you with the information extracted from the OCR as a text.
                    """,
                },
                {
                    "role": "user",
                    "content": text,
                },
            ],
        )

        Described = Response.choices[0].message.content.strip()
        return Described
