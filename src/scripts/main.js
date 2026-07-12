import { waMessages, dynamicText } from '../data/i18n.js'
import { ranks, duoBoostRanks, DISCOUNT_TIERS } from '../data/pricing.js'

// Language is fixed per page (/ = id, /en/ = en); no runtime switching
const LANG = document.documentElement.lang === 'en' ? 'en' : 'id'
const getLang = () => LANG

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
    initDuoPerRank()
    setupDuoSubtabs()
    setupCalcTabs()
}

// Render rank options in dropdowns
function renderRankOptions() {
    const createOptions = (container, type) => {
        container.innerHTML = ranks.map(rank => `
      <div class="rank-option ${state[type + 'Rank'] === rank.id ? 'active' : ''}" data-rank="${rank.id}" role="button" tabindex="0">
        <img src="${rank.image}" alt="${rank.name}" class="rank-option-img" width="40" height="40">
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
            if (rr < 100) return `Imm 1 (${rr} RR)`
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
        const fromMinRR = fromRank.id === 8 ? 10 : fromRank.minRR
        fromRRInput.value = Math.max(state.fromRR, fromMinRR)
        fromRRInput.min = fromMinRR
        fromRRInput.max = fromRank.maxRR
        fromRRInput.placeholder = fromMinRR
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
        const toMinRR = toRank.id === 8 ? 10 : toRank.minRR
        toRRInput.value = Math.max(state.toRR, toMinRR)
        toRRInput.min = toMinRR
        toRRInput.max = toRank.maxRR
        toRRInput.placeholder = toMinRR
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

    // Helper function to calculate RR price with tiers (for Immortal/Radiant)
    function getRRPrice(fromRR, toRR, rank) {
        // Clamp values - allow toRR to be 1 above maxRR for boundary calculations
        fromRR = Math.max(rank.minRR, Math.min(rank.maxRR, fromRR))
        toRR = Math.max(rank.minRR, Math.min(rank.maxRR + 1, toRR))

        if (toRR <= fromRR) return 0

        const rrDiff = toRR - fromRR

        if (!Array.isArray(rank.pricePerRR)) {
            return rrDiff * rank.pricePerRR
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
            // Calculate Immortal portion: from current RR to end of Immortal (299)
            // We use maxRR + 1 to include the boundary RR in calculation
            totalPrice += getRRPrice(state.fromRR, fromRank.maxRR + 1, fromRank)
            // Calculate Radiant portion: from start of Radiant (300) to target
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
            // Immortal: 0 to 300 (using maxRR + 1 for boundary)
            totalPrice += getRRPrice(immortalRank.minRR, immortalRank.maxRR + 1, immortalRank)
            // Then add Radiant RR from 300 to target
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

    // Add request agent surcharge (25% if target rank is Immortal/Radiant)
    if (state.requestAgent && state.toRank >= 8) {
        totalPrice = Math.round(totalPrice * 1.25)
    }

    // Add priority surcharge (25%)
    if (state.priority) {
        totalPrice = Math.round(totalPrice * 1.25)
    }

    // Update Request Agent price text based on target rank
    const addonAgentPriceEl = document.querySelector('label[for="addon-agent"] .addon-price')
    if (addonAgentPriceEl) {
        if (state.toRank >= 8) {
            addonAgentPriceEl.setAttribute('data-i18n', 'addon.agent.price.paid')
            addonAgentPriceEl.textContent = '+25%'
        } else {
            addonAgentPriceEl.setAttribute('data-i18n', 'addon.agent.price.free')
            addonAgentPriceEl.textContent = getLang() === 'en' ? 'Free' : 'Gratis'
        }
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
            discountBadgeEl.textContent = dynamicText[getLang()].discountBadge(Math.round(discountPercent * 100))
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

    // Update rank preview bar
    updateRankPreview()
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
    rrInfoText.textContent = dynamicText[getLang()].rrInfo(fromLabel, toLabel)
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
    const wa = waMessages[getLang()]
    let addonsText = ''
    if (state.offlineMode) addonsText += `\n- ${wa.offlineMode}`
    if (state.requestAgent) {
        if (state.toRank >= 8) {
            addonsText += `\n- ${wa.requestAgent} (+25%)`
        } else {
            addonsText += `\n- ${wa.requestAgent}`
        }
    }
    if (state.priority) addonsText += `\n- ${wa.priority}`
    const addonsSection = addonsText ? `\n${wa.addons}:${addonsText}\n` : ''

    const message = encodeURIComponent(
        `${wa.regulerGreeting}\n\n` +
        `${wa.from}: ${fromText}\n` +
        `${wa.to}: ${toText}\n` +
        addonsSection +
        `${wa.estimate}: Rp ${price.toLocaleString('id-ID')}\n\n` +
        wa.closing
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

        // Auto-switch: Immortal -> Radiant when RR >= 300
        if (currentRank.id === 8 && value >= 300) {
            const radiantRank = ranks.find(r => r.id === 9)
            state.fromRank = 9  // Switch to Radiant
            state.fromRR = Math.min(value, radiantRank.maxRR)  // Clamp to max
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }
        // Auto-switch: Radiant -> Immortal when RR < 300
        if (currentRank.id === 9 && value < 300) {
            state.fromRank = 8  // Switch to Immortal
            state.fromRR = value
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }

        // Immortal auto-grants 10 RR on rank up, so minimum is 10
        const minRR = currentRank.id === 8 ? 10 : currentRank.minRR
        if (value < minRR) value = minRR
        if (value > currentRank.maxRR) value = currentRank.maxRR
        state.fromRR = value
        updateSelectedRanks()
        calculatePrice()
    })

    toRRInput.addEventListener('input', (e) => {
        const currentRank = ranks.find(r => r.id === state.toRank)
        let value = parseInt(e.target.value) || currentRank.minRR

        // Auto-switch: Immortal -> Radiant when RR >= 300
        if (currentRank.id === 8 && value >= 300) {
            const radiantRank = ranks.find(r => r.id === 9)
            state.toRank = 9  // Switch to Radiant
            state.toRR = Math.min(value, radiantRank.maxRR)  // Clamp to max
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }
        // Auto-switch: Radiant -> Immortal when RR < 300
        if (currentRank.id === 9 && value < 300) {
            state.toRank = 8  // Switch to Immortal
            state.toRR = value
            renderRankOptions()
            updateSelectedRanks()
            updateDivisionVisibility()
            calculatePrice()
            return
        }

        // Immortal auto-grants 10 RR on rank up, so minimum is 10
        const minRR = currentRank.id === 8 ? 10 : currentRank.minRR
        if (value < minRR) value = minRR
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

    // Re-render on language change
    window.addEventListener('langchange', () => {
        updateSelectedRanks()
        calculatePrice()
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
            <div class="rank-option ${duoState.selectedRank === index ? 'active' : ''}" data-rank="${index}" role="button" tabindex="0">
                <img src="${rank.image}" alt="${rank.name}" class="rank-option-img" width="40" height="40">
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
            duoSelected.querySelector('.selected-rank-division').textContent = dynamicText[getLang()].division(duoState.selectedDivision)
        } else {
            duoSelected.querySelector('.selected-rank-division').textContent = dynamicText[getLang()].perWin(getDuoPrice().toLocaleString('id-ID'))
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

        duoPricePerGame.textContent = dynamicText[getLang()].duoPricePerGame(pricePerWin.toLocaleString('id-ID'), duoState.games)

        duoPriceValue.classList.add('calculating')
        setTimeout(() => {
            duoPriceValue.textContent = total.toLocaleString('id-ID')
            duoPriceValue.classList.remove('calculating')
            duoPriceValue.classList.add('calculated')
            setTimeout(() => duoPriceValue.classList.remove('calculated'), 300)
        }, 150)

        // Update WA order button
        const wa = waMessages[getLang()]
        const rankName = rank.hasDivisions ? `${rank.name} ${duoState.selectedDivision}` : rank.name
        const message = encodeURIComponent(
            `${wa.duoGreeting}\n\n` +
            `${wa.rank}: ${rankName}\n` +
            `${wa.winsCount}: ${duoState.games}\n` +
            `${wa.pricePerWin}: Rp ${pricePerWin.toLocaleString('id-ID')}\n` +
            `${wa.total}: Rp ${total.toLocaleString('id-ID')}\n\n` +
            wa.closing
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

    // Listen for language changes to update duo calculator text
    window.addEventListener('langchange', () => {
        updateDuoSelected()
        calculateDuoPrice()
    })

    // Initialize
    renderDuoOptions()
    updateDuoSelected()
    updateDuoDivisionVisibility()
    calculateDuoPrice()
}

// ==========================================
// DUO BOOST PER RANK (GENDONG PER RANK)
// Price = 2x Regular Boost (after discount)
// ==========================================
function initDuoPerRank() {
    const dprFromPicker = document.getElementById('duo-pr-from-picker')
    const dprToPicker = document.getElementById('duo-pr-to-picker')
    const dprFromSelected = document.getElementById('duo-pr-from-selected')
    const dprToSelected = document.getElementById('duo-pr-to-selected')
    const dprFromOptions = document.getElementById('duo-pr-from-options')
    const dprToOptions = document.getElementById('duo-pr-to-options')
    const dprFromDivision = document.getElementById('duo-pr-from-division')
    const dprToDivision = document.getElementById('duo-pr-to-division')
    const dprFromRegularRRContainer = document.getElementById('duo-pr-from-regular-rr-container')
    const dprFromRRContainer = document.getElementById('duo-pr-from-rr-container')
    const dprToRRContainer = document.getElementById('duo-pr-to-rr-container')
    const dprFromRegularRR = document.getElementById('duo-pr-from-regular-rr')
    const dprFromRR = document.getElementById('duo-pr-from-rr')
    const dprToRR = document.getElementById('duo-pr-to-rr')
    const dprPriceValue = document.getElementById('duo-pr-price-value')
    const dprOriginalPrice = document.getElementById('duo-pr-original-price')
    const dprDiscountBadge = document.getElementById('duo-pr-discount-badge')
    const dprOrderBtn = document.getElementById('duo-pr-order-btn')
    const dprRRInfoBar = document.getElementById('duo-pr-rr-info-bar')
    const dprRRInfoText = document.getElementById('duo-pr-rr-info-text')

    if (!dprFromPicker) return

    const dprState = {
        fromRank: 1, fromDivision: 1, fromRR: 0,
        toRank: 4, toDivision: 1, toRR: 50,
        regularRR: 0
    }

    function dprRenderRankOptions() {
        ;[dprFromOptions, dprToOptions].forEach((container, i) => {
            const selectedId = i === 0 ? dprState.fromRank : dprState.toRank
            container.innerHTML = ranks.map(rank => `
                <div class="rank-option ${rank.id === selectedId ? 'active' : ''}" data-rank="${rank.id}" role="button" tabindex="0">
                    <img src="${rank.image}" alt="${rank.name}" class="rank-option-img" width="40" height="40">
                    <span class="rank-option-name">${rank.name}</span>
                </div>
            `).join('')
        })
    }

    function dprUpdateSelected() {
        ;[
            { el: dprFromSelected, rankId: dprState.fromRank, div: dprState.fromDivision, rr: dprState.fromRR },
            { el: dprToSelected, rankId: dprState.toRank, div: dprState.toDivision, rr: dprState.toRR }
        ].forEach(({ el, rankId, div, rr }) => {
            const rank = ranks.find(r => r.id === rankId)
            el.querySelector('.selected-rank-img').src = rank.image
            el.querySelector('.selected-rank-img').alt = rank.name
            el.querySelector('.selected-rank-name').textContent = rank.name
            el.querySelector('.selected-rank-division').textContent = rank.usesRR ? `${rr} RR` : dynamicText[getLang()].division(div)
        })
    }

    function dprUpdateDivisionVisibility() {
        const fromRank = ranks.find(r => r.id === dprState.fromRank)
        const toRank = ranks.find(r => r.id === dprState.toRank)
        dprFromDivision.style.display = fromRank.usesRR ? 'none' : 'flex'
        dprFromRegularRRContainer.style.display = fromRank.usesRR ? 'none' : 'block'
        dprFromRRContainer.style.display = fromRank.usesRR ? 'block' : 'none'
        if (fromRank.usesRR) { dprFromRR.min = fromRank.minRR; dprFromRR.max = fromRank.maxRR; dprFromRR.value = dprState.fromRR }
        dprToDivision.style.display = toRank.usesRR ? 'none' : 'flex'
        dprToRRContainer.style.display = toRank.usesRR ? 'block' : 'none'
        if (toRank.usesRR) { dprToRR.min = toRank.minRR; dprToRR.max = toRank.maxRR; dprToRR.value = dprState.toRR }
        dprUpdateDivBtns('from'); dprUpdateDivBtns('to')
    }

    function dprUpdateDivBtns(type) {
        const container = type === 'from' ? dprFromDivision : dprToDivision
        const activeDiv = type === 'from' ? dprState.fromDivision : dprState.toDivision
        container.querySelectorAll('.division-btn').forEach((btn, i) => btn.classList.toggle('active', i + 1 === activeDiv))
    }

    // Reuse reguler's helper functions but on dprState
    function dprGetDivisionPrice(rank, division) {
        return Array.isArray(rank.pricePerDivision) ? rank.pricePerDivision[division - 1] : rank.pricePerDivision
    }

    function dprGetRRPrice(fromRR, toRR, rank) {
        if (toRR <= fromRR) return 0
        const tiers = rank.rrTiers
        const prices = rank.pricePerRR
        let price = 0, currentRR = fromRR
        for (let i = 0; i < tiers.length; i++) {
            if (currentRR >= toRR) break
            if (currentRR >= tiers[i]) continue
            const tierEnd = Math.min(toRR, tiers[i])
            price += (tierEnd - currentRR) * prices[i]
            currentRR = tierEnd
        }
        // Minimum RR boost: 10 RR
        const MIN_RR = 10
        if ((toRR - fromRR) < MIN_RR && (toRR - fromRR) > 0) {
            let tierIdx = 0
            for (let i = 0; i < tiers.length; i++) { if (fromRR >= tiers[i]) tierIdx = i + 1 }
            if (tierIdx >= prices.length) tierIdx = prices.length - 1
            price = Math.max(price, MIN_RR * prices[tierIdx])
        }
        return price
    }

    function calcDuoPrPrice() {
        let totalPrice = 0
        const fromRank = ranks.find(r => r.id === dprState.fromRank)
        const toRank = ranks.find(r => r.id === dprState.toRank)

        // Case 1: Both use RR
        if (fromRank.usesRR && toRank.usesRR) {
            if (toRank.id < fromRank.id || (toRank.id === fromRank.id && dprState.toRR <= dprState.fromRR)) {
                totalPrice = 0
            } else if (fromRank.id === toRank.id) {
                totalPrice = dprGetRRPrice(dprState.fromRR, dprState.toRR, fromRank)
            } else {
                totalPrice += dprGetRRPrice(dprState.fromRR, fromRank.maxRR + 1, fromRank)
                if (dprState.toRR > toRank.minRR) totalPrice += dprGetRRPrice(toRank.minRR, dprState.toRR, toRank)
            }
        }
        // Case 2: From RR, To division (invalid)
        else if (fromRank.usesRR && !toRank.usesRR) { totalPrice = 0 }
        // Case 3: From division, To RR
        else if (!fromRank.usesRR && toRank.usesRR) {
            const immortalRank = ranks.find(r => r.id === 8)
            const fromTotalDiv = getTotalDivisions(dprState.fromRank, dprState.fromDivision)
            const immortalStartDiv = getTotalDivisions(8, 1)
            if (immortalStartDiv > fromTotalDiv) {
                let cr = dprState.fromRank, cd = dprState.fromDivision
                while (getTotalDivisions(cr, cd) < immortalStartDiv) {
                    const r = ranks.find(rr => rr.id === cr)
                    if (r && !r.usesRR) totalPrice += dprGetDivisionPrice(r, cd)
                    cd++; if (cd > 3) { cd = 1; cr++ }
                }
            }
            if (toRank.id === 8) {
                totalPrice += dprGetRRPrice(immortalRank.minRR, dprState.toRR, immortalRank)
            } else if (toRank.id === 9) {
                totalPrice += dprGetRRPrice(immortalRank.minRR, immortalRank.maxRR + 1, immortalRank)
                if (dprState.toRR > toRank.minRR) totalPrice += dprGetRRPrice(toRank.minRR, dprState.toRR, toRank)
            }
        }
        // Case 4: Both use divisions
        else {
            const fromTD = getTotalDivisions(dprState.fromRank, dprState.fromDivision)
            const toTD = getTotalDivisions(dprState.toRank, dprState.toDivision)
            if (toTD > fromTD) {
                let cr = dprState.fromRank, cd = dprState.fromDivision
                while (getTotalDivisions(cr, cd) < toTD) {
                    const r = ranks.find(rr => rr.id === cr)
                    if (r) totalPrice += dprGetDivisionPrice(r, cd)
                    cd++; if (cd > 3) { cd = 1; cr++ }
                }
            }
        }

        // Apply same discount as reguler
        const discountPercent = getDiscountTier(totalPrice)
        const discountAmount = totalPrice * discountPercent
        const afterDiscount = totalPrice - discountAmount

        // × 2 for gendong
        const duoOriginal = roundPrice(totalPrice * 2)
        const duoFinal = roundPrice(afterDiscount * 2)

        // Update price display
        dprPriceValue.classList.add('calculating')
        setTimeout(() => {
            dprPriceValue.textContent = duoFinal.toLocaleString('id-ID')
            dprPriceValue.classList.remove('calculating')
            dprPriceValue.classList.add('calculated')
            setTimeout(() => dprPriceValue.classList.remove('calculated'), 300)
        }, 150)

        const lang = getLang()
        if (discountPercent > 0) {
            dprOriginalPrice.textContent = `Rp ${duoOriginal.toLocaleString('id-ID')}`
            dprOriginalPrice.style.display = 'block'
            dprDiscountBadge.textContent = dynamicText[lang].discountBadge(Math.round(discountPercent * 100))
            dprDiscountBadge.style.display = 'inline-block'
        } else {
            dprOriginalPrice.textContent = ''
            dprOriginalPrice.style.display = 'none'
            dprDiscountBadge.textContent = ''
            dprDiscountBadge.style.display = 'none'
        }

        // RR Info
        if (!fromRank.usesRR && dprState.fromRank < 8) {
            dprRRInfoBar.style.display = 'block'
            const fromLabel = `${fromRank.name} ${dprState.fromDivision} (RR ${dprState.regularRR})`
            const toLabel = toRank.usesRR ? `${toRank.name} ${dprState.toRR} RR` : `${toRank.name} ${dprState.toDivision} (RR ${dprState.regularRR})`
            dprRRInfoText.textContent = dynamicText[lang].rrInfo(fromLabel, toLabel)
        } else {
            dprRRInfoBar.style.display = 'none'
        }

        // WA button
        const fText = fromRank.usesRR ? `${fromRank.name} ${dprState.fromRR} RR` : `${fromRank.name} ${dprState.fromDivision}`
        const tText = toRank.usesRR ? `${toRank.name} ${dprState.toRR} RR` : `${toRank.name} ${dprState.toDivision}`
        const wa = waMessages[lang]
        dprOrderBtn.href = `https://wa.me/6289524150075?text=${encodeURIComponent(`${wa.duoGreeting} (Per Rank)\n\n${wa.from}: ${fText}\n${wa.to}: ${tText}\n${wa.estimate}: Rp ${duoFinal.toLocaleString('id-ID')}\n\n${wa.closing}`)}`
    }

    // Auto-adjust to rank
    function dprAdjustTo() {
        const fr = ranks.find(r => r.id === dprState.fromRank)
        const tr = ranks.find(r => r.id === dprState.toRank)
        if (fr.usesRR && tr.usesRR) {
            if (dprState.toRank < dprState.fromRank || (dprState.toRank === dprState.fromRank && dprState.toRR <= dprState.fromRR)) {
                if (dprState.fromRR + 50 <= fr.maxRR) { dprState.toRank = dprState.fromRank; dprState.toRR = dprState.fromRR + 50 }
                else { const n = ranks.find(r => r.id === dprState.fromRank + 1); if (n) { dprState.toRank = n.id; dprState.toRR = n.minRR + 50 } }
            }
        } else if (fr.usesRR && !tr.usesRR) {
            dprState.toRank = dprState.fromRank; dprState.toRR = Math.min(dprState.fromRR + 50, fr.maxRR)
        } else if (!fr.usesRR && !tr.usesRR) {
            if (getTotalDivisions(dprState.toRank, dprState.toDivision) <= getTotalDivisions(dprState.fromRank, dprState.fromDivision)) {
                if (dprState.fromDivision < 3) { dprState.toRank = dprState.fromRank; dprState.toDivision = dprState.fromDivision + 1 }
                else {
                    const n = ranks.find(r => r.id === dprState.fromRank + 1)
                    if (n) { dprState.toRank = n.id; if (n.usesRR) { dprState.toRR = n.minRR + 50 } else { dprState.toDivision = 1 } }
                }
            }
        }
    }

    // Events
    dprFromSelected.addEventListener('click', () => { dprFromPicker.classList.toggle('open'); dprToPicker.classList.remove('open') })
    dprToSelected.addEventListener('click', () => { dprToPicker.classList.toggle('open'); dprFromPicker.classList.remove('open') })

    dprFromOptions.addEventListener('click', e => {
        const opt = e.target.closest('.rank-option'); if (!opt) return
        const r = ranks.find(rr => rr.id === parseInt(opt.dataset.rank)); dprState.fromRank = r.id
        if (r.usesRR) dprState.fromRR = r.minRR; else dprState.fromDivision = 1
        dprAdjustTo(); dprFromPicker.classList.remove('open')
        dprRenderRankOptions(); dprUpdateSelected(); dprUpdateDivisionVisibility(); calcDuoPrPrice()
    })
    dprToOptions.addEventListener('click', e => {
        const opt = e.target.closest('.rank-option'); if (!opt) return
        const r = ranks.find(rr => rr.id === parseInt(opt.dataset.rank)); dprState.toRank = r.id
        if (r.usesRR) dprState.toRR = r.minRR + 50; else dprState.toDivision = 1
        dprToPicker.classList.remove('open')
        dprRenderRankOptions(); dprUpdateSelected(); dprUpdateDivisionVisibility(); calcDuoPrPrice()
    })

    dprFromDivision.addEventListener('click', e => { const b = e.target.closest('.division-btn'); if (!b) return; dprState.fromDivision = parseInt(b.dataset.division); dprAdjustTo(); dprUpdateSelected(); dprUpdateDivBtns('from'); dprUpdateDivisionVisibility(); calcDuoPrPrice() })
    dprToDivision.addEventListener('click', e => { const b = e.target.closest('.division-btn'); if (!b) return; dprState.toDivision = parseInt(b.dataset.division); dprUpdateSelected(); dprUpdateDivBtns('to'); calcDuoPrPrice() })

    dprFromRR.addEventListener('input', e => {
        const cr = ranks.find(r => r.id === dprState.fromRank); let v = parseInt(e.target.value) || cr.minRR
        if (cr.id === 8 && v >= 400) { dprState.fromRank = 9; dprState.fromRR = Math.min(v, 1000) }
        else if (cr.id === 9 && v < 400) { dprState.fromRank = 8; dprState.fromRR = v }
        else dprState.fromRR = Math.max(cr.minRR, Math.min(v, cr.maxRR))
        dprRenderRankOptions(); dprUpdateSelected(); dprUpdateDivisionVisibility(); calcDuoPrPrice()
    })
    dprToRR.addEventListener('input', e => {
        const cr = ranks.find(r => r.id === dprState.toRank); let v = parseInt(e.target.value) || cr.minRR
        if (cr.id === 8 && v >= 400) { dprState.toRank = 9; dprState.toRR = Math.min(v, 1000) }
        else if (cr.id === 9 && v < 400) { dprState.toRank = 8; dprState.toRR = v }
        else dprState.toRR = Math.max(cr.minRR, Math.min(v, cr.maxRR))
        dprRenderRankOptions(); dprUpdateSelected(); dprUpdateDivisionVisibility(); calcDuoPrPrice()
    })
    dprFromRegularRR.addEventListener('input', e => { dprState.regularRR = Math.max(0, Math.min(99, parseInt(e.target.value) || 0)); calcDuoPrPrice() })

    document.addEventListener('click', e => { if (!dprFromPicker.contains(e.target)) dprFromPicker.classList.remove('open'); if (!dprToPicker.contains(e.target)) dprToPicker.classList.remove('open') })
    window.addEventListener('langchange', () => { dprUpdateSelected(); calcDuoPrPrice() })

    // Init
    dprRenderRankOptions(); dprUpdateSelected(); dprUpdateDivisionVisibility(); calcDuoPrPrice()
}

// ==========================================
// DUO SUB-TAB SWITCHING
// ==========================================
function setupDuoSubtabs() {
    const subtabsContainer = document.querySelector('.duo-subtabs')
    const subtabs = document.querySelectorAll('.duo-subtab')
    const subpanels = document.querySelectorAll('.duo-subpanel')

    // Set initial data-active
    subtabsContainer.dataset.active = 'perwin'

    subtabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.duotab
            subtabsContainer.dataset.active = target
            subtabs.forEach(t => {
                t.classList.toggle('active', t === tab)
                t.setAttribute('aria-selected', t === tab ? 'true' : 'false')
            })
            subpanels.forEach(p => p.classList.toggle('active', p.id === `duo-panel-${target}`))
        })
    })
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

    const activateTab = (activeTab) => {
        tabsContainer.dataset.active = activeTab.dataset.tab
        tabs.forEach(t => {
            t.classList.toggle('active', t === activeTab)
            t.setAttribute('aria-selected', t === activeTab ? 'true' : 'false')
        })
        panels.forEach(p => p.classList.remove('active'))
        const targetPanel = document.getElementById(`panel-${activeTab.dataset.tab}`)
        if (targetPanel) {
            targetPanel.classList.add('active')
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab))
    })

    // Handle service card links that switch to mabar tab
    document.querySelectorAll('a[href="#calculator-mabar"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            activateTab(document.getElementById('tab-mabar'))
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

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item')
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question')
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active')
            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active')
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false')
            })
            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active')
                question.setAttribute('aria-expanded', 'true')
            }
        })
    })
}

