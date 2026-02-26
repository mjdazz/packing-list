// UI rendering and DOM manipulation
import { translations } from './i18n.js';
import { categoryTranslations } from './packingList.js';

export class UIManager {
  constructor() {
    this.elements = {};
    this.cacheElements();
  }

  cacheElements() {
    this.elements = {
      generateBtn: document.getElementById('generateBtn'),
      packingList: document.getElementById('packingList'),
      packedCount: document.getElementById('packedCount'),
      totalCount: document.getElementById('totalCount'),
      progressBar: document.getElementById('progressBar'),
      progressFill: document.getElementById('progressFill'),
      packingStatusAnnouncement: document.getElementById('packingStatusAnnouncement')
    };
  }

  displayPackingList(items, onCheckboxChange) {
    // Clear the current packing list
    this.elements.packingList.innerHTML = '';

    // Get current language
    const lang = document.documentElement.lang || 'en';
    const translationsData = document.documentElement.getAttribute('data-translations') ?
      JSON.parse(document.documentElement.getAttribute('data-translations')) :
      { en: {}, de: {} };

    // Group items by category
    const categories = {};
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    // Create a section for each category
    Object.entries(categories).forEach(([category, categoryItems]) => {
      const categorySection = document.createElement('div');
      categorySection.className = 'mb-6';

      const categoryTitle = document.createElement('h3');
      categoryTitle.className = 'text-lg font-semibold text-gray-800 mb-3 border-b pb-1';

      // Use translated category name
      const translationKey = categoryTranslations[category] || category;
      const translatedCategory = translationsData[lang]?.[translationKey] ||
        (category.charAt(0).toUpperCase() + category.slice(1));

      categoryTitle.textContent = translatedCategory;
      categorySection.appendChild(categoryTitle);

      // Create progress bar container
      const progressContainer = document.createElement('div');
      progressContainer.className = 'mb-4';

      // Create progress text (counter)
      const progressText = document.createElement('div');
      progressText.className = 'flex justify-between items-center mb-1';

      const progressCount = document.createElement('span');
      progressCount.className = 'text-xs text-gray-500';
      progressCount.textContent = '0/0';

      progressText.appendChild(progressCount);

      // Create progress bar
      const progressBar = document.createElement('div');
      progressBar.className = 'w-full bg-gray-200 rounded-full h-1.5';
      progressBar.innerHTML = `
        <div class="bg-indigo-600 h-1.5 rounded-full category-progress" style="width: 0%" data-category="${category}"></div>
      `;

      // Append elements to container
      progressContainer.appendChild(progressText);
      progressContainer.appendChild(progressBar);

      // Add to category section
      categorySection.appendChild(progressContainer);

      const itemsList = document.createElement('div');
      itemsList.className = 'space-y-2';

      categoryItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        itemDiv.dataset.category = category;

        const label = document.createElement('label');
        label.className = 'checkbox-container flex items-center space-x-3 cursor-pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'sr-only';
        checkbox.setAttribute('aria-label', `Pack ${item.name}`);
        checkbox.addEventListener('change', onCheckboxChange);

        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark w-5 h-5 border border-gray-300 rounded-md bg-white flex-shrink-0';

        const itemText = document.createElement('span');
        itemText.className = 'text-gray-700';
        itemText.textContent = `${item.name}${item.quantity > 1 ? ` (${item.quantity})` : ''}`;

        label.appendChild(checkbox);
        label.appendChild(checkmark);
        label.appendChild(itemText);

        itemDiv.appendChild(label);
        itemsList.appendChild(itemDiv);
      });

      categorySection.appendChild(itemsList);
      this.elements.packingList.appendChild(categorySection);
    });

    // Show progress bar
    this.elements.progressBar.classList.remove('hidden');
  }

  updatePackedCount() {
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const total = checkboxes.length;

    this.elements.packedCount.textContent = checkedCount;
    this.elements.totalCount.textContent = total;

    // Update progress bar
    const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.progressFill.setAttribute('role', 'progressbar');
    this.elements.progressFill.setAttribute('aria-valuenow', progress);
    this.elements.progressFill.setAttribute('aria-valuemin', '0');
    this.elements.progressFill.setAttribute('aria-valuemax', '100');
    this.elements.progressFill.setAttribute('aria-label', `Packing progress: ${progress}%`);

    // Update screen reader announcement
    if (this.elements.packingStatusAnnouncement) {
      this.elements.packingStatusAnnouncement.textContent = `${checkedCount} of ${total} items packed`;
    }

    // Update category progress
    const categoryItems = {};
    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach((checkbox) => {
      const category = checkbox.closest('[data-category]')?.dataset.category || 'uncategorized';
      if (!categoryItems[category]) {
        categoryItems[category] = { total: 0, checked: 0 };
      }
      categoryItems[category].total++;
      if (checkbox.checked) {
        categoryItems[category].checked++;
      }
    });

    // Update each category's progress
    Object.entries(categoryItems).forEach(([category, { total, checked }]) => {
      const progress = Math.round((checked / total) * 100);
      const progressElement = document.querySelector(`.category-progress[data-category="${category}"]`);

      if (progressElement) {
        progressElement.style.width = `${progress}%`;

        // Update category count
        const progressContainer = progressElement.closest('.mb-4');
        if (progressContainer) {
          const countElement = progressContainer.querySelector('.text-xs');
          if (countElement) {
            countElement.textContent = `${checked}/${total}`;
          }
        }

        // Update progress bar color based on completion
        if (progress === 100) {
          progressElement.classList.remove('bg-indigo-600');
          progressElement.classList.add('bg-green-500');
        } else {
          progressElement.classList.remove('bg-green-500');
          progressElement.classList.add('bg-indigo-600');
        }
      }
    });
  }
}
