import './style.css'

// Rank data with prices (based on competitor research - updated)
// Immortal and Radiant use RR system instead of divisions
// Immortal: 0-79 RR (Immo 1), 80-199 RR (Immo 2), 200-399 RR (Immo 3)
// Radiant: 400-1000 RR (Premium pricing)
const ranks = [
    { id: 1, name: 'Iron', image: '/assets/1 - IRON.webp', pricePerDivision: 10000 },
    { id: 2, name: 'Bronze', image: '/assets/2 - BRONZE.webp', pricePerDivision: 20000 },
    { id: 3, name: 'Silver', image: '/assets/3 - SILVER.webp', pricePerDivision: 30000 },
    { id: 4, name: 'Gold', image: '/assets/4 - GOLD.webp', pricePerDivision: 40000 },
    { id: 5, name: 'Platinum', image: '/assets/5 - PLATINUM.webp', pricePerDivision: 55000 },
    { id: 6, name: 'Diamond', image: '/assets/6 - DIAMOND.webp', pricePerDivision: [70000, 80000, 90000] },
    { id: 7, name: 'Ascendant', image: '/assets/7 - ASCENDANT.webp', pricePerDivision: [120000, 140000, 160000] },
    { id: 8, name: 'Immortal', image: '/assets/8 - IMMORTAL.webp', pricePerRR: [5000, 6000, 7500], rrTiers: [80, 200, 400], minRR: 0, maxRR: 399, usesRR: true },
    { id: 9, name: 'Radiant', image: '/assets/9 - RADIANT.webp', pricePerRR: [15000, 25000, 50000], rrTiers: [500, 700, 1000], minRR: 400, maxRR: 1000, usesRR: true, isRadiant: true }
]

// Duo Boost (Joki Mabar) price data - per rank + division pricing
const duoBoostRanks = [
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

// State
let state = {
    fromRank: 1,
    fromDivision: 1,
    fromRR: 0,
    toRank: 4,
    toDivision: 1,
    toRR: 50,
    offlineMode: false,
    requestAgent: false,
    priority: false,
    regularRR: 0,
}

const duoState = {
    selectedRank: 0,
    selectedDivision: 1,
    games: 1
}

// DOM Elements
const fromRankPicker = document.getElementById('from-rank-picker')
const toRankPicker = document.getElementById('to-rank-picker')
const fromOptions = document.getElementById('from-options')
const toOptions = document.getElementById('to-options')
const fromSelected = document.getElementById('from-selected')
const toSelected = document.getElementById('to-selected')
const fromDivisionSelector = document.getElementById('from-division')
const toDivisionSelector = document.getElementById('to-division')
const fromRRContainer = document.getElementById('from-rr-container')
const toRRContainer = document.getElementById('to-rr-container')
const fromRRInput = document.getElementById('from-rr')
const toRRInput = document.getElementById('to-rr')
const priceValue = document.getElementById('price-value')
const originalPriceEl = document.getElementById('original-price')
const discountBadgeEl = document.getElementById('discount-badge')
const priceInfoEl = document.querySelector('.price-info')
const orderBtn = document.getElementById('order-btn')
const navbar = document.getElementById('navbar')
const mobileMenuBtn = document.getElementById('mobile-menu-btn')
const mobileMenu = document.getElementById('mobile-menu')
const addonOffline = document.getElementById('addon-offline')
const addonAgent = document.getElementById('addon-agent')
const addonPriority = document.getElementById('addon-priority')
const rrInfoBar = document.getElementById('rr-info-bar')
const rrInfoText = document.getElementById('rr-info-text')
const fromRegularRRInput = document.getElementById('from-regular-rr')
const fromRegularRRContainer = document.getElementById('from-regular-rr-container')

// Discount tiers configuration
const DISCOUNT_TIERS = [
    { minPrice: 500000, discount: 0.30 }, // 30% off for 500k+
    { minPrice: 200000, discount: 0.20 }, // 20% off for 200k-499k
    { minPrice: 100000, discount: 0.15 }, // 15% off for 100k-199k
]

// Get discount percentage based on price
function getDiscountTier(price) {
    for (const tier of DISCOUNT_TIERS) {
        if (price >= tier.minPrice) {
            return tier.discount
        }
    }
    return 0 // No discount for orders under 100k
}

// Round price to nearest 1000
function roundPrice(price) {
    return Math.round(price / 1000) * 1000
}

// Initialize
function init() {
    renderRankOptions()
    updateSelectedRanks()
    updateDivisionVisibility()
    calculatePrice()
    setupEventListeners()
    initDuoBoost()
    setupCalcTabs()
}

// Render rank options in dropdowns
function renderRankOptions() {
    const createOptions = (container, type) => {
        container.innerHTML = ranks.map(rank => `
      <div class="rank-option ${state[type + 'Rank'] === rank.id ? 'active' : ''}" data-rank="${rank.id}">
        <img src="${rank.image}" alt="${rank.name}" class="rank-option-img">
        <span class="rank-option-name">${rank.name}</span>
      </div>
    `).join('')
    }

    createOptions(fromOptions, 'from')
    createOptions(toOptions, 'to')
}

// Check if rank uses RR system (Immortal or Radiant)
function usesRRSystem(rankId) {
    const rank = ranks.find(r => r.id === rankId)
    return rank && rank.usesRR
}

// Check if rank is Radiant
function isRadiant(rankId) {
    const rank = ranks.find(r => r.id === rankId)
    return rank && rank.isRadiant
}

// Get RR display text based on rank
function getRRDisplayText(rankId, rr) {
    const rank = ranks.find(r => r.id === rankId)
    if (rank && rank.usesRR) {
        if (rank.isRadiant) {
            return `${rr} RR`
        } else {
            // Immortal - show tier name
            if (rr < 80) return `Imm 1 (${rr} RR)`
            if (rr < 200) return `Imm 2 (${rr} RR)`
            return `Imm 3 (${rr} RR)`
        }
    }
    return ''
}

// Update selected rank display
function updateSelectedRanks() {
    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)

    if (fromRank) {
        fromSelected.querySelector('.selected-rank-img').src = fromRank.image
        fromSelected.querySelector('.selected-rank-img').alt = fromRank.name
        fromSelected.querySelector('.selected-rank-name').textContent = fromRank.name

        if (fromRank.usesRR) {
            fromSelected.querySelector('.selected-rank-division').textContent = getRRDisplayText(fromRank.id, state.fromRR)
        } else {
            fromSelected.querySelector('.selected-rank-division').textContent = `Division ${state.fromDivision}`
        }
    }

    if (toRank) {
        toSelected.querySelector('.selected-rank-img').src = toRank.image
        toSelected.querySelector('.selected-rank-img').alt = toRank.name
        toSelected.querySelector('.selected-rank-name').textContent = toRank.name

        if (toRank.usesRR) {
            toSelected.querySelector('.selected-rank-division').textContent = getRRDisplayText(toRank.id, state.toRR)
        } else {
            toSelected.querySelector('.selected-rank-division').textContent = `Division ${state.toDivision}`
        }
    }
}

