# Quick Start Guide 🚀

## Installation

### Prerequisites
- Python 3.8+
- Camera/webcam access
- Git

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/your-username/privacy-screen-app.git
cd privacy-screen-app

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# For development:
pip install -r requirements-dev.txt
```

## Running the App

### Basic Usage
```bash
# Run the application
python src/main.py

# Or use the Makefile
make run
```

### Development Commands
```bash
# Run tests
make test

# Format code
make format

# Lint code
make lint

# Run with coverage
make test-cov

# Clean build artifacts
make clean
```

## Configuration

The app uses `config/settings.yaml` for configuration. Key settings:

```yaml
protection:
  mode: "blur"              # blur, pixelate, overlay, brightness, stealth
  sensitivity: 0.8          # 0.0 to 1.0
  reaction_time: 200        # milliseconds

camera:
  resolution: "720p"        # 480p, 720p, 1080p
  fps: 30                   # frames per second
```

## Project Structure

```
privacy-screen-app/
├── src/                    # Source code
│   ├── core/              # Core functionality
│   │   ├── privacy_screen_app.py    # Main app class
│   │   ├── face_detector.py         # Face detection
│   │   ├── gaze_tracker.py          # Eye tracking
│   │   ├── screen_protector.py      # Screen protection
│   │   └── camera_manager.py        # Camera management
│   ├── utils/             # Utilities
│   ├── models/            # Data models
│   └── main.py            # Entry point
├── config/                 # Configuration files
├── tests/                  # Test suite
├── requirements.txt        # Dependencies
└── Makefile               # Development commands
```

## Key Features

- **Real-time face detection** using MediaPipe and OpenCV
- **Gaze tracking** for precise user attention detection
- **Multiple protection modes**: blur, pixelate, overlay, brightness, stealth
- **Platform support**: Windows, macOS, Linux
- **Local processing** for complete privacy
- **Configurable sensitivity** and reaction time

## Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Check if camera is not in use by other applications
- Try different camera device indices

### Performance Issues
- Reduce camera resolution in config
- Lower FPS settings
- Enable power saving mode

### Import Errors
- Ensure virtual environment is activated
- Check Python version (3.8+)
- Install all dependencies

## Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement in appropriate module
3. Add tests in `tests/`
4. Update documentation
5. Submit pull request

### Code Style
- Use Black for formatting
- Follow PEP 8 guidelines
- Add type hints
- Write docstrings for all functions

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/privacy-screen-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/privacy-screen-app/discussions)
- **Email**: support@privacyscreenapp.com

---

**Happy coding! 🔒✨**