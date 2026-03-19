function convertToReadableFormat(inputString) {
  var words = inputString.split('-');
var outputString = words.map(function (word, index) {
return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  }).join(' ');
return outputString;
}
function formatTableCompact(table) {
if (!table) return;
var numRows = table.getNumRows();
var numCols = table.getRow(0).getNumCells();
for (var r = 0; r < numRows; r++) {
var row = table.getRow(r);
row.setMinimumHeight(0);
for (var c = 0; c < row.getNumCells(); c++) {
var cell = row.getCell(c);
cell.setPaddingTop(0);
cell.setPaddingBottom(0);
cell.setPaddingLeft(1);
cell.setPaddingRight(1);
var cellText = cell.editAsText();
cellText.setFontSize(5);
cellText.setFontFamily("Arial Narrow");
for (var p = 0; p < cell.getNumChildren(); p++) {
var child = cell.getChild(p);
if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
child.asParagraph().setSpacingBefore(0);
child.asParagraph().setSpacingAfter(0);
child.asParagraph().setLineSpacing(1.0);
if (c === 0) {
child.asParagraph().setAlignment(DocumentApp.HorizontalAlignment.LEFT);
          } else {
child.asParagraph().setAlignment(DocumentApp.HorizontalAlignment.CENTER);
          }
        }
      }
if (r === 0) {
cellText.setBold(true);
cellText.setFontSize(5);
cell.setBackgroundColor("#D9D9D9");
      }
if (r >= numRows - 2 && numCols > 4) {
cellText.setBold(true);
cell.setBackgroundColor("#F0F0F0");
      }
    }
  }
