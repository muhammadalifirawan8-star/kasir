function initSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const schema = {
    'Users': ['id', 'username', 'password', 'role', 'timestamp'],
    'Products': ['id', 'name', 'category', 'price', 'stock', 'image', 'timestamp'],
    'Transactions': ['id', 'receipt', 'tableNo', 'paymentMethod', 'total', 'items', 'timestamp']
  };

  // LOOP MEMBUAT SHEET SESUAI SKEMA DENGAN AMAN
  Object.keys(schema).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(schema[sheetName]);
      sheet.getRange(1, 1, 1, schema[sheetName].length)
           .setFontWeight("bold")
           .setBackground("#f59e0b")
           .setFontColor("white");
    }
  });

  // GENERATE AKUN DEFAULT JIKA KOSONG
  const userSheet = ss.getSheetByName('Users');
  if (userSheet.getLastRow() <= 1) {
    userSheet.appendRow([Utils.generateID(), 'admin', 'admin123', 'Admin', Utils.getTimestamp()]);
    userSheet.appendRow([Utils.generateID(), 'kasir', 'kasir123', 'Kasir', Utils.getTimestamp()]);
  }

  // GENERATE PRODUK DUMMY AGAR TAMPILAN TIDAK KOSONG
  const prodSheet = ss.getSheetByName('Products');
  if (prodSheet.getLastRow() <= 1) {
    const dummy = [
      ['Nasi Goreng Spesial', 'Makanan', 25000, 50, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80'],
      ['Mie Goreng Seafood', 'Makanan', 28000, 30, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80'],
      ['Kopi Gula Aren', 'Minuman', 18000, 100, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300&q=80'],
      ['Es Teh Manis', 'Minuman', 8000, 150, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80'],
      ['Kentang Goreng', 'Snack', 15000, 40, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=300&q=80']
    ];
    dummy.forEach(d => prodSheet.appendRow([Utils.generateID(), d[0], d[1], d[2], d[3], d[4], Utils.getTimestamp()]));
  }
}