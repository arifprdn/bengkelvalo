// Generator grafik harga joki Valorant untuk halaman riset data terbuka —
// brand look sama dengan scripts/make-og.mjs. Kredit dibakar langsung ke
// piksel gambar agar bertahan saat di-screenshot atau di-embed ulang.
// Jalankan dari root project: npm run chart  →  hasil di
// public/assets/riset/chart-harga-joki-valorant-2026.png
// Sumber data: public/data/survei-harga-joki-valorant-2026.csv

import sharp from 'sharp'
import { mkdirSync, readFileSync } from 'fs'

const CSV_PATH = 'public/data/survei-harga-joki-valorant-2026.csv'
const OUT_DIR = 'public/assets/riset'
const OUT_PATH = `${OUT_DIR}/chart-harga-joki-valorant-2026.png`

const NAVY = '#0f1923'
const NAVY2 = '#16222e'
const RED = '#ff4655'
const BONE = '#ece8e1'
const MUTED = '#8a94a0'

const W = 1200
const H = 900

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---------- read + parse CSV (no quoted commas in this dataset) ----------
const csvRaw = readFileSync(CSV_PATH, 'utf8').trim()
const [headerLine, ...lines] = csvRaw.split(/\r?\n/)
const headers = headerLine.split(',')
const rows = lines.map((line) => {
    const cols = line.split(',')
    const rec = {}
    headers.forEach((h, i) => { rec[h.trim()] = cols[i] })
    return {
        rank: rec.rank,
        low: Number(rec.harga_pasar_terendah_idr),
        high: Number(rec.harga_pasar_tertinggi_idr),
        unit: rec.satuan,
    }
})

// ---------- formatting helpers ----------
const fmtRupiah = (n) => 'Rp' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const fmtCompact = (n) => {
    if (n >= 1_000_000) {
        const v = n / 1_000_000
        return `${Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')} jt`
    }
    return `${Math.round(n / 1000)} rb`
}

// ---------- log scale ----------
const DOMAIN_MIN = 5000
// Beri ruang di kanan titik termahal (Rp3,53 jt) agar label harganya tidak terpotong tepi kanvas
const DOMAIN_MAX = 6_000_000
const logMin = Math.log10(DOMAIN_MIN)
const logMax = Math.log10(DOMAIN_MAX)

const CHART_LEFT = 300
const CHART_RIGHT = 1140
const CHART_TOP = 150
const CHART_BOTTOM = 750
const CHART_WIDTH = CHART_RIGHT - CHART_LEFT

const xScale = (v) => CHART_LEFT + ((Math.log10(v) - logMin) / (logMax - logMin)) * CHART_WIDTH

const GRIDLINES = [10000, 30000, 100000, 300000, 1000000, 3000000]

