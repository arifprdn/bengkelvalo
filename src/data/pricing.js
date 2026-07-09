// ==========================================
// BengkelValo pricing data — single source of truth.
// Used by the client calculator AND the static (SEO) price tables.
// Immortal and Radiant use RR system instead of divisions:
//   Immortal: 0-100 RR (Immo 1), 100-199 RR (Immo 2), 200-299 RR (Immo 3)
//   Radiant: 300-1000 RR (Premium pricing)
// ==========================================

export const ranks = [
    { id: 1, name: 'Iron', image: '/assets/1 - IRON.webp', pricePerDivision: 10000 },
    { id: 2, name: 'Bronze', image: '/assets/2 - BRONZE.webp', pricePerDivision: 20000 },
    { id: 3, name: 'Silver', image: '/assets/3 - SILVER.webp', pricePerDivision: 30000 },
    { id: 4, name: 'Gold', image: '/assets/4 - GOLD.webp', pricePerDivision: 40000 },
    { id: 5, name: 'Platinum', image: '/assets/5 - PLATINUM.webp', pricePerDivision: 55000 },
    { id: 6, name: 'Diamond', image: '/assets/6 - DIAMOND.webp', pricePerDivision: [70000, 80000, 90000] },
    { id: 7, name: 'Ascendant', image: '/assets/7 - ASCENDANT.webp', pricePerDivision: [120000, 140000, 160000] },
    { id: 8, name: 'Immortal', image: '/assets/8 - IMMORTAL.webp', pricePerRR: [5000, 6000, 7500], rrTiers: [100, 200, 299], minRR: 0, maxRR: 299, usesRR: true },
    { id: 9, name: 'Radiant', image: '/assets/9 - RADIANT.webp', pricePerRR: [15000, 25000, 50000], rrTiers: [300, 500, 800], minRR: 300, maxRR: 1000, usesRR: true, isRadiant: true }
]

// Duo Boost (Joki Mabar) price data - per rank + division pricing
export const duoBoostRanks = [
    { id: 1, name: 'Iron', image: '/assets/1 - IRON.webp', pricePerWin: 10000, hasDivisions: true },
    { id: 2, name: 'Bronze', image: '/assets/2 - BRONZE.webp', pricePerWin: 10000, hasDivisions: true },
    { id: 3, name: 'Silver', image: '/assets/3 - SILVER.webp', pricePerWin: 15000, hasDivisions: true },
    { id: 4, name: 'Gold', image: '/assets/4 - GOLD.webp', pricePerWin: 20000, hasDivisions: true },
    { id: 5, name: 'Platinum', image: '/assets/5 - PLATINUM.webp', pricePerWin: 25000, hasDivisions: true },
    { id: 6, name: 'Diamond', image: '/assets/6 - DIAMOND.webp', pricePerWin: [30000, 35000, 40000], hasDivisions: true },
    { id: 7, name: 'Ascendant', image: '/assets/7 - ASCENDANT.webp', pricePerWin: [50000, 60000, 70000], hasDivisions: true },
    { id: 8, name: 'Immortal', image: '/assets/8 - IMMORTAL.webp', pricePerWin: [100000, 165000, 225000], hasDivisions: true },
    { id: 9, name: 'Radiant', image: '/assets/9 - RADIANT.webp', pricePerWin: 400000, hasDivisions: false }
]

// Discount tiers configuration
export const DISCOUNT_TIERS = [
    { minPrice: 500000, discount: 0.10 }, // 10% off for 500k+
    { minPrice: 100000, discount: 0.05 }, // 5% off for 100k-499k
]

export const OFFLINE_MODE_PRICE = 15000

export const formatRp = (n) => 'Rp ' + n.toLocaleString('id-ID')
