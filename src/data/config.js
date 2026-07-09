// ==========================================
// Konfigurasi situs yang bisa diubah tanpa menyentuh kode lain.
// ==========================================

// URL CSV Google Sheet untuk fitur Cek Pesanan (/cek-pesanan).
// Cara setup (5 menit) — lihat PLAYBOOK.md bagian 4.2:
//   1. Buat Google Sheet, header baris 1: kode,status,layanan,rank_awal,rank_tujuan,catatan,update
//   2. File → Share → Publish to web → pilih sheet → CSV → Publish
//   3. Paste URL hasilnya di bawah ini (bentuknya: https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv)
// Selama masih kosong (''), halaman Cek Pesanan menampilkan fallback "hubungi WhatsApp".
export const ORDER_SHEET_CSV_URL = ''

export const WA_NUMBER = '6289524150075'
