document
  .getElementById("generate-qr-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, email }),
      });

      const data = await response.json();

      if (response.ok) {
        const qrCodeImg = `<img src="${data.qrCode}" alt="QR Code" style="width: 200px; height: 200px;">`; // Menambahkan styling untuk ukuran
        document.getElementById("qr-code-result").innerHTML = qrCodeImg;
      } else {
        document.getElementById("qr-code-result").textContent = data.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

document
  .getElementById("scan-qr-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const qrCode = document.getElementById("qr-code").value;

    try {
      const response = await fetch("/scan-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("scan-result").innerHTML = `
                <h3>Peserta Ditemukan:</h3>
                <p>Nama: ${data.nama}</p>
                <p>Email: ${data.email}</p>
            `;
      } else {
        document.getElementById("scan-result").textContent = data.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
