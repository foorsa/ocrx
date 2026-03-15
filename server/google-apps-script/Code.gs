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
if (tables.length === 0) return "no tables found";

// Get actual page width from document style
var docStyle = docData.documentStyle;
var pageWidth = docStyle.pageSize.width.magnitude; // in PT
var marginLeft = docStyle.marginLeft ? docStyle.marginLeft.magnitude : 72;
var marginRight = docStyle.marginRight ? docStyle.marginRight.magnitude : 72;
var pageWidthPt = pageWidth - marginLeft - marginRight;

console.log("Page width: " + pageWidth + "pt, margins: " + marginLeft + "+" + marginRight + ", usable: " + pageWidthPt + "pt");

for (var t = 0; t < tables.length; t++) {
var numCols = tables[t].numCols;
var colWidths = [];
if (numCols <= 4) {
for (var c = 0; c < numCols; c++) {
colWidths.push(Math.floor(pageWidthPt / numCols));
      }
    } else {
// Give first column (labels) more space proportionally
var firstColWidth = Math.floor(pageWidthPt * 0.22);
var otherColWidth = Math.floor((pageWidthPt - firstColWidth) / (numCols - 1));
for (var c = 0; c < numCols; c++) {
colWidths.push(c === 0 ? firstColWidth : otherColWidth);
      }
    }
console.log("Table " + t + ": " + numCols + " cols, widths: " + colWidths.join(","));
setTableColumnWidths(docId, tables[t].startIndex, numCols, colWidths);
  }
console.log("Auto-fit table widths applied for " + tables.length + " table(s).");
return "success: " + tables.length + " table(s) resized";
}

// Set page to landscape for wide tables
function setLandscapeIfNeeded(docId, numCols) {
if (numCols <= 6) return;
var requests = [{
updateDocumentStyle: {
documentStyle: {
pageSize: {
width: { magnitude: 792, unit: "PT" },
height: { magnitude: 612, unit: "PT" }
        },
marginLeft: { magnitude: 36, unit: "PT" },
marginRight: { magnitude: 36, unit: "PT" },
marginTop: { magnitude: 36, unit: "PT" },
marginBottom: { magnitude: 36, unit: "PT" }
      },
fields: "pageSize,marginLeft,marginRight,marginTop,marginBottom"
    }
  }];
Docs.Documents.batchUpdate({ requests: requests }, docId);
console.log("Set page to landscape with narrow margins for " + numCols + " columns");
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
var tableSizingResult = "skipped";
if (Session["Information Type"] == "Tabular") {
try {
// Detect max columns across all tables to decide landscape
var docData = Docs.Documents.get(newFile.getId());
var maxCols = 0;
for (var i = 0; i < docData.body.content.length; i++) {
if (docData.body.content[i].table && docData.body.content[i].table.columns > maxCols) {
maxCols = docData.body.content[i].table.columns;
          }
        }
// Switch to landscape with narrow margins for wide tables
setLandscapeIfNeeded(newFile.getId(), maxCols);
tableSizingResult = autoFitTables(newFile.getId(), Session);
      } catch (e) {
tableSizingResult = "error: " + e.message;
console.log("Table column resize failed: " + e.message + "\nStack: " + e.stack);
      }
    }
console.log("Table sizing result: " + tableSizingResult);
// Move the document to the specified folder
var folderId = "1q_ZBhJ1v-EKYH7vWKYgFxwlrf2WKtNYE";
var destinationFolder = DriveApp.getFolderById(folderId);
destinationFolder.addFile(newFile);
// Make the document viewable by anyone with the link (needed for preview iframe)
newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
// Return the ID of the new document
return { status: "success", documentId: newFile.getId(), tableSizing: tableSizingResult };
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
