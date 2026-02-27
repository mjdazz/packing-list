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

    // Capture checklist state
    const checklistState = [];
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checklistState.push(checkbox.checked);
    });

    const template = {
      id: crypto.randomUUID(),
      name: name.trim(),
      formData,
      customItems: JSON.parse(JSON.stringify(customItems)), // Deep clone
      checklistState,
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

    // Restore checklist state after a short delay to ensure DOM is updated
    if (template.checklistState) {
      setTimeout(() => {
        const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
        template.checklistState.forEach((checked, index) => {
          if (checkboxes[index]) {
            checkboxes[index].checked = checked;
          }
        });

        // Update packed count
        if (window.appState && window.appState.uiManager) {
          window.appState.uiManager.updatePackedCount();
        }
      }, 100);
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
    console.log('renderTemplateList called, container:', container, 'templates:', this.templates);

    if (!container) {
      console.error('templateList container not found!');
      return;
    }

    if (!this.templates.length) {
      container.innerHTML = '<p class="text-sm text-gray-500 italic">No saved templates</p>';
      return;
    }

    const html = this.templates
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(template => `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <div class="mb-2">
            <p class="text-sm font-medium text-gray-700">${this.escapeHtml(template.name)}</p>
            <p class="text-xs text-gray-500">${new Date(template.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="flex gap-2">
            <button
              class="load-template flex-1 text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              style="background-color: #16a34a; color: white;"
              data-id="${template.id}"
              aria-label="Load template ${this.escapeHtml(template.name)}"
              onmouseover="this.style.backgroundColor='#15803d'"
              onmouseout="this.style.backgroundColor='#16a34a'"
            >
              📂 Load
            </button>
            <button
              class="delete-template text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              style="background-color: #dc2626; color: white;"
              data-id="${template.id}"
              aria-label="Delete template ${this.escapeHtml(template.name)}"
              onmouseover="this.style.backgroundColor='#b91c1c'"
              onmouseout="this.style.backgroundColor='#dc2626'"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      `).join('');

    console.log('Setting innerHTML:', html);
    container.innerHTML = html;

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
    const templateNameInput = document.getElementById('templateName');

    if (saveBtn && templateNameInput) {
      saveBtn.addEventListener('click', () => {
        const name = templateNameInput.value.trim();
        if (name) {
          this.saveTemplate(name);
          templateNameInput.value = '';
          notify.success('Template saved successfully!');
        } else {
          notify.error('Please enter a template name');
        }
      });

      // Allow Enter key to save
      templateNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveBtn.click();
        }
      });
    }

    // Initial render
    this.renderTemplateList();
  }

  attachTemplateEventListeners() {
    const loadButtons = document.querySelectorAll('.load-template');
    const deleteButtons = document.querySelectorAll('.delete-template');

    console.log('Attaching listeners - Load buttons:', loadButtons.length, 'Delete buttons:', deleteButtons.length);

    loadButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        console.log('Load clicked for template:', id);
        if (this.loadTemplate(id)) {
          notify.success('Template loaded successfully!');
        }
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const template = this.templates.find(t => t.id === id);
        if (template && confirm(`Delete template "${template.name}"?`)) {
          this.deleteTemplate(id);
          notify.success('Template deleted');
        }
      });
    });
  }
}
