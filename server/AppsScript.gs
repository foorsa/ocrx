function createDocument(SerialNumber, Candidate, DateOfBirth, Institute, City, Province, Session, Mention, Series) {
  var TEMPLATE_ID = '1X3rr9TPPR7egAZLvDalNBAnkOYizgAmezHwFgRw1rzE';  
  var documentId = DriveApp.getFileById(TEMPLATE_ID).makeCopy().getId();
  
  var drivedoc = DriveApp.getFileById(documentId);
  var documentName = "Baccalaureate Diploma - " + Candidate;
  drivedoc.setName(documentName);
  
  var doc = DocumentApp.openById(documentId);
  
  var body = doc.getBody();
  
  body.replaceText('{SerialNumber}', SerialNumber);
  body.replaceText('{Candidate}', Candidate);
  body.replaceText('{DateOfBirth}', DateOfBirth);
  body.replaceText('{Institute}', Institute);
  body.replaceText('{City}', City);
  body.replaceText('{Province}', Province);
  body.replaceText('{Session}', Session);
  body.replaceText('{Mention}', Mention);
  body.replaceText('{Series}', Series);

  drivedoc.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);

  return "https://docs.google.com/document/d/" + documentId + "/export?format=pdf";
}

function doGet(e) {
  var {SerialNumber, Candidate, DateOfBirth, Institute, City, Province, Session, Mention, Series} = e.parameter;
  var url = createDocument(SerialNumber, Candidate, DateOfBirth, Institute, City, Province, Session, Mention, Series);
  return ContentService.createTextOutput(url);
}
