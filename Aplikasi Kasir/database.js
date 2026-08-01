const DB = {
  insert: function(sheetName, dataObject) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000); 
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      if (!sheet) throw new Error(`Tabel '${sheetName}' tidak ditemukan.`);
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const rowData = headers.map(header => dataObject[header] !== undefined ? dataObject[header] : "");
      sheet.appendRow(rowData);
      SpreadsheetApp.flush(); 
      return true;
    } finally {
      lock.releaseLock();
    }
  },
  read: function(sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error(`Tabel '${sheetName}' tidak ditemukan.`);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    const headers = data.shift();
    return data.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
  },
  update: function(sheetName, id, updateData) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idIndex = headers.indexOf('id');
      if (idIndex === -1) throw new Error("Kolom 'id' wajib ada di baris 1.");
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIndex] == id) {
          headers.forEach((h, colIndex) => {
            if (updateData[h] !== undefined) sheet.getRange(i + 1, colIndex + 1).setValue(updateData[h]);
          });
          SpreadsheetApp.flush();
          return true;
        }
      }
      throw new Error(`Data dengan ID ${id} tidak ditemukan.`);
    } finally {
      lock.releaseLock();
    }
  },
  delete: function(sheetName, id) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      const data = sheet.getDataRange().getValues();
      const idIndex = data[0].indexOf('id');
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][idIndex] == id) {
          sheet.deleteRow(i + 1);
          SpreadsheetApp.flush();
          return true;
        }
      }
      throw new Error(`Data dengan ID ${id} tidak ditemukan.`);
    } finally {
      lock.releaseLock();
    }
  }
};