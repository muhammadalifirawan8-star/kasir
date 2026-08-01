const EmailService = {
  sendReceiptToOwner: function(transactionData) {
    const ownerEmail = Session.getEffectiveUser().getEmail(); 
    const subject = `[POS UMKM] Transaksi Baru: ${transactionData.receipt}`;
    
    let itemsHtml = "";
    try {
      const items = JSON.parse(transactionData.items);
      items.forEach(item => {
        itemsHtml += `<li>${item.name} (x${item.qty}) - Rp ${item.price * item.qty}</li>`;
      });
    } catch(e) { itemsHtml = "Detail item corrupt."; }

    const body = `
      <h3>Transaksi Baru Masuk!</h3>
      <p><b>ID Struk:</b> ${transactionData.receipt}</p>
      <p><b>Meja:</b> ${transactionData.tableNo}</p>
      <p><b>Pembayaran:</b> ${transactionData.paymentMethod}</p>
      <p><b>Waktu:</b> ${transactionData.timestamp}</p>
      <p><b>Total Penjualan:</b> Rp ${transactionData.total}</p>
      <hr>
      <ul>${itemsHtml}</ul>
    `;
    MailApp.sendEmail({ to: ownerEmail, subject: subject, htmlBody: body });
  }
};