table.setBorderWidth(0.25);
}
// Sets column widths using the Docs Advanced API (requires enabling Google Docs API service)
function setTableColumnWidths(docId, tableStartIndex, numCols, colWidths) {
var requests = [];
for (var c = 0; c < numCols; c++) {
requests.push({
updateTableColumnProperties: {
tableStartLocation: { index: tableStartIndex },
columnIndices: [c],
tableColumnProperties: {
width: { magnitude: colWidths[c], unit: "PT" },
widthType: "FIXED_WIDTH"
        },
fields: "width,widthType"
      }
    });
  }
Docs.Documents.batchUpdate({ requests: requests }, docId);
}
// After doc.saveAndClose(), use Docs API to resize all tables
function autoFitTables(docId, Session) {
var docData = Docs.Documents.get(docId);
var bodyContent = docData.body.content;
var tables = [];
for (var i = 0; i < bodyContent.length; i++) {
if (bodyContent[i].table) {
tables.push({
startIndex: bodyContent[i].startIndex,
numCols: bodyContent[i].table.columns
      });
    }
  }
if (tables.length === 0) return;
var pageWidthPt = 450;
for (var t = 0; t < tables.length; t++) {
var numCols = tables[t].numCols;
var colWidths = [];
if (numCols <= 4) {
for (var c = 0; c < numCols; c++) {
colWidths.push(Math.floor(pageWidthPt / numCols));
      }
    } else {
var firstColWidth = Math.floor(pageWidthPt * 0.18);
var otherColWidth = Math.floor((pageWidthPt - firstColWidth) / (numCols - 1));
for (var c = 0; c < numCols; c++) {
colWidths.push(c === 0 ? firstColWidth : otherColWidth);
      }
    }
setTableColumnWidths(docId, tables[t].startIndex, numCols, colWidths);
  }
console.log("Auto-fit table widths applied for " + tables.length + " table(s).");
}
function createDocumentFromTemplate(TemplateId, Session) {
try {
var templateFile = DriveApp.getFileById(TemplateId);
var newFile = templateFile.makeCopy();
var doc = DocumentApp.openById(newFile.getId());
var body = doc.getBody();
var documentType = convertToReadableFormat(Session["Document Type"])
var studentName = Session["Translation"]["Text"]["Student Name"]
var fileName = studentName + " | " + documentType
doc.setName(fileName);
let replacements = Session["Translation"]["Text"];
for (var key in replacements) {
let placeholder = "{{" + key + "}}";
body.replaceText(placeholder, replacements[key]);
    }
const parent = doc.getHeader().getParent();
for (let i = 0; i < parent.getNumChildren(); i += 1) {
const child = parent.getChild(i);
if (child.getType() === DocumentApp.ElementType.FOOTER_SECTION) {
child.asFooterSection().replaceText("{{Session Id}}", Session["Session Id"]);
child.asFooterSection().replaceText("{{Translation Date}}", Session["Operation Date"]);
      }
    }
if (Session["Information Type"] == "Tabular") {
var documentType = Session["Document Type"];
var searchText = "{{Grades}}";
var foundElement = body.findText(searchText);
if (foundElement != null) {
switch (documentType) {
case "Master-Transcript-of-Marks":
var tableInformation = Session["Translation"]["Tables"];
if (tableInformation != null) {
var numRows = tableInformation.length;
var cells = [];
var headingRow = ["Subject", "Mark", "Result", "Session"];
cells.push(headingRow);
for (let row = 0; row < numRows; row++) {
let rowData = [];
rowData.push(tableInformation[row]["Subject"]);
rowData.push(tableInformation[row]["Mark"]);
rowData.push(tableInformation[row]["Result"]);
rowData.push(tableInformation[row]["Session"]);
cells.push(rowData);
              }
var foundParagraph = foundElement.getElement().getParent();
var parParent = foundParagraph.getParent();
var newTable = parParent.insertTable(parParent.getChildIndex(foundParagraph) + 1, cells);
formatTableCompact(newTable);
            }
break;
case "Baccalaureate-Transcript-of-Marks-V1":
case "Baccalaureate-Transcript-of-Marks-V2":
var transcriptData = Session["Translation"]["Tables"];
console.log("Processing Table case for: ", "Baccalaureate-Transcript-of-Marks")
if (transcriptData != null) {
var transcriptTable = transcriptData["Transcript"];
var overallTable = transcriptData["Overall"];
if (overallTable != null) {
var overallCells = [];
overallCells.push(overallTable["Columns"]);
for (let row = 0; row < overallTable["Rows"].length; row++) {
overallCells.push(overallTable["Rows"][row]);
                }
var foundParagraph = foundElement.getElement().getParent();
var parParent = foundParagraph.getParent();
var newOverallTable = parParent.insertTable(parParent.getChildIndex(foundParagraph) + 1, overallCells);
formatTableCompact(newOverallTable);
              }
if (transcriptTable != null) {
var transcriptCells = [];
transcriptCells.push(transcriptTable["Columns"]);
for (let row = 0; row < transcriptTable["Rows"].length; row++) {
transcriptCells.push(transcriptTable["Rows"][row]);
                }
var foundParagraph = foundElement.getElement().getParent();
var parParent = foundParagraph.getParent();
var newTranscriptTable = parParent.insertTable(parParent.getChildIndex(foundParagraph) + 1, transcriptCells);
formatTableCompact(newTranscriptTable);
              }
foundElement.getElement().getParent().removeFromParent();
            }
break;
default:
throw new Error("Document Type Not Supported !");
        }
body.replaceText(searchText, "")
      }
    }
// Save Document
doc.saveAndClose();
// Resize table columns using Docs API (requires Docs advanced service)
if (Session["Information Type"] == "Tabular") {
try {
autoFitTables(newFile.getId(), Session);
      } catch (e) {
console.log("Table column resize skipped: " + e.message);
      }
    }
// Move the document to the specified folder
var folderId = "1q_ZBhJ1v-EKYH7vWKYgFxwlrf2WKtNYE";
var destinationFolder = DriveApp.getFolderById(folderId);
destinationFolder.addFile(newFile);
// Make the document viewable by anyone with the link (needed for preview iframe)
newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
// Return the ID of the new document
return { status: "success", documentId: newFile.getId() };
  } catch (error) {
return { status: "error", message: error.message };
  }
}
function doPost(e) {
try {
var requestData = JSON.parse(e.postData.contents);
var result = createDocumentFromTemplate(
requestData.TemplateId,
requestData.Session
    );
if (result.status === "success") {
return ContentService.createTextOutput(
JSON.stringify({
status: "success",
docLink: "https://docs.google.com/document/d/" + result.documentId,
pdfLink: "https://docs.google.com/document/d/" + result.documentId + "/export?format=pdf",
previewLink: "https://docs.google.com/document/d/" + result.documentId + "/preview",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else {
return ContentService.createTextOutput(
JSON.stringify({
status: "error",
message: result.message,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
return ContentService.createTextOutput(
JSON.stringify({
status: "error",
message: "An unexpected error occurred.",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME UTILITY: Replace old logo / watermark with LanguageLine Solutions
// logo across all document templates.
//
// HOW TO RUN:
//   1. Open the Google Apps Script editor (script.google.com → your project)
//   2. Paste / save this file
//   3. Select "replaceLogo" from the function dropdown
//   4. Click ▶ Run  (grant Drive + Docs permissions when prompted)
//   5. Check View → Logs to confirm success
// ─────────────────────────────────────────────────────────────────────────────
function replaceLogo() {
  var TEMPLATE_IDS = [
    "1G4MkDqydk7FppspfLYjH50mg2v15PGe0lj6GDX5drNY", // Baccalaureate Certificate
    "1wd3NV2GlidXm_wBubH0l85DO0qiLMqCrtBksYlnqe9o", // Baccalaureate School Certificate
    "1P8IUOG1ee2RS3y3TTGVLNeueHHaym4-S5fsnXoO4HqY", // Baccalaureate Transcript V1
    "1yTkDcROEOUAyMPdfQn09770AQK3iLjaXpWAo7Ad7iMo", // Baccalaureate Transcript V2
    "1XVB2gaCxbCu021MPxtMd4HFUaO7Pgb-HdDn9hIofTTc", // Bachelor Certificate
    "1TQs-wT3ussThmuGzD-PqGfGPGWoLmOV7QV3XgwDpKbc", // Certificate of Achievement
    "1if3Sb6XvUL4E5BaJdQu--uMp4ew3lXVlKbuEQ2998XQ",  // Police Record Checks
    "1QAGI7vLF0N7iZz4ZGX5hewqIHCg_LoK4QwKIWyI5QeE",  // Registration Certificate
    "1JLRy9ncr_wYduwEZsvbaspsgBJw_DbWc3NTTgGGMoq4",  // Statement of Penalties
    "1N_1iIdGK_R2AC227cfkmCATITL9-8lt_yRgOMtPD5xw",  // Technical University Degree
    "1_k7sTZl77Q8H0V6z9qHG7w_vrChSkfouXubOuwFdNuw",  // Master Certificate
    "1GudSJq0yOy5u_iJH70DgOmDvqEvvZ6YPhygbxVyhZTk",  // Master Certificate of Schooling
    "1tPwRsWLdbbQyRU0qqnifQY1INoKT0c6NJQCkXriJqOc",  // Master Certificate of Success
    "1yI3Gdxlw1YlEz-OuhxXNlNqelvzYphNxyo2nnS0n3cM"   // Master Transcript of Marks
  ];

  // Fetch the new LLS logo (white-on-transparent PNG hosted in the public repo)
  var LOGO_URL = "https://raw.githubusercontent.com/foorsa/ocrx/main/client/public/Logo/Lockup.png";
  var logoBlob = UrlFetchApp.fetch(LOGO_URL).getBlob().setName("LLS-logo.png");

  var totalReplaced = 0;

  for (var i = 0; i < TEMPLATE_IDS.length; i++) {
    var id = TEMPLATE_IDS[i];
    try {
      var doc  = DocumentApp.openById(id);
      var body = doc.getBody();

      // ── replace images in BODY ──────────────────────────────────────────
      var bodyImgs = body.getImages();
      for (var b = bodyImgs.length - 1; b >= 0; b--) {
        var img    = bodyImgs[b];
        var parent = img.getParent();
        var idx    = parent.getChildIndex(img);
        img.removeFromParent();
        parent.insertInlineImage(idx, logoBlob.copyBlob());
        totalReplaced++;
      }

      // ── replace images in HEADER ────────────────────────────────────────
      var header = doc.getHeader();
      if (header) {
        var hImgs = header.getImages();
        for (var h = hImgs.length - 1; h >= 0; h--) {
          var hImg    = hImgs[h];
          var hParent = hImg.getParent();
          var hIdx    = hParent.getChildIndex(hImg);
          hImg.removeFromParent();
          hParent.insertInlineImage(hIdx, logoBlob.copyBlob());
          totalReplaced++;
        }
      }

      // ── replace images in FOOTER ────────────────────────────────────────
      var footer = doc.getFooter();
      if (footer) {
        var fImgs = footer.getImages();
        for (var f = fImgs.length - 1; f >= 0; f--) {
          var fImg    = fImgs[f];
          var fParent = fImg.getParent();
          var fIdx    = fParent.getChildIndex(fImg);
          fImg.removeFromParent();
          fParent.insertInlineImage(fIdx, logoBlob.copyBlob());
          totalReplaced++;
        }
      }

      doc.saveAndClose();
      Logger.log("✅ Updated: " + doc.getName() + " (" + (bodyImgs.length + (header ? header.getImages().length : 0)) + " image(s))");

    } catch (e) {
      Logger.log("❌ Error on template [" + id + "]: " + e.message);
    }
  }

  Logger.log("─────────────────────────────────────────");
  Logger.log("Done. Total images replaced: " + totalReplaced + " across " + TEMPLATE_IDS.length + " templates.");
}
