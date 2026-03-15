function convertToReadableFormat(inputString) {
  // Split the input string by hyphen "-"
var words = inputString.split('-');
// Capitalize the first word and join the rest of the words with spaces
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
// Set minimum row height
row.setMinimumHeight(0);
for (var c = 0; c < row.getNumCells(); c++) {
var cell = row.getCell(c);
// Tight padding to match original
cell.setPaddingTop(0);
cell.setPaddingBottom(0);
cell.setPaddingLeft(1);
cell.setPaddingRight(1);
// Font styling - small to match original transcript
var cellText = cell.editAsText();
cellText.setFontSize(5);
cellText.setFontFamily("Arial Narrow");
// Center align grade columns, left align subject column
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
// Header row styling
if (r === 0) {
cellText.setBold(true);
cellText.setFontSize(5);
cell.setBackgroundColor("#D9D9D9");
      }
// Last 2 rows (averages) - slight highlight
if (r >= numRows - 2 && numCols > 4) {
cellText.setBold(true);
cell.setBackgroundColor("#F0F0F0");
      }
    }
  }
// Thin borders
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

  // Find all tables in the document
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

  // A4 usable width with standard margins (~450pt)
  var pageWidthPt = 450;

  for (var t = 0; t < tables.length; t++) {
    var numCols = tables[t].numCols;
    var colWidths = [];

    if (numCols <= 4) {
      // Overall table (4 cols) - equal distribution
      for (var c = 0; c < numCols; c++) {
        colWidths.push(Math.floor(pageWidthPt / numCols));
      }
    } else {
      // Transcript table (9 cols) - subject column wider, grade columns narrow
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
// Create a copy of the template file
var templateFile = DriveApp.getFileById(TemplateId);
var newFile = templateFile.makeCopy();
// Open the new document and replace placeholder text
var doc = DocumentApp.openById(newFile.getId());
var body = doc.getBody();
// Add the Document Type and Session ID to the file name
var documentType = convertToReadableFormat(Session["Document Type"])
var studentName = Session["Translation"]["Text"]["Student Name"]
var fileName =
studentName +
" | " +
documentType
doc.setName(fileName);
console.log("File Name is NULL.")
let replacements = Session["Translation"]["Text"];
// Replace the placeholder text with actual values
for (var key in replacements) {
let placeholder = "{{" + key + "}}";
body.replaceText(placeholder, replacements[key]);
    }
// Retrieves the header's container element which is the DOCUMENT
const parent = doc.getHeader().getParent();
// Replace Values in the Footer Section:
for (let i = 0; i < parent.getNumChildren(); i += 1) {
// Retrieves the child element at the specified child index
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
var numCols = Object.keys(tableInformation[0]).length;
var cells = [];
// Create a heading row with the desired column order
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
console.log("Creating Cells for Overall Table.")
overallCells.push(overallTable["Columns"]);
for (let row = 0; row < overallTable["Rows"].length; row++) {
let rowData = overallTable["Rows"][row];
overallCells.push(rowData);
                }
console.log("Inserted Cells to Overall Table: ", overallCells.length, "Rows.")
var foundParagraph = foundElement.getElement().getParent();
var parParent = foundParagraph.getParent();
var newOverallTable = parParent.insertTable(parParent.getChildIndex(foundParagraph) + 1, overallCells);
formatTableCompact(newOverallTable);
              } else {
console.log("Overall Table is null.")
              }
if (transcriptTable != null) {
var transcriptCells = [];
console.log("Creating Cells for Transcript Table.")
transcriptCells.push(transcriptTable["Columns"]);
for (let row = 0; row < transcriptTable["Rows"].length; row++) {
let rowData = transcriptTable["Rows"][row];
transcriptCells.push(rowData);
                }
console.log("Inserted Cells to Transcript Table: ", transcriptCells.length, "Rows.")
var foundParagraph = foundElement.getElement().getParent();
var parParent = foundParagraph.getParent();
var newTranscriptTable = parParent.insertTable(parParent.getChildIndex(foundParagraph) + 1, transcriptCells);
formatTableCompact(newTranscriptTable);
              } else {
console.log("Transcript Table is null.")
              }
// After inserting both tables, we can now remove the placeholder text
foundElement.getElement().getParent().removeFromParent();
            } else {
console.log("Transcript Table is null.")
            }
break;
default:
throw new Error("Document Type Not Supported !");
break;
        }
// Remove the placeholder text
body.replaceText(searchText, "")
      } else {
console.log("No element is found in the document.")
      }
    } else {
console.log("Document information is not Tabular, skipping tables.")
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
// Return detailed error information
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
console.log("Success.");
// Return the links in the HTTP response
return ContentService.createTextOutput(
JSON.stringify({
status: "success",
docLink: "https://docs.google.com/document/d/" + result.documentId,
pdfLink: "https://docs.google.com/document/d/" + result.documentId + "/export?format=pdf",
previewLink:
"https://docs.google.com/document/d/" + result.documentId + "/preview",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else {
console.log("Failure.");
// Return the error message in the HTTP response
return ContentService.createTextOutput(
JSON.stringify({
status: "error",
message: result.message,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
console.log(error);
// Return the general error message in the HTTP response
return ContentService.createTextOutput(
JSON.stringify({
status: "error",
message: "An unexpected error occurred.",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
