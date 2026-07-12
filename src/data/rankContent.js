// ==========================================
// Konten editorial per-rank untuk halaman /joki-valorant-{rank}/.
// Harga TIDAK ditulis di sini — selalu diambil dari pricing.js supaya
// tidak pernah beda dengan kalkulator.
// Estimasi durasi mengikuti ketentuan di halaman /tos/.
// ==========================================

export const rankContent = [
    {
        slug: 'iron',
        rankId: 1,
        duration: '±1 hari',
        intro: 'Iron adalah titik mulai semua orang — dan keluar dari sini adalah proses tercepat sekaligus termurah di seluruh ladder. Bagi booster kami, lobby Iron praktis tanpa perlawanan, jadi order di tier ini hampir selalu selesai dalam sehari.',
        tips: 'Kalau mau coba naik sendiri dulu: fokus satu hal saja — crosshair placement setinggi kepala. Di Iron, pemain yang aim-nya selalu siap di sudut pintu menang melawan 90% lobby tanpa perlu aim dewa.',
    },
    {
        slug: 'bronze',
        rankId: 2,
        duration: '1–2 hari',
        intro: 'Bronze sering jadi tempat "nyangkut" pemain kasual: musuh mulai bisa menembak balik, tapi permainan tim belum ada. Untuk booster, tier ini masih wilayah solo-carry penuh — order Bronze termasuk yang paling cepat selesai.',
        tips: 'Tips keluar dari Bronze: berhenti force-buy tiap ronde. Ikut ekonomi tim (eco bareng, full-buy bareng) sudah cukup untuk menang 2–3 ronde ekstra per game — itu bedanya menang 13-10 dan kalah 10-13.',
    },
    {
        slug: 'silver',
        rankId: 3,
        duration: '1–2 hari',
        intro: 'Silver adalah rank ber-populasi terbesar di Valorant Indonesia — artinya antrian matchmaking cepat dan variasi lawan paling acak. Banyak pelanggan kami mulai dari sini karena reward akhir season mulai terasa sayang dilewatkan.',
        tips: 'Di Silver, kesalahan #1 adalah dry-peek berulang ke sudut yang sama. Belajar trade: masuk berdua, yang kedua langsung membalas kill. Winrate naik drastis tanpa aim berubah.',
    },
    {
        slug: 'gold',
        rankId: 4,
        duration: '2–4 hari',
        intro: 'Gold adalah target paling populer di kalkulator kami — batas psikologis "sudah bukan rank bawah". Lawan mulai memakai utility dengan benar, jadi kecepatan pengerjaan sedikit lebih bervariasi dibanding tier di bawahnya.',
        tips: 'Naik dari Gold butuh konsistensi role: kuasai 2–3 agent dalam SATU role (misal controller: Omen + Brimstone) daripada ganti-ganti agent tiap game. Setengah belajar selamanya = hardstuck selamanya.',
    },
    {
        slug: 'platinum',
        rankId: 5,
        duration: '2–4 hari',
        intro: 'Platinum adalah gerbang menuju rank atas — dan tempat smurf mulai sering muncul. Di sinilah jasa joki mulai benar-benar menghemat waktu: naik satu divisi secara solo di Plat rata-rata butuh belasan jam main serius.',
        tips: 'Pembeda terbesar di Plat: komunikasi info yang disiplin (posisi musuh, sisa HP, util yang sudah terpakai) dan tidak mati gratis setelah ronde sudah dimenangkan. Simpan senjatamu — ekonomi ronde berikutnya lebih berharga daripada satu exit-kill.',
    },
    {
        slug: 'diamond',
        rankId: 6,
        duration: '3–7 hari',
        intro: 'Diamond adalah tier pertama dengan harga per-divisi bertingkat — lobby-nya jauh lebih keras dan tiap divisi terasa seperti rank berbeda. Booster kami yang peak Immortal–Radiant tetap nyaman solo-carry di sini, tapi durasi per divisi mulai lebih panjang.',
        tips: 'Kalau grinding sendiri di Diamond: mulai review VOD kekalahanmu 10 menit per hari. Di tier ini masalahnya hampir selalu keputusan (rotasi telat, peek tanpa tujuan), bukan aim — dan itu hanya kelihatan dari rekaman.',
    },
    {
        slug: 'ascendant',
        rankId: 7,
        duration: '3–7 hari',
        intro: 'Ascendant adalah rank tersulit sebelum sistem RR Immortal — populasinya kecil, lawannya serius semua, dan solo queue terasa seperti lotere. Order Ascendant kami kerjakan dengan booster peak Radiant supaya winrate tetap stabil.',
        tips: 'Di Ascendant, meta dan komposisi mulai menentukan: belajar minimal satu agent meta per role sesuai patch berjalan, dan pahami default setup tiap map. Satu util yang salah timing di sini langsung dihukum.',
    },
    {
        slug: 'immortal',
        rankId: 8,
        duration: '5–14 hari',
        intro: 'Mulai Immortal, Valorant beralih ke sistem RR murni (0–299 RR dalam tiga tier) — karena itu harga kami juga per RR, bukan per divisi. Transparan: kamu bayar persis sejauh RR yang ditempuh, bukan paket gelap. Hanya booster peak Radiant yang memegang order Immortal.',
        tips: 'Bertahan di Immortal soal mental sebanyak soal skill: batasi sesi ranked 3–4 game, berhenti saat kalah 2 beruntun, dan jaga jadwal tidur — decay performa karena tilt dan begadang adalah pembunuh RR nomor satu di tier ini.',
    },
    {
        slug: 'radiant',
        rankId: 9,
        duration: '5–14 hari',
        intro: 'Radiant adalah 500 pemain teratas per region — dan kami salah satu dari sangat sedikit jasa joki Indonesia yang berani mempublikasikan harga Radiant secara terbuka, per RR. Order di tier ini dikerjakan langsung oleh booster Radiant aktif, dengan slot terbatas.',
        tips: 'Menuju Radiant tidak ada trik: scrim/deathmatch rutin, satu role permanen, dan review setiap kekalahan. Kalau kamu butuh lompatan RR untuk mengejar leaderboard sebelum akhir season — itulah persisnya alasan layanan per-RR kami ada.',
    },
]
