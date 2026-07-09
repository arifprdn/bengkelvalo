// Cek Pesanan — looks up an order code in a published Google Sheet (CSV).
// Sheet columns (row 1 header): kode,status,layanan,rank_awal,rank_tujuan,catatan,update
// The sheet URL is configured in src/data/config.js and injected via data-sheet.

const STATUSES = ['Menunggu Pembayaran', 'Dalam Antrian', 'Dikerjakan', 'Selesai']

// Minimal CSV parser that handles quoted fields ("a,b") and CRLF
function parseCsv(text) {
    const rows = []
    let row = [], field = '', inQuotes = false
    for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++ }
                else inQuotes = false
            } else field += c
        } else if (c === '"') {
            inQuotes = true
        } else if (c === ',') {
            row.push(field); field = ''
        } else if (c === '\n') {
            row.push(field); field = ''
            if (row.some(v => v.trim() !== '')) rows.push(row)
            row = []
        } else if (c !== '\r') {
            field += c
        }
    }
    row.push(field)
    if (row.some(v => v.trim() !== '')) rows.push(row)
    return rows
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('track-form')
    if (!form) return

    const sheetUrl = form.dataset.sheet
    const codeInput = document.getElementById('track-code')
    const result = document.getElementById('track-result')
    const detail = document.getElementById('track-detail')
    const message = document.getElementById('track-message')
    const steps = document.querySelectorAll('.track-step')

    const showMessage = (text) => {
        result.hidden = true
        message.textContent = text
        message.hidden = false
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const code = codeInput.value.trim().toUpperCase()
        if (!code) return

        if (!sheetUrl) {
            showMessage('Fitur lacak online sedang disiapkan — untuk saat ini silakan cek status via tombol WhatsApp di bawah, sebutkan kode ordermu.')
            return
        }

        showMessage('Mencari pesanan…')
        try {
            const res = await fetch(sheetUrl, { cache: 'no-store' })
            if (!res.ok) throw new Error('fetch failed')
            const rows = parseCsv(await res.text())
            const header = rows[0].map(h => h.trim().toLowerCase())
            const idx = (name) => header.indexOf(name)
            const found = rows.slice(1).find(r => (r[idx('kode')] || '').trim().toUpperCase() === code)

            if (!found) {
                showMessage(`Kode "${code}" tidak ditemukan. Pastikan penulisannya sama persis dengan yang dikirim via WhatsApp.`)
                return
            }

            const get = (name) => (found[idx(name)] || '').trim()
            const status = get('status')
            const activeIndex = STATUSES.findIndex(s => s.toLowerCase() === status.toLowerCase())

            steps.forEach((el, i) => {
                el.classList.toggle('done', activeIndex >= 0 && i <= activeIndex)
                el.classList.toggle('current', i === activeIndex)
            })

            const fields = [
                ['Layanan', get('layanan')],
                ['Rank Awal', get('rank_awal')],
                ['Rank Tujuan', get('rank_tujuan')],
                ['Progres', get('catatan')],
                ['Update Terakhir', get('update')],
            ].filter(([, v]) => v)

            detail.innerHTML = fields
                .map(([k, v]) => `<div class="track-row"><dt>${k}</dt><dd>${v.replace(/</g, '&lt;')}</dd></div>`)
                .join('')

            message.hidden = true
            result.hidden = false
        } catch (_) {
            showMessage('Gagal memuat data pesanan. Coba lagi sebentar, atau cek langsung via WhatsApp.')
        }
    })
})