// Update division/RR visibility based on selected rank
function updateDivisionVisibility() {
    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)

    // From rank
    if (fromRank && fromRank.usesRR) {
        fromDivisionSelector.style.display = 'none'
        fromRRContainer.style.display = 'block'
        fromRegularRRContainer.style.display = 'none'
        fromRRInput.value = state.fromRR
        fromRRInput.min = fromRank.minRR
        fromRRInput.max = fromRank.maxRR
        fromRRInput.placeholder = fromRank.minRR
    } else {
        fromDivisionSelector.style.display = 'flex'
        fromRRContainer.style.display = 'none'
        fromRegularRRContainer.style.display = 'block'
        fromRegularRRInput.value = state.regularRR
        updateDivisionButtons('from')
    }

    // To rank
    if (toRank && toRank.usesRR) {
        toDivisionSelector.style.display = 'none'
        toRRContainer.style.display = 'block'
        toRRInput.value = state.toRR
        toRRInput.min = toRank.minRR
        toRRInput.max = toRank.maxRR
        toRRInput.placeholder = toRank.minRR
    } else {
        toDivisionSelector.style.display = 'flex'
        toRRContainer.style.display = 'none'
        updateDivisionButtons('to')
    }
}

// Update division buttons
function updateDivisionButtons(type) {
    const selector = type === 'from' ? fromDivisionSelector : toDivisionSelector
    const division = type === 'from' ? state.fromDivision : state.toDivision

    selector.querySelectorAll('.division-btn').forEach((btn, index) => {
        const div = index + 1
        btn.classList.toggle('active', division === div)
    })
}

