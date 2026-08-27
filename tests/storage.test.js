import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadSavedState, saveState, debounce } from '../src/js/storage.js'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadSavedState', () => {
    it('returns null when no data is stored', () => {
      expect(loadSavedState()).toBeNull()
    })

    it('returns valid state', () => {
      const state = {
        version: 1,
        formData: { nights: 3 },
        items: [],
        checkedItems: []
      }
      localStorage.setItem('packingListState', JSON.stringify(state))
      expect(loadSavedState()).toEqual(state)
    })

    it('returns null and clears storage on schema version mismatch', () => {
      const state = {
        version: 999,
        formData: {},
        items: [],
        checkedItems: []
      }
      localStorage.setItem('packingListState', JSON.stringify(state))
      expect(loadSavedState()).toBeNull()
      expect(localStorage.getItem('packingListState')).toBeNull()
    })

    it('returns null and clears storage on corrupted JSON', () => {
      localStorage.setItem('packingListState', '{not valid json')
      expect(loadSavedState()).toBeNull()
      expect(localStorage.getItem('packingListState')).toBeNull()
    })

    it('returns null when structure is invalid', () => {
      const state = { version: 1, formData: 'not an object' }
      localStorage.setItem('packingListState', JSON.stringify(state))
      expect(loadSavedState()).toBeNull()
    })

    it('clears storage when structure is invalid', () => {
      const state = { version: 1, formData: 'not an object' }
      localStorage.setItem('packingListState', JSON.stringify(state))
      loadSavedState()
      expect(localStorage.getItem('packingListState')).toBeNull()
    })

    it('rejects state missing items array', () => {
      const state = { version: 1, formData: {}, checkedItems: [] }
      localStorage.setItem('packingListState', JSON.stringify(state))
      expect(loadSavedState()).toBeNull()
    })

    it('rejects state missing checkedItems array', () => {
      const state = { version: 1, formData: {}, items: [] }
      localStorage.setItem('packingListState', JSON.stringify(state))
      expect(loadSavedState()).toBeNull()
    })
  })

  describe('saveState', () => {
    it('saves state with version and timestamp', () => {
      const state = { formData: { nights: 5 }, items: [], checkedItems: [] }
      saveState(state)
      const saved = JSON.parse(localStorage.getItem('packingListState'))
      expect(saved.version).toBe(1)
      expect(saved.timestamp).toBeDefined()
      expect(saved.formData.nights).toBe(5)
    })

    it('does not mutate the original state object', () => {
      const state = { formData: {}, items: [], checkedItems: [] }
      saveState(state)
      expect(state.version).toBeUndefined()
      expect(state.timestamp).toBeUndefined()
    })

    it('re-throws QuotaExceededError', () => {
      const original = Storage.prototype.setItem
      Storage.prototype.setItem = () => {
        const error = new DOMException('quota exceeded', 'QuotaExceededError')
        throw error
      }

      const state = { formData: {}, items: [], checkedItems: [] }
      expect(() => saveState(state)).toThrow()

      Storage.prototype.setItem = original
    })

    it('roundtrips: saveState then loadSavedState returns equivalent data', () => {
      const state = {
        formData: { nights: 7, weather: 'cold' },
        items: [{ name: 'test', quantity: 1 }],
        checkedItems: [true, false, true]
      }
      saveState(state)
      const loaded = loadSavedState()
      expect(loaded.formData).toEqual(state.formData)
      expect(loaded.items).toEqual(state.items)
      expect(loaded.checkedItems).toEqual(state.checkedItems)
      expect(loaded.version).toBe(1)
      expect(loaded.timestamp).toBeGreaterThan(0)
    })
  })

  describe('debounce', () => {
    it('delays function execution', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledOnce()

      vi.useRealTimers()
    })

    it('resets timer on subsequent calls', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      vi.advanceTimersByTime(50)
      debounced()
      vi.advanceTimersByTime(50)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledOnce()

      vi.useRealTimers()
    })

    it('passes arguments to the debounced function', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced('a', 'b')
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledWith('a', 'b')

      vi.useRealTimers()
    })
  })
})