// Update rank preview bar (Before → After visual)
function updateRankPreview() {
    const previewBar = document.getElementById('rank-preview-bar')
    if (!previewBar) return

    const fromRank = ranks.find(r => r.id === state.fromRank)
    const toRank = ranks.find(r => r.id === state.toRank)
    if (!fromRank || !toRank) return

    const fromDetail = fromRank.usesRR
        ? `RR ${state.fromRR}`
        : `Division ${state.fromDivision}`
    const toDetail = toRank.usesRR
        ? `RR ${state.toRR}`
        : `Division ${state.toDivision}`

    previewBar.innerHTML = `
        <div class="rank-preview-item">
            <img src="${fromRank.image}" alt="${fromRank.name}" class="rank-preview-icon" width="44" height="44" />
            <div class="rank-preview-info">
                <span class="rank-preview-name">${fromRank.name}</span>
                <span class="rank-preview-detail">${fromDetail}</span>
            </div>
        </div>
        <div class="rank-preview-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <div class="rank-preview-item">
            <img src="${toRank.image}" alt="${toRank.name}" class="rank-preview-icon" width="44" height="44" />
            <div class="rank-preview-info">
                <span class="rank-preview-name">${toRank.name}</span>
                <span class="rank-preview-detail">${toDetail}</span>
            </div>
        </div>
    `
}