// Calculate price
function calculatePrice() {
    let totalPrice = 0

    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)

    // Helper function to get price for a specific rank and division
    function getDivisionPrice(rank, division) {
        if (Array.isArray(rank.pricePerDivision)) {
            return rank.pricePerDivision[division - 1] || rank.pricePerDivision[0]
        }
        return rank.pricePerDivision
    }

    // Minimum RR per boost (1 win gives ~15-20 RR, so minimum boost = 15 RR)
    const MIN_RR_PER_BOOST = 15

    // Helper function to calculate RR price with tiers (for Immortal/Radiant)
    function getRRPrice(fromRR, toRR, rank) {
        // Clamp values - allow toRR to be 1 above maxRR for boundary calculations
        fromRR = Math.max(rank.minRR, Math.min(rank.maxRR, fromRR))
        toRR = Math.max(rank.minRR, Math.min(rank.maxRR + 1, toRR))

        if (toRR <= fromRR) return 0

        const actualRRDiff = toRR - fromRR

        if (!Array.isArray(rank.pricePerRR)) {
            // For non-tiered pricing, apply minimum RR
            const effectiveRR = Math.max(actualRRDiff, MIN_RR_PER_BOOST)
            return effectiveRR * rank.pricePerRR
        }

        let price = 0
        let currentRR = fromRR
        const tiers = rank.rrTiers
        const prices = rank.pricePerRR
        let iterations = 0
        const maxIterations = 100  // Safety limit

        while (currentRR < toRR && iterations < maxIterations) {
            iterations++
            let tierIndex = 0
            // Determine current tier
            for (let i = 0; i < tiers.length; i++) {
                if (currentRR >= tiers[i]) {
                    tierIndex = i + 1
                }
            }
            if (tierIndex >= prices.length) tierIndex = prices.length - 1

            // Calculate how much RR in this tier
            let nextTierRR = tierIndex < tiers.length ? tiers[tierIndex] : rank.maxRR + 1
            if (nextTierRR <= currentRR) nextTierRR = toRR  // Safety check

            let rrInThisTier = Math.min(toRR, nextTierRR) - currentRR

            if (rrInThisTier > 0) {
                price += rrInThisTier * prices[tierIndex]
                currentRR += rrInThisTier
            } else {
                break  // Safety break
            }
        }

        // Apply minimum price: if RR diff is less than MIN_RR_PER_BOOST, 
        // calculate what MIN_RR_PER_BOOST would cost at the starting tier rate
        if (actualRRDiff < MIN_RR_PER_BOOST) {
            // Get the tier rate at fromRR position
            let tierIndex = 0
            for (let i = 0; i < tiers.length; i++) {
                if (fromRR >= tiers[i]) {
                    tierIndex = i + 1
                }
            }
            if (tierIndex >= prices.length) tierIndex = prices.length - 1
            const minPrice = MIN_RR_PER_BOOST * prices[tierIndex]
            price = Math.max(price, minPrice)
        }

        return price
    }

    // Case 1: Both ranks use RR system (Immortal or Radiant)
    if (fromRank.usesRR && toRank.usesRR) {
        // Check if going backwards (invalid)
        if (toRank.id < fromRank.id || (toRank.id === fromRank.id && state.toRR <= state.fromRR)) {
            totalPrice = 0
        } else if (fromRank.id === toRank.id) {
            // Same rank (both Immortal or both Radiant)
            totalPrice = getRRPrice(state.fromRR, state.toRR, fromRank)
        } else {
            // Different ranks (Immortal -> Radiant)
            // Calculate Immortal portion: from current RR to end of Immortal (399)
            // We use maxRR + 1 to include the boundary RR in calculation
            totalPrice += getRRPrice(state.fromRR, fromRank.maxRR + 1, fromRank)
            // Calculate Radiant portion: from start of Radiant (400) to target
            // Only charge if target is above minRR
            if (state.toRR > toRank.minRR) {
                totalPrice += getRRPrice(toRank.minRR, state.toRR, toRank)
            }
        }
    }
    // Case 2: From uses RR, To doesn't (invalid - can't go down)
    else if (fromRank.usesRR && !toRank.usesRR) {
        totalPrice = 0
    }
    // Case 3: From doesn't use RR, To uses RR (regular -> Immortal/Radiant)
    else if (!fromRank.usesRR && toRank.usesRR) {
        // First, calculate price to reach Immortal (the first RR-based rank)
        const immortalRank = ranks.find(r => r.id === 8)  // Immortal
        const fromTotalDiv = getTotalDivisions(state.fromRank, state.fromDivision)
        const immortalStartDiv = getTotalDivisions(8, 1)  // Division count to reach Immortal

        // Calculate division cost to reach Immortal
        if (immortalStartDiv > fromTotalDiv) {
            let currentRank = state.fromRank
            let currentDiv = state.fromDivision

            while (getTotalDivisions(currentRank, currentDiv) < immortalStartDiv) {
                const rank = ranks.find(r => r.id === currentRank)
                if (rank && !rank.usesRR) {
                    totalPrice += getDivisionPrice(rank, currentDiv)
                }

                currentDiv++
                if (currentDiv > 3) {
                    currentDiv = 1
                    currentRank++
                }
            }
        }

        // Now we're at Immortal. Calculate RR costs.
        if (toRank.id === 8) {
            // Destination is Immortal - just add RR from 0 to target
            totalPrice += getRRPrice(immortalRank.minRR, state.toRR, immortalRank)
        } else if (toRank.id === 9) {
            // Destination is Radiant - must go through ALL of Immortal first
            // Immortal: 0 to 400 (using maxRR + 1 for boundary)
            totalPrice += getRRPrice(immortalRank.minRR, immortalRank.maxRR + 1, immortalRank)
            // Then add Radiant RR from 400 to target
            if (state.toRR > toRank.minRR) {
                totalPrice += getRRPrice(toRank.minRR, state.toRR, toRank)
            }
        }
    }
    // Case 4: Normal division-based calculation (neither uses RR)
    else {
        const fromTotalDiv = getTotalDivisions(state.fromRank, state.fromDivision)
        const toTotalDiv = getTotalDivisions(state.toRank, state.toDivision)

        if (toTotalDiv <= fromTotalDiv) {
            totalPrice = 0
        } else {
            let currentRank = state.fromRank
            let currentDiv = state.fromDivision

            while (getTotalDivisions(currentRank, currentDiv) < toTotalDiv) {
                const rank = ranks.find(r => r.id === currentRank)
                if (rank) {
                    totalPrice += getDivisionPrice(rank, currentDiv)
                }

                currentDiv++
                if (currentDiv > 3) {
                    currentDiv = 1
                    currentRank++
                }
            }
        }
    }

    // Add offline mode cost
    const OFFLINE_MODE_PRICE = 15000
    if (state.offlineMode) {
        totalPrice += OFFLINE_MODE_PRICE
    }

    // Add priority surcharge (25%)
    if (state.priority) {
        totalPrice = Math.round(totalPrice * 1.25)
    }

    // Calculate discount
    const discountPercent = getDiscountTier(totalPrice)
    const discountAmount = totalPrice * discountPercent
    const finalPrice = roundPrice(totalPrice - discountAmount)

    // Update RR info
    updateRRInfo()

    // Format price with loading animation
    priceValue.classList.add('calculating')

    // Small delay for visual feedback
    setTimeout(() => {
        // Show original price (strikethrough) only if there's a discount
        if (discountPercent > 0) {
            originalPriceEl.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`
            discountBadgeEl.textContent = `💰 Hemat ${Math.round(discountPercent * 100)}%`
            priceInfoEl.classList.add('has-discount')
        } else {
            originalPriceEl.textContent = ''
            discountBadgeEl.textContent = ''
            priceInfoEl.classList.remove('has-discount')
        }

        const formattedPrice = finalPrice.toLocaleString('id-ID')
        priceValue.textContent = formattedPrice
        priceValue.classList.remove('calculating')
        priceValue.classList.add('calculated')

        // Remove calculated class after animation
        setTimeout(() => {
            priceValue.classList.remove('calculated')
        }, 300)
    }, 150)

    // Update order button with final (discounted) price
    updateOrderButton(finalPrice)
}

// Update RR Info display
function updateRRInfo() {
    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)

    // Only show RR info when there's a valid rank selection
    if (!fromRank || !toRank) {
        rrInfoBar.style.display = 'none'
        return
    }

    let rrAwal, rrAkhir
    let fromLabel, toLabel

    // Determine RR Awal
    if (fromRank.usesRR) {
        rrAwal = state.fromRR
        fromLabel = `${fromRank.name} ${rrAwal} RR`
    } else {
        rrAwal = state.regularRR
        fromLabel = `${fromRank.name} ${state.fromDivision} (RR ${rrAwal})`
    }

    // Determine RR Akhir - same RR as awal but at the target rank
    if (toRank.usesRR) {
        rrAkhir = state.toRR
        toLabel = `${toRank.name} ${rrAkhir} RR`
    } else {
        // For non-RR destination ranks, RR akhir ≥ RR awal at the target rank
        rrAkhir = rrAwal
        toLabel = `${toRank.name} ${state.toDivision} (RR ${rrAkhir})`
    }

    rrInfoBar.style.display = 'block'
    rrInfoText.textContent = `RR Awal: ${fromLabel} → RR Akhir: akan sampai ke ${toLabel}`
}

// Get total divisions from Iron 1 (ranks using RR don't count as divisions)
function getTotalDivisions(rankId, division) {
    let total = 0
    for (let i = 1; i < rankId; i++) {
        const rank = ranks.find(r => r.id === i)
        if (rank && !rank.usesRR) {
            total += 3
        }
    }
    return total + division
}

// Update order button with dynamic message
function updateOrderButton(price) {
    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)

    let fromText, toText

    if (fromRank.usesRR) {
        fromText = `${fromRank.name} ${state.fromRR} RR`
    } else {
        fromText = `${fromRank.name} ${state.fromDivision}`
    }

    if (toRank.usesRR) {
        toText = `${toRank.name} ${state.toRR} RR`
    } else {
        toText = `${toRank.name} ${state.toDivision}`
    }

    // Build add-ons text
    let addonsText = ''
    if (state.offlineMode) addonsText += '\n- Offline Mode (+Rp 15.000)'
    if (state.requestAgent) addonsText += '\n- Request Agent'
    if (state.priority) addonsText += '\n- Prioritas (+25%)'
    const addonsSection = addonsText ? `\nAdd-ons:${addonsText}\n` : ''

    const message = encodeURIComponent(
        `Halo Valojoki, saya ingin order boosting (Joki Reguler):\n\n` +
        `Dari: ${fromText}\n` +
        `Ke: ${toText}\n` +
        addonsSection +
        `Estimasi: Rp ${price.toLocaleString('id-ID')}\n\n` +
        `Mohon informasi lebih lanjut. Terima kasih!`
    )

    orderBtn.href = `https://wa.me/6289524150075?text=${message}`
}

// Setup event listeners
function setupEventListeners() {
    // Rank picker toggle
    fromSelected.addEventListener('click', () => {
        fromRankPicker.classList.toggle('open')
        toRankPicker.classList.remove('open')
    })

    toSelected.addEventListener('click', () => {
        toRankPicker.classList.toggle('open')
        fromRankPicker.classList.remove('open')
    })

    // Rank selection
    fromOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.rank-option')
        if (option) {
            const rankId = parseInt(option.dataset.rank)
            const rank = ranks.find(r => r.id === rankId)
            state.fromRank = rankId

            // Reset to appropriate defaults
            if (rank && rank.usesRR) {
                state.fromRR = rank.minRR
            } else {
                state.fromDivision = 1
            }

            // Auto-adjust 'to' rank to be at least 1 step higher
            adjustToRankMinimum()

            fromRankPicker.classList.remove('open')
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
        }
    })

    // Helper function to ensure 'to' is always higher than 'from'
    function adjustToRankMinimum() {
        const fromRank = ranks.find(r => r.id === state.fromRank)
        const toRank = ranks.find(r => r.id === state.toRank)

        // Both use RR system
        if (fromRank.usesRR && toRank.usesRR) {
            if (state.toRank < state.fromRank ||
                (state.toRank === state.fromRank && state.toRR <= state.fromRR)) {
                // Set 'to' to be at least 50 RR higher
                if (state.fromRR + 50 <= fromRank.maxRR) {
                    state.toRank = state.fromRank
                    state.toRR = state.fromRR + 50
                } else {
                    // Move to next rank (Radiant)
                    const nextRank = ranks.find(r => r.id === state.fromRank + 1)
                    if (nextRank) {
                        state.toRank = nextRank.id
                        state.toRR = nextRank.minRR + 50
                    }
                }
            }
        }
        // From uses RR, To doesn't (invalid)
        else if (fromRank.usesRR && !toRank.usesRR) {
            // Set 'to' to the same rank with higher RR
            state.toRank = state.fromRank
            state.toRR = Math.min(state.fromRR + 50, fromRank.maxRR)
        }
        // From doesn't use RR, To uses RR (valid, no adjustment needed if toRank > fromRank)
        else if (!fromRank.usesRR && toRank.usesRR) {
            // This is fine, RR ranks are higher
        }
        // Both use division system
        else {
            const fromTotal = state.fromRank * 3 + state.fromDivision
            const toTotal = state.toRank * 3 + state.toDivision

            if (toTotal <= fromTotal) {
                // Set 'to' to next division
                if (state.fromDivision < 3) {
                    state.toRank = state.fromRank
                    state.toDivision = state.fromDivision + 1
                } else {
                    // Move to next rank
                    const nextRank = ranks.find(r => r.id === state.fromRank + 1)
                    if (nextRank) {
                        state.toRank = nextRank.id
                        if (nextRank.usesRR) {
                            state.toRR = nextRank.minRR + 50
                        } else {
                            state.toDivision = 1
                        }
                    }
                }
            }
        }
    }

    toOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.rank-option')
        if (option) {
            const rankId = parseInt(option.dataset.rank)
            const rank = ranks.find(r => r.id === rankId)
            state.toRank = rankId

            // Reset to appropriate defaults
            if (rank && rank.usesRR) {
                state.toRR = rank.minRR + 50  // Default to 50 RR above minimum
            } else {
                state.toDivision = 1
            }

            toRankPicker.classList.remove('open')
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
        }
    })

    // Division selection
    fromDivisionSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.division-btn')
        if (btn) {
            state.fromDivision = parseInt(btn.dataset.division)
            adjustToRankMinimum()
            updateSelectedRanks()
            updateDivisionButtons('from')
            updateDivisionVisibility()
            calculatePrice()
        }
    })

    toDivisionSelector.addEventListener('click', (e) => {
        const btn = e.target.closest('.division-btn')
        if (btn) {
            state.toDivision = parseInt(btn.dataset.division)
            updateSelectedRanks()
            updateDivisionButtons('to')
            calculatePrice()
        }
    })

    // RR input handling with auto-rank switch
    fromRRInput.addEventListener('input', (e) => {
        const currentRank = ranks.find(r => r.id === state.fromRank)
        let value = parseInt(e.target.value) || currentRank.minRR

        // Auto-switch: Immortal -> Radiant when RR >= 400
        if (currentRank.id === 8 && value >= 400) {
            const radiantRank = ranks.find(r => r.id === 9)
            state.fromRank = 9  // Switch to Radiant
            state.fromRR = Math.min(value, radiantRank.maxRR)  // Clamp to max
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }
        // Auto-switch: Radiant -> Immortal when RR < 400
        if (currentRank.id === 9 && value < 400) {
            state.fromRank = 8  // Switch to Immortal
            state.fromRR = value
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }

        if (value < currentRank.minRR) value = currentRank.minRR
        if (value > currentRank.maxRR) value = currentRank.maxRR
        state.fromRR = value
        updateSelectedRanks()
        calculatePrice()
    })

    toRRInput.addEventListener('input', (e) => {
        const currentRank = ranks.find(r => r.id === state.toRank)
        let value = parseInt(e.target.value) || currentRank.minRR

        // Auto-switch: Immortal -> Radiant when RR >= 400
        if (currentRank.id === 8 && value >= 400) {
            const radiantRank = ranks.find(r => r.id === 9)
            state.toRank = 9  // Switch to Radiant
            state.toRR = Math.min(value, radiantRank.maxRR)  // Clamp to max
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }
        // Auto-switch: Radiant -> Immortal when RR < 400
        if (currentRank.id === 9 && value < 400) {
            state.toRank = 8  // Switch to Immortal
            state.toRR = value
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }

        if (value < currentRank.minRR) value = currentRank.minRR
        if (value > currentRank.maxRR) value = currentRank.maxRR
        state.toRR = value
        updateSelectedRanks()
        calculatePrice()
    })

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!fromRankPicker.contains(e.target)) {
            fromRankPicker.classList.remove('open')
        }
        if (!toRankPicker.contains(e.target)) {
            toRankPicker.classList.remove('open')
        }
    })

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled')
        } else {
            navbar.classList.remove('scrolled')
        }
    })

    // Mobile menu toggle with ARIA support
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active')
        mobileMenuBtn.classList.toggle('active')

        // Update ARIA attributes for accessibility
        mobileMenuBtn.setAttribute('aria-expanded', isOpen)
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi')
        mobileMenu.setAttribute('aria-hidden', !isOpen)
    })

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active')
            mobileMenuBtn.classList.remove('active')
        })
    })

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip order buttons - they have dynamically updated hrefs
            if (this.classList.contains('order-btn')) return
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        })
    })

    // Add-ons event listeners
    addonOffline.addEventListener('change', () => {
        state.offlineMode = addonOffline.checked
        calculatePrice()
    })

    addonAgent.addEventListener('change', () => {
        state.requestAgent = addonAgent.checked
        calculatePrice()
    })

    addonPriority.addEventListener('change', () => {
        state.priority = addonPriority.checked
        calculatePrice()
    })

    // Regular RR input
    fromRegularRRInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 0
        if (value < 0) value = 0
        if (value > 99) value = 99
        state.regularRR = value
        updateRRInfo()
    })
}

