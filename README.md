# 🧳 Smart Packing List Generator

A modern, accessible single-page application that generates customized packing lists based on your trip details. Built with vanilla JavaScript and TailwindCSS.

## ✨ Features

### Core Functionality
- **Smart List Generation**: Automatically generates packing lists based on:
  - Trip duration (nights)
  - Weather conditions (warm/medium/cold)
  - Accommodation type (hotel, hostel, mountain cabin, holiday home)
  - Activities (beach, sauna, hiking, climbing, photography)
  - Travel details (abroad, flight, washing machine availability)

### New in Version 2.0
- **Custom Items**: Add, edit, and delete your own packing items
- **Templates**: Save and load trip configurations for reuse
- **Print Support**: Print-friendly formatted packing lists
- **Toast Notifications**: Modern, non-intrusive user feedback
- **Full Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Session Persistence**: Automatically saves your progress with validated storage

### User Experience
- 📱 Fully responsive mobile design
- 🌍 Bilingual support (English/German)
- ♿ Full accessibility (WCAG AA)
- 📊 Real-time progress tracking by category
- 💾 Automatic state persistence
- 🎨 Clean, modern interface

## 🚀 Quick Start

**Important**: All npm commands must be run in Docker containers to avoid local filesystem pollution.

### Docker Commands Quick Reference

```bash
# Install dependencies
docker run --rm -v "$(pwd):/app" -w /app node:20 npm install

# Development server (with hot reload)
docker run --rm -v "$(pwd):/app" -w /app -p 3000:3000 node:20 npm run dev
# Then open http://localhost:3000

# Build for production (outputs single HTML file)
docker run --rm -v "$(pwd):/app" -w /app node:20 npm run build
# Output: dist/index.html

# Preview production build
docker run --rm -v "$(pwd):/app" -w /app -p 4173:4173 node:20 npm run preview
```

### Development Workflow

1. **First time setup**:
   ```bash
   docker run --rm -v "$(pwd):/app" -w /app node:20 npm install
   ```

2. **Start development server**:
   ```bash
   docker run --rm -v "$(pwd):/app" -w /app -p 3000:3000 node:20 npm run dev
   ```

3. **Make your changes** - files are watched and auto-reload

4. **Build for deployment**:
   ```bash
   docker run --rm -v "$(pwd):/app" -w /app node:20 npm run build
   ```

## 📁 Project Structure

```
packing-list/
├── src/
│   ├── index.html              # Main HTML (268 lines)
│   ├── js/
│   │   ├── main.js             # Application entry point
│   │   ├── state.js            # State management
│   │   ├── storage.js          # localStorage with validation
│   │   ├── packingList.js      # List generation logic
│   │   ├── ui.js               # DOM manipulation
│   │   ├── customItems.js      # Custom items manager
│   │   ├── templates.js        # Template system
│   │   ├── export.js           # Print functionality
│   │   ├── notifications.js    # Toast notifications
│   │   ├── validation.js       # Input validation
│   │   └── i18n.js             # Internationalization
│   └── styles/
│       ├── accessibility.css   # Accessibility styles
│       └── print.css           # Print-friendly styles
├── dist/                       # Build output (single HTML file)
├── vite.config.js              # Build configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🎯 Usage

### Basic Usage

1. Enter trip details (nights, weather, accommodation)
2. Select activities (beach, hiking, etc.)
3. Click "Generate Packing List"
4. Check off items as you pack
5. Track progress with visual indicators

### Custom Items

1. Scroll to "Custom Items" section
2. Enter item name, quantity, and category
3. Click "Add" to include in packing list
4. Edit or delete custom items anytime
5. Custom items persist across sessions

### Templates

1. Configure your ideal trip settings
2. Click "Save" button
3. Name your template (e.g., "Beach Weekend")
4. Click "Load" button to restore saved templates
5. Templates include form settings and custom items

### Printing

1. Generate your packing list
2. Click "Print" button
3. Print or save as PDF
4. Clean, formatted output without UI elements

## 🔧 Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **Styling**: TailwindCSS v4
- **Build Tool**: Vite v5
- **Bundling**: vite-plugin-singlefile (outputs single HTML)
- **Deployment**: GitHub Pages with GitHub Actions
- **Storage**: localStorage with schema validation

## ♿ Accessibility

This application meets WCAG AA standards:

- ✅ Full keyboard navigation
- ✅ Screen reader compatible
- ✅ ARIA labels and live regions
- ✅ Focus visible indicators
- ✅ High contrast mode support
- ✅ Reduced motion preferences respected
- ✅ Semantic HTML structure

## 🌍 Internationalization

Currently supports:
- English (en)
- German (de)

Language is automatically detected from browser settings and can be toggled using the button in the header.

## 📦 Build Details

The build process:
1. Vite bundles all JavaScript modules
2. TailwindCSS compiles styles
3. vite-plugin-singlefile inlines everything
4. Output: Single `dist/index.html` file
5. GitHub Actions automatically deploys to Pages

### Build Configuration

- Target: `esnext` for modern browsers
- All assets inlined (CSS, JS)
- Optimized for production
- Single HTML file output for easy deployment

## 🧪 Testing

Manual testing checklist:
- [ ] Form inputs persist across page reloads
- [ ] Custom items add/edit/delete correctly
- [ ] Templates save and load with all data
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces changes
- [ ] Mobile layout is usable
- [ ] Print layout is clean
- [ ] Both languages work correctly

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Run all npm commands in containers:
   ```bash
   docker run --rm -v "$(pwd):/app" -w /app node:20 npm install
   docker run --rm -v "$(pwd):/app" -w /app -p 3000:3000 node:20 npm run dev
   ```
4. Make your changes
5. Test thoroughly (including accessibility)
6. Build in container to verify:
   ```bash
   docker run --rm -v "$(pwd):/app" -w /app node:20 npm run build
   ```
7. Submit a pull request

### Code Style

- Use ES6+ modules
- Follow existing patterns
- Keep functions pure where possible
- Add JSDoc comments for complex logic
- Ensure accessibility is maintained

## 📄 License

MIT License - Feel free to use and modify

## 🙏 Acknowledgments

- TailwindCSS for the styling framework
- Vite for the build tooling
- Font Awesome for icons

## 📈 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for technical details about the application architecture.

---

**Version 2.0** - Fully refactored with modern architecture and enhanced features
