# Changelog

All notable changes to the Smart Packing List Generator project.

## [2.0.0] - 2026-02-26

### 🎉 Major Refactor - Complete Overhaul

This release represents a complete rewrite of the application with modern architecture, enhanced accessibility, and new features.

### ✨ Added

#### New Features
- **Custom Items System**: Add, edit, and delete your own packing items
  - Persistent storage across sessions
  - Category assignment
  - Quantity specification
  - Integration with main packing list

- **Template Management**: Save and load trip configurations
  - Save current form settings as reusable templates
  - Store custom items with templates
  - Load templates with one click
  - Delete unwanted templates
  - Templates persist in localStorage

- **Print Functionality**: Professional print support
  - Print-friendly stylesheet
  - Clean layout without UI controls
  - Trip summary header
  - Optimized for black & white printing

- **Toast Notifications**: Modern user feedback
  - Non-intrusive notifications
  - Success, error, warning, and info types
  - Auto-dismiss after 3 seconds
  - Accessible (ARIA live regions)

#### Accessibility Improvements
- **WCAG AA Compliance**: Full accessibility support
  - Proper ARIA labels on all interactive elements
  - ARIA live regions for dynamic content updates
  - Screen reader compatible throughout
  - Keyboard navigation for all functionality
  - Focus visible indicators on all focusable elements
  - High contrast mode support
  - Reduced motion preferences respected

- **Semantic HTML**: Improved structure
  - Proper heading hierarchy
  - Semantic form elements
  - Accessible modal dialogs
  - Role attributes where appropriate

#### Technical Improvements
- **Modular Architecture**: Complete code reorganization
  - Separated into 11 JavaScript modules
  - Clean separation of concerns
  - Reduced HTML from 759 lines to 268 lines
  - Improved maintainability and testability

- **Build System**: Modern development workflow
  - Vite for fast development and building
  - Single-file output via vite-plugin-singlefile
  - GitHub Actions for automated deployment
  - Hot module replacement in development

- **State Management**: Robust state handling
  - Centralized state management
  - Validated localStorage with schema versioning
  - Debounced saves to reduce writes
  - Eliminated race conditions (removed 100ms timeout hack)

- **Error Handling**: Comprehensive validation
  - Input validation for form fields
  - localStorage quota handling
  - Malformed data recovery
  - User-friendly error messages

### 🔧 Changed

#### UI/UX Improvements
- Reorganized header with template and print buttons
- Improved mobile responsiveness
- Better visual feedback for user actions
- Cleaner modal designs
- Enhanced progress tracking display

#### Code Quality
- **From monolithic to modular**:
  - `storage.js`: localStorage with validation
  - `state.js`: State management
  - `packingList.js`: List generation logic
  - `ui.js`: DOM manipulation
  - `customItems.js`: Custom items manager
  - `templates.js`: Template system
  - `export.js`: Print functionality
  - `notifications.js`: Toast system
  - `validation.js`: Input validation
  - `i18n.js`: Internationalization (refactored)
  - `main.js`: Application entry point

- **Improved i18n system**:
  - Fixed select option translation bug
  - Proper handling of `data-i18n` attributes
  - Added translations for new features
  - Export functions for use in modules

- **Better performance**:
  - DOM element caching
  - Debounced state saves
  - Event delegation where appropriate
  - Optimized rendering

### 🐛 Fixed

#### Critical Fixes
- **Accessibility Issues**:
  - Custom checkboxes now keyboard accessible (changed from `opacity-0 absolute` to `sr-only`)
  - Select options properly translatable (removed broken `<span>` elements inside `<option>`)
  - Added missing ARIA labels throughout
  - Fixed focus management in modals

- **Race Conditions**:
  - Eliminated 100ms timeout hack in state restoration
  - Implemented proper event-driven state restoration using `requestAnimationFrame`
  - Synchronous state updates with DOM rendering

- **Security**:
  - localStorage data now validated before use
  - Schema versioning prevents data corruption
  - HTML escaping for user-generated content
  - Proper error handling for quota exceeded

- **Bugs**:
  - Fixed checkbox ID mismatch (fotos vs photos)
  - Fixed translation system for dynamic content
  - Fixed progress bar ARIA attributes
  - Fixed state persistence edge cases

### 🎨 Styling

- Created `accessibility.css`:
  - Screen reader only class (`.sr-only`)
  - Focus visible styles
  - High contrast mode support
  - Reduced motion support

- Created `print.css`:
  - Clean print layout
  - Hidden non-essential elements
  - Optimized for paper/PDF
  - Black and white friendly

### 📚 Documentation

- Comprehensive README.md with:
  - Feature overview
  - Quick start guide
  - Project structure
  - Usage instructions
  - Technology stack details
  - Accessibility information
  - Contributing guidelines

- CHANGELOG.md (this file)
- ARCHITECTURE.md with technical details

### 🔒 Security

- Schema validation for localStorage data
- JSON.parse error handling
- Quota exceeded error handling
- Input sanitization for custom items
- HTML escaping for user content

### ⚡ Performance

- Reduced HTML file size by 65%
- Debounced localStorage saves
- DOM element caching
- Optimized rendering pipeline
- Event delegation for dynamic content

---

## [1.0.0] - Previous Version

### Initial Release
- Basic packing list generation
- Trip parameter inputs
- Weather-based recommendations
- Activity-based items
- Progress tracking
- English/German translations
- localStorage persistence
- Mobile responsive design

---

## Version Comparison

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Lines of HTML | 759 | 268 |
| JavaScript Modules | 0 (inline) | 11 |
| Accessibility | Basic | WCAG AA |
| Custom Items | ❌ | ✅ |
| Templates | ❌ | ✅ |
| Print Support | ❌ | ✅ |
| Toast Notifications | ❌ | ✅ |
| State Validation | ❌ | ✅ |
| Build System | None | Vite |
| CI/CD | Manual | GitHub Actions |

---

## Migration Guide

### From v1.0 to v2.0

**localStorage Changes:**
- Old data is automatically migrated
- Schema version added for future compatibility
- Invalid data is safely cleared

**No Action Required:**
- The application handles migration automatically
- Your saved trips will continue to work
- Custom items and templates are new features

**New Capabilities:**
- Add custom items to any list
- Save favorite configurations as templates
- Print clean, formatted lists
- Better accessibility for all users

---

## Roadmap

### Future Enhancements (Post v2.0)

**Potential Features:**
- Cloud sync (Firebase/Supabase)
- Share templates via URL
- PWA offline support
- Weather API integration
- Item usage analytics
- Community template marketplace
- Additional languages
- Dark mode theme

**Technical Debt:**
- Add unit tests (Jest)
- Add E2E tests (Playwright)
- Performance profiling
- Bundle size optimization
- Browser compatibility testing

---

**Note**: Version 2.0 maintains backward compatibility with v1.0 localStorage data while adding significant new capabilities.
