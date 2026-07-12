// Cek link mati di semua halaman live bengkelvalo.com.
// Jalankan: npm run linkcheck  — rutin tiap Senin, atau setelah mengubah link.
// Daftar halaman diambil otomatis dari sitemap — halaman baru langsung ikut tercek.

const sitemapRes = await fetch('https://bengkelvalo.com/sitemap-0.xml')
if (!sitemapRes.ok) {
    console.error(`Gagal ambil sitemap (HTTP ${sitemapRes.status})`)
    process.exit(1)
}
const PAGES = [...(await sitemapRes.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())

// Domain yang memblokir bot/curl — dilewati (cek manual sesekali di browser)
const SKIP = [/^mailto:/, /^tel:/, /^javascript:/, /^data:/, /^#/, /instagram\.com/]
const OK_STATUS = new Set([200, 201, 202, 203, 204, 301, 302, 303, 307, 308])

const found = new Map() // url -> Set(halaman yang memuatnya)

for (const page of PAGES) {
    const res = await fetch(page)
    if (!res.ok) {
        console.error(`✗ HALAMAN GAGAL DIMUAT: ${page} (HTTP ${res.status})`)
        process.exitCode = 1
        continue
    }
    const html = await res.text()
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        let url = m[1]
        if (SKIP.some((re) => re.test(url))) continue
        if (url.startsWith('//')) url = 'https:' + url
        else if (url.startsWith('/')) url = 'https://bengkelvalo.com' + url
        else if (!url.startsWith('http')) continue
        // buang fragment untuk pengecekan HTTP
        const clean = url.split('#')[0]
        if (!clean) continue
        if (!found.has(clean)) found.set(clean, new Set())
        found.get(clean).add(page)
    }
}

console.log(`Mengecek ${found.size} URL unik dari ${PAGES.length} halaman...\n`)

const entries = [...found.entries()]
const broken = []

async function check(url) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 15000)
    try {
        const res = await fetch(url, {
            redirect: 'manual',
            signal: ctrl.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (linkcheck bengkelvalo)' },
        })
        if (!OK_STATUS.has(res.status) && res.status !== 429) {
            return `HTTP ${res.status}`
        }
        return null
    } catch (e) {
        return e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message)
    } finally {
        clearTimeout(timer)
    }
}

// concurrency sederhana: batch 8
for (let i = 0; i < entries.length; i += 8) {
    const batch = entries.slice(i, i + 8)
    const results = await Promise.all(batch.map(([url]) => check(url)))
    results.forEach((err, j) => {
        const [url, pages] = batch[j]
        if (err) {
            broken.push({ url, err, pages: [...pages] })
            console.log(`✗ ${url}  (${err})`)
        }
    })
    process.stdout.write(`\r${Math.min(i + 8, entries.length)}/${entries.length} dicek...`)
}

console.log('\n')
if (broken.length === 0) {
    console.log('✓ Semua link sehat.')
} else {
    console.log(`✗ ${broken.length} link bermasalah:`)
    for (const b of broken) {
        console.log(`  ${b.url} (${b.err})`)
        b.pages.forEach((p) => console.log(`      dimuat di: ${p}`))
    }
    process.exitCode = 1
}
