// ==========================================
// i18n - Internationalization Module
// ==========================================

const translations = {
    // --- Navbar ---
    'nav.order': { id: 'Order Sekarang', en: 'Order Now' },

    // --- Mobile Menu ---
    'mobile.order': { id: 'Order Sekarang', en: 'Order Now' },

    // --- Hero Section ---
    'hero.badge': { id: '#1 Valorant Rank Up Service', en: '#1 Valorant Rank Up Service' },
    'hero.title': { id: 'Naikan <span class="gradient-text">Rank Valorant</span> Kamu Sekarang', en: 'Boost Your <span class="gradient-text">Valorant Rank</span> Now' },
    'hero.description': { id: 'Layanan Rank Up Valorant yang ', en: 'A Valorant Rank Up Service that is ' },
    'hero.description2': { id: 'Dapatkan rank impianmu dengan bantuan expert player berpengalaman.', en: 'Get your dream rank with the help of experienced expert players.' },
    'hero.cta': { id: 'Hitung Harga', en: 'Calculate Price' },
    'hero.cta2': { id: 'Lihat Layanan', en: 'View Services' },
    'hero.stat.orders': { id: 'Order Selesai', en: 'Orders Done' },
    'hero.stat.satisfaction': { id: 'Kepuasan', en: 'Satisfaction' },
    'hero.scroll': { id: 'Scroll Down', en: 'Scroll Down' },

    // --- Calculator Section ---
    'calc.badge': { id: 'Kalkulator Harga', en: 'Price Calculator' },
    'calc.title': { id: 'Hitung Biaya <span class="gradient-text">Rank Up</span>', en: 'Calculate <span class="gradient-text">Rank Up</span> Cost' },
    'calc.description': { id: 'Pilih layanan dan hitung estimasi harga', en: 'Choose a service and estimate the price' },
    'calc.tab.reguler': { id: 'Joki Reguler', en: 'Regular Boost' },
    'calc.tab.mabar': { id: 'Joki Gendong', en: 'Duo Boost Carry' },
    'calc.currentRank': { id: 'Rank Saat Ini', en: 'Current Rank' },
    'calc.targetRank': { id: 'Rank Tujuan', en: 'Target Rank' },
    'calc.currentRR': { id: 'RR Saat Ini', en: 'Current RR' },
    'calc.ratingPoints': { id: 'Rating Points (RR)', en: 'Rating Points (RR)' },

    // Add-ons
    'addon.title': { id: 'Add-ons', en: 'Add-ons' },
    'addon.offline.name': { id: 'Offline Mode', en: 'Offline Mode' },
    'addon.offline.desc': { id: 'Akun akan di-set offline selama proses', en: 'Account will be set offline during process' },
    'addon.offline.price': { id: '+Rp 15.000', en: '+Rp 15,000' },
    'addon.agent.name': { id: 'Request Agent', en: 'Request Agent' },
    'addon.agent.desc': { id: 'Pilih agent tertentu untuk digunakan (Gratis dibawah Immortal)', en: 'Choose a specific agent to use (Free below Immortal)' },
    'addon.agent.price': { id: 'Gratis', en: 'Free' },
    'addon.agent.price.free': { id: 'Gratis', en: 'Free' },
    'addon.agent.price.paid': { id: '+25%', en: '+25%' },
    'addon.priority.name': { id: 'Prioritas', en: 'Priority' },
    'addon.priority.desc': { id: 'Pengerjaan diprioritaskan lebih dulu', en: 'Your order gets top priority' },
    'addon.priority.price': { id: '+25%', en: '+25%' },

    // Price Display
    'price.label': { id: 'Total Estimasi Harga', en: 'Total Estimated Price' },
    'price.note': { id: '*Harga dapat berubah sesuai kondisi', en: '*Price may vary depending on conditions' },
    'price.order': { id: 'Order via WhatsApp', en: 'Order via WhatsApp' },
    'calc.safe': { id: '100% Aman', en: '100% Safe' },
    'calc.fast': { id: 'Proses Cepat', en: 'Fast Process' },
    'calc.guarantee': { id: 'Garansi Rank', en: 'Rank Guarantee' },

    // Duo Boost
    'duo.rankLabel': { id: 'Rank Saat Ini', en: 'Current Rank' },
    'duo.winLabel': { id: 'Jumlah Win', en: 'Number of Wins' },
    'duo.priceLabel': { id: 'Total Harga Joki Gendong', en: 'Total Duo Boost Carry Price' },
    'duo.priceNote': { id: '*Harga per win, garansi kalah diganti win', en: '*Price per win, losses are replaced with wins' },
    'duo.order': { id: 'Order Gendong via WhatsApp', en: 'Order Duo Boost via WhatsApp' },
    'duo.subtab.perwin': { id: 'Per Win', en: 'Per Win' },
    'duo.subtab.perrank': { id: 'Per Rank', en: 'Per Rank' },
    'duo.perrank.from': { id: 'Rank Saat Ini', en: 'Current Rank' },
    'duo.perrank.to': { id: 'Rank Tujuan', en: 'Target Rank' },
    'duo.perrank.priceLabel': { id: 'Total Harga Gendong Per Rank', en: 'Total Duo Carry Per Rank Price' },
    'duo.perrank.priceNote': { id: '*Harga 2x joki reguler, main bareng booster', en: '*Price is 2x regular boost, play together with booster' },
    'duo.perrank.order': { id: 'Order Gendong via WhatsApp', en: 'Order Duo Carry via WhatsApp' },

    // --- Services Section ---
    'svc.badge': { id: 'Layanan Kami', en: 'Our Services' },
    'svc.title': { id: 'Jasa <span class="gradient-text">Naik Rank</span> Profesional', en: 'Professional <span class="gradient-text">Rank Up</span> Service' },
    'svc.description': { id: 'Tingkatkan rank Valorant kamu dengan bantuan expert player berpengalaman', en: 'Boost your Valorant rank with the help of experienced expert players' },

    // Card Reguler
    'svc.reguler.badge': { id: 'Layanan Utama', en: 'Main Service' },
    'svc.reguler.title': { id: 'Joki Reguler', en: 'Regular Boost' },
    'svc.reguler.desc': { id: 'Player profesional akan menaikkan rank akun kamu ke tujuan yang diinginkan. Biaya dihitung per rank.', en: 'A professional player will boost your account rank to the desired target. Price calculated per rank.' },
    'svc.reguler.f1': { id: 'Harga per rank / divisi', en: 'Price per rank / division' },
    'svc.reguler.f2': { id: '100% Aman & Terpercaya', en: '100% Safe & Trusted' },
    'svc.reguler.f3': { id: 'Offline Mode (+15k)', en: 'Offline Mode (+15k)' },
    'svc.reguler.f4': { id: 'Request Agent', en: 'Request Agent' },
    'svc.reguler.f5': { id: 'Garansi Rank & Support 24/7', en: 'Rank Guarantee & 24/7 Support' },
    'svc.reguler.btn': { id: 'Hitung Harga Sekarang', en: 'Calculate Price Now' },

    // Card Mabar
    'svc.mabar.badge': { id: 'Baru!', en: 'New!' },
    'svc.mabar.title': { id: 'Joki Gendong / Carry', en: 'Duo Boost Carry' },
    'svc.mabar.desc': { id: 'Main bareng dengan expert player! Kamu tetap main di akun sendiri, didampingi booster. Biaya per win.', en: 'Play together with an expert player! You play on your own account, accompanied by a booster. Price per win.' },
    'svc.mabar.f1': { id: 'Harga per win', en: 'Price per win' },
    'svc.mabar.f2': { id: 'Main di akun sendiri', en: 'Play on your own account' },
    'svc.mabar.f3': { id: 'Didampingi booster expert', en: 'Accompanied by expert booster' },
    'svc.mabar.f4': { id: 'Garansi: kalah diganti win', en: 'Guarantee: losses replaced with wins' },
    'svc.mabar.f5': { id: 'Support 24/7', en: 'Support 24/7' },
    'svc.mabar.btn': { id: 'Hitung Harga Gendong', en: 'Calculate Duo Price' },

    // --- Why Us Section ---
    'why.badge': { id: 'Mengapa Kami', en: 'Why Us' },
    'why.title': { id: 'Kenapa Pilih <span class="gradient-text">BengkelValo</span>?', en: 'Why Choose <span class="gradient-text">BengkelValo</span>?' },
    'why.description': { id: 'Kami berkomitmen memberikan layanan terbaik untuk kamu', en: 'We are committed to providing the best service for you' },
    'why.fast.title': { id: 'Proses Cepat', en: 'Fast Process' },
    'why.fast.desc': { id: 'Pengerjaan rank up cepat dengan estimasi waktu yang jelas', en: 'Fast rank up with clear time estimates' },
    'why.safe.title': { id: '100% Aman', en: '100% Safe' },
    'why.safe.desc': { id: 'Keamanan akun terjamin dengan metode aman dan terpercaya', en: 'Account security guaranteed with safe and trusted methods' },
    'why.support.title': { id: '24/7 Support', en: '24/7 Support' },
    'why.support.desc': { id: 'Tim support siap membantu kapanpun kamu butuhkan', en: 'Support team ready to help whenever you need' },
    'why.expert.title': { id: 'Expert Player', en: 'Expert Player' },
    'why.expert.desc': { id: 'Player berpengalaman dengan rank tinggi dan skill mumpuni', en: 'Experienced players with high rank and top skills' },
    'why.price.title': { id: 'Harga Terjangkau', en: 'Affordable Price' },
    'why.price.desc': { id: 'Harga kompetitif dengan kualitas layanan premium', en: 'Competitive prices with premium service quality' },
    'why.guarantee.title': { id: 'Garansi Rank', en: 'Rank Guarantee' },
    'why.guarantee.desc': { id: 'Garansi rank tercapai atau uang kembali', en: 'Rank guarantee or money back' },

    // --- CTA Section ---
    'cta.title': { id: 'Siap Naik Rank?', en: 'Ready to Rank Up?' },
    'cta.description': { id: 'Jangan tunggu lagi! Hubungi kami sekarang dan raih rank impianmu bersama BengkelValo. Proses cepat, aman, dan terpercaya.', en: "Don't wait any longer! Contact us now and achieve your dream rank with BengkelValo. Fast, safe, and trusted." },
    'cta.wa': { id: 'Chat WhatsApp', en: 'Chat WhatsApp' },
    'cta.discord': { id: 'Join Discord', en: 'Join Discord' },

    // --- Footer ---
    'footer.desc': { id: 'Layanan naik rank Valorant terpercaya dan profesional di Indonesia.', en: 'Trusted and professional Valorant rank up service in Indonesia.' },
    'footer.services': { id: 'Layanan', en: 'Services' },
    'footer.rankUp': { id: 'Rank Up Service', en: 'Rank Up Service' },
    'footer.priceCalc': { id: 'Kalkulator Harga', en: 'Price Calculator' },
    'footer.links': { id: 'Link', en: 'Links' },
    'footer.whyUs': { id: 'Mengapa Kami', en: 'Why Us' },
    'footer.legal': { id: 'Legal', en: 'Legal' },
    'footer.tos': { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
    'footer.privacy': { id: 'Kebijakan Privasi', en: 'Privacy Policy' },
    'footer.disclaimer': { id: 'BengkelValo tidak berafiliasi dengan Riot Games.', en: 'BengkelValo is not affiliated with Riot Games.' },

    // --- Accessibility ---
    'a11y.skip': { id: 'Langsung ke konten utama', en: 'Skip to main content' },
    'a11y.menuOpen': { id: 'Buka menu navigasi', en: 'Open navigation menu' },

    // --- FAQ Section ---
    'faq.badge': { id: 'FAQ', en: 'FAQ' },
    'faq.title': { id: 'Pertanyaan yang \u003cspan class="gradient-text"\u003eSering Ditanyakan\u003c/span\u003e', en: 'Frequently \u003cspan class="gradient-text"\u003eAsked Questions\u003c/span\u003e' },
    'faq.description': { id: 'Temukan jawaban untuk pertanyaan umum seputar layanan kami', en: 'Find answers to common questions about our services' },

    'faq.q1': { id: 'Apakah akun saya aman?', en: 'Is my account safe?' },
    'faq.a1': { id: 'Booster kami tidak menggunakan program ilegal apapun, sehingga akun kamu tetap aman. Perlu diketahui bahwa terkadang Riot Games mewajibkan pengaktifan pengaturan HVCI atau IOMMU karena mendeteksi perubahan statistik yang mendadak — ini adalah hal yang normal dan tersedia banyak panduan troubleshooting-nya.', en: 'Our boosters do not use any illegal programs, so your account remains safe. Please note that sometimes Riot Games may require you to enable HVCI or IOMMU settings due to sudden changes in statistics — this is completely normal and there are plenty of troubleshooting guides available.' },

    'faq.q2': { id: 'Berapa lama proses boosting?', en: 'How long does the boosting process take?' },
    'faq.a2': { id: 'Durasi bervariasi tergantung rank: di bawah Gold biasanya selesai dalam 24 jam, Gold hingga Ascendant sekitar 3 hari, dan Immortal ke atas maksimal 7 hari. Kami selalu berupaya menyelesaikan secepat mungkin sesuai ketersediaan booster. Gunakan add-on Prioritas (khusus Joki Reguler) untuk pengerjaan lebih cepat.', en: 'Duration varies by rank: below Gold typically completes within 24 hours, Gold to Ascendant takes about 3 days, and Immortal and above takes up to 7 days maximum. We always strive to finish as quickly as possible based on booster availability. Use the Priority add-on (Regular Boost only) for faster processing.' },

    'faq.q3': { id: 'Bagaimana cara melakukan pemesanan?', en: 'How do I place an order?' },
    'faq.a3': { id: 'Hubungi kami via WhatsApp atau Discord. Setelah pembayaran dikonfirmasi, kami akan meminta detail akun (untuk Joki Reguler) atau mengatur jadwal yang disepakati bersama (untuk Joki Gendong).', en: 'Contact us via WhatsApp or Discord. After payment is confirmed, we will request your account details (for Regular Boost) or arrange a mutually agreed schedule (for Duo Boost Carry).' },

    'faq.q4': { id: 'Metode pembayaran apa saja yang tersedia?', en: 'What payment methods are available?' },
    'faq.a4': { id: 'Saat ini kami menerima pembayaran melalui QRIS, Dana, GoPay, OVO, dan Transfer Bank Indonesia. QRIS juga dapat digunakan dari beberapa negara seperti Singapura, Malaysia, Thailand, Filipina, Vietnam, Jepang, Laos, dan Brunei melalui integrasi QR lintas negara.', en: 'We currently accept payments via QRIS, Dana, GoPay, OVO, and Indonesian Bank Transfer. QRIS can also be used from several countries including Singapore, Malaysia, Thailand, Philippines, Vietnam, Japan, Laos, and Brunei through cross-border QR integration.' },

    'faq.q5': { id: 'Apakah bisa request agent/booster tertentu?', en: 'Can I request a specific agent/booster?' },
    'faq.a5': { id: 'Ya, request agent adalah fitur gratis. Namun ketersediaan booster terbatas, sehingga kami tidak dapat menjamin booster tertentu selalu tersedia untuk mengerjakan order kamu.', en: 'Yes, requesting a specific agent is a free feature. However, booster availability is limited, so we cannot guarantee that a specific booster will always be available for your order.' },

    'faq.q6': { id: 'Apa bedanya Joki Reguler dan Joki Gendong?', en: 'What is the difference between Regular Boost and Duo Boost Carry?' },
    'faq.a6': { id: 'Joki Reguler: booster bermain menggunakan akunmu secara langsung — lebih cepat dengan harga lebih terjangkau. Joki Gendong: booster bermain bersamamu dalam satu party — kamu tetap bermain di akun sendiri, lebih seru, dengan harga 2x lipat dari reguler.', en: 'Regular Boost: the booster plays directly on your account — faster with a more affordable price. Duo Boost Carry: the booster plays together with you in a party — you keep playing on your own account, more fun, at 2x the regular price.' },

    'faq.q7': { id: 'Apakah saya bisa memantau progress boosting?', en: 'Can I track the boosting progress?' },
    'faq.a7': { id: 'Tentu! Hubungi kami via WhatsApp atau Discord kapan saja untuk menanyakan progress boosting yang sedang berlangsung.', en: 'Of course! Contact us via WhatsApp or Discord anytime to ask about your ongoing boosting progress.' },

    // --- Payment Methods Section ---
    'payment.badge': { id: 'Pembayaran', en: 'Payment' },
    'payment.title': { id: 'Metode \u003cspan class="gradient-text"\u003ePembayaran\u003c/span\u003e', en: 'Payment \u003cspan class="gradient-text"\u003eMethods\u003c/span\u003e' },
    'payment.description': { id: 'Kami menerima berbagai metode pembayaran untuk kemudahan transaksi', en: 'We accept various payment methods for your convenience' },
}

// Typewriter words per language
export const typewriterWords = {
    id: ['profesional !', 'cepat !', 'aman !', 'terpercaya !'],
    en: ['professional !', 'fast !', 'safe !', 'trusted !']
}

// WA message templates
export const waMessages = {
    id: {
        regulerGreeting: 'Halo BengkelValo, saya ingin order boosting (Joki Reguler):',
        duoGreeting: 'Halo BengkelValo, saya ingin order Joki Gendong:',
        from: 'Dari',
        to: 'Ke',
        rank: 'Rank',
        winsCount: 'Jumlah Win',
        pricePerWin: 'Harga per win',
        total: 'Total',
        estimate: 'Estimasi',
        addons: 'Add-ons',
        offlineMode: 'Offline Mode (+Rp 15.000)',
        requestAgent: 'Request Agent',
        priority: 'Prioritas (+25%)',
        closing: 'Mohon informasi lebih lanjut. Terima kasih!',
    },
    en: {
        regulerGreeting: 'Hi BengkelValo, I want to order boosting (Regular Boost):',
        duoGreeting: 'Hi BengkelValo, I want to order Duo Boost Carry:',
        from: 'From',
        to: 'To',
        rank: 'Rank',
        winsCount: 'Number of Wins',
        pricePerWin: 'Price per win',
        total: 'Total',
        estimate: 'Estimate',
        addons: 'Add-ons',
        offlineMode: 'Offline Mode (+Rp 15,000)',
        requestAgent: 'Request Agent',
        priority: 'Priority (+25%)',
        closing: 'Please let me know more details. Thank you!',
    }
}

// Dynamic text templates
export const dynamicText = {
    id: {
        rrInfo: (fromLabel, toLabel) => `RR Awal: ${fromLabel} → RR Akhir: akan sampai ke ${toLabel}`,
        discountBadge: (percent) => `💰 Hemat ${percent}%`,
        duoPricePerGame: (price, games) => `Rp ${price} × ${games} win`,
        division: (num) => `Division ${num}`,
        perWin: (price) => `Rp ${price} / win`,
    },
    en: {
        rrInfo: (fromLabel, toLabel) => `Starting RR: ${fromLabel} → Target RR: will reach ${toLabel}`,
        discountBadge: (percent) => `💰 Save ${percent}%`,
        duoPricePerGame: (price, games) => `Rp ${price} × ${games} win(s)`,
        division: (num) => `Division ${num}`,
        perWin: (price) => `Rp ${price} / win`,
    }
}

// Current language
let currentLang = 'id'

/**
 * Get the current language
 */
export function getLang() {
    return currentLang
}

/**
 * Initialize language from localStorage or browser detection
 */
export function initLang() {
    const saved = localStorage.getItem('bengkelvalo-lang')
    if (saved && (saved === 'id' || saved === 'en')) {
        currentLang = saved
    } else {
        // Auto-detect from browser language
        currentLang = navigator.language.startsWith('id') ? 'id' : 'en'
    }
    applyTranslations()
    updateToggleButton()
    return currentLang
}

/**
 * Toggle between languages
 */
export function toggleLang() {
    currentLang = currentLang === 'id' ? 'en' : 'id'
    localStorage.setItem('bengkelvalo-lang', currentLang)
    applyTranslations()
    updateToggleButton()
    // Dispatch event so other modules can react
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }))
}

/**
 * Apply all translations to DOM elements with data-i18n attribute
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n')
        const t = translations[key]
        if (t) {
            // Check if translation contains HTML (spans etc.)
            if (t[currentLang].includes('<')) {
                el.innerHTML = t[currentLang]
            } else {
                el.textContent = t[currentLang]
            }
        }
    })
    // Update html lang attribute
    document.documentElement.lang = currentLang
}

/**
 * Update the toggle button visual
 */
function updateToggleButton() {
    const code = document.getElementById('lang-code')
    if (code) code.textContent = currentLang === 'id' ? 'ID' : 'EN'
    // Update active option
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang)
    })
}

/**
 * Get a specific translation string
 */
export function t(key) {
    const entry = translations[key]
    return entry ? entry[currentLang] : key
}
