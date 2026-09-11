<div align="center">

# 🛡️ GoodByeFirewall

### Next-Generation Deep Packet Inspection (DPI) & Firewall Circumvention Client for Windows

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20(x64)-0078D6?style=flat-square&logo=windows)](https://github.com)
[![Engine](https://img.shields.io/badge/Engine-GoodbyeDPI%20%2B%20WinDivert-0071e3?style=flat-square)](https://github.com/ValdikSS/GoodbyeDPI)
[![License](https://img.shields.io/badge/License-MIT-orange?style=flat-square)](LICENSE)

<br/>

</div>

---

## 📖 Overview

**GoodByeFirewall** is an advanced, modern Windows desktop client designed to effortlessly bypass **Deep Packet Inspection (DPI)** systems, government/ISP censorship, website blocks, and bandwidth throttling.

Powered by [GoodbyeDPI](https://github.com/ValdikSS/GoodbyeDPI) and the [WinDivert](https://reqrypt.org/windivert.html) kernel-level packet manipulation driver, GoodByeFirewall modifies outgoing network packets in real-time right before they leave your computer—making it mathematically impossible for ISP surveillance middleboxes to inspect the domain names you visit or block your connections.

---

## 🔬 How It Works Under the Hood

### What is Deep Packet Inspection (DPI)?
Most Internet Service Providers (ISPs) and national firewalls (e.g., Roskomnadzor in Russia, BTK in Turkey, or corporate filters) do not block IP addresses directly. Instead, they deploy intermediate surveillance appliances (middleboxes) that inspect the contents of your network traffic:
- **HTTP**: The middlebox inspects the plaintext `Host:` header in HTTP GET/POST requests.
- **HTTPS (TLS)**: Although traffic is encrypted, the very first packet—the **TLS ClientHello**—contains the **Server Name Indication (SNI)** in plaintext, revealing the exact website domain name you are connecting to.

### How GoodByeFirewall Bypasses DPI
GoodByeFirewall operates locally at the network stack layer using the **WinDivert** kernel driver. It does **not** route your traffic through slow remote proxies or VPN servers; your connection remains direct, full-speed, and ping-free. It defeats DPI using sophisticated packet manipulation techniques:

1. **TCP Packet Fragmentation (`-f` & `-e`)**:
   - Splits the HTTP request or TLS ClientHello packet into tiny TCP fragments (e.g., splitting right in the middle of the domain name in the SNI).
   - Because DPI middleboxes are designed for high throughput and lack full TCP stream reassembly capabilities, they fail to reconstruct and read the SNI domain name. The destination web server, however, seamlessly reassembles the fragments according to the TCP standard.

2. **Out-of-Order TCP Segmentation**:
   - Sends the second half of the ClientHello packet *before* the first half. The destination server reorders them correctly, while naive DPI filters drop or ignore the stream.

3. **HTTP Header Manipulation**:
   - Modifies whitespace, changes header cases (`host:` instead of `Host:`), and removes spaces between the header name and value, which confuses rigid ISP inspection filters while complying with web server specifications.

4. **TTL Spoofing / Decoy Packets (`--set-ttl`)**:
   - Sends fake "decoy" request packets with a deliberately low Time-To-Live (TTL).
   - The decoy packet reaches the ISP's DPI middlebox (triggering and poisoning its state engine) but expires in transit before reaching the real website destination. The real request packet follows immediately behind and connects securely.

---

## 🎛️ Features & Deep Dive

### 1. DPI Bypass Levels (Presets -1 to -9)

GoodByeFirewall includes fine-tuned presets designed for maximum compatibility across various ISP equipment:

| Level | Name | Description & Technical Behavior |
| :--- | :--- | :--- |
| **`-5`** | **Level 5 (Aggressive)** ⭐ *Default* | **Recommended for most users.** Combines aggressive TCP segmentation, TLS SNI splitting, and HTTP header manipulation. Proven effective against strict national firewalls (Russia, Turkey, Iran). |
| **`-1`** | **Level 1 (Standard)** | Most compatible passive mode. Uses standard TCP fragmentation and HTTP alterations without aggressive spoofing. |
| **`-2`** | **Level 2 (Quick ACK)** | Optimized for networks that require rapid TCP ACK responses to avoid socket timeouts. |
| **`-3`** | **Level 3 (No Fragmentation)** | Avoids splitting packets into fragments. Ideal for lossy Wi-Fi networks, mobile hotspots, or online gaming where packet splitting might cause packet loss. |
| **`-4`** | **Level 4 (Ultra Fast)** | Balanced profile offering rapid throughput with light fragmentation. |
| **`-6` to `-9`** | **Advanced Profiles** | Specialized variations of ACK timeouts, TLS record splitting, and window adjustments for tricky ISP middlebox architectures. |
| **`Custom`** | **Custom Arguments** | Free-form terminal input for advanced users. Enter custom flags (e.g., `-p -r -s -m --blacklist list.txt`). |

---

### 2. DPI Spoofing (Fake Packets & TTL)

Configurable under **Paramètres Avancés / Advanced Settings**:
- **`Désactivé / None`**: Standard fragmentation without fake packets.
- **`--auto-ttl`**: Automatically computes the hop distance to the target server and sets the decoy TTL dynamically.
- **`--set-ttl [3, 4, 5, 6]`**: Manually locks the TTL for fake decoy packets. If your ISP middlebox is located 3 hops away, a TTL of 3 ensures the fake packet reaches the firewall and dies before hitting the destination web server.

---

### 3. Anti-Censorship & Encrypted DNS Resolvers

ISPs frequently hijack or poison unencrypted UDP port 53 DNS queries to redirect users to warning splash pages. GoodByeFirewall lets you redirect DNS requests to secure, independent resolvers:
- 🛡️ **Cloudflare DNS** (`1.1.1.1` & `1.0.0.1`) — Ultra-fast, privacy-respecting resolver.
- 🔒 **Quad9** (`9.9.9.9`) — Security-focused resolver blocking malicious domains.
- ⚡ **Google Public DNS** (`8.8.8.8`) — High-availability global resolver.
- 🌐 **Yandex DNS** (Port `1253`) — Alternate port resolver bypassing standard port 53 blocks.
- 🛠️ **Custom DNS** — Specify any custom IPv4 resolver and port.

---

### 4. Dual Operating Modes

- **⚡ Session Rapide (Quick Session)**:
  - Spawns a silent, background `goodbyedpi.exe` process that shields your connection as long as the application runs.
  - Automatically stops and cleans up upon exit.
- **⚙️ Service Windows (Auto Service)**:
  - Installs GoodbyeDPI as a native Windows System Service via `sc.exe`.
  - Automatically starts on Windows boot before user login, providing permanent system-wide protection without needing the UI open.

---

### 5. Seamless System Tray & Silent Background

- **Minimize / Close to Tray**: Closing the window hides the application into the Windows system tray (hidden icons area near the clock).
- **Clean Tray Context Menu**:
  - Direct status display: `GoodByeFirewall — ACTIF` / `INACTIF`.
  - One-click protection toggle (`Activer / Désactiver la protection`).
  - Open window or Quit completely.
- **Native Windows Toast Notifications**: Configured with a registered Windows `AppUserModelId` to show crisp, native alerts identifying **GoodByeFirewall** with its custom icon.

---

### 6. Apple Bento Grid Glassmorphism UI

- **Vibrant Aesthetic**: Genuine macOS Sonoma & iOS Control Center styling with real-time acrylic blur (`backdrop-filter: blur(28px)`), rounded squircles, and specular elevation.
- **Interactive Concentric Wave Canvas**: Live 60/120 FPS canvas radiating serene Apple blue waves when idle and emerald green pulses when protected.
- **Live Network Telemetry**: Integrated real-time ping latency badge and collapsible live terminal inspector showing exact process arguments and telemetry streams.
- **Bilingual Interface**: Instant toggle between French (FR) and English (EN) with persistent settings.
- **Day / Night Theme**: Smooth toggle between Apple Pure White and Obsidian Dark themes.

---

### 7. Zero-UAC Automated Setup

WinDivert requires Administrator privileges to hook into the Windows network filter driver. GoodByeFirewall includes a built-in automated task scheduler script (`setup-skip-uac.ps1`):
- Authorize once during setup.
- All subsequent launches via Desktop or Start Menu shortcuts launch instantly **without** Windows UAC confirmation prompts.

---

## 🚀 Installation & Getting Started

### Option 1: Using the Pre-Built Installer *(Recommended)*
1. Download the latest **`Installer-GoodByeFirewall-v2.0.0.exe`** from the [Releases](https://github.com) section.
2. Run the installer and follow the on-screen setup.
3. Launch **GoodByeFirewall** from the Desktop or Start Menu.
4. Click the central **Power Button** to activate protection!

### Option 2: Running from Source
```bash
# Clone the repository
git clone https://github.com/your-username/GoodByeFirewall.git
cd GoodByeFirewall/GoodByeDPI-Pro

# Install dependencies
npm install

# Start the application
npm start

# Build standalone Windows installer
npm run build
```

---

## ⚙️ Requirements

- **Operating System**: Windows 10 or Windows 11 (64-bit recommended)
- **Privileges**: Administrator rights (required on first launch to initialize the WinDivert network driver)
- **Antivirus Note**: Because WinDivert inspects and modifies raw network packets at the kernel level, some third-party antivirus software may trigger a false-positive alert. WinDivert is 100% open-source, verified, and safe.

---

## 🤝 Contributing & License

Contributions, bug reports, and suggestions are welcome! Feel free to open an issue or submit a pull request.

Distributed under the **MIT License**. See `LICENSE` for more information.
All underlying packet manipulation rights belong to the [GoodbyeDPI](https://github.com/ValdikSS/GoodbyeDPI) and [WinDivert](https://reqrypt.org/windivert.html) projects.
