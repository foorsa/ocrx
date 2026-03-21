# import the necessary packages
import os
import tempfile
import base64
import io
from concurrent.futures import ThreadPoolExecutor, as_completed
from pdf2image import convert_from_path
import pytesseract
from ExtractTable import ExtractTable
from dotenv import load_dotenv
import json
from PyPDF2 import PdfReader
from openai import OpenAI


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        self.ET_SESSION = ExtractTable(os.environ.get("ET_API_KEY"))
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def _image_to_base64(self, image):
        """Convert a PIL Image to a base64 string (JPEG for smaller payload)."""
        buffer = io.BytesIO()
        # Convert RGBA/palette to RGB before saving as JPEG
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        image.save(buffer, format="JPEG", quality=85, optimize=True)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _extract_text_with_vision(self, image):
        """Use GPT-4o Vision to extract text from an image."""
        base64_image = self._image_to_base64(image)

        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract ALL text from this image exactly as it appears. Preserve layout. Include every word, number, date, symbol. For tables, use clear column separation. Output ONLY the extracted text.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "auto",
                            },
                        },
                    ],
                }
            ],
            max_tokens=2048,
        )

        return response.choices[0].message.content.strip()

    # Read the Image File
    def ExtractTextFromImage(self, InformationType, SessionId, Image):
        import time

        # Try Tesseract first (instant, ~0.5s)
        try:
            t0 = time.time()
            print("[OCR] Extracting text with Tesseract...")
            TextContent = pytesseract.image_to_string(
                Image,
                lang="fra+ara+eng",
                config="",
            )
            print(f"[OCR] Tesseract extracted {len(TextContent)} chars in {time.time() - t0:.1f}s")
            if TextContent and len(TextContent.strip()) > 20:
                return TextContent
            print("[OCR] Tesseract output too short, falling back to Vision...")
        except Exception as e:
            print(f"[OCR] Tesseract failed: {str(e)}, falling back to Vision...")

        # Fallback to GPT-4o Vision (slower but higher quality)
        try:
            t0 = time.time()
            print("[OCR] Extracting text with GPT-4o Vision...")
            text = self._extract_text_with_vision(Image)
            print(f"[OCR] GPT-4o Vision extracted {len(text)} chars in {time.time() - t0:.1f}s")
            if text and text.strip():
                return text
        except Exception as e:
            print(f"[OCR] GPT-4o Vision also failed: {str(e)}")

        return ""

    def ExtractTextFromPDF(self, InformationType, SessionId, PDFBytes):
        import time
        try:
            # First, try direct text extraction from the PDF (works for digital PDFs)
            t0 = time.time()
            PDFBytes.seek(0)
            reader = PdfReader(PDFBytes)
            direct_text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    direct_text += page_text

            if direct_text.strip():
                print(f"[OCR] Extracted text directly from PDF ({len(direct_text)} chars) in {time.time() - t0:.1f}s")
                return direct_text

            # Fall back to Tesseract OCR for scanned PDFs (much faster than Vision)
            print("[OCR] No embedded text found, converting pages to images for Tesseract...")
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            PDFBytes.seek(0)
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            t1 = time.time()
            pages = convert_from_path(TEMPORARY_PDF_PATH, 200)
            print(f"[OCR] PDF to images: {time.time() - t1:.1f}s")

            # Use Tesseract on all pages in parallel
            t2 = time.time()
            page_list = list(pages)
            results = [None] * len(page_list)

            def process_page_tesseract(args):
                idx, page = args
                text = pytesseract.image_to_string(page, lang="fra+ara+eng", config="")
                page.close()
                return idx, text

            with ThreadPoolExecutor(max_workers=min(4, len(page_list))) as executor:
                futures = {executor.submit(process_page_tesseract, (i, p)): i for i, p in enumerate(page_list)}
                for future in as_completed(futures):
                    idx, text = future.result()
                    results[idx] = text

            extracted_text = "\n".join(r for r in results if r)
            print(f"[OCR] Tesseract extracted {len(extracted_text)} chars from {len(page_list)} pages in {time.time() - t2:.1f}s")

            # If Tesseract got very little text, fall back to Vision
            if len(extracted_text.strip()) < 20:
                print("[OCR] Tesseract output too short, falling back to Vision...")
                t3 = time.time()
                pages = convert_from_path(TEMPORARY_PDF_PATH, 200)
                page_list = list(pages)
                results = [None] * len(page_list)

                def process_page_vision(args):
                    idx, page = args
                    text = self._extract_text_with_vision(page)
                    page.close()
                    return idx, text

                with ThreadPoolExecutor(max_workers=min(4, len(page_list))) as executor:
                    futures = {executor.submit(process_page_vision, (i, p)): i for i, p in enumerate(page_list)}
                    for future in as_completed(futures):
                        idx, text = future.result()
                        results[idx] = text

                extracted_text = "\n".join(r for r in results if r)
                print(f"[OCR] Vision extracted {len(extracted_text)} chars in {time.time() - t3:.1f}s")

            # Clean up
            os.remove(TEMPORARY_PDF_PATH)

            return extracted_text

        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def ExtractTableFromImage(self, InformationType, SessionId, Image):
        print("[...] Extracting Table from Image ...")
        try:
            # Temporary File Path
            TEMPORARY_IMAGE_PATH = os.path.join(
                tempfile.gettempdir(), f"{SessionId}.png"
            )

            # Save the Image to a Temporary File
            Image.save(TEMPORARY_IMAGE_PATH, "PNG")

            PROCESSED_TABLES = []

            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_IMAGE_PATH, output_format="json"
            )

            print("[OK] Extracting Table from Image Finished !")

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)  # Load JSON string to a dictionary

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concatenate Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append(
                                ""
                            )  # Handle missing data as an empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)

            # Clean up: remove the temporary image file
            os.remove(TEMPORARY_IMAGE_PATH)

            return PROCESSED_TABLES
        except Exception as e:
            print(f"Error processing table: {str(e)}")
            return []

    def ExtractTableFromPDF(self, InformationType, SessionId, PDFBytes):
        try:
            print("[...] Extracting Table from PDF ...")

            # Temporary File Path
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            # Write the PDF Bytes to a Temporary File
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            PROCESSED_TABLES = []

            # Process the Table
            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_PDF_PATH, output_format="json"
            )

            print("[OK] Extracting Table from PDF Finished !")

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concatenate Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append("")  # Handle missing data as empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)

            # Clean up: remove the temporary PDF file
            os.remove(TEMPORARY_PDF_PATH)

            return PROCESSED_TABLES
        except Exception as e:
            print(f"[ERROR] Error processing table: {str(e)}")
            return []

    def Check_API_USAGE(self):
        return self.ET_SESSION.check_usage()

    def Get_File_Content(self):
        return self.file_content


# Optical Character Recognition Processor
OCR = OCRProcessor()

print("API Key: " + str(os.environ.get("ET_API_KEY")))

# USAGE
USAGE = OCR.Check_API_USAGE()

CREDITS = USAGE["credits"]
USED = USAGE["used"]
PERCENTAGE = USED / CREDITS * 100

print(
    f"[Extract Table] API Usage: Credits: {CREDITS}, Used: {USED}, Percentage: {PERCENTAGE}%."
)