// Payment Marquee - clone items for seamless infinite loop
function initPaymentMarquee() {
    const track = document.getElementById('payment-track')
    if (!track) return
    // Clone all children and append to track for seamless loop
    const items = Array.from(track.children)
    items.forEach(item => {
        track.appendChild(item.cloneNode(true))
    })
}

// Nav basics run on every page (home + subpages without the calculator)
function initNavBasics() {
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled')
            } else {
                navbar.classList.remove('scrolled')
            }
        })
    }

    // Mobile menu toggle with ARIA support
    if (mobileMenuBtn && mobileMenu) {
        const menuLabels = LANG === 'en'
            ? { open: 'Open navigation menu', close: 'Close navigation menu' }
            : { open: 'Buka menu navigasi', close: 'Tutup menu navigasi' }
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active')
            mobileMenuBtn.classList.toggle('active')

            // Update ARIA attributes for accessibility
            mobileMenuBtn.setAttribute('aria-expanded', isOpen)
            mobileMenuBtn.setAttribute('aria-label', isOpen ? menuLabels.close : menuLabels.open)
            mobileMenu.setAttribute('aria-hidden', !isOpen)
        })

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active')
                mobileMenuBtn.classList.remove('active')
            })
        })
    }

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

    // Language dropdown: options are plain links (/ and /en/), only open/close here
    const langDropdown = document.getElementById('lang-dropdown')
    const langToggle = document.getElementById('lang-toggle')
    if (langDropdown && langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation()
            const open = langDropdown.classList.toggle('open')
            langToggle.setAttribute('aria-expanded', open)
        })
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target)) {
                langDropdown.classList.remove('open')
                langToggle.setAttribute('aria-expanded', 'false')
            }
        })
    }

    // Keyboard support for the custom rank pickers (divs acting as buttons)
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches &&
            e.target.matches('.selected-rank, .rank-option')) {
            e.preventDefault()
            e.target.click()
        }
    })

    // Keep aria-expanded of pickers in sync after any interaction
    document.addEventListener('click', () => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.rank-picker').forEach(picker => {
                const sel = picker.querySelector('.selected-rank')
                if (sel) sel.setAttribute('aria-expanded', picker.classList.contains('open'))
            })
        })
    })

    // GA4 conversion events (gtag is forwarded to the Partytown worker)
    const track = (name, params) => {
        try {
            if (typeof window.gtag === 'function') window.gtag('event', name, params)
        } catch (_) { /* analytics must never break the page */ }
    }
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            track('wa_click', {
                source: link.id || link.className || 'link',
                page: location.pathname,
            })
        })
    })
    document.querySelectorAll('a[href*="discord.gg"]').forEach(link => {
        link.addEventListener('click', () => {
            track('discord_click', { page: location.pathname })
        })
    })
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initNavBasics()
    initFAQ()
    initPaymentMarquee()

    // Calculator only exists on the home pages
    if (document.getElementById('from-rank-picker')) {
        init()
        initCountUpAnimation()
    }
})