// ==========================================
// DUO BOOST (JOKI MABAR) CALCULATOR
// ==========================================
function initDuoBoost() {
    const duoRankPicker = document.getElementById('duo-rank-picker')
    const duoSelected = document.getElementById('duo-selected')
    const duoOptions = document.getElementById('duo-options')
    const duoDivision = document.getElementById('duo-division')
    const duoGamesInput = document.getElementById('duo-games')
    const duoMinusBtn = document.getElementById('duo-minus')
    const duoPlusBtn = document.getElementById('duo-plus')
    const duoPriceValue = document.getElementById('duo-price-value')
    const duoPricePerGame = document.getElementById('duo-price-per-game')
    const duoOrderBtn = document.getElementById('duo-order-btn')

    if (!duoRankPicker) return

    // Get price for current rank + division
    function getDuoPrice() {
        const rank = duoBoostRanks[duoState.selectedRank]
        if (Array.isArray(rank.pricePerWin)) {
            return rank.pricePerWin[duoState.selectedDivision - 1]
        }
        return rank.pricePerWin
    }

    // Render duo rank options in dropdown
    function renderDuoOptions() {
        duoOptions.innerHTML = duoBoostRanks.map((rank, index) => `
            <div class="rank-option ${duoState.selectedRank === index ? 'active' : ''}" data-rank="${index}">
                <img src="${rank.image}" alt="${rank.name}" class="rank-option-img">
                <span class="rank-option-name">${rank.name}</span>
            </div>
        `).join('')
    }

    // Update duo selected display
    function updateDuoSelected() {
        const rank = duoBoostRanks[duoState.selectedRank]
        duoSelected.querySelector('.selected-rank-img').src = rank.image
        duoSelected.querySelector('.selected-rank-img').alt = rank.name
        duoSelected.querySelector('.selected-rank-name').textContent = rank.name
        if (rank.hasDivisions) {
            duoSelected.querySelector('.selected-rank-division').textContent = `Division ${duoState.selectedDivision}`
        } else {
            duoSelected.querySelector('.selected-rank-division').textContent = `Rp ${getDuoPrice().toLocaleString('id-ID')} / win`
        }
    }

    // Update division visibility
    function updateDuoDivisionVisibility() {
        const rank = duoBoostRanks[duoState.selectedRank]
        if (rank.hasDivisions) {
            duoDivision.style.display = 'flex'
        } else {
            duoDivision.style.display = 'none'
        }
    }

    // Calculate duo price
    function calculateDuoPrice() {
        const rank = duoBoostRanks[duoState.selectedRank]
        const pricePerWin = getDuoPrice()
        const total = pricePerWin * duoState.games

        duoPricePerGame.textContent = `Rp ${pricePerWin.toLocaleString('id-ID')} × ${duoState.games} win`

        duoPriceValue.classList.add('calculating')
        setTimeout(() => {
            duoPriceValue.textContent = total.toLocaleString('id-ID')
            duoPriceValue.classList.remove('calculating')
            duoPriceValue.classList.add('calculated')
            setTimeout(() => duoPriceValue.classList.remove('calculated'), 300)
        }, 150)

        // Update WA order button
        const rankName = rank.hasDivisions ? `${rank.name} ${duoState.selectedDivision}` : rank.name
        const message = encodeURIComponent(
            `Halo Valojoki, saya ingin order Joki Mabar / Gendong:\n\n` +
            `Rank: ${rankName}\n` +
            `Jumlah Win: ${duoState.games}\n` +
            `Harga per win: Rp ${pricePerWin.toLocaleString('id-ID')}\n` +
            `Total: Rp ${total.toLocaleString('id-ID')}\n\n` +
            `Mohon informasi lebih lanjut. Terima kasih!`
        )
        duoOrderBtn.href = `https://wa.me/6289524150075?text=${message}`
    }

    // Event: Toggle dropdown
    duoSelected.addEventListener('click', () => {
        duoRankPicker.classList.toggle('open')
    })

    // Event: Select rank
    duoOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.rank-option')
        if (option) {
            duoState.selectedRank = parseInt(option.dataset.rank)
            duoState.selectedDivision = 1
            duoRankPicker.classList.remove('open')

            // Reset division buttons
            duoDivision.querySelectorAll('.division-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === 0)
            })

            renderDuoOptions()
            updateDuoSelected()
            updateDuoDivisionVisibility()
            clampGames()
            calculateDuoPrice()
        }
    })

    // Event: Division buttons
    duoDivision.querySelectorAll('.division-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            duoDivision.querySelectorAll('.division-btn').forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            duoState.selectedDivision = parseInt(btn.dataset.division)
            updateDuoSelected()
            clampGames()
            calculateDuoPrice()
        })
    })

    // Event: Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!duoRankPicker.contains(e.target)) {
            duoRankPicker.classList.remove('open')
        }
    })

    // Get max wins based on rank
    function getMaxWins() {
        const rank = duoBoostRanks[duoState.selectedRank]
        // Immortal 3 (index 7, division 3) and Radiant (index 8) have no 6-win cap
        if (duoState.selectedRank === 8) return 50
        if (duoState.selectedRank === 7 && duoState.selectedDivision === 3) return 50
        return 6
    }

    // Clamp games to max
    function clampGames() {
        const max = getMaxWins()
        if (duoState.games > max) {
            duoState.games = max
            duoGamesInput.value = max
        }
        duoGamesInput.max = max
    }

    // Event: Game count buttons
    duoMinusBtn.addEventListener('click', () => {
        if (duoState.games > 1) {
            duoState.games--
            duoGamesInput.value = duoState.games
            calculateDuoPrice()
        }
    })

    duoPlusBtn.addEventListener('click', () => {
        if (duoState.games < getMaxWins()) {
            duoState.games++
            duoGamesInput.value = duoState.games
            calculateDuoPrice()
        }
    })

    // Event: Game count input
    duoGamesInput.addEventListener('input', () => {
        let val = parseInt(duoGamesInput.value) || 1
        if (val < 1) val = 1
        const max = getMaxWins()
        if (val > max) val = max
        duoState.games = val
        calculateDuoPrice()
    })

    // Initialize
    renderDuoOptions()
    updateDuoSelected()
    updateDuoDivisionVisibility()
    calculateDuoPrice()
}

