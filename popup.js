document.getElementById("downloadBtn").addEventListener("click", async () => {
    chrome.storage.local.get("mediaUrl", (data) => {
        if (data.mediaUrl) {
            const a = document.createElement("a");
            a.href = data.mediaUrl;
            a.download = "JioSaavn_Song.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            document.getElementById("status").innerText = "Download Started!";
        } else {
            document.getElementById("status").innerText = "No song found! Play a song first.";
        }
    });
});
