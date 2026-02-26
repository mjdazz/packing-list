// Packing list generation logic
import { translations } from './i18n.js';

export function generatePackingList(formData, customItemsManager = null) {
  console.log('Generating packing list with:', formData);

  const {
    nights,
    weather,
    beach,
    sauna,
    hiking,
    climbing,
    abroad,
    flight,
    fotos,
    accommodation,
    washing_machine
  } = formData;

  let items = [];

  // Helper function to add item with duplicate check and translation
  function addItem(itemKey, quantity, category) {
    // Get current language
    const lang = document.documentElement.lang || 'en';

    // Get translated item name
    let translatedName = translations[lang]?.[itemKey] || itemKey;

    // Handle pluralization for quantities > 1
    if (quantity > 1) {
      // Check if there's a plural form available
      const pluralKey = itemKey.endsWith('y') ?
        itemKey.slice(0, -1) + 'ies' :
        itemKey + 's';

      if (translations[lang]?.[pluralKey]) {
        translatedName = translations[lang][pluralKey];
      } else if (translations[lang]?.[itemKey + 's']) {
        translatedName = translations[lang][itemKey + 's'];
      }
    }

    // Check if item already exists (case-insensitive)
    const existingItem = items.find(item =>
      item.name.toLowerCase() === translatedName.toLowerCase()
    );

    if (!existingItem) {
      items.push({
        name: translatedName,
        originalKey: itemKey,
        quantity,
        category
      });
    }
  }

  // Clothing basics - adjust quantities based on washing machine availability
  if (washing_machine) {
    const shirtsQty = Math.min(7, Math.ceil(nights));
    const underpantsQty = Math.min(7, Math.ceil(nights));
    const socksQty = Math.min(7, Math.ceil(nights));
    addItem('shirt', shirtsQty, 'clothing');
    addItem('detergent', 1, 'clothing');
    addItem('underpant', underpantsQty, 'clothing');
    addItem('sockPair', socksQty, 'clothing');
  } else {
    addItem('shirt', nights, 'clothing');
    addItem('underpant', nights, 'clothing');
    addItem('sockPair', nights, 'clothing');
  }

  if (weather === 'warm') {
    addItem('sunscreen', 1, 'personal');
    addItem('sunglasses', 1, 'personal');
    if (washing_machine) {
      const vestsQty = Math.min(2, Math.ceil(nights / 10));
      const shortsQty = Math.min(2, Math.ceil(nights / 5));
      addItem('vest', vestsQty, 'clothing');
      addItem('pairOfShorts', shortsQty, 'clothing');
    } else {
      const vestsQty = Math.ceil(nights / 10);
      const shortsQty = Math.ceil(nights / 5);
      addItem('vest', vestsQty, 'clothing');
      addItem('pairOfShorts', shortsQty, 'clothing');
    }
  } else if (weather === 'medium') {
    addItem('jacket', 1, 'clothing');
    if (washing_machine) {
      const vestsQty = Math.min(2, Math.ceil(nights / 5));
      const shortsQty = Math.min(2, Math.ceil(nights / 5));
      const pantsQty = Math.min(2, Math.ceil(nights / 5));
      addItem('vest', vestsQty, 'clothing');
      addItem('pairOfShorts', shortsQty, 'clothing');
      addItem('pairOfPants', pantsQty, 'clothing');
    } else {
      const qty = Math.ceil(nights / 5);
      addItem('vest', qty, 'clothing');
      addItem('pairOfShorts', qty, 'clothing');
      addItem('pairOfPants', qty, 'clothing');
    }
  } else if (weather === 'cold') {
    addItem('jacket', 1, 'clothing');
    addItem('pairOfGloves', 1, 'clothing');
    addItem('hat', 1, 'clothing');
    if (washing_machine) {
      const vestsQty = Math.min(2, Math.ceil(nights / 5));
      const pantsQty = Math.min(2, Math.ceil(nights / 5));
      addItem('vest', vestsQty, 'clothing');
      addItem('pairOfPants', pantsQty, 'clothing');
    } else {
      const qty = Math.ceil(nights / 5);
      addItem('vest', qty, 'clothing');
      addItem('pairOfPants', qty, 'clothing');
    }
  }

  if (nights > 5) {
    addItem('additionalShoes', 1, 'clothing');
  }

  // Beach items
  if (beach) {
    addItem('swimsuit', 1, 'beach');
    addItem('flipFlops', 1, 'beach');
    addItem('beachTowel', 1, 'beach');
    addItem('sunHat', 1, 'beach');
  }

  // Sauna items
  if (sauna) {
    addItem('swimsuit', 1, 'beach');
    addItem('saunaTowel', 1, 'sauna');
    addItem('bathrobe', 1, 'sauna');
    addItem('slippers', 1, 'sauna');
    addItem('saunaHat', 1, 'sauna');
  }

  // Hiking items
  if (hiking) {
    addItem('hikingBoots', 1, 'hiking');
    addItem('hikingPants', 1, 'hiking');
    addItem('hikingSocks', 2, 'hiking');
    addItem('hikingStick', 2, 'hiking');
    addItem('backpack', 1, 'hiking');
    addItem('waterBag', 1, 'hiking');
    addItem('hat', 1, 'clothing');
    addItem('headlamp', 1, 'clothing');
    if (weather === 'medium') {
      addItem('sunscreen', 1, 'personal');
      addItem('sunglasses', 1, 'personal');
    }
  }

  // Climbing items
  if (climbing) {
    addItem('climbingShoes', 1, 'climbing');
    addItem('viaFerrata', 1, 'climbing');
    addItem('carabiner', 1, 'climbing');
    addItem('climbingHarness', 1, 'climbing');
    addItem('helmet', 1, 'climbing');
  }

  // Electronics
  addItem('phone', 1, 'electronics');
  addItem('phoneCharger', 1, 'electronics');
  addItem('notebook', 1, 'electronics');
  addItem('notebookCharger', 1, 'electronics');
  addItem('headphones', 1, 'electronics');
  addItem('powerBank', 1, 'electronics');
  addItem('steamDeck', 1, 'electronics');
  addItem('usbAdapter', 1, 'electronics');
  addItem('hdmiCable', 1, 'electronics');

  if (fotos) {
    addItem('camera', 1, 'electronics');
    addItem('cameraCharger', 1, 'electronics');
  }

  // Travel essentials
  if (abroad) {
    addItem('passport', 1, 'travel');
    addItem('travelAdapter', 1, 'travel');
  }

  if (flight) {
    addItem('neckPillow', 1, 'travel');
    addItem('earplugs', 1, 'accommodation');
  }

  // Accommodation items
  if (accommodation === 'hostel') {
    addItem('padlock', 1, 'accommodation');
    addItem('earplugs', 1, 'accommodation');
    addItem('slippers', 1, 'personal');
    addItem('towels', 1, 'accommodation');
  } else if (accommodation === 'mountain_cabin') {
    addItem('sleepingBag', 1, 'accommodation');
    addItem('towel', 1, 'accommodation');
  } else if (accommodation === 'holiday_home') {
    addItem('aeropress', 1, 'accommodation');
    addItem('knife', 1, 'accommodation');
    addItem('spicery', 1, 'accommodation');
  }

  // Personal care
  addItem('toothbrush', 1, 'personal');
  addItem('toothpaste', 1, 'personal');
  addItem('showerGel', 1, 'personal');
  addItem('deodorant', 1, 'personal');
  addItem('combBrush', 1, 'personal');
  addItem('nightGuard', 1, 'personal');
  if (nights > 3) {
    addItem('shaver', 1, 'personal');
  }
  if (nights > 7) {
    addItem('nailClipper', 1, 'personal');
  }

  // Miscellaneous
  addItem('cash', 1, 'misc');
  addItem('waterBottle', 1, 'misc');
  addItem('driversLicense', 1, 'misc');
  addItem('painkillers', 1, 'misc');
  addItem('bandAid', 1, 'misc');
  addItem('disinfectant', 1, 'misc');
  addItem('chewingGum', 1, 'misc');
  addItem('books', 1, 'misc');
  addItem('washingBag', 1, 'clothing');
  addItem('condoms', 1, 'misc');

  // Add custom items if available
  if (customItemsManager) {
    const customItems = customItemsManager.getAll();
    customItems.forEach(customItem => {
      items.push({
        name: customItem.name,
        quantity: customItem.quantity,
        category: customItem.category,
        originalKey: `custom_${customItem.id}`,
        isCustom: true
      });
    });
  }

  console.log('Generated items:', items);
  return items;
}

export const categoryTranslations = {
  'clothing': 'categoryClothing',
  'personal': 'categoryPersonal',
  'beach': 'categoryBeach',
  'sauna': 'categorySauna',
  'hiking': 'categoryHiking',
  'climbing': 'categoryClimbing',
  'electronics': 'categoryElectronics',
  'travel': 'categoryTravel',
  'accommodation': 'categoryAccommodation',
  'misc': 'categoryMisc'
};
