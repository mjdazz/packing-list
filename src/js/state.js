// State management
import { loadSavedState, saveState, debouncedSaveState } from './storage.js';
import { generatePackingList } from './packingList.js';

export class StateManager {
  constructor(uiManager, customItemsManager = null) {
    this.uiManager = uiManager;
    this.customItemsManager = customItemsManager;
    this.currentItems = [];
  }

  getFormData() {
    return {
      nights: parseInt(document.getElementById('nights').value) || 3,
      weather: document.getElementById('weather').value,
      beach: document.getElementById('beach').checked,
      sauna: document.getElementById('sauna').checked,
      hiking: document.getElementById('hiking').checked,
      climbing: document.getElementById('climbing').checked,
      abroad: document.getElementById('abroad').checked,
      flight: document.getElementById('flight').checked,
      fotos: document.getElementById('fotos').checked,
      accommodation: document.getElementById('accommodation').value,
      washing_machine: document.getElementById('washing_machine').checked
    };
  }

  async restoreState() {
    const state = loadSavedState();
    if (!state) return;

    // 1. Restore form inputs
    this.restoreFormInputs(state.formData);

    // 2. Generate list
    this.generateList();

    // 3. Wait for DOM update (fixes race condition - no more 100ms timeout!)
    await this.waitForDOMReady();

    // 4. Restore checkbox states
    this.restoreCheckboxStates(state.checkedItems);
  }

  restoreFormInputs(formData) {
    if (!formData) return;

    if (formData.nights) document.getElementById('nights').value = formData.nights;
    if (formData.weather) document.getElementById('weather').value = formData.weather;
    if (formData.accommodation) document.getElementById('accommodation').value = formData.accommodation;

    const checkboxes = ['beach', 'sauna', 'hiking', 'climbing', 'abroad', 'flight', 'fotos', 'washing_machine'];
    checkboxes.forEach(id => {
      if (formData[id] !== undefined) {
        const element = document.getElementById(id);
        if (element) {
          element.checked = formData[id];
        }
      }
    });
  }

  restoreCheckboxStates(checkedItems) {
    if (!checkedItems || !Array.isArray(checkedItems)) return;

    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkedItems.forEach((isChecked, index) => {
      if (checkboxes[index]) {
        checkboxes[index].checked = isChecked;
      }
    });

    // Update the progress after all checkboxes are set
    this.uiManager.updatePackedCount();
  }

  waitForDOMReady() {
    return new Promise(resolve => {
      // Use double requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }

  generateList() {
    const formData = this.getFormData();
    this.currentItems = generatePackingList(formData, this.customItemsManager);
    this.uiManager.displayPackingList(this.currentItems, () => {
      this.uiManager.updatePackedCount();
      this.save();
    });
    this.uiManager.updatePackedCount();
  }

  save() {
    const formData = this.getFormData();
    const checkedItems = Array.from(
      document.querySelectorAll('.checkbox-container input[type="checkbox"]')
    ).map(cb => cb.checked);

    const state = {
      formData,
      items: this.currentItems,
      checkedItems
    };

    debouncedSaveState(state);
  }

  setupEventListeners() {
    // Save state on form input changes
    const formInputs = [
      'nights', 'weather', 'accommodation', 'beach', 'sauna',
      'hiking', 'climbing', 'abroad', 'flight', 'fotos', 'washing_machine'
    ];

    formInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => this.save());
      }
    });

    // Generate button
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.generateList();
        this.save();
      });
    }
  }
}
