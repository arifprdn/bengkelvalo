import './style.css'

// Rank data with prices (based on competitor research - updated)
// Immortal and Radiant use RR system instead of divisions
// Immortal: 0-79 RR (Immo 1), 80-199 RR (Immo 2), 200-399 RR (Immo 3)
// Radiant: 400-1000 RR (Premium pricing)
const ranks = [
    { id: 1, name: 'Iron', image: '/assets/1 - IRON.webp', pricePerDivision: 20000 },
    { id: 2, name: 'Bronze', image: '/assets/2 - BRONZE.webp', pricePerDivision: 30000 },
    { id: 3, name: 'Silver', image: '/assets/3 - SILVER.webp', pricePerDivision: 40000 },
    { id: 4, name: 'Gold', image: '/assets/4 - GOLD.webp', pricePerDivision: 55000 },
    { id: 5, name: 'Platinum', image: '/assets/5 - PLATINUM.webp', pricePerDivision: 70000 },
    { id: 6, name: 'Diamond', image: '/assets/6 - DIAMOND.webp', pricePerDivision: [100000, 120000, 150000] },
    { id: 7, name: 'Ascendant', image: '/assets/7 - ASCENDANT.webp', pricePerDivision: [175000, 200000, 250000] },
    { id: 8, name: 'Immortal', image: '/assets/8 - IMMORTAL.webp', pricePerRR: [3000, 5000, 7000], rrTiers: [80, 200, 400], minRR: 0, maxRR: 399, usesRR: true },
    { id: 9, name: 'Radiant', image: '/assets/9 - RADIANT.webp', pricePerRR: [15000, 25000, 50000], rrTiers: [500, 700, 1000], minRR: 400, maxRR: 1000, usesRR: true, isRadiant: true }
]

// State
let state = {
    fromRank: 1,
    fromDivision: 1,
    fromRR: 0,
    toRank: 4,
    toDivision: 1,
    toRR: 50
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
const orderBtn = document.getElementById('order-btn')
const navbar = document.getElementById('navbar')
const mobileMenuBtn = document.getElementById('mobile-menu-btn')
const mobileMenu = document.getElementById('mobile-menu')

// Initialize
function init() {
    renderRankOptions()
    updateSelectedRanks()
    updateDivisionVisibility()
    calculatePrice()
    setupEventListeners()
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
        fromRRInput.value = state.fromRR
        fromRRInput.min = fromRank.minRR
        fromRRInput.max = fromRank.maxRR
        fromRRInput.placeholder = fromRank.minRR
    } else {
        fromDivisionSelector.style.display = 'flex'
        fromRRContainer.style.display = 'none'
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

    // Format price with loading animation
    priceValue.classList.add('calculating')

    // Small delay for visual feedback
    setTimeout(() => {
        const formattedPrice = totalPrice.toLocaleString('id-ID')
        priceValue.textContent = formattedPrice
        priceValue.classList.remove('calculating')
        priceValue.classList.add('calculated')

        // Remove calculated class after animation
        setTimeout(() => {
            priceValue.classList.remove('calculated')
        }, 300)
    }, 150)

    // Update order button with price
    updateOrderButton(totalPrice)
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

    const message = encodeURIComponent(
        `Halo Valojoki, saya ingin order boosting:\n\n` +
        `Dari: ${fromText}\n` +
        `Ke: ${toText}\n` +
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
                setTimeout(hidePreloader, 300) // Short delay for animation
            }
        }
        img.src = src
    })

    // Fallback: hide after max 3 seconds no matter what
    setTimeout(hidePreloader, 3000)
})
