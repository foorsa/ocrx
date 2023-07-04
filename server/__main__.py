# Licensed under the Apache License, Version 2.0 (the "License");

# Libraries
import datetime
import os
from werkzeug.utils import secure_filename
import json


# Modules
from Modules.SessionGenerator import SessionGenerator
from Modules.OCRProcessor import OCRProcessor
from Modules.GPTCorrector import GPTCorrector
from Modules.PDFGenerator import PDFGenerator


def ProcessDocument(File, DocumentType):
    # Create a session
    Session = SessionGenerator(File, DocumentType)
    SessionDocument = Session.Generate()

    # Process the document
    Processor = OCRProcessor(File, DocumentType)
    Processor.Process()
    Processor.Save()

    # Correct the OCR output
    Corrector = GPTCorrector()
    Corrected = Corrector.Correct(Processor.Text, DocumentType)

    # Describe the document
    Description = Corrector.Describe(Processor.Text, DocumentType)

    # Generate the PDF
    Generator = PDFGenerator(Processor.Text, DocumentType)
    Generator.Generate()

    # Update the session document
    SessionDocument["Status"] = "Completed"
    SessionDocument["Corrected"] = Corrected
    SessionDocument["Description"] = Description
    SessionDocument["PDF"] = Generator.PDFPath
    SessionDocument["JSON"] = Generator.JSONPath
    SessionDocument["English"] = Generator.EnglishPath
    SessionDocument["French"] = Generator.FrenchPath
    SessionDocument["Arabic"] = Generator.ArabicPath
    SessionDocument["Date"] = datetime.datetime.now()

    # Save the session document
    Session.db.Sessions.update_one(
        {"Session ID": SessionDocument["Session ID"]}, {"$set": SessionDocument}
    )

    # Destroy the session
    Session.Destroy()

    return SessionDocument
