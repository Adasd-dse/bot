# Privacy Screen App (SafeView) 🔒

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Windows%20%7C%20macOS-blue.svg)](https://github.com/your-username/privacy-screen-app)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)

## 🇷🇴 Descrierea Produsului

**Privacy Screen App (SafeView)** este o aplicație mobilă și desktop care protejează confidențialitatea utilizatorului prin restricționarea vizibilității ecranului. Folosind camera frontală și algoritmi de computer vision, aplicația detectează dacă utilizatorul privește direct spre ecran și menține conținutul clar doar pentru acesta.

### 🎯 Problema Rezolvată

În era digitală, unde oamenii lucrează sau navighează în transportul public, birouri open-space sau cafenele, riscul de „shoulder surfing" (priviri indiscrete la ecran) este ridicat. Această aplicație elimină problema printr-o soluție software inteligentă, fără a fi nevoie de filtre fizice pentru ecran.

### 👥 Public Țintă

- **Profesioniști** (avocați, consultanți, IT, financiar) care lucrează în spații publice
- **Companii** ce gestionează date confidențiale (corporate security)
- **Utilizatori obișnuiți** care își doresc intimitate în locuri aglomerate

## 🇬🇧 Product Description

**Privacy Screen App (SafeView)** is a mobile and desktop application that protects user privacy by restricting screen visibility. Using the front camera and computer vision algorithms, the app detects whether the user is looking directly at the screen and maintains clear content only for them.

### 🎯 Problem Solved

In the digital age, where people work or browse in public transport, open-space offices, or cafes, the risk of "shoulder surfing" (unauthorized screen viewing) is high. This app eliminates the problem through an intelligent software solution, without the need for physical screen filters.

### 👥 Target Audience

- **Professionals** (lawyers, consultants, IT, financial) who work in public spaces
- **Companies** managing confidential data (corporate security)
- **Regular users** who want privacy in crowded places

## ✨ Features

### 🔒 Core Functionality
- **Real-time face detection** using front camera/webcam
- **Gaze direction analysis** for precise user identification
- **Adaptive screen protection** (blur, pixelation, overlay, brightness reduction)
- **Instant response** (< 200ms reaction time)

### 🛡️ Security Features
- **Local processing** - no data uploads, complete privacy
- **Stealth mode** - invisible operation
- **Customizable sensitivity** settings
- **Multiple protection modes**

### 📱 Platform Support
- **Android** - Native app with camera integration
- **iOS** - Native app with Face ID integration
- **Windows** - Desktop app with webcam support
- **macOS** - Desktop app with webcam support

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- OpenCV 4.5+
- PyTorch 1.9+
- Camera/webcam access

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/privacy-screen-app.git
cd privacy-screen-app

# Install dependencies
pip install -r requirements.txt

# Run the application
python src/main.py
```

### Quick Start

```python
from privacy_screen_app import PrivacyScreenApp

# Initialize the app
app = PrivacyScreenApp()

# Start protection
app.start_protection()

# Configure settings
app.set_protection_mode("blur")
app.set_sensitivity(0.8)
```

## 🏗️ Architecture

```
privacy-screen-app/
├── src/                    # Source code
│   ├── core/              # Core functionality
│   ├── ui/                # User interface
│   ├── utils/             # Utility functions
│   ├── models/            # ML models and data structures
│   └── services/          # Business logic services
├── platforms/              # Platform-specific code
│   ├── android/           # Android implementation
│   ├── ios/               # iOS implementation
│   └── desktop/           # Desktop implementation
├── tests/                  # Test suite
├── docs/                   # Documentation
├── assets/                 # Icons, images, resources
└── config/                 # Configuration files
```

## 🔧 Configuration

The app can be configured through `config/settings.yaml`:

```yaml
# Protection settings
protection:
  mode: "blur"              # blur, pixelate, overlay, brightness
  sensitivity: 0.8          # 0.0 to 1.0
  reaction_time: 200        # milliseconds
  
# Camera settings
camera:
  resolution: "720p"        # 480p, 720p, 1080p
  fps: 30                   # frames per second
  
# Performance settings
performance:
  max_cpu_usage: 0.3       # maximum CPU usage
  battery_optimization: true
```

## 🧪 Testing

```bash
# Run all tests
python -m pytest tests/

# Run specific test categories
python -m pytest tests/test_face_detection.py
python -m pytest tests/test_protection_modes.py

# Run with coverage
python -m pytest --cov=src tests/
```

## 📊 Performance Metrics

- **Reaction Time**: < 200ms
- **CPU Usage**: < 30% on average
- **Memory Usage**: < 100MB
- **Battery Impact**: < 5% per hour

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install development dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenCV community for computer vision libraries
- PyTorch team for deep learning framework
- Contributors and beta testers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/privacy-screen-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/privacy-screen-app/discussions)
- **Email**: support@privacyscreenapp.com

---

**Made with ❤️ for privacy and security**