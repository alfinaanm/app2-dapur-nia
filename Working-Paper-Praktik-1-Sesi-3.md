**Working Paper: Praktik 1 Sesi 3**

Kasus Aplikasi Pemesanan Katering Dapur Nia

**Identitas**

| Keterangan | Isian |
| :---- | :---- |
| Nama peserta | Peserta Bootcamp |
| Tanggal | 15 Oktober 2026 |
| Sesi | Sesi 3 |
| Nama proyek Antigravity | App 2 Dapur Nia · Kelola Menu |

**A. Pemeriksaan UI CRUD**

| Pemeriksaan | Hasil | Catatan perbaikan |
| :---- | :---- | :---- |
| Daftar data | Sesuai | Menampilkan daftar menu masakan dalam kartu individual putih dengan nama menu, harga (format Rp), badge sisa porsi hijau, serta aksi Ubah dan Hapus. |
| Formulir | Sesuai | Formulir modal dengan label di atas field, validasi karakter (1-60), validasi angka bulat non-negatif, dan pesan galat dekat field. |
| Create | Sesuai | Tombol "+ Tambah Menu" membuka modal; data baru tervalidasi dan berhasil ditambahkan ke daftar menu. |
| Read | Sesuai | Membaca data menu dari state data contoh; sisa porsi bernilai 0 otomatis menampilkan badge merah "Habis". |
| Update | Sesuai | Tombol "Ubah" membuka formulir modal dengan data terisi otomatis (*prefilled*); perubahan data berhasil diperbarui. |
| Delete | Sesuai | Tombol "Hapus" membuka modal konfirmasi; data berhasil dihapus setelah dikonfirmasi pengguna. |
| Loading state | Sesuai | Menampilkan animasi *skeleton shimmer* meniru bentuk kartu menu dan *spinner* saat data dimuat atau disimpan. |
| Empty state | Sesuai | Menampilkan ilustrasi piring katering, judul ramah, dan tombol penuntun "+ Tambah Menu" saat daftar kosong. |
| Error state | Sesuai | Menampilkan kartu peringatan berlatar merah lembut dengan pesan ramah dan tombol "Coba Lagi" saat proses gagal. |

**B. Tiga State Tampilan**

| State | Kondisi pemicu | Pesan | Tindakan pengguna | Sudah |
| :---- | :---- | :---- | :---- | :---- |
| Loading | Aplikasi pertama kali dibuka, data dimuat ulang, atau form sedang disimpan. | "Memuat daftar menu Dapur Nia..." / "Menyimpan Menu..." | Menunggu proses selesai. Tombol dinonaktifkan (*disabled*) untuk mencegah klik ganda. | \[x\] |
| Empty | Koleksi menu kosong atau seluruh data menu dihapus (`daftarMenu.length === 0`). | "Belum Ada Menu Masakan. Daftar menu harian masih kosong." | Menekan tombol "+ Tambah Menu" atau tombol "Muat Data Contoh". | \[x\] |
| Error | Koneksi data terputus atau terjadi kegagalan pembacaan data. | "Gagal Memuat Menu. Terjadi kendala saat mengambil data menu. Silakan periksa koneksi internet Anda dan coba lagi." | Menekan tombol "🔄 Coba Lagi" (*retry*) untuk memulihkan koneksi dan memuat ulang data. | \[x\] |