// ==========================================
// CALCULATOR TAB SWITCHING
// ==========================================
function setupCalcTabs() {
    const tabsContainer = document.querySelector('.calc-tabs')
    const tabs = document.querySelectorAll('.calc-tab')
    const panels = document.querySelectorAll('.calc-tab-panel')

    // Set initial data-active
    tabsContainer.dataset.active = 'reguler'

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab

            // Update sliding pill
            tabsContainer.dataset.active = targetTab

            // Update tab active states
            tabs.forEach(t => t.classList.remove('active'))
            tab.classList.add('active')

            // Update panel visibility
            panels.forEach(p => p.classList.remove('active'))
            const targetPanel = document.getElementById(`panel-${targetTab}`)
            if (targetPanel) {
                targetPanel.classList.add('active')
            }
        })
    })

    // Handle service card links that switch to mabar tab
    document.querySelectorAll('a[href="#calculator-mabar"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            // Switch to mabar tab
            tabsContainer.dataset.active = 'mabar'
            tabs.forEach(t => t.classList.remove('active'))
            document.getElementById('tab-mabar').classList.add('active')
            panels.forEach(p => p.classList.remove('active'))
            document.getElementById('panel-mabar').classList.add('active')
            // Scroll to calculator
            document.getElementById('calculator').scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    })
}

