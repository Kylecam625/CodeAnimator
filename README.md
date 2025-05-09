# Code Animation Tool

A lightweight web application for creating animated code visualizations, perfect for presentations, tutorials, and educational content.

## ✨ Features

- **Code Animation**: Smoothly scroll through code for visually appealing presentations
- **Syntax Highlighting**: Beautiful syntax highlighting with multiple themes (Atom One Dark, GitHub, Monokai, Android Studio, Dracula)
- **Customizable Speed**: Adjust animation speed to your preference
- **Fullscreen Mode**: Present your code in distraction-free fullscreen with a blurred background
- **Editable Filename**: Click the filename to customize it, automatically remembered between sessions
- **Keyboard Shortcuts**: Control animations with simple keyboard commands
- **Video Export**: Download animations as videos for sharing or embedding
- **Responsive Design**: Works great on desktops, tablets, and mobile devices

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Paste your code in the input area
3. Click "Load Code for Animation"
4. Adjust the animation speed if needed
5. Click the fullscreen button or press `G` to start the animation in fullscreen
6. Click "Download" to export as a video file

## ⌨️ Keyboard Shortcuts

- `G` - Start animation in fullscreen
- `R` - Restart animation
- `F` - Toggle fullscreen mode
- `ESC` - Exit fullscreen mode

## 💻 Technologies

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Syntax Highlighting:** [highlight.js](https://highlightjs.org/)
- **Screen Capture:** [html2canvas](https://html2canvas.hertzen.com/)

## 🔧 Installation

No installation required! Simply clone the repository and open `index.html` in your browser:

```bash
git clone https://github.com/Kylecam625/codeanimations.git
cd codeanimations
# Open index.html in your browser
```

## 📋 Project Structure

```
codeanimations/
├── assets/           # Resources and assets
├── css/              # Stylesheets
│   ├── base.css      # Base styles and variables
│   ├── components.css # UI component styles
│   ├── layout.css    # Layout structure styles
│   ├── main.css      # CSS entry point
│   ├── modal.css     # Modal dialog styles
│   ├── progress.css  # Progress bar styles
│   └── legacy/       # Legacy CSS (for reference)
├── js/               # JavaScript files
│   ├── modules/      # Modular JS components
│   │   ├── animation.js      # Animation controller
│   │   ├── codeHandling.js   # Code input and highlighting
│   │   ├── exporter.js       # Video export functionality
│   │   ├── modalHandler.js   # Modal dialog controller
│   │   └── theme.js          # Theme selection and management
│   ├── legacy/       # Legacy code (for reference)
│   └── main.js       # Main application entry point
├── docs/             # Documentation
├── index.html        # Main HTML file
├── CHANGELOG.md      # Record of changes
└── README.md         # This file
```

## 🆕 Recent Updates

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

- Improved fullscreen mode with blurred background
- Added editable filenames with persistent storage
- Multiple syntax highlighting themes
- Fixed scrolling issues in animation
- Added better scrollbars for code navigation
- Ensured code is displayed properly without cutting off content

## 🔮 Coming Soon

- Multiple language support
- Line numbers option
- Additional animation effects
- More themes and customization options
- Code snippet library

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Kyle Camuti
