// Buat thumbnail 96x96 untuk ikon rank (dipakai di dropdown kalkulator yang
// hanya menampilkan 40-60px — file asli terlalu besar untuk ukuran itu).
// Jalankan sekali: node scripts/make-thumbs.mjs (hasil di-commit).

import sharp from 'sharp'
import { mkdirSync, readdirSync, statSync } from 'fs'

mkdirSync('public/assets/thumbs', { recursive: true })

const ranks = readdirSync('public/assets').filter((f) => /^\d - .*\.webp$/.test(f))

for (const f of ranks) {
    const out = `public/assets/thumbs/${f}`
    await sharp(`public/assets/${f}`)
        .resize(96, 96, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(out)
    console.log(`✓ ${out} (${statSync(out).size} bytes)`)
}
