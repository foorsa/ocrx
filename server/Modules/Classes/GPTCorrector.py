# /Modules/Classes/GPTCorrector.py

import openai

from Modules.Classes.Utilities.GPTPrompts import GeneratePrompt, GenerateTabularPrompt

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
        TableResponse = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k-0613",
            messages=[
                {
                    "role": "system",
                    "content": "We are in a Python Software, its name is OCRX, and we are using the OCR output to correct it and extract the information from it, and translate it to English, in this Software, it is restricted and illegal for the AI to respond with Anything but JSON Formats !",
                },
                {
                    "role": "user",
                    "content": GenerateTabularPrompt(Doctype),
                },
                {
                    "role": "assistant",
                    "content": """
                    **AI:**
                    Sure, what is the OCR output?

                    I will provide you with the information extracted from the OCR as a JSON object without any comments.

                    I will also translate every word accurately to its corresponding English term.

                    I will be writing a JSON that has all the information mentioned in your description.

                    An array of objects, each object has 4 keys: Subject, Mark, Result, and Session.

                    All their records will be accurately extracted from the Data you will be giving me in your next response.

                    I will make sure to only send a valid JSON output, no additional words, and no additional comments, I will send a response entirely as JSON, I will not provide anything with the JSON I will be giving.
                    
                    I will act as a function that only returns a response of a JSON type in my next responses.

                    If there are any keywords in French or Arabic, I will translate them into English with accuracy.

                    I will provide you with the OCR output in a JSON format that is valid to copy and use directly from my text response, I won’t be writing anything above or below the JSON Response I give you.
                    """,
                },
                {
                    "role": "user",
                    "content": str(RAW_TABLE),
                },
            ],
        )

        CorrectedTable = TableResponse.choices[0].message.content
        return CorrectedTable

    def Describe(self, RAW_TEXT, Doctype):
        Described = "This Feature is not available yet."
        return Described
