// Main entry point
import { initLanguage } from './i18n.js';
import { UIManager } from './ui.js';
import { StateManager } from './state.js';
import { CustomItemsManager } from './customItems.js';
import { TemplateManager } from './templates.js';
import { setupExport } from './export.js';

// Global app state
window.appState = {
  uiManager: null,
  stateManager: null,
  customItemsManager: null,
  templateManager: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing Smart Packing List...');

  // Initialize i18n
  initLanguage();

  // Initialize Custom Items Manager
  window.appState.customItemsManager = new CustomItemsManager();
  window.appState.customItemsManager.init();

  // Initialize Template Manager
  window.appState.templateManager = new TemplateManager();
  window.appState.templateManager.init();

  // Initialize Export/Print functionality
  setupExport();

  // Initialize UI Manager
  window.appState.uiManager = new UIManager();

  // Initialize State Manager with custom items manager
  window.appState.stateManager = new StateManager(
    window.appState.uiManager,
    window.appState.customItemsManager
  );

  // Setup event listeners
  window.appState.stateManager.setupEventListeners();

  // Load saved state if it exists
  window.appState.stateManager.restoreState();

  console.log('Application initialized successfully');
});

// Make generatePackingList available globally for i18n to call
window.generatePackingList = function() {
  if (window.appState.stateManager) {
    window.appState.stateManager.generateList();
  }
};
