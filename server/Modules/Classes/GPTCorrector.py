# /Modules/Classes/GPTCorrector.py

from Modules.Classes.Utilities.GPTPrompts import (
    GenerateTextCorrection,
    GenerateTextTranslation,
    GenerateTableCorrection,
    GenerateTableTranslation,
    GenerateTableCorrectionAndTranslation,
    GenerateTextCorrectionAndTranslation,
)


class GPTCorrector:
    def __init__(self):
        pass

    #
    def CorrectText(self, Text, Doctype):
        TextResponse = GenerateTextCorrection(Doctype, Text)
        return TextResponse

    #
    def TranslateText(self, RAW_OCR, Text, Doctype):
        TextResponse = GenerateTextTranslation(Doctype, Text, RAW_OCR)
        return TextResponse

    #
    def CorrectTable(self, Tables, Doctype):
        TableResponse = GenerateTableCorrection(Doctype, Tables)
        return TableResponse

    #
    def TranslateTable(self, Tables, Doctype):
        TableResponse = GenerateTableTranslation(Doctype, Tables)
        return TableResponse

    # Combined: correct + translate in one GPT call (saves ~14s)
    def CorrectAndTranslateTable(self, Tables, Doctype):
        return GenerateTableCorrectionAndTranslation(Doctype, Tables)

    # Combined: correct + translate text in one GPT call
    def CorrectAndTranslateText(self, Text, Doctype):
        return GenerateTextCorrectionAndTranslation(Doctype, Text)
