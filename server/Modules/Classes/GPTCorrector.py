# /Modules/Classes/GPTCorrector.py

import openai

from Modules.Classes.Utilities.GPTPrompts import GeneratePrompt, GenerateTableCorrection

# from Utilities.GPTPrompts import GeneratePrompt, GenerateTabularPrompt

# Load your API key from an environment variable or secret management service
openai.api_key = "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"


class GPTCorrector:
    def __init__(self):
        pass

    def Correct(self, RAW_OCR, Doctype):
        Response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k-0613",
            messages=[
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
                    "content": RAW_OCR,
                },
            ],
        )

        Corrected = Response.choices[0].message.content
        return Corrected

    def CorrectTable(self, RAW_TABLE, Doctype):
        TableResponse = GenerateTableCorrection(Doctype, RAW_TABLE)

        CorrectedTable = TableResponse.choices[0].message.content
        return CorrectedTable

    def Describe(self, RAW_TEXT, Doctype):
        Described = "This Feature is not available yet."
        return Described
