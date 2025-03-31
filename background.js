let downloadedSongs = new Set(); // Stores unique song IDs
let isProcessing = false; // Prevents multiple parallel requests

chrome.webRequest.onCompleted.addListener(
    async (details) => {
        if (isProcessing) return; // Prevent multiple requests while processing

        if (details.url.includes("song.generateAuthToken")) {  
            console.log("🎵 Song API Detected:", details.url);

            isProcessing = true; // Block further requests while fetching

            try {
                let response = await fetch(details.url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "application/json",
                        "Referer": "https://www.jiosaavn.com/"
                    }
                });

                let data = await response.json();
                let songUrl = data.auth_url; 

                if (songUrl && songUrl.includes(".mp4")) {
                    let songID = new URL(songUrl).pathname.split('/').pop().split('.')[0];  

                    if (!downloadedSongs.has(songID)) {
                        console.log("🎵 Downloading:", songUrl);
                        downloadedSongs.add(songID); // Mark as downloaded

                        chrome.downloads.download({
                            url: songUrl,
                            filename: `JioSaavn/Song_${songID}.mp4`,
                            conflictAction: "uniquify"
                        });

                        console.log("✅ Download started for:", songUrl);
                    } else {
                        console.log("⚠️ Already downloaded, skipping...");
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching song URL:", error);
            }

            // Delay for 5 seconds before allowing another request
            setTimeout(() => {
                isProcessing = false;
            }, 5000);
        }
    },
    { urls: ["*://www.jiosaavn.com/api.php?__call=song.generateAuthToken*"] }
);
