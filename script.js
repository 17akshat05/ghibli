document.getElementById("upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            document.getElementById("originalImage").src = img.src;
            document.getElementById("originalImage").style.display = "block";
        };
    };
    reader.readAsDataURL(file);
});

document.getElementById("convertBtn").addEventListener("click", function () {
    const img = document.getElementById("originalImage");
    if (!img.src) {
        alert("Please upload an image first.");
        return;
    }

    applyGhibliEffect(img, "ghibliCanvas", "downloadGhibli");
    applyMangaEffect(img, "mangaCanvas", "downloadManga");
    applyLegoEffect(img, "legoCanvas", "downloadLego");
});

function applyGhibliEffect(img, canvasId, downloadId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply Ghibli-like soft blur
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] += 10;  // R
        imageData.data[i + 1] += 15; // G
        imageData.data[i + 2] += 25; // B
    }
    ctx.putImageData(imageData, 0, 0);
    
    enableDownload(canvas, downloadId);
}

function applyMangaEffect(img, canvasId, downloadId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Convert to Black & White (Manga style)
    for (let i = 0; i < imageData.data.length; i += 4) {
        let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
    
    enableDownload(canvas, downloadId);
}

function applyLegoEffect(img, canvasId, downloadId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Reduce resolution for blocky effect
    const smallCanvas = document.createElement("canvas");
    const smallCtx = smallCanvas.getContext("2d");
    smallCanvas.width = img.width / 10;
    smallCanvas.height = img.height / 10;
    smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
    
    enableDownload(canvas, downloadId);
}

function enableDownload(canvas, downloadId) {
    const downloadLink = document.getElementById(downloadId);
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.style.display = "block";
}
