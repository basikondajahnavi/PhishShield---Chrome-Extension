const VIRUSTOTAL_API_KEY = "YOURS_API_KEY";

// Fix and validate the URL
function fixUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.href;
        }
        return null; // skip non-http/https URLs
    } catch (e) {
        console.error("Invalid URL format:", url);
        return null;
    }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && !tab.url.includes("mail.google.com")) {
        const cleanUrl = fixUrl(tab.url);
        if (cleanUrl) {
            chrome.action.setIcon({ tabId, path: "../icons/scanning.png" });
            chrome.storage.local.set({ scanStatus: "scanning", phishingStatus: null });
            scanURL(tabId, cleanUrl);
        } else {
            console.warn("Skipping scan. Invalid or unsupported URL:", tab.url);
        }
    }
});

// Handle notifications
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showNotification") {
        chrome.notifications.create(`notify_${Date.now()}`, {
            type: "basic",
            iconUrl: "../icons/danger.png",
            title: request.title,
            message: request.message
        });
    }
    return true;
});

// Scan the given URL using VirusTotal
async function scanURL(tabId, url) {
    try {
        console.log("Scanning URL:", url);

        // Submit URL to VirusTotal
        const postResponse = await fetch("https://www.virustotal.com/api/v3/urls", {
            method: "POST",
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "url=" + encodeURIComponent(url)
        });

        if (!postResponse.ok) {
            throw new Error(`VirusTotal POST error: ${postResponse.status}`);
        }

        const postData = await postResponse.json();
        const analysisId = postData.data.id;
        console.log("Submitted URL. Analysis ID:", analysisId);

        const startTime = Date.now();
        const timeout = 15000;

        // Poll for analysis result
        const pollAnalysis = async () => {
            const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                headers: { "x-apikey": VIRUSTOTAL_API_KEY }
            });

            if (!response.ok) {
                throw new Error(`Analysis fetch error: ${response.status}`);
            }

            const analysisData = await response.json();
            const status = analysisData.data.attributes.status;

            if (status === "completed") {
                const stats = analysisData.data.attributes.stats;
                const maliciousCount = stats.malicious || 0;
                const suspiciousCount = stats.suspicious || 0;
                const isMalicious = maliciousCount > 0 || suspiciousCount > 0;

                chrome.action.setIcon({
                    tabId,
                    path: isMalicious ? "../icons/danger.png" : "../icons/icon.png"
                });

                chrome.storage.local.set({ scanStatus: isMalicious ? "malicious" : "safe" });

                if (isMalicious) {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "../icons/danger.png",
                        title: "PhishShield Alert",
                        message: `⚠️ This site is suspicious.\nMalicious: ${maliciousCount}, Suspicious: ${suspiciousCount}`
                    });
                }

                return;
            }

            if (Date.now() - startTime < timeout) {
                setTimeout(pollAnalysis, 2000);
            } else {
                throw new Error("VirusTotal scan timed out.");
            }
        };

        pollAnalysis();

    } catch (error) {
        console.error("VirusTotal Error:", error.message);
        chrome.action.setIcon({ tabId, path: "../icons/error.png" });
        chrome.storage.local.set({ scanStatus: "error" });
        chrome.notifications.create({
            type: "basic",
            iconUrl: "../icons/error.png",
            title: "PhishShield Error",
            message: "Failed to scan URL: " + error.message
        });
    }
}
