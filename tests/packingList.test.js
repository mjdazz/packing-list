import { describe, it, expect, beforeEach } from 'vitest'
import { generatePackingList, categoryTranslations } from '../src/js/packingList.js'

function baseFormData(overrides = {}) {
  return {
    nights: 3,
    weather: 'medium',
    beach: false,
    sauna: false,
    hiking: false,
    climbing: false,
    abroad: false,
    flight: false,
    fotos: false,
    accommodation: 'hotel',
    washing_machine: false,
    ...overrides
  }
}

function findItem(items, key) {
  return items.find(i => i.originalKey === key)
}

function itemKeys(items) {
  return items.map(i => i.originalKey)
}

describe('generatePackingList', () => {
  beforeEach(() => {
    document.documentElement.lang = 'en'
  })

  describe('clothing basics', () => {
    it('scales shirts, underpants, socks to number of nights', () => {
      const items = generatePackingList(baseFormData({ nights: 5 }))
      expect(findItem(items, 'shirt').quantity).toBe(5)
      expect(findItem(items, 'underpant').quantity).toBe(5)
      expect(findItem(items, 'sockPair').quantity).toBe(5)
    })

    it('adds additional shoes for trips longer than 5 nights', () => {
      const short = generatePackingList(baseFormData({ nights: 5 }))
      const long = generatePackingList(baseFormData({ nights: 6 }))
      expect(findItem(short, 'additionalShoes')).toBeUndefined()
      expect(findItem(long, 'additionalShoes')).toBeDefined()
    })

    it('adds shaver for trips longer than 3 nights', () => {
      const short = generatePackingList(baseFormData({ nights: 3 }))
      const long = generatePackingList(baseFormData({ nights: 4 }))
      expect(findItem(short, 'shaver')).toBeUndefined()
      expect(findItem(long, 'shaver')).toBeDefined()
    })

    it('adds nail clipper for trips longer than 7 nights', () => {
      const short = generatePackingList(baseFormData({ nights: 7 }))
      const long = generatePackingList(baseFormData({ nights: 8 }))
      expect(findItem(short, 'nailClipper')).toBeUndefined()
      expect(findItem(long, 'nailClipper')).toBeDefined()
    })
  })

  describe('washing machine', () => {
    it('caps clothing quantities at 7', () => {
      const items = generatePackingList(baseFormData({ nights: 14, washing_machine: true }))
      expect(findItem(items, 'shirt').quantity).toBe(7)
      expect(findItem(items, 'underpant').quantity).toBe(7)
      expect(findItem(items, 'sockPair').quantity).toBe(7)
    })

    it('adds detergent when washing machine is available', () => {
      const without = generatePackingList(baseFormData({ washing_machine: false }))
      const withWm = generatePackingList(baseFormData({ washing_machine: true }))
      expect(findItem(without, 'detergent')).toBeUndefined()
      expect(findItem(withWm, 'detergent')).toBeDefined()
    })

    it('caps vests and shorts at 2 in warm weather', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'warm', washing_machine: true
      }))
      expect(findItem(items, 'vest').quantity).toBe(2)
      expect(findItem(items, 'pairOfShorts').quantity).toBe(2)
    })

    it('caps vests, shorts and pants at 2 in medium weather', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'medium', washing_machine: true
      }))
      expect(findItem(items, 'vest').quantity).toBe(2)
      expect(findItem(items, 'pairOfShorts').quantity).toBe(2)
      expect(findItem(items, 'pairOfPants').quantity).toBe(2)
    })

    it('caps vests and pants at 2 in cold weather', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'cold', washing_machine: true
      }))
      expect(findItem(items, 'vest').quantity).toBe(2)
      expect(findItem(items, 'pairOfPants').quantity).toBe(2)
    })

    it('does not cap quantities in warm weather without washing machine', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'warm', washing_machine: false
      }))
      expect(findItem(items, 'vest').quantity).toBe(Math.ceil(30 / 10))
      expect(findItem(items, 'pairOfShorts').quantity).toBe(Math.ceil(30 / 5))
      expect(findItem(items, 'shirt').quantity).toBe(30)
    })

    it('does not cap quantities in medium weather without washing machine', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'medium', washing_machine: false
      }))
      const qty = Math.ceil(30 / 5)
      expect(findItem(items, 'vest').quantity).toBe(qty)
      expect(findItem(items, 'pairOfShorts').quantity).toBe(qty)
      expect(findItem(items, 'pairOfPants').quantity).toBe(qty)
    })

    it('does not cap quantities in cold weather without washing machine', () => {
      const items = generatePackingList(baseFormData({
        nights: 30, weather: 'cold', washing_machine: false
      }))
      const qty = Math.ceil(30 / 5)
      expect(findItem(items, 'vest').quantity).toBe(qty)
      expect(findItem(items, 'pairOfPants').quantity).toBe(qty)
    })
  })

  describe('weather', () => {
    it('adds sunscreen and sunglasses for warm weather', () => {
      const items = generatePackingList(baseFormData({ weather: 'warm' }))
      expect(findItem(items, 'sunscreen')).toBeDefined()
      expect(findItem(items, 'sunglasses')).toBeDefined()
    })

    it('does not add sunscreen for cold weather without hiking', () => {
      const items = generatePackingList(baseFormData({ weather: 'cold' }))
      expect(findItem(items, 'sunscreen')).toBeUndefined()
    })

    it('adds jacket for medium weather', () => {
      const items = generatePackingList(baseFormData({ weather: 'medium' }))
      expect(findItem(items, 'jacket')).toBeDefined()
    })

    it('adds jacket, gloves and hat for cold weather', () => {
      const items = generatePackingList(baseFormData({ weather: 'cold' }))
      expect(findItem(items, 'jacket')).toBeDefined()
      expect(findItem(items, 'pairOfGloves')).toBeDefined()
      expect(findItem(items, 'hat')).toBeDefined()
    })

    it('does not add shorts for cold weather', () => {
      const items = generatePackingList(baseFormData({ weather: 'cold' }))
      expect(findItem(items, 'pairOfShorts')).toBeUndefined()
    })
  })

  describe('activities', () => {
    it('adds beach items when beach is selected', () => {
      const items = generatePackingList(baseFormData({ beach: true }))
      const keys = itemKeys(items)
      expect(keys).toContain('swimsuit')
      expect(keys).toContain('flipFlops')
      expect(keys).toContain('beachTowel')
      expect(keys).toContain('sunHat')
    })

    it('adds sauna items when sauna is selected', () => {
      const items = generatePackingList(baseFormData({ sauna: true }))
      const keys = itemKeys(items)
      expect(keys).toContain('swimsuit')
      expect(keys).toContain('saunaTowel')
      expect(keys).toContain('bathrobe')
      expect(keys).toContain('slippers')
      expect(keys).toContain('saunaHat')
    })

    it('adds hiking items when hiking is selected', () => {
      const items = generatePackingList(baseFormData({ hiking: true }))
      const keys = itemKeys(items)
      expect(keys).toContain('hikingBoots')
      expect(keys).toContain('hikingPants')
      expect(keys).toContain('hikingSocks')
      expect(keys).toContain('backpack')
      expect(keys).toContain('waterBag')
      expect(keys).toContain('headlamp')
    })

    it('adds sunscreen for hiking in medium weather', () => {
      const items = generatePackingList(baseFormData({ hiking: true, weather: 'medium' }))
      expect(findItem(items, 'sunscreen')).toBeDefined()
      expect(findItem(items, 'sunglasses')).toBeDefined()
    })

    it('does not add sunscreen from hiking block in warm weather', () => {
      // sunscreen is added by warm weather block, not hiking — verify no duplicate
      const items = generatePackingList(baseFormData({ hiking: true, weather: 'warm' }))
      const sunscreens = items.filter(i => i.originalKey === 'sunscreen')
      expect(sunscreens).toHaveLength(1)
    })

    it('does not add sunscreen for hiking in cold weather', () => {
      const items = generatePackingList(baseFormData({ hiking: true, weather: 'cold' }))
      expect(findItem(items, 'sunscreen')).toBeUndefined()
    })

    it('adds hiking sticks with quantity 2', () => {
      const items = generatePackingList(baseFormData({ hiking: true }))
      expect(findItem(items, 'hikingStick').quantity).toBe(2)
      expect(findItem(items, 'hikingSocks').quantity).toBe(2)
    })

    it('adds climbing items when climbing is selected', () => {
      const items = generatePackingList(baseFormData({ climbing: true }))
      const keys = itemKeys(items)
      expect(keys).toContain('climbingShoes')
      expect(keys).toContain('viaFerrata')
      expect(keys).toContain('carabiner')
      expect(keys).toContain('climbingHarness')
      expect(keys).toContain('helmet')
    })

    it('adds camera items when photos is selected', () => {
      const items = generatePackingList(baseFormData({ fotos: true }))
      const keys = itemKeys(items)
      expect(keys).toContain('camera')
      expect(keys).toContain('cameraCharger')
    })

    it('does not add camera when photos is not selected', () => {
      const items = generatePackingList(baseFormData({ fotos: false }))
      expect(findItem(items, 'camera')).toBeUndefined()
    })
  })

  describe('travel', () => {
    it('adds passport and travel adapter when abroad', () => {
      const items = generatePackingList(baseFormData({ abroad: true }))
      expect(findItem(items, 'passport')).toBeDefined()
      expect(findItem(items, 'travelAdapter')).toBeDefined()
    })

    it('does not add passport when not abroad', () => {
      const items = generatePackingList(baseFormData({ abroad: false }))
      expect(findItem(items, 'passport')).toBeUndefined()
    })

    it('adds neck pillow and earplugs for flights', () => {
      const items = generatePackingList(baseFormData({ flight: true }))
      expect(findItem(items, 'neckPillow')).toBeDefined()
      expect(findItem(items, 'earplugs')).toBeDefined()
    })
  })

  describe('accommodation', () => {
    it('adds padlock, earplugs, slippers and towels for hostels', () => {
      const items = generatePackingList(baseFormData({ accommodation: 'hostel' }))
      const keys = itemKeys(items)
      expect(keys).toContain('padlock')
      expect(keys).toContain('earplugs')
      expect(keys).toContain('slippers')
      expect(keys).toContain('towels')
    })

    it('adds sleeping bag and towel for mountain cabin', () => {
      const items = generatePackingList(baseFormData({ accommodation: 'mountain_cabin' }))
      const keys = itemKeys(items)
      expect(keys).toContain('sleepingBag')
      expect(keys).toContain('towel')
    })

    it('adds aeropress, knife and spicery for holiday home', () => {
      const items = generatePackingList(baseFormData({ accommodation: 'holiday_home' }))
      const keys = itemKeys(items)
      expect(keys).toContain('aeropress')
      expect(keys).toContain('knife')
      expect(keys).toContain('spicery')
    })

    it('does not add hostel items for hotel', () => {
      const items = generatePackingList(baseFormData({ accommodation: 'hotel' }))
      expect(findItem(items, 'padlock')).toBeUndefined()
      expect(findItem(items, 'sleepingBag')).toBeUndefined()
      expect(findItem(items, 'aeropress')).toBeUndefined()
    })
  })

  describe('duplicates', () => {
    it('does not duplicate swimsuit when both beach and sauna are selected', () => {
      const items = generatePackingList(baseFormData({ beach: true, sauna: true }))
      const swimsuits = items.filter(i => i.originalKey === 'swimsuit')
      expect(swimsuits).toHaveLength(1)
    })

    it('does not duplicate earplugs when flight + hostel', () => {
      const items = generatePackingList(baseFormData({ flight: true, accommodation: 'hostel' }))
      const earplugs = items.filter(i => i.originalKey === 'earplugs')
      expect(earplugs).toHaveLength(1)
    })

    it('does not duplicate hat when cold weather + hiking', () => {
      const items = generatePackingList(baseFormData({ weather: 'cold', hiking: true }))
      const hats = items.filter(i => i.originalKey === 'hat')
      expect(hats).toHaveLength(1)
    })

    it('does not duplicate slippers when sauna + hostel', () => {
      const items = generatePackingList(baseFormData({ sauna: true, accommodation: 'hostel' }))
      const slippers = items.filter(i => i.originalKey === 'slippers')
      expect(slippers).toHaveLength(1)
    })

    it('does not duplicate sunscreen when warm weather + hiking in medium', () => {
      // warm weather already adds sunscreen, hiking only adds it for medium
      // this tests warm+hiking (hiking block skips sunscreen for warm)
      const items = generatePackingList(baseFormData({ weather: 'warm', hiking: true }))
      const sunscreens = items.filter(i => i.originalKey === 'sunscreen')
      expect(sunscreens).toHaveLength(1)
    })
  })

  describe('always included items', () => {
    it('always includes all electronics essentials', () => {
      const items = generatePackingList(baseFormData())
      const keys = itemKeys(items)
      expect(keys).toContain('phone')
      expect(keys).toContain('phoneCharger')
      expect(keys).toContain('notebook')
      expect(keys).toContain('notebookCharger')
      expect(keys).toContain('headphones')
      expect(keys).toContain('powerBank')
      expect(keys).toContain('steamDeck')
      expect(keys).toContain('usbAdapter')
      expect(keys).toContain('hdmiCable')
    })

    it('always includes all personal care essentials', () => {
      const items = generatePackingList(baseFormData())
      const keys = itemKeys(items)
      expect(keys).toContain('toothbrush')
      expect(keys).toContain('toothpaste')
      expect(keys).toContain('showerGel')
      expect(keys).toContain('deodorant')
      expect(keys).toContain('combBrush')
      expect(keys).toContain('nightGuard')
    })

    it('always includes all miscellaneous essentials', () => {
      const items = generatePackingList(baseFormData())
      const keys = itemKeys(items)
      expect(keys).toContain('cash')
      expect(keys).toContain('waterBottle')
      expect(keys).toContain('driversLicense')
      expect(keys).toContain('painkillers')
      expect(keys).toContain('bandAid')
      expect(keys).toContain('disinfectant')
      expect(keys).toContain('chewingGum')
      expect(keys).toContain('books')
      expect(keys).toContain('condoms')
    })

    it('always includes washing bag in clothing', () => {
      const items = generatePackingList(baseFormData())
      const washingBag = findItem(items, 'washingBag')
      expect(washingBag).toBeDefined()
      expect(washingBag.category).toBe('clothing')
    })
  })

  describe('custom items', () => {
    it('appends custom items from manager', () => {
      const mockManager = {
        getAll: () => [
          { id: '1', name: 'Tripod', quantity: 1, category: 'electronics' },
          { id: '2', name: 'Snacks', quantity: 3, category: 'misc' }
        ]
      }
      const items = generatePackingList(baseFormData(), mockManager)
      const tripod = items.find(i => i.name === 'Tripod')
      const snacks = items.find(i => i.name === 'Snacks')
      expect(tripod).toBeDefined()
      expect(tripod.isCustom).toBe(true)
      expect(tripod.originalKey).toBe('custom_1')
      expect(snacks.quantity).toBe(3)
    })

    it('works without custom items manager', () => {
      const items = generatePackingList(baseFormData(), null)
      expect(items.length).toBeGreaterThan(0)
    })
  })

  describe('item structure', () => {
    it('returns items with correct shape', () => {
      const items = generatePackingList(baseFormData())
      items.forEach(item => {
        expect(item).toHaveProperty('name')
        expect(item).toHaveProperty('originalKey')
        expect(item).toHaveProperty('quantity')
        expect(item).toHaveProperty('category')
        expect(typeof item.name).toBe('string')
        expect(typeof item.quantity).toBe('number')
        expect(item.quantity).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('i18n', () => {
    it('uses German translations when lang is de', () => {
      document.documentElement.lang = 'de'
      const items = generatePackingList(baseFormData())
      const phone = findItem(items, 'phone')
      expect(phone.name).toBe('Handy')
    })

    it('uses English translations when lang is en', () => {
      document.documentElement.lang = 'en'
      const items = generatePackingList(baseFormData())
      const phone = findItem(items, 'phone')
      expect(phone.name).toBe('Phone')
    })

    it('falls back to item key for unknown language', () => {
      document.documentElement.lang = 'fr'
      const items = generatePackingList(baseFormData())
      const phone = findItem(items, 'phone')
      expect(phone.name).toBe('phone')
    })

    it('uses plural translation for quantities > 1', () => {
      document.documentElement.lang = 'en'
      const items = generatePackingList(baseFormData({ nights: 5 }))
      const shirts = findItem(items, 'shirt')
      expect(shirts.name).toBe('Shirts')
      expect(shirts.quantity).toBe(5)
    })

    it('uses singular translation for quantity of 1', () => {
      document.documentElement.lang = 'en'
      const items = generatePackingList(baseFormData())
      const phone = findItem(items, 'phone')
      expect(phone.name).toBe('Phone')
      expect(phone.quantity).toBe(1)
    })
  })

  describe('categoryTranslations', () => {
    it('maps all 10 categories', () => {
      const categories = ['clothing', 'personal', 'beach', 'sauna', 'hiking',
        'climbing', 'electronics', 'travel', 'accommodation', 'misc']
      categories.forEach(cat => {
        expect(categoryTranslations).toHaveProperty(cat)
        expect(typeof categoryTranslations[cat]).toBe('string')
      })
    })

    it('has exactly 10 entries', () => {
      expect(Object.keys(categoryTranslations)).toHaveLength(10)
    })
  })

  describe('custom items edge cases', () => {
    it('handles manager returning empty array', () => {
      const mockManager = { getAll: () => [] }
      const withManager = generatePackingList(baseFormData(), mockManager)
      const without = generatePackingList(baseFormData(), null)
      // Same items, no custom items appended
      expect(withManager.length).toBe(without.length)
      expect(withManager.every(i => !i.isCustom)).toBe(true)
    })
  })
})
