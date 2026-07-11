// Submit semua URL sitemap ke IndexNow (Bing, Yandex, Naver, Seznam, dll).
// Jalankan: npm run indexnow  — setelah publish/update konten, atau rutin tiap Senin.
// Key bersifat publik by design; kepemilikan dibuktikan file key di situs.

const HOST = 'bengkelvalo.com'
const KEY = '819f9dc208b9007f91ada8aae0157df9'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const SITEMAP = `https://${HOST}/sitemap-0.xml`

const res = await fetch(SITEMAP)
if (!res.ok) {
    console.error(`Gagal ambil sitemap (HTTP ${res.status}): ${SITEMAP}`)
    process.exit(1)
}
const xml = await res.text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim())

if (urls.length === 0) {
    console.error('Sitemap kosong — tidak ada yang disubmit.')
    process.exit(1)
}

console.log(`Submit ${urls.length} URL ke IndexNow:`)
urls.forEach((u) => console.log(`  - ${u}`))

const submit = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
})

// 200 = OK, 202 = diterima (key akan divalidasi menyusul)
if (submit.status === 200 || submit.status === 202) {
    console.log(`\n✓ Berhasil (HTTP ${submit.status}) — URL diteruskan ke semua mesin pencari peserta IndexNow.`)
} else {
    console.error(`\n✗ Gagal (HTTP ${submit.status}): ${await submit.text()}`)
    process.exit(1)
}
