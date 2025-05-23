
# 🔒 PhishShield – Chrome Extension for Malicious URL Detection

**PhishShield** is a Chrome browser extension that automatically scans websites you visit and checks them against the [VirusTotal](https://www.virustotal.com/) database to detect **malicious** or **suspicious** activity in real time.

## 🚀 Features

- ✅ Real-time scanning of websites using the VirusTotal API  
- ✅ Alerts the user when a website is marked as **malicious** or **suspicious**
- ✅ Displays scan status with dynamic icons in the browser toolbar
- ✅ Sends browser notifications for malicious threats

## 📸 Screenshots

| Scanning Icon | Safe Website | Malicious Detected |
|---------------|--------------|--------------------|
| ![Scanning](./icons/scanning.png) | ![Safe](./icons/icon.png) | ![Danger](./icons/danger.png) |


## 🛠️ Tech Stack

- **JavaScript**
- **Chrome Extensions API**
- **VirusTotal REST API**

## ⚙️ How It Works

1. When a user opens a new tab or website, the extension is triggered.
2. The URL is sent to the VirusTotal API for scanning.
3. The extension polls VirusTotal until the scan result is ready.
4. Based on results:
   - ✅ Safe → default icon shown
   - ⚠️ Suspicious or malicious → warning icon + notification

## 📦 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the folder containing the extension files

---

## 🔐 Configuration

Replace your own VirusTotal API key in `background.js`:

```js
const VIRUSTOTAL_API_KEY = "YOUR_API_KEY_HERE";
```
You can get your free API key from [VirusTotal API](https://www.virustotal.com/gui/join-us).

🌐 3. Test It on a Website
    Now, try visiting some websites:
✅ Safe URL Test
Open a new tab and go to: https://example.com

You should see:

🔄 Icon change to scanning.png first.

✅ Then change back to icon.png if it's safe.

⚠️ Malicious URL Test
Visit a known malicious test URL (example for testing VirusTotal):

http://www.smokeinsecticide.com (commonly flagged)

If VirusTotal flags it:

Icon will change to danger.png

A notification will show: “PhishShield Alert”


## 📚 Use Cases

- 🔐 Personal browsing safety
- 🧪 Security research tools
- 🧩 Browser extension learning project
- 🧑‍💻 Portfolio project for cybersecurity roles

---

## 🧠 Future Improvements (Optional Ideas)

- Add a popup UI to display the full scan result
- Option to whitelist trusted domains
- Show detection engines and severity level

---

## 🙌 Credits

- [VirusTotal](https://www.virustotal.com/) API for threat scanning
- Chrome Extension APIs

---

## 📃 License

This project is open-source and available under the MIT License.
