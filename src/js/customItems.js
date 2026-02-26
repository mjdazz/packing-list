// Custom items management
export class CustomItemsManager {
  constructor() {
    this.customItems = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const items = localStorage.getItem('customPackingItems');
      return items ? JSON.parse(items) : [];
    } catch (e) {
      console.error('Error loading custom items:', e);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem('customPackingItems', JSON.stringify(this.customItems));
    } catch (e) {
      console.error('Error saving custom items:', e);
    }
  }

  addItem(name, quantity, category) {
    const item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity: parseInt(quantity) || 1,
      category: category || 'misc',
      isCustom: true,
      createdAt: Date.now()
    };

    this.customItems.push(item);
    this.save();
    this.render();
    return item;
  }

  editItem(id, updates) {
    const item = this.customItems.find(i => i.id === id);
    if (!item) return false;

    Object.assign(item, updates, { updatedAt: Date.now() });
    this.save();
    this.render();
    return true;
  }

  deleteItem(id) {
    this.customItems = this.customItems.filter(i => i.id !== id);
    this.save();
    this.render();
  }

  getAll() {
    return this.customItems;
  }

  render() {
    const container = document.getElementById('customItemsList');
    if (!container) return;

    if (!this.customItems.length) {
      container.innerHTML = '<p class="text-sm text-gray-500 italic">No custom items yet</p>';
      return;
    }

    container.innerHTML = this.customItems.map(item => `
      <div class="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
        <span class="text-sm text-gray-700">
          ${this.escapeHtml(item.name)}
          ${item.quantity > 1 ? `<span class="text-gray-500">(${item.quantity})</span>` : ''}
          <span class="text-xs text-gray-400 ml-2">${item.category}</span>
        </span>
        <div class="flex gap-2">
          <button
            class="edit-custom-item text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            data-id="${item.id}"
            aria-label="Edit ${this.escapeHtml(item.name)}"
          >
            Edit
          </button>
          <button
            class="delete-custom-item text-sm text-red-600 hover:text-red-800 focus:outline-none focus:underline"
            data-id="${item.id}"
            aria-label="Delete ${this.escapeHtml(item.name)}"
          >
            Delete
          </button>
        </div>
      </div>
    `).join('');

    this.attachItemEventListeners();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  init() {
    const form = document.getElementById('customItemForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('customItemName').value;
      const qty = document.getElementById('customItemQty').value;
      const category = document.getElementById('customItemCategory').value;

      if (name.trim()) {
        this.addItem(name, qty, category);
        form.reset();
        document.getElementById('customItemQty').value = '1';

        // Regenerate packing list to include new item
        if (window.generatePackingList) {
          window.generatePackingList();
        }
      }
    });

    // Initial render
    this.render();
  }

  attachItemEventListeners() {
    document.querySelectorAll('.delete-custom-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (confirm('Delete this custom item?')) {
          this.deleteItem(id);

          // Regenerate list
          if (window.generatePackingList) {
            window.generatePackingList();
          }
        }
      });
    });

    document.querySelectorAll('.edit-custom-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const item = this.customItems.find(i => i.id === id);
        if (item) {
          // Simple inline edit - could be enhanced with modal
          const newName = prompt('Edit item name:', item.name);
          if (newName && newName.trim()) {
            this.editItem(id, { name: newName.trim() });

            // Regenerate list
            if (window.generatePackingList) {
              window.generatePackingList();
            }
          }
        }
      });
    });
  }
}
