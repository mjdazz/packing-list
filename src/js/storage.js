// Storage management with validation
const SCHEMA_VERSION = 1;

export function loadSavedState() {
  try {
    const savedData = localStorage.getItem('packingListState');
    if (!savedData) return null;

    const state = JSON.parse(savedData);

    // Validate schema version
    if (state.version !== SCHEMA_VERSION) {
      console.warn('Schema version mismatch, clearing state');
      localStorage.removeItem('packingListState');
      return null;
    }

    // Validate structure
    if (!validateStateSchema(state)) {
      throw new Error('Invalid state schema');
    }

    return state;
  } catch (e) {
    console.error('Error loading state:', e);
    localStorage.removeItem('packingListState');
    return null;
  }
}

function validateStateSchema(state) {
  return (
    state &&
    typeof state === 'object' &&
    state.version === SCHEMA_VERSION &&
    typeof state.formData === 'object' &&
    Array.isArray(state.items) &&
    Array.isArray(state.checkedItems)
  );
}

export function saveState(state) {
  try {
    const stateToSave = {
      ...state,
      version: SCHEMA_VERSION,
      timestamp: Date.now()
    };
    localStorage.setItem('packingListState', JSON.stringify(stateToSave));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
      // Could show user notification
    }
    throw e;
  }
}

// Debounce function to limit save frequency
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create debounced save function
export const debouncedSaveState = debounce(saveState, 1000);
