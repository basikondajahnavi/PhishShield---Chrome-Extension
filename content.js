let alertFlag = 0;

function isPhishingEmail(emailText) {
    const phishingKeywords = [
        "verify", "login", "password", "account", "bank", "credit card",
        "security alert", "click here", "urgent", "suspend", "reset", "confirm"
    ];
    const lowercaseText = emailText.toLowerCase();

    return phishingKeywords.some(keyword => lowercaseText.includes(keyword));
}

function addPhishingWarningBanner() {
    // Remove existing banner if any
    document.querySelectorAll(".phishing-banner").forEach(b => b.remove());

    const banner = document.createElement("div");
    banner.textContent = "⚠️ Warning: This email may be a phishing attempt!";
    banner.className = "phishing-banner";
    Object.assign(banner.style, {
        backgroundColor: "#ffcccc",
        color: "#990000",
        padding: "10px",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: "9999"
    });

    const header = document.querySelector(".ha");
    if (header && header.parentNode) {
        header.parentNode.insertBefore(banner, header);
    }
}

function scanCurrentEmail() {
    const emailBodyElement = document.querySelector(".a3s");
    if (emailBodyElement) {
        const emailText = emailBodyElement.innerText;
        if (isPhishingEmail(emailText) && alertFlag === 0) {
            alertFlag = 1;
            addPhishingWarningBanner();

            // Add red border to the email body
            emailBodyElement.style.border = "3px solid red";

            chrome.runtime.sendMessage({
                action: "showNotification",
                title: "Phishing Email Detected",
                message: "Warning: This email contains suspicious keywords."
            });
        }
    }
}

// Use MutationObserver instead of interval for performance
const observer = new MutationObserver(() => {
    alertFlag = 0; // Reset for each new email
    scanCurrentEmail();
});

function startObserver() {
    const targetNode = document.querySelector(".ae4.UI");
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    } else {
        // Retry if Gmail not fully loaded yet
        setTimeout(startObserver, 1000);
    }
}

startObserver();

