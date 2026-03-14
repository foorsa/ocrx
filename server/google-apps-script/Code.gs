/**
 * OCRX Document Generator - Google Apps Script
 * Handles POST requests from the OCRX backend to generate translated documents.
 *
 * This script:
 * 1. Copies a Google Docs template
 * 2. Fills in text placeholders from Session.Translation.Text
 * 3. Creates tables from Session.Translation.Tables with compact formatting
 * 4. Exports as PDF and returns links
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var templateId = data.TemplateId;
    var session = data.Session;
    var tableOptions = data.tableOptions || {};

    if (!templateId || !session) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Missing TemplateId or Session data"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Copy the template
    var templateFile = DriveApp.getFileById(templateId);
    var docName = "OCRX - " + (session["Session Id"] || "Document") + " - " + new Date().toISOString().split("T")[0];
    var copy = templateFile.makeCopy(docName);
    var doc = DocumentApp.openById(copy.getId());
    var body = doc.getBody();

    // Step 1: Replace text placeholders from Translation.Text
    var textFields = session.Translation && session.Translation.Text ? session.Translation.Text : {};
    for (var key in textFields) {
      if (textFields.hasOwnProperty(key)) {
        var placeholder = "{{" + key + "}}";
        body.replaceText(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), textFields[key] || "");
      }
    }

    // Step 2: Handle tables from Translation.Tables
    var tables = session.Translation && session.Translation.Tables ? session.Translation.Tables : null;
    if (tables && session["Information Type"] === "Tabular") {
      insertTablesCompact(body, tables, session["Document Type"], tableOptions);
    }

    // Save and close
    doc.saveAndClose();

    // Generate PDF
    var pdfBlob = DriveApp.getFileById(copy.getId()).getAs("application/pdf");
    var pdfFile = DriveApp.createFile(pdfBlob).setName(docName + ".pdf");

    // Set sharing permissions
    copy.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var result = {
      status: "success",
      docLink: "https://docs.google.com/document/d/" + copy.getId() + "/edit",
      pdfLink: "https://drive.google.com/uc?id=" + pdfFile.getId() + "&export=download",
      previewLink: "https://drive.google.com/file/d/" + pdfFile.getId() + "/preview"
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * Insert tables with compact formatting to prevent oversized cells.
 * Handles all document types: Baccalaureate V1, V2, and Master transcripts.
 */
function insertTablesCompact(body, tables, docType, options) {
  // Default compact formatting options
  var fontSize = options.fontSize || 8;
  var cellPadding = options.cellPadding || 2;
  var headerFontSize = options.headerFontSize || 8;
  var fitToPageWidth = options.fitToPageWidth !== false; // default true

  // Find the {{TABLES}} placeholder or append at end
  var tablePlaceholder = body.findText("\\{\\{TABLES\\}\\}");
  var insertIndex = null;

  if (tablePlaceholder) {
    var element = tablePlaceholder.getElement();
    var paragraph = element.getParent();
    insertIndex = body.getChildIndex(paragraph);
    // Remove the placeholder paragraph
    body.removeChild(paragraph);
  }

  // Determine table structure based on document type
  if (typeof tables === "object" && !Array.isArray(tables)) {
    // Structured tables (Baccalaureate V1/V2 format with "Transcript" and "Overall" keys)
    if (tables.Transcript) {
      var tbl = createCompactTable(body, tables.Transcript, fontSize, cellPadding, headerFontSize, insertIndex);
      if (insertIndex !== null) insertIndex++;

      // Add spacing between tables
      if (tables.Overall) {
        var spacer = body.insertParagraph(insertIndex !== null ? insertIndex : body.getNumChildren(), "");
        spacer.setSpacingBefore(4);
        spacer.setSpacingAfter(4);
        if (insertIndex !== null) insertIndex++;

        createCompactTable(body, tables.Overall, fontSize, cellPadding, headerFontSize, insertIndex);
      }
    }
  } else if (Array.isArray(tables)) {
    // Master Transcript format: array of {Subject, Mark, Result, Session} objects
    var masterTable = convertMasterArrayToTable(tables);
    createCompactTable(body, masterTable, fontSize, cellPadding, headerFontSize, insertIndex);
  }
}


/**
 * Convert Master transcript array format to Columns/Rows format.
 */
function convertMasterArrayToTable(records) {
  var columns = ["Subject", "Mark", "Result", "Session"];
  var rows = [];

  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    rows.push([
      record.Subject || "",
      record.Mark || "",
      record.Result || "",
      record.Session || ""
    ]);
  }

  return { Columns: columns, Rows: rows };
}


/**
 * Create a compact table in the document body with proper formatting.
 * This is the core function that ensures tables fit on the page.
 */
function createCompactTable(body, tableData, fontSize, cellPadding, headerFontSize, insertIndex) {
  var columns = tableData.Columns || [];
  var rows = tableData.Rows || [];

  if (columns.length === 0 && rows.length === 0) return null;

  // Build the table data array (headers + data rows)
  var allRows = [];
  if (columns.length > 0) {
    allRows.push(columns);
  }
  for (var i = 0; i < rows.length; i++) {
    allRows.push(rows[i]);
  }

  if (allRows.length === 0) return null;

  // Determine number of columns from the widest row
  var numCols = 0;
  for (var i = 0; i < allRows.length; i++) {
    if (allRows[i].length > numCols) numCols = allRows[i].length;
  }

  // Create the table
  var table;
  if (insertIndex !== null) {
    table = body.insertTable(insertIndex, allRows);
  } else {
    table = body.appendTable(allRows);
  }

  // Page width calculation (Letter: 612pt, margins ~72pt each side = 468pt usable)
  var pageWidth = 468;
  var colWidth = Math.floor(pageWidth / numCols);

  // Apply compact formatting to every cell
  for (var r = 0; r < table.getNumRows(); r++) {
    var row = table.getRow(r);

    for (var c = 0; c < row.getNumCells(); c++) {
      var cell = row.getCell(c);

      // Set tight cell padding (in points)
      cell.setPaddingTop(cellPadding);
      cell.setPaddingBottom(cellPadding);
      cell.setPaddingLeft(cellPadding + 1);
      cell.setPaddingRight(cellPadding + 1);

      // Set cell width to distribute evenly
      cell.setWidth(colWidth);

      // Format text in the cell
      var text = cell.editAsText();
      var isHeader = (r === 0 && columns.length > 0);

      text.setFontSize(isHeader ? headerFontSize : fontSize);
      text.setFontFamily("Arial");

      if (isHeader) {
        text.setBold(true);
        // Header background color
        cell.setBackgroundColor("#E8E8E8");
      } else {
        text.setBold(false);
      }

      // Vertical alignment
      cell.setVerticalAlignment(DocumentApp.VerticalAlignment.CENTER);

      // Paragraph spacing inside cells
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

  // Set table border
  table.setBorderWidth(0.5);
  table.setBorderColor("#999999");

  return table;
}
