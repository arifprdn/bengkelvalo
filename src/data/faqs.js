// ==========================================
// Satu sumber data FAQ — dipakai accordion homepage DAN halaman /faq/
// (termasuk JSON-LD FAQPage di sana).
// Prinsip: kalimat PERTAMA tiap jawaban harus sudah menjawab pertanyaannya
// (format "answer-first" yang dikutip AI Overviews/ChatGPT/Perplexity).
// ==========================================

export function getFaqs(lang = 'id') {
    return lang === 'id' ? [
        {
            q: 'Apakah akun saya aman?',
            a: 'Aman — booster kami tidak menggunakan program ilegal apapun, sehingga akun kamu tetap aman. Perlu diketahui bahwa terkadang Riot Games mewajibkan pengaktifan pengaturan HVCI atau IOMMU karena mendeteksi perubahan statistik yang mendadak — ini adalah hal yang normal dan tersedia banyak panduan troubleshooting-nya.',
        },
        {
            q: 'Berapa lama proses boosting?',
            a: 'Di bawah Gold biasanya selesai dalam 24 jam, Gold hingga Ascendant sekitar 3 hari, dan Immortal ke atas maksimal 7 hari. Kami selalu berupaya menyelesaikan secepat mungkin sesuai ketersediaan booster. Gunakan add-on Prioritas (khusus Joki Reguler) untuk pengerjaan lebih cepat.',
        },
        {
            q: 'Bagaimana cara melakukan pemesanan?',
            a: 'Hubungi kami via WhatsApp atau Discord. Setelah pembayaran dikonfirmasi, kami akan meminta detail akun (untuk Joki Reguler) atau mengatur jadwal yang disepakati bersama (untuk Joki Gendong).',
        },
        {
            q: 'Metode pembayaran apa saja yang tersedia?',
            a: 'Kami menerima QRIS, Dana, GoPay, OVO, dan Transfer Bank Indonesia. QRIS juga dapat digunakan dari beberapa negara seperti Singapura, Malaysia, Thailand, Filipina, Vietnam, Jepang, Laos, dan Brunei melalui integrasi QR lintas negara.',
        },
        {
            q: 'Apakah bisa request agent/booster tertentu?',
            a: 'Bisa — request agent adalah fitur gratis. Namun ketersediaan booster terbatas, sehingga kami tidak dapat menjamin booster tertentu selalu tersedia untuk mengerjakan order kamu.',
        },
        {
            q: 'Apa bedanya Joki Reguler dan Joki Gendong?',
            a: 'Joki Reguler: booster bermain menggunakan akunmu secara langsung — lebih cepat dengan harga lebih terjangkau. Joki Gendong: booster bermain bersamamu dalam satu party — kamu tetap bermain di akun sendiri, lebih seru, dengan harga 2x lipat dari reguler.',
        },
        {
            q: 'Apakah saya bisa memantau progress boosting?',
            a: 'Bisa — cek status ordermu kapan saja di halaman Cek Pesanan dengan kode order, atau hubungi kami via WhatsApp/Discord untuk update langsung.',
        },
        {
            q: 'Berapa harga joki Valorant?',
            a: 'Harga joki Valorant di BengkelValo mulai dari Rp 10.000 per divisi (Iron) hingga Rp 160.000 per divisi (Ascendant 3). Immortal dan Radiant dihitung per RR, mulai Rp 5.000/RR. Joki Gendong mulai Rp 10.000 per win. Ada diskon otomatis 5% untuk order di atas Rp 100.000 dan 10% di atas Rp 500.000 — cek tabel harga atau hitung persisnya di kalkulator.',
        },
        {
            q: 'Apakah joki Valorant bisa kena ban?',
            a: 'Risiko ban dari joki manual (tanpa cheat) sangat kecil karena booster kami bermain murni dengan skill, tanpa program ilegal. Namun perlu jujur: jasa joki melanggar Terms of Service Riot Games, sehingga risiko tidak pernah nol. Kami meminimalkannya dengan permainan wajar dan mode offline.',
        },
        {
            q: 'Apakah ada garansi?',
            a: 'Ada. Joki Reguler bergaransi rank tercapai sesuai target order. Joki Gendong bergaransi win: jika kalah dalam satu game, game diganti sampai menang. Jika target tidak tercapai karena kesalahan kami, uang kembali.',
        },
        {
            q: 'Apa itu joki gendong?',
            a: 'Joki gendong (duo carry) adalah layanan di mana kamu main di akunmu sendiri, satu party dengan booster yang "menggendong" permainan. Tidak perlu berbagi akun sama sekali — paling aman. Biaya dihitung per win, atau per rank dengan harga 2x joki reguler.',
        },
        {
            q: 'Apakah joki Valorant legal?',
            a: 'Secara hukum negara, memakai jasa joki bukan tindakan ilegal — tidak ada undang-undang yang melarangnya. Namun joki melanggar Terms of Service Riot Games, jadi risikonya ada di level akun game (sanksi dari Riot), bukan pidana. Kami menekan risiko itu dengan joki manual tanpa cheat dan mode offline.',
        },
        {
            q: 'Berapa lama joki dari Iron ke Gold?',
            a: 'Rute Iron 1 ke Gold 1 (9 divisi) umumnya selesai 2–4 hari. Rank di bawah Gold biasanya jalan sangat cepat karena lobby-nya ringan untuk booster kami. Mau lebih cepat? Tambahkan add-on Prioritas supaya ordermu dikerjakan lebih dulu.',
        },
        {
            q: 'Apakah harus bayar penuh di depan?',
            a: 'Ya — sesuai ketentuan layanan, pembayaran dilakukan di muka sebelum pengerjaan dimulai, via QRIS, e-wallet (Dana/GoPay/OVO), atau transfer bank. Setelah pembayaran terkonfirmasi, order langsung masuk antrian dan bisa kamu pantau di halaman Cek Pesanan.',
        },
    ] : [
        {
            q: 'Is my account safe?',
            a: 'Yes — our boosters do not use any illegal programs, so your account remains safe. Note that Riot Games may occasionally require enabling HVCI or IOMMU settings after detecting sudden statistical changes — this is normal and plenty of troubleshooting guides exist.',
        },
        {
            q: 'How long does the boosting process take?',
            a: 'Below Gold typically completes within 24 hours, Gold to Ascendant takes about 3 days, and Immortal and above takes up to 7 days. We always finish as quickly as booster availability allows. Use the Priority add-on (Regular Boost only) for faster processing.',
        },
        {
            q: 'How do I place an order?',
            a: 'Contact us via WhatsApp or Discord. After payment is confirmed, we will request your account details (Regular Boost) or arrange a mutually agreed schedule (Duo Carry).',
        },
        {
            q: 'What payment methods are available?',
            a: 'We accept QRIS, Dana, GoPay, OVO, and Indonesian bank transfer. QRIS also works from Singapore, Malaysia, Thailand, the Philippines, Vietnam, Japan, Laos, and Brunei via cross-border QR.',
        },
        {
            q: 'Can I request a specific agent/booster?',
            a: 'Yes — requesting an agent is free. Booster availability is limited though, so we cannot guarantee a specific booster is always free to take your order.',
        },
        {
            q: 'What is the difference between Regular Boost and Duo Carry?',
            a: 'Regular Boost: the booster plays directly on your account — faster and cheaper. Duo Carry: the booster queues with you in a party — you keep playing on your own account, at 2x the regular price.',
        },
        {
            q: 'Can I track the boosting progress?',
            a: 'Yes — check your order status anytime on the Track Order page using your order code, or message us on WhatsApp/Discord for a live update.',
        },
        {
            q: 'How much does Valorant boosting cost?',
            a: 'BengkelValo prices start from Rp 10,000 per division (Iron) up to Rp 160,000 per division (Ascendant 3). Immortal and Radiant are charged per RR, from Rp 5,000/RR. Duo Carry starts at Rp 10,000 per win, with automatic discounts of 5% above Rp 100,000 and 10% above Rp 500,000.',
        },
        {
            q: 'Can my account get banned for boosting?',
            a: 'The ban risk from manual boosting (no cheats) is very small because our boosters play purely on skill. To be honest though: boosting violates Riot Games’ Terms of Service, so the risk is never zero. We minimize it with natural play patterns and offline mode.',
        },
        {
            q: 'Is there a guarantee?',
            a: 'Yes. Regular Boost is guaranteed to reach your target rank. Duo Carry guarantees wins: a lost game is replayed until you win. If we fail through our own fault, you get your money back.',
        },
        {
            q: 'What is duo carry (joki gendong)?',
            a: 'Duo carry means you play on your own account, queued with a booster who carries the games. No account sharing at all — the safest option. Priced per win, or per rank at 2x the regular boost price.',
        },
        {
            q: 'Is Valorant boosting legal?',
            a: 'Legally, using a boosting service is not a crime — no law forbids it. It does violate Riot Games’ Terms of Service, so the risk sits at the game-account level (Riot sanctions), not criminal law. We minimize that risk with manual, cheat-free boosting and offline mode.',
        },
        {
            q: 'How long does Iron to Gold take?',
            a: 'The Iron 1 to Gold 1 route (9 divisions) usually completes in 2–4 days. Ranks below Gold move very fast for our boosters. Add the Priority add-on to jump the queue.',
        },
        {
            q: 'Do I have to pay in full upfront?',
            a: 'Yes — per our terms, payment is made upfront before work begins, via QRIS, e-wallet (Dana/GoPay/OVO), or bank transfer. Once confirmed, your order enters the queue and can be tracked on the Track Order page.',
        },
    ]
}
