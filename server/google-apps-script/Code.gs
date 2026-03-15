function convertToReadableFormat(inputString) {
  // Split the input string by hyphen "-"
var words = inputString.split('-');
// Capitalize the first word and join the rest of the words with spaces
var outputString = words.map(function (word, index) {
return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  }).join(' ');
return outputString;
}

function formatTableCompact(table, tableOptions) {
  if (!table) return;

  var numRows = table.getNumRows();
  var numCols = table.getRow(0).getNumCells();

  var fontSize = (tableOptions && tableOptions.fontSize) || 6;
  var fontFamily = (tableOptions && tableOptions.fontFamily) || "Arial Narrow";

  for (var r = 0; r < numRows; r++) {
    var row = table.getRow(r);
    for (var c = 0; c < row.getNumCells(); c++) {
      var cell = row.getCell(c);

      // Minimal padding
      cell.setPaddingTop(1);
      cell.setPaddingBottom(1);
      cell.setPaddingLeft(2);
      cell.setPaddingRight(2);

      // Font styling
      var cellText = cell.editAsText();
      cellText.setFontSize(fontSize);
      cellText.setFontFamily(fontFamily);

      // Header row
      if (r === 0) {
        cellText.setBold(true);
        cell.setBackgroundColor("#E8E8E8");
      }

      // Zero paragraph spacing
      for (var p = 0; p < cell.getNumChildren(); p++) {
        var child = cell.getChild(p);
        if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          child.asParagraph().setSpacingBefore(0);
          child.asParagraph().setSpacingAfter(0);
          child.asParagraph().setLineSpacing(1.0);
        }
      }
    }
  }

  // Thin borders
  table.setBorderWidth(0.5);
}

function autoFitTableWidths(docId, Session) {
  // Read the document structure via Docs API to find tables
  var docData = Docs.Documents.get(docId);
  var bodyContent = docData.body.content;
  var tables = [];
  for (var i = 0; i < bodyContent.length; i++) {
    if (bodyContent[i].table) {
      tables.push({
        startIndex: bodyContent[i].startIndex,
        numCols: bodyContent[i].table.columns,
        numRows: bodyContent[i].table.rows
      });
    }
  }

  if (tables.length === 0) return;

  // Collect all cell data from the session to calculate widths
  var allCellSets = [];
  var documentType = Session["Document Type"];
  if (documentType === "Master-Transcript-of-Marks") {
    var tableInfo = Session["Translation"]["Tables"];
    if (tableInfo) {
      var headingRow = ["Subject", "Mark", "Result", "Session"];
      var cells = [headingRow];
      for (var r = 0; r < tableInfo.length; r++) {
        cells.push([tableInfo[r]["Subject"], tableInfo[r]["Mark"], tableInfo[r]["Result"], tableInfo[r]["Session"]]);
      }
      allCellSets.push(cells);
    }
  } else {
    var transcriptData = Session["Translation"]["Tables"];
    if (transcriptData) {
      if (transcriptData["Overall"]) {
        var overallCells = [transcriptData["Overall"]["Columns"]];
        for (var r = 0; r < transcriptData["Overall"]["Rows"].length; r++) {
          overallCells.push(transcriptData["Overall"]["Rows"][r]);
        }
        allCellSets.push(overallCells);
      }
      if (transcriptData["Transcript"]) {
        var transcriptCells = [transcriptData["Transcript"]["Columns"]];
        for (var r = 0; r < transcriptData["Transcript"]["Rows"].length; r++) {
          transcriptCells.push(transcriptData["Transcript"]["Rows"][r]);
        }
        allCellSets.push(transcriptCells);
      }
    }
  }

  // Apply auto-fit widths to each table
  for (var t = 0; t < tables.length && t < allCellSets.length; t++) {
    var cells = allCellSets[t];
    var numCols = cells[0].length;
    var ptPerChar = 4.0;
    var minWidth = 25;
    var maxTotalWidth = 468; // A4 usable width in points

    var colWidths = [];
    for (var c = 0; c < numCols; c++) {
      var maxLen = 0;
      for (var r = 0; r < cells.length; r++) {
        var len = String(cells[r][c] || "").length;
        if (len > maxLen) maxLen = len;
      }
      colWidths.push(Math.max(maxLen * ptPerChar, minWidth));
    }

    // Scale down if total exceeds page width
    var total = 0;
    for (var i = 0; i < colWidths.length; i++) total += colWidths[i];
    if (total > maxTotalWidth) {
      var scale = maxTotalWidth / total;
      for (var i = 0; i < colWidths.length; i++) {
        colWidths[i] = colWidths[i] * scale;
      }
    }

    var requests = [];
    for (var c = 0; c < numCols && c < tables[t].numCols; c++) {
      requests.push({
        updateTableColumnProperties: {
          tableStartLocation: { index: tables[t].startIndex },
          columnIndices: [c],
          tableColumnProperties: {
            width: { magnitude: colWidths[c], unit: "PT" },
            widthType: "FIXED_WIDTH"
          },
          fields: "width,widthType"
        }
      });
    }
    if (requests.length > 0) {
      Docs.Documents.batchUpdate({ requests: requests }, docId);
    }
  }
  console.log("Auto-fit table widths applied successfully for " + tables.length + " table(s).");
}

