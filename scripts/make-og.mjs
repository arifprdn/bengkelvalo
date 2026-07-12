// Generator gambar Open Graph per-artikel blog — brand look sama dengan scripts/make-promo.mjs.
// Jalankan dari root project: npm run og  →  hasil di public/assets/og/<slug>.png
// Sumber data: src/data/blogPosts.js — tambah/ubah post di sana lalu jalankan ulang.

import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { blogPosts } from '../src/data/blogPosts.js'

const OUT = 'public/assets/og'
mkdirSync(OUT, { recursive: true })

const NAVY = '#0f1923'
const NAVY2 = '#16222e'
const RED = '#ff4655'
const BONE = '#ece8e1'
const MUTED = '#8a94a0'

const W = 1200
const H = 630

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Greedy word-wrap based on an estimated average character width for a bold
// display font (Arial Black). Never truncates — only wraps.
function wrapText(text, maxChars) {
    const words = text.split(' ')
    const lines = []
    let cur = ''
    for (const w of words) {
        const test = cur ? `${cur} ${w}` : w
        if (test.length <= maxChars || !cur) {
            cur = test
        } else {
            lines.push(cur)
            cur = w
        }
    }
    if (cur) lines.push(cur)
    return lines
}

// Pick the largest font size (within bounds) that fits the title in <= maxLines,
// shrinking gradually. If even the minimum size needs more lines, it still
// renders every line rather than cutting text.
function fitTitle(title, { maxWidthPx = 1040, maxLines = 3, maxFontSize = 60, minFontSize = 34, charWidthFactor = 0.62 } = {}) {
    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
        const maxChars = Math.floor(maxWidthPx / (fontSize * charWidthFactor))
        const lines = wrapText(title, maxChars)
        if (lines.length <= maxLines) return { fontSize, lines }
    }
    const maxChars = Math.floor(maxWidthPx / (minFontSize * charWidthFactor))
    return { fontSize: minFontSize, lines: wrapText(title, maxChars) }
}

function slugFromHref(href) {
    return href.split('/').filter(Boolean).pop()
}

function ogSvg(title) {
    const { fontSize, lines } = fitTitle(title)
    const lineHeight = Math.round(fontSize * 1.25)
    const blockHeight = lines.length * lineHeight
    const centerY = 325
    const startY = Math.round(centerY - blockHeight / 2 + fontSize * 0.8)

    const titleLines = lines.map((line, i) => {
        const y = startY + i * lineHeight
        return `<text x="80" y="${y}" font-family="Arial Black, Arial" font-weight="900" font-size="${fontSize}" fill="${BONE}">${esc(line)}</text>`
    }).join('')

    return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${NAVY}"/>
      <rect x="0" y="0" width="${W}" height="8" fill="${RED}"/>
      <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${RED}"/>

      <!-- corner-cut motif, top-right -->
      <polygon points="${W - 160},0 ${W},0 ${W},160" fill="${NAVY2}"/>
      <line x1="${W - 160}" y1="0" x2="${W}" y2="160" stroke="${RED}" stroke-width="3"/>

      <!-- corner-cut motif, bottom-left -->
      <polygon points="0,${H - 160} 0,${H} 160,${H}" fill="${NAVY2}"/>
      <line x1="0" y1="${H - 160}" x2="160" y2="${H}" stroke="${RED}" stroke-width="3"/>

      <text x="80" y="110" font-family="Arial Black, Arial" font-weight="900" font-size="26" fill="${RED}" letter-spacing="6">// BENGKELVALO BLOG</text>

      ${titleLines}

      <rect x="80" y="555" width="10" height="28" fill="${RED}"/>
      <text x="104" y="578" font-family="Arial" font-weight="bold" font-size="26" fill="${BONE}">bengkelvalo.com<tspan fill="${RED}">/blog</tspan></text>
    </svg>`
}

for (const post of blogPosts) {
    const slug = slugFromHref(post.href)
    const svg = ogSvg(post.title)
    const outPath = `${OUT}/${slug}.png`
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath)
    console.log(`✓ ${outPath}`)
}
console.log(`Selesai. ${blogPosts.length} gambar OG dibuat di ${OUT}/ — sinkron dengan src/data/blogPosts.js.`)