function chartSvg() {
    const rowHeight = (CHART_BOTTOM - CHART_TOP) / rows.length

    const zebra = rows.map((_, i) => {
        if (i % 2 === 0) return ''
        const y = CHART_TOP + rowHeight * i
        return `<rect x="0" y="${y.toFixed(1)}" width="${W}" height="${rowHeight.toFixed(1)}" fill="${NAVY2}" opacity="0.5"/>`
    }).join('')

    const grid = GRIDLINES.map((v) => {
        const x = xScale(v)
        return `
        <line x1="${x.toFixed(1)}" y1="${CHART_TOP}" x2="${x.toFixed(1)}" y2="${CHART_BOTTOM}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="2 5" opacity="0.35"/>
        <text x="${x.toFixed(1)}" y="${CHART_BOTTOM + 26}" font-family="Arial" font-size="13" fill="${MUTED}" text-anchor="middle">${esc(fmtCompact(v))}</text>`
    }).join('')

    const dataRows = rows.map((r, i) => {
        const centerY = CHART_TOP + rowHeight * (i + 0.5)
        const x1 = xScale(r.low)
        const x2 = xScale(r.high)
        const labelY = centerY + 5

        return `
        <text x="${CHART_LEFT - 20}" y="${labelY - 6}" font-family="Arial Black, Arial" font-weight="900" font-size="17" fill="${BONE}" text-anchor="end">${esc(r.rank)}</text>
        <text x="${CHART_LEFT - 20}" y="${labelY + 12}" font-family="Arial" font-size="11" fill="${MUTED}" text-anchor="end">${esc(r.unit)}</text>

        <line x1="${x1.toFixed(1)}" y1="${centerY.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${centerY.toFixed(1)}" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${x1.toFixed(1)}" cy="${centerY.toFixed(1)}" r="8" fill="${NAVY}" stroke="${RED}" stroke-width="3"/>
        <circle cx="${x2.toFixed(1)}" cy="${centerY.toFixed(1)}" r="8" fill="${RED}"/>

        <text x="${(x1 - 16).toFixed(1)}" y="${labelY.toFixed(1)}" font-family="Arial" font-weight="bold" font-size="14" fill="${BONE}" text-anchor="end">${esc(fmtRupiah(r.low))}</text>
        <text x="${(x2 + 16).toFixed(1)}" y="${labelY.toFixed(1)}" font-family="Arial" font-weight="bold" font-size="14" fill="${BONE}" text-anchor="start">${esc(fmtRupiah(r.high))}</text>`
    }).join('')

    const creditY = H - 34
    const creditText = 'Sumber: BengkelValo — bengkelvalo.com/riset/harga-joki-valorant-2026 · Lisensi CC BY 4.0'

    return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${NAVY}"/>
      <rect x="0" y="0" width="${W}" height="8" fill="${RED}"/>

      <!-- corner-cut motif, top-right -->
      <polygon points="${W - 140},0 ${W},0 ${W},140" fill="${NAVY2}"/>
      <line x1="${W - 140}" y1="0" x2="${W}" y2="140" stroke="${RED}" stroke-width="3"/>

      <text x="60" y="64" font-family="Arial Black, Arial" font-weight="900" font-size="34" fill="${BONE}">Survei Harga Joki Valorant Indonesia 2026</text>
      <text x="60" y="94" font-family="Arial" font-size="17" fill="${MUTED}">Rentang harga termurah–termahal per rank, survei Juli 2026 (Rupiah, skala logaritmik)</text>

      <!-- legend -->
      <circle cx="${CHART_RIGHT - 190}" cy="112" r="7" fill="${NAVY}" stroke="${RED}" stroke-width="3"/>
      <text x="${CHART_RIGHT - 175}" y="117" font-family="Arial" font-size="13" fill="${BONE}">Termurah</text>
      <circle cx="${CHART_RIGHT - 90}" cy="112" r="7" fill="${RED}"/>
      <text x="${CHART_RIGHT - 75}" y="117" font-family="Arial" font-size="13" fill="${BONE}">Termahal</text>

      ${zebra}
      ${grid}
      ${dataRows}

      <line x1="${CHART_LEFT}" y1="${CHART_BOTTOM}" x2="${CHART_RIGHT}" y2="${CHART_BOTTOM}" stroke="${MUTED}" stroke-width="1" opacity="0.5"/>

      <text x="60" y="${CHART_BOTTOM + 60}" font-family="Arial" font-size="12" font-style="italic" fill="${MUTED}">Skala sumbu bersifat logaritmik agar rentang Iron sampai paket Immortal→Radiant sama-sama terbaca.</text>

      <rect x="0" y="${H - 60}" width="${W}" height="60" fill="${NAVY2}"/>
      <rect x="0" y="${H - 60}" width="${W}" height="3" fill="${RED}"/>
      <rect x="60" y="${creditY - 14}" width="8" height="20" fill="${RED}"/>
      <text x="82" y="${creditY + 1}" font-family="Arial" font-weight="bold" font-size="16" fill="${BONE}">${esc(creditText)}</text>

      <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${RED}"/>
    </svg>`
}

mkdirSync(OUT_DIR, { recursive: true })
const svg = chartSvg()
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT_PATH)
console.log(`✓ ${OUT_PATH} (${W}x${H})`)
