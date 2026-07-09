# BengkelValo

Situs jasa joki Valorant — [bengkelvalo.com](https://bengkelvalo.com). Dibangun dengan [Astro](https://astro.build) (HTML statis, JavaScript hanya untuk kalkulator harga).

## Perintah

```bash
npm install      # install dependency
npm run dev      # dev server di http://localhost:4321
npm run build    # build produksi ke dist/
npm run preview  # preview hasil build
```

## Deploy ke Vercel (gratis)

Cara termudah — lewat GitHub:

1. Push repo ini ke GitHub.
2. Buka [vercel.com/new](https://vercel.com/new), login, lalu **Import** repo-nya.
3. Vercel otomatis mendeteksi Astro — tidak perlu mengubah setting apa pun. Klik **Deploy**.
4. Setelah live, tambahkan custom domain `bengkelvalo.com` di **Project → Settings → Domains**, lalu arahkan DNS domain (A record `76.76.21.21` atau CNAME `cname.vercel-dns.com`) sesuai instruksi Vercel.

Alternatif via CLI: `npm i -g vercel` lalu jalankan `vercel` di folder ini.

`vercel.json` sudah mengatur: clean URLs, trailing slash konsisten, redirect 301 dari URL lama (`/tos.html` → `/tos/`), dan cache immutable untuk aset.

## Struktur

```
src/
  data/pricing.js     # SATU sumber data harga — dipakai kalkulator & tabel harga statis
  data/i18n.js        # kamus teks ID/EN
  scripts/main.js     # kalkulator harga (client-side)
  layouts/            # Base (head SEO lengkap) & Legal
  components/         # Hero, Calculator, PriceTable, Services, CaraOrder, WhyUs, Safety, Cta, Payments, Faq, SeoArticle, Nav, Footer
  pages/              # / (ID), /en/ (EN), /harga-joki-valorant, /tos, /privacy
  styles/global.css   # design system (Valorant-style)
public/               # gambar, favicon, robots.txt, og-image
```

## Catatan penting

- **Mengubah harga**: edit `src/data/pricing.js` — kalkulator DAN tabel harga statis ikut berubah otomatis saat build.
- **Bahasa**: halaman ID dan EN adalah URL terpisah (`/` dan `/en/`) dengan hreflang — keduanya terindeks Google. Tidak ada lagi ganti bahasa via JavaScript.
- **Analytics**: GA4 (`G-7SL63XWHB6`) berjalan lewat Partytown (web worker) supaya tidak membebani main thread. Tag Google Ads sudah dicabut.
- **Sitemap** dibuat otomatis saat build (`/sitemap-index.xml`), sudah dirujuk dari `robots.txt`.