function createDocumentFromTemplate(TemplateId, Session, tableOptions) {
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
formatTableCompact(newTable, tableOptions);
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
formatTableCompact(newOverallTable, tableOptions);
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
formatTableCompact(newTranscriptTable, tableOptions);
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
// Auto-fit table column widths using Docs API (requires Docs advanced service)
if (Session["Information Type"] == "Tabular") {
  try {
    autoFitTableWidths(newFile.getId(), Session);
  } catch (e) {
    console.log("Auto-fit table widths skipped: " + e.message);
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
requestData.Session,
requestData.tableOptions || {}
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
function ExperimentGeneration() {
var requestData = {
"TemplateId": "1Z3iGEgvJ84Ab5oQMN8zkkEKkkdYvjNcrlMv-J7fE0nA",
"Session": {
"Correction": {
"Tables": {
"Overall": {
"Columns": [
"Average of Continuous Control",
"Regional Exam Average",
"National Exam Average",
"Overall Average"
            ],
"Rows": [
              [
"",
"",
"07,10",
""
              ]
            ]
          },
"Transcript": {
"Columns": [
"Subjects",
"2019/2020 S1",
"2019/2020 S2",
"2020/2021 S1",
"2020/2021 S2",
"2021/2022 S1",
"2021/2022 S2",
"Regional Exam",
"National Exam"
            ],
"Rows": [
              [
"LANGUE ARABE",
"08,00",
"",
"13,56",
"13,16",
"18,53",
"",
"14,00",
""
              ],
              [
"LANGUE FRANCAISE",
"10,70",
"",
"10,85",
"11,20",
"19,15",
"",
"05,00",
""
              ],
              [
"LANGUE ANGLAISE",
"15,75",
"",
"12,80",
"15,80",
"18,48",
"",
"",
""
              ],
              [
"HISTOIRE GEOGRAPHIE",
"10,78",
"",
"16,50",
"17,62",
"19,31",
"",
"04,00",
""
              ],
              [
"MATHEMATIQUES",
"12,50",
"",
"09,00",
"14,33",
"20,00",
"",
"",
""
              ],
              [
"SC. DE LA VIE ET DE LA TERRE",
"07,06",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"PHYSIQUE CHIMIE",
"05,00",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"INSTRUCTION ISLAMIQUE",
"10,00",
"",
"15,00",
"11,38",
"19,38",
"",
"08,00",
""
              ],
              [
"EDUCATION PHYSIQUE",
"15,00",
"",
"18,00",
"17,83",
"20,00",
"",
"",
""
              ],
              [
"INFORMATIQUE",
"10,80",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"PHILOSOPHIE",
"10,88",
"",
"12,50",
"14,50",
"17,44",
"",
"",
""
              ],
              [
"ASSIDUITE ET CONDUITE",
"20,00",
"",
"20,00",
"20,00",
"20,00",
"",
"",
""
              ],
              [
"DROIT",
"",
"",
"13,56",
"15,12",
"19,22",
"",
"",
""
              ],
              [
"COMPTA. ET MATHS. FINANCIERES",
"",
"",
"14,06",
"14,38",
"19,06",
"",
"",
""
              ],
              [
"ECO. GENERALE ET STATISTIQUES",
"",
"",
"12,38",
"13,38",
"18,75",
"",
"",
""
              ],
              [
"ECO. ET ORG. ADMIN. ENTREPRISE",
"",
"",
"15,19",
"13,31",
"18,03",
"",
"",
""
              ],
              [
"INFORMATIQUE DE GESTION",
"",
"",
"18,00",
"17,88",
"19,25",
"",
"",
""
              ],
              [
"Moyenne Semestrielle",
"10,60",
"10,67",
"13,47",
"14,34",
"19,09",
"",
"",
""
              ],
              [
"Moyenne Annuelle",
"",
"10,67",
"",
"13,90",
"",
"",
"",
""
              ]
            ]
          }
        },
"Text": {
"City of issue": "Skhirate-Témara",
"Date of issue": "",
"Institute": "al jawzia private school group",
"Province": "Rabat-Salé-Kénitra",
"Student Level": "Baccalaureate in Economic Sciences",
"Student Name": "Majda Jbari",
"Student National Code": "J135149654",
"Student Option": "Economics",
"Year": "2019/2020"
        }
      },
"Document Type": "Baccalaureate-Transcript-of-Marks-V1",
"Error": null,
"Extraction": {
"Tables": [],
"Text": ""
      },
"Generation": {
"Google Docs Link": "",
"PDF Link": "",
"Previw Link": ""
      },
"Information Type": "Tabular",
"Message": "",
"Operation Date": "Saturday, 12 August 2023, 02:12AM UTC",
"Session Id": "LLS-C94B05DB-TRS",
"Status": "Translated",
"Translation": {
"Tables": {
"Overall": {
"Columns": [
"Average of Continuous Control",
"Regional Exam Average",
"National Exam Average",
"Overall Average"
            ],
"Rows": [
              [
"",
"",
"07.10",
""
              ]
            ]
          },
"Transcript": {
"Columns": [
"Subjects",
"2019/2020 S1",
"2019/2020 S2",
"2020/2021 S1",
"2020/2021 S2",
"2021/2022 S1",
"2021/2022 S2",
"Regional Exam",
"National Exam"
            ],
"Rows": [
              [
"ARABIC LANGUAGE",
"08.00",
"",
"13.56",
"13.16",
"18.53",
"",
"14.00",
""
              ],
              [
"FRENCH LANGUAGE",
"10.70",
"",
"10.85",
"11.20",
"19.15",
"",
"05.00",
""
              ],
              [
"ENGLISH LANGUAGE",
"15.75",
"",
"12.80",
"15.80",
"18.48",
"",
"",
""
              ],
              [
"HISTORY GEOGRAPHY",
"10.78",
"",
"16.50",
"17.62",
"19.31",
"",
"04.00",
""
              ],
              [
"MATHEMATICS",
"12.50",
"",
"09.00",
"14.33",
"20.00",
"",
"",
""
              ],
              [
"LIFE AND EARTH SCIENCE",
"07.06",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"PHYSICS CHEMISTRY",
"05.00",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"ISLAMIC INSTRUCTION",
"10.00",
"",
"15.00",
"11.38",
"19.38",
"",
"08.00",
""
              ],
              [
"PHYSICAL EDUCATION",
"15.00",
"",
"18.00",
"17.83",
"20.00",
"",
"",
""
              ],
              [
"COMPUTER SCIENCE",
"10.80",
"",
"",
"",
"",
"",
"",
""
              ],
              [
"PHILOSOPHY",
"10.88",
"",
"12.50",
"14.50",
"17.44",
"",
"",
""
              ],
              [
"ATTENDANCE AND CONDUCT",
"20.00",
"",
"20.00",
"20.00",
"20.00",
"",
"",
""
              ],
              [
"LAW",
"",
"",
"13.56",
"15.12",
"19.22",
"",
"",
""
              ],
              [
"ACCOUNTING AND FINANCIAL MATHEMATICS",
"",
"",
"14.06",
"14.38",
"19.06",
"",
"",
""
              ],
              [
"GENERAL ECONOMICS AND STATISTICS",
"",
"",
"12.38",
"13.38",
"18.75",
"",
"",
""
              ],
              [
"ECONOMICS AND BUSINESS ORGANIZATION",
"",
"",
"15.19",
"13.31",
"18.03",
"",
"",
""
              ],
              [
"MANAGEMENT INFORMATION SYSTEMS",
"",
"",
"18.00",
"17.88",
"19.25",
"",
"",
""
              ],
              [
"Semester Average",
"10.60",
"10.67",
"13.47",
"14.34",
"19.09",
"",
"",
""
              ],
              [
"Annual Average",
"",
"10.67",
"",
"13.90",
"",
"",
"",
""
              ]
            ]
          }
        },
"Text": {
"City of issue": "Skhirate-Témara",
"Date of issue": "UNKNOWN",
"Institute": "al jawzia private school group",
"Province": "Rabat-Salé-Kénitra",
"Student Level": "Baccalaureate in Economic Sciences",
"Student Name": "Majda Jbari",
"Student National Code": "J135149654",
"Student Option": "Economics",
"Year": "2019/2020"
        }
      },
"Uploads": [
        {
"File": "Upload.jpeg",
"Upload Id": {
"$oid": "64d6dc656c9e7cdd5ae6d260"
          }
        }
      ],
"_id": {
"$oid": "64d6dc666c9e7cdd5ae6d263"
      }
    }
  }
var result = createDocumentFromTemplate(
requestData.TemplateId,
requestData.Session,
requestData.tableOptions || {}
  );
console.log(result)
if (result.status == "success") {
console.log("Document URL: ", "https://docs.google.com/file/d/" + result.documentId + "")
  }
}
