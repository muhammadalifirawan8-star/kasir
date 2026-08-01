const Utils = {
  success: function(data = null, message = "Success") {
    const res = { status: "success", code: 200, message: message, data: data };
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  },
  error: function(error, code = 500) {
    const res = { status: "error", code: code, message: error.message || error, data: null };
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  },
  generateID: () => Utilities.getUuid(),
  getTimestamp: () => new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
};