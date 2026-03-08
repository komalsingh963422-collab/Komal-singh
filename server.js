const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

const app = express();
let qr = "";

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr: newQr } = update;
    if (newQr) {
      qr = newQr;
      console.log("QR Code generated");
    }
  });
}

startSock();

app.get("/", (req, res) => {
  res.send("WhatsApp API Server Running");
});

app.get("/qr", async (req, res) => {
  if (!qr) return res.send("QR not ready");
  const qrImage = await QRCode.toDataURL(qr);
  res.send(`<img src="${qrImage}" />`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});