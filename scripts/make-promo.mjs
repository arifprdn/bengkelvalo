// Generator gambar promo bermerek — SELALU sinkron dengan src/data/pricing.js.
// Jalankan: npm run promo  →  hasil di folder marketing/
// Dipakai untuk: post grup Facebook, feed IG, katalog WhatsApp Business.

import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { ranks, duoBoostRanks, DISCOUNT_TIERS } from '../src/data/pricing.js'

const OUT = 'marketing'
mkdirSync(OUT, { recursive: true })

const NAVY = '#0f1923'
const NAVY2 = '#16222e'
const RED = '#ff4655'
const BONE = '#ece8e1'
const MUTED = '#8a94a0'

const fmt = (n) => n.toLocaleString('id-ID')
const priceRange = (v) => Array.isArray(v) ? `${fmt(Math.min(...v))} – ${fmt(Math.max(...v))}` : fmt(v)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// ---------- 1. Price list 1080x1350 (feed IG / post FB) ----------
function priceListSvg() {
    const rows = ranks.map((r) => {
        const duo = duoBoostRanks.find((d) => d.id === r.id)
        return {
            name: r.name.toUpperCase(),
            reg: r.usesRR ? `Rp ${priceRange(r.pricePerRR)} /RR` : `Rp ${priceRange(r.pricePerDivision)} /divisi`,
            duo: `Rp ${priceRange(duo.pricePerWin)} /win`,
        }
    })

    const rowH = 82
    const tableY = 330
    const rowsSvg = rows.map((r, i) => {
        const y = tableY + i * rowH
        const bg = i % 2 === 0 ? NAVY2 : NAVY
        return `
        <rect x="60" y="${y}" width="960" height="${rowH}" fill="${bg}"/>
        <text x="90" y="${y + 52}" font-family="Arial Black, Arial" font-weight="900" font-size="30" fill="${BONE}">${r.name}</text>
        <text x="380" y="${y + 52}" font-family="Arial" font-size="27" fill="${BONE}">${esc(r.reg)}</text>
        <text x="730" y="${y + 52}" font-family="Arial" font-size="25" fill="${MUTED}">${esc(r.duo)}</text>`
    }).join('')

    return `<svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
      <rect width="1080" height="1350" fill="${NAVY}"/>
      <rect x="0" y="0" width="1080" height="10" fill="${RED}"/>
      <text x="60" y="120" font-family="Arial Black, Arial" font-weight="900" font-size="34" fill="${RED}" letter-spacing="6">// PRICE LIST 2026</text>
      <text x="60" y="205" font-family="Arial Black, Arial" font-weight="900" font-size="64" fill="${BONE}">HARGA JOKI</text>
      <text x="60" y="280" font-family="Arial Black, Arial" font-weight="900" font-size="64" fill="${RED}">VALORANT</text>
      <text x="380" y="${tableY - 14}" font-family="Arial" font-weight="bold" font-size="24" fill="${RED}">JOKI REGULER</text>
      <text x="730" y="${tableY - 14}" font-family="Arial" font-weight="bold" font-size="24" fill="${MUTED}">GENDONG/WIN</text>
      ${rowsSvg}
      <text x="60" y="${tableY + rows.length * rowH + 60}" font-family="Arial" font-size="28" fill="${BONE}">Diskon otomatis ${DISCOUNT_TIERS[1].discount * 100}% &gt; Rp ${fmt(DISCOUNT_TIERS[1].minPrice)}  ·  ${DISCOUNT_TIERS[0].discount * 100}% &gt; Rp ${fmt(DISCOUNT_TIERS[0].minPrice)}</text>
      <text x="60" y="${tableY + rows.length * rowH + 105}" font-family="Arial" font-size="28" fill="${MUTED}">Garansi rank · No cheat · Bisa offline mode · Online 24 jam</text>
      <rect x="60" y="1230" width="960" height="80" fill="${RED}"/>
      <text x="540" y="1282" font-family="Arial Black, Arial" font-weight="900" font-size="34" fill="${NAVY}" text-anchor="middle">BENGKELVALO.COM  ·  WA 0895-2415-0075</text>
    </svg>`
}

// ---------- 2. Kartu promo persegi 1080x1080 (feed/story crop) ----------
function promoCardSvg() {
    return `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="1080" height="1080" fill="${NAVY}"/>
      <rect x="0" y="0" width="1080" height="10" fill="${RED}"/>
      <rect x="0" y="1070" width="1080" height="10" fill="${RED}"/>
      <text x="540" y="300" font-family="Arial Black, Arial" font-weight="900" font-size="40" fill="${RED}" text-anchor="middle" letter-spacing="8">// JOKI VALORANT</text>
      <text x="540" y="430" font-family="Arial Black, Arial" font-weight="900" font-size="96" fill="${BONE}" text-anchor="middle">NAIK RANK</text>
      <text x="540" y="540" font-family="Arial Black, Arial" font-weight="900" font-size="96" fill="${RED}" text-anchor="middle">TANPA DRAMA</text>
      <text x="540" y="650" font-family="Arial" font-size="36" fill="${MUTED}" text-anchor="middle">Mulai Rp ${fmt(10000)} · Garansi Rank · Aman No Cheat</text>
      <text x="540" y="710" font-family="Arial" font-size="36" fill="${MUTED}" text-anchor="middle">Iron sampai Radiant · Bisa Duo Gendong</text>
      <rect x="240" y="820" width="600" height="90" fill="${RED}"/>
      <text x="540" y="878" font-family="Arial Black, Arial" font-weight="900" font-size="38" fill="${NAVY}" text-anchor="middle">BENGKELVALO.COM</text>
    </svg>`
}

// ---------- 3. Template kartu testimoni 1080x1080 (isi manual per order) ----------
function testiTemplateSvg() {
    return `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="1080" height="1080" fill="${NAVY}"/>
      <rect x="0" y="0" width="1080" height="10" fill="${RED}"/>
      <text x="60" y="130" font-family="Arial Black, Arial" font-weight="900" font-size="38" fill="${RED}" letter-spacing="6">// ORDER SELESAI</text>
      <rect x="60" y="200" width="960" height="560" fill="${NAVY2}" stroke="#2a3644" stroke-width="2"/>
      <text x="540" y="500" font-family="Arial" font-size="30" fill="${MUTED}" text-anchor="middle">[ tempel screenshot chat WA di area ini ]</text>
      <text x="60" y="850" font-family="Arial Black, Arial" font-weight="900" font-size="56" fill="${BONE}">SILVER 2 → GOLD 1</text>
      <text x="60" y="910" font-family="Arial" font-size="30" fill="${MUTED}">Joki Reguler · 2 hari · Juli 2026</text>
      <rect x="60" y="960" width="960" height="80" fill="${RED}"/>
      <text x="540" y="1012" font-family="Arial Black, Arial" font-weight="900" font-size="34" fill="${NAVY}" text-anchor="middle">BENGKELVALO.COM · JOKI VALORANT TERPERCAYA</text>
    </svg>`
}

const jobs = [
    ['promo-pricelist-1080x1350.png', priceListSvg()],
    ['promo-card-1080x1080.png', promoCardSvg()],
    ['template-testimoni-1080x1080.png', testiTemplateSvg()],
]

for (const [name, svg] of jobs) {
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${OUT}/${name}`)
    console.log(`✓ ${OUT}/${name}`)
}
console.log('Selesai. Gambar selalu sinkron dengan src/data/pricing.js — ubah harga lalu jalankan ulang `npm run promo`.')