// Count-up animation for stats
function initCountUpAnimation() {
    const countUpElements = document.querySelectorAll('[data-count-up]')

    const animateCountUp = (element) => {
        const target = parseInt(element.dataset.countUp)
        const suffix = element.dataset.suffix || ''
        const duration = 3500 // 3.5 seconds (slower)
        const startTime = performance.now()

        // Easing function for smooth animation
        const easeOutQuad = (t) => t * (2 - t)

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOutQuad(progress)
            const currentValue = Math.floor(easedProgress * target)

            element.textContent = currentValue.toLocaleString('id-ID') + suffix

            if (progress < 1) {
                requestAnimationFrame(updateCount)
            } else {
                element.textContent = target.toLocaleString('id-ID') + suffix
            }
        }

        requestAnimationFrame(updateCount)
    }

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target
                animateCountUp(element)
                observer.unobserve(element) // Only animate once
            }
        })
    }, {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '0px'
    })

    countUpElements.forEach(element => {
        observer.observe(element)
    })
}

// Typewriter effect with delete animation
function initTypewriterEffect() {
    const typewriterElement = document.getElementById('typewriter')
    if (!typewriterElement) return

    const words = ['profesional !', 'cepat !', 'aman !', 'terpercaya !']
    let wordIndex = 0
    let charIndex = 0
    let isDeleting = false
    let isPaused = false

    const typingSpeed = 100      // Speed of typing each character
    const deletingSpeed = 60     // Speed of deleting each character
    const pauseAfterWord = 2000  // Pause after completing a word
    const pauseBeforeDelete = 1500 // Pause before starting to delete

    function type() {
        const currentWord = words[wordIndex]

        if (isPaused) {
            isPaused = false
            setTimeout(type, isDeleting ? pauseBeforeDelete : pauseAfterWord)
            return
        }

        if (isDeleting) {
            // Deleting characters
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1)
            charIndex--

            if (charIndex === 0) {
                isDeleting = false
                wordIndex = (wordIndex + 1) % words.length
                setTimeout(type, 500) // Small pause before typing new word
                return
            }
        } else {
            // Typing characters
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1)
            charIndex++

            if (charIndex === currentWord.length) {
                isDeleting = true
                isPaused = true
            }
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed
        setTimeout(type, speed)
    }

    // Start the typewriter effect
    setTimeout(type, 1000) // Initial delay before starting
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    init()
    initCountUpAnimation()
    initTypewriterEffect()

    // Preload critical images (visible rank icons)
    const criticalImages = [
        '/assets/1 - IRON.webp',
        '/assets/4 - GOLD.webp',
        '/assets/bg.webp'
    ]

    let imagesLoaded = 0
    const totalImages = criticalImages.length

    const hidePreloader = () => {
        document.body.classList.add('loaded')
        const preloader = document.getElementById('preloader')
        if (preloader) {
            setTimeout(() => preloader.remove(), 500)
        }
    }

    // Load critical images
    criticalImages.forEach(src => {
        const img = new Image()
        img.onload = img.onerror = () => {
            imagesLoaded++
            if (imagesLoaded >= totalImages) {
                setTimeout(hidePreloader, 1000) // Minimum 1 second delay for animation
            }
        }
        img.src = src
    })

    // Fallback: hide after max 5 seconds no matter what
    setTimeout(hidePreloader, 5000)
})
