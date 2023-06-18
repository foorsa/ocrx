# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests

URL = "https://script.google.com/macros/s/AKfycbzCsNMH5vy7b254b4LV0eTXS4N2sjuPgHAS5e8w5T7yItk0BOivcoYzgPtxaqh2_7UkvQ/exec?SerialNumber={}&Candidate={}&DateOfBirth={}&Institute={}&City={}&Province={}&Session={}&Mention={}&Series={}"


class PDFGenerator:
    def Generate(self, document_type, session_id, fields):
        if document_type == "Baccalaureate Diploma":
            pdf = self.BaccalaureateDiploma(session_id, fields)
            return pdf.output(dest="S").encode("latin-1")
        else:
            raise ValueError("Unsupported document type")

    def BaccalaureateDiploma(self, session_id, fields):
        SerialNumber = None
        Candidate = None
        DateOfBirth = None
        Institute = None
        City = None
        Province = None
        Session = None
        Mention = None
        Series = None

        for field in fields:
            match field.name:
                case "Serial Number":
                    SerialNumber = field.value
                case "Candidate":
                    Candidate = field.value
                case "Date of birth":
                    DateOfBirth = field.value
                case "Institute":
                    Institute = field.value
                case "City":
                    City = field.value
                case "Province":
                    Province = field.value
                case "Session":
                    Session = field.value
                case "Mention":
                    Mention = field.value

        # Generate the PDF using the provided fields
        print("[Processing] ", "Baccalaureate Diploma - ", Candidate)
        response = requests.get(
            URL.format(
                SerialNumber,
                Candidate,
                DateOfBirth,
                Institute,
                City,
                Province,
                Session,
                Mention,
                Series,
            )
        )
        print("[File Generated] ", "Baccalaureate Diploma - ", Candidate)
        response = requests.get(response.content)
        print("[File Downloaded] ", "Baccalaureate Diploma - ", Candidate)
        with open("Baccalaureate Diploma - {}.pdf".format(Candidate), "wb") as f:
            f.write(response.content)

        # Return the PDF data
        return response.content

    def Save(self, session_id, pdfData):
        # Based on the session ID, save the PDF data to the Session Results folder
        # "/Sessions/{session_id}/Results/Output.pdf".

        # Create the folder if it doesn't exist
        folder_path = os.path.join(os.getcwd(), "Sessions", session_id, "Results")
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        # Save the PDF file
        file_path = os.path.join(folder_path, "Output.pdf")
        with open(file_path, "wb") as file:
            file.write(pdfData)

        # Return
        return True
