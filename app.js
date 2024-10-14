const express = require("express");
const QRCode = require("qrcode");
const mysql = require("mysql2/promise");
const cors = require("cors"); // Import CORS
const fs = require("fs");
const path = require("path");
// Configure a secure connection with a dedicated user
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "barcode-app",
});

const app = express();
const port = 3030;
app.use(express.static("public"));

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Generate QR Code and store in database
app.post("/generate-qr", async (req, res) => {
  const { nama, email } = req.body;

  try {
    // Buat QR Code
    const qrCodeData = await QRCode.toDataURL(`Nama: ${nama}, Email: ${email}`);

    // Menyimpan QR Code ke file
    const qrCodeFilename = `qr-${Date.now()}.png`;
    const qrCodeFilePath = path.join(__dirname, "public", qrCodeFilename);

    // Menggunakan QRCode.toFile untuk menyimpan sebagai gambar
    await QRCode.toFile(qrCodeFilePath, `Nama: ${nama}, Email: ${email}`);

    // Mengembalikan URL gambar
    res.json({ qrCode: `/${qrCodeFilename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghasilkan QR Code" });
  }
});

// Scan QR Code and retrieve participant data
app.post("/scan-qr", async (req, res) => {
  const { qrCode } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM pesertas WHERE qr_code = ?",
      [qrCode]
    );
    const participant = rows[0];

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    res.json(participant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
