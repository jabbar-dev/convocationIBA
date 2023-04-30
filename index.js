document.getElementById("generateBtn").addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const id = document.getElementById("id").value;

    if (name === "" || id === "") {
        alert("Please enter both name and ID.");
        return;
    }

    const data = JSON.stringify({ name: name, id: id });

    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = ""; // Clear the container

    const qrCode = new QRCode(qrcodeContainer, {
        text: data,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });

    document.getElementById("downloadBtn").hidden = false;
});

document.getElementById("downloadBtn").addEventListener("click", function () {
    const canvas = document.querySelector("#qrcode canvas");
    const imgDataUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = imgDataUrl;
    link.download = "QRCode.png";
    link.click();
});
