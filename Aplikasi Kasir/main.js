function getProp(key, defaultVal = "") {
  return PropertiesService.getScriptProperties().getProperty(key) || defaultVal;
}

function verifyToken(token) {
  const SERVER_API_KEY = getProp('API_KEY');
  if (SERVER_API_KEY && token !== SERVER_API_KEY) {
    throw new Error("Unauthorized: API Key (Satpam) menolak akses Anda.");
  }
}

function doGet(e) {
  try {
    verifyToken(e.parameter.apiKey);
    const action = e.parameter.action;
    
    switch(action) {
      case "readData":
        if(!e.parameter.table) throw new Error("Parameter 'table' dibutuhkan.");
        return Utils.success(DB.read(e.parameter.table), "Data berhasil diambil");
      default:
        return Utils.success({ message: "API V3 Online." }, "OK");
    }
  } catch(error) {
    return Utils.error(error);
  }
}

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    verifyToken(request.apiKey);
    
    const action = request.action;
    const table = request.table;
    const payload = request.data;

    switch(action) {
      case "login":
        const users = DB.read("Users");
        const user = users.find(u => u.username === payload.username && u.password === payload.password);
        if(user) return Utils.success({ id: user.id, username: user.username, role: user.role }, "Login sukses");
        throw new Error("Username atau password salah!");

      case "insertData":
        payload.id = payload.id || Utils.generateID();
        payload.timestamp = payload.timestamp || Utils.getTimestamp();
        DB.insert(table, payload);
        return Utils.success({ id: payload.id }, "Data berhasil ditambahkan.");
        
      case "updateData":
        if(!payload.id) throw new Error("ID wajib disertakan untuk update.");
        DB.update(table, payload.id, payload);
        return Utils.success({ id: payload.id }, "Data berhasil diperbarui.");
        
      case "deleteData":
        if(!payload.id) throw new Error("ID wajib disertakan untuk hapus.");
        DB.delete(table, payload.id);
        return Utils.success(null, "Data berhasil dihapus.");

      case "checkout":
        payload.id = Utils.generateID();
        payload.receipt = "TRX-" + new Date().getTime().toString().slice(-6);
        payload.timestamp = Utils.getTimestamp();
        
        DB.insert("Transactions", payload);
        
        const items = JSON.parse(payload.items);
        const products = DB.read("Products");
        items.forEach(cartItem => {
          const p = products.find(prod => prod.id === cartItem.id);
          if (p) {
            DB.update("Products", p.id, { stock: parseInt(p.stock) - parseInt(cartItem.qty) });
          }
        });

        EmailService.sendReceiptToOwner(payload);
        return Utils.success({ receipt: payload.receipt }, "Checkout Sukses & Email terkirim!");
        
      default:
        throw new Error("Action route tidak valid.");
    }
  } catch(error) {
    return Utils.error(error);
  }
}