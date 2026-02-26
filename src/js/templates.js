// Template management
import { notify } from './notifications.js';

export class TemplateManager {
  constructor() {
    this.templates = this.loadTemplates();
  }

  loadTemplates() {
    try {
      const data = localStorage.getItem('packingListTemplates');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading templates:', e);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem('packingListTemplates', JSON.stringify(this.templates));
    } catch (e) {
      console.error('Error saving templates:', e);
    }
  }

  saveTemplate(name) {
    // Capture current form state
    const formData = {
      nights: document.getElementById('nights').value,
      weather: document.getElementById('weather').value,
      accommodation: document.getElementById('accommodation').value,
      beach: document.getElementById('beach').checked,
      sauna: document.getElementById('sauna').checked,
      hiking: document.getElementById('hiking').checked,
      climbing: document.getElementById('climbing').checked,
      abroad: document.getElementById('abroad').checked,
      flight: document.getElementById('flight').checked,
      fotos: document.getElementById('fotos').checked,
      washing_machine: document.getElementById('washing_machine').checked
    };

    // Get custom items
    const customItems = window.appState.customItemsManager
      ? window.appState.customItemsManager.getAll()
      : [];

    const template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      formData,
      customItems: JSON.parse(JSON.stringify(customItems)), // Deep clone
      createdAt: Date.now()
    };

    this.templates.push(template);
    this.save();
    this.renderTemplateList();

    return template;
  }

  loadTemplate(id) {
    const template = this.templates.find(t => t.id === id);
    if (!template) return false;

    // Restore form inputs
    Object.entries(template.formData).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });

    // Restore custom items
    if (template.customItems && window.appState.customItemsManager) {
      // Clear existing custom items
      window.appState.customItemsManager.customItems = [];

      // Add template custom items
      template.customItems.forEach(item => {
        window.appState.customItemsManager.customItems.push({
          ...item,
          id: crypto.randomUUID() // New ID to avoid conflicts
        });
      });

      window.appState.customItemsManager.save();
      window.appState.customItemsManager.render();
    }

    // Regenerate packing list
    if (window.generatePackingList) {
      window.generatePackingList();
    }

    return true;
  }

  deleteTemplate(id) {
    this.templates = this.templates.filter(t => t.id !== id);
    this.save();
    this.renderTemplateList();
  }

  renderTemplateList() {
    const container = document.getElementById('templateList');
    if (!container) return;

    if (!this.templates.length) {
      container.innerHTML = '<p class="text-sm text-gray-500 italic">No saved templates</p>';
      return;
    }

    container.innerHTML = this.templates
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(template => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700">${this.escapeHtml(template.name)}</p>
            <p class="text-xs text-gray-500">${new Date(template.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="flex gap-2">
            <button
              class="load-template text-sm text-green-600 hover:text-green-800 focus:outline-none focus:underline"
              data-id="${template.id}"
              aria-label="Load template ${this.escapeHtml(template.name)}"
            >
              Load
            </button>
            <button
              class="delete-template text-sm text-red-600 hover:text-red-800 focus:outline-none focus:underline"
              data-id="${template.id}"
              aria-label="Delete template ${this.escapeHtml(template.name)}"
            >
              Delete
            </button>
          </div>
        </div>
      `).join('');

    this.attachTemplateEventListeners();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  init() {
    // Save template button
    const saveBtn = document.getElementById('saveTemplateBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.showModal('save');
      });
    }

    // Load template button
    const loadBtn = document.getElementById('loadTemplateBtn');
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        this.showModal('load');
      });
    }

    // Confirm save
    const confirmBtn = document.getElementById('confirmSaveTemplate');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const name = document.getElementById('templateName').value.trim();
        if (name) {
          this.saveTemplate(name);
          document.getElementById('templateName').value = '';
          notify.success('Template saved successfully!');
        }
      });
    }

    // Close modal
    const closeBtn = document.getElementById('closeTemplateModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideModal();
      });
    }

    // Close on backdrop click
    const modal = document.getElementById('templateModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'templateModal') {
          this.hideModal();
        }
      });
    }
  }

  attachTemplateEventListeners() {
    document.querySelectorAll('.load-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (this.loadTemplate(id)) {
          this.hideModal();
          notify.success('Template loaded successfully!');
        }
      });
    });

    document.querySelectorAll('.delete-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const template = this.templates.find(t => t.id === id);
        if (template && confirm(`Delete template "${template.name}"?`)) {
          this.deleteTemplate(id);
        }
      });
    });
  }

  showModal(mode) {
    const modal = document.getElementById('templateModal');
    if (!modal) return;

    modal.classList.remove('hidden');

    // Focus management for accessibility
    if (mode === 'save') {
      const templateName = document.getElementById('templateName');
      if (templateName) {
        setTimeout(() => templateName.focus(), 100);
      }
    }

    // Render template list
    this.renderTemplateList();
  }

  hideModal() {
    const modal = document.getElementById('templateModal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}
