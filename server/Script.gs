function createDocumentFromTemplate(TemplateId, Session) {
    try {
        // Create a copy of the template file
        var templateFile = DriveApp.getFileById(TemplateId);
        var newFile = templateFile.makeCopy();

        // Open the new document and replace placeholder text
        var doc = DocumentApp.openById(newFile.getId());
        var body = doc.getBody();

        // Add the Document Type and Session ID to the file name
        var fileName =
            Session["Document Type"] +
            " | " +
            Session["Session Id"] +
            " (" +
            Session["Operation Date"].replace(/[\/\?<>\\:\*\|":]/g, "-") + // Sanitize file name
            ")";
        doc.setName(fileName);

        let replacements = Session["Extraction"]["Corrected"];

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

            child
                .asFooterSection()
                .replaceText("{{Session Id}}", Session["Session Id"]);
            child
                .asFooterSection()
                .replaceText("{{Translation Date}}", Session["Operation Date"]);
        }

        if (Session["Information Type"] == "Tabular") {
            var documentType = Session["Document Type"];
            var searchText = "{{Grades}}";
            var foundElement = body.findText(searchText);

            if (foundElement != null) {
                switch (documentType) {
                    case "Master-Transcript-of-Marks":
                        var tableInformation =
                            Session["Extraction"]["CorrectedTable"];

                        if (tableInformation != null) {
                            // Create a new table with the same dimensions as the JSON_TABLE (transposed)
                            var numCols = Object.keys(tableInformation).length;
                            var numRows = Object.keys(
                                tableInformation[
                                    Object.keys(tableInformation)[0]
                                ]
                            ).length;

                            var startOffset = foundElement.getStartOffset();
                            var endOffset =
                                foundElement.getEndOffsetInclusive();

                            var text = foundElement.getElement().asText();
                            text.deleteText(startOffset, endOffset);

                            // Create a new table and insert it at the location of the deleted text
                            var table = body.insertTable(
                                startOffset,
                                Object.values(tableInformation)
                            );

                            // Move to the next instance of the search text
                            foundElement = body.findText(
                                searchText,
                                foundElement
                            );
                        }

                        break;
                    case "Baccalaureate-Transcript-of-Notes":
                        throw new Error("Document Type Yet Coming Soon !");
                        break;
                    default:
                        throw new Error("Document Type Not Supported !");
                        break;
                }
            }
        }

        // Save Document
        doc.saveAndClose();

        // Move the document to the specified folder
        var folderId = "1ZnsxferHUx00OEqW6ewWk_TN34msxtfJ";
        var destinationFolder = DriveApp.getFolderById(folderId);
        destinationFolder.addFile(newFile);

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
            // Return the links in the HTTP response
            return ContentService.createTextOutput(
                JSON.stringify({
                    status: "success",
                    docLink:
                        "https://docs.google.com/document/d/" +
                        result.documentId,
                    pdfLink:
                        "https://docs.google.com/document/d/" +
                        result.documentId +
                        "/export?format=pdf",
                    previewLink:
                        "https://drive.google.com/file/d/" +
                        result.documentId +
                        "/preview",
                })
            ).setMimeType(ContentService.MimeType.JSON);
        } else {
            // Return the error message in the HTTP response
            return ContentService.createTextOutput(
                JSON.stringify({
                    status: "error",
                    message: result.message,
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }
    } catch (error) {
        // Return the general error message in the HTTP response
        return ContentService.createTextOutput(
            JSON.stringify({
                status: "error",
                message: "An unexpected error occurred.",
            })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}
