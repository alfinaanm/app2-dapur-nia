# Lembar Kerja Praktik Sesi 3 · App 2 Dapur Nia

**Identitas Proyek**
* **Nama Aplikasi**: App 2 Dapur Nia (Modul Kelola Menu)
* **Sesi**: Sesi 3 · Bootcamp AI Web Programming
* **Basis Data**: Cloud Firestore
* **Antarmuka**: React (Vite)
* **Target Deploy**: Netlify

---

## Bagian C: Memasang Tiga State (Tahap 3)

### 1. Deskripsi Tiga State yang Terpasang

| State | Kondisi Muncul | Implementasi Antarmuka | Aksi Pengguna |
| :--- | :--- | :--- | :--- |
| **Loading State** | Saat aplikasi pertama kali dibuka (mengambil data) atau saat data contoh dimuat ulang. Juga aktif saat tombol simpan ditekan (*"Menyimpan Menu..."*). | Animasi *skeleton shimmer* meniru bentuk baris menu (nama, harga, tombol) disertai *spinner* dan teks *"Memuat daftar menu Dapur Nia..."*. | Tombol dinonaktifkan (*disabled*) untuk mencegah *double submit*. |
| **Empty State** | Saat koleksi daftar menu tidak memiliki data (`daftarMenu.length === 0`). | Kartu bergaris putus-putus dengan ikon `🍲`, judul *"Belum Ada Menu Masakan"*, dan deskripsi panduan yang ramah. | Dua tombol aksi: **`+ Tambah Menu`** dan **`Muat Data Contoh`**. |
| **Error State** | Saat pembacaan data gagal atau terjadi kendala jaringan. | Kartu berlatar merah lembut dengan ikon `⚠️`, judul *"Gagal Memuat Menu"*, dan pesan ramah tanpa rincian teknis. | Tombol aksi pemulihan: **`🔄 Coba Lagi`** (*retry*). |

### 2. Bukti Pengujian Tiga State

Aplikasi dilengkapi panel **State Switcher Bar** di bagian atas kartu untuk memudahkan pengujian mandiri:
* Tombol **`Normal (Ada Data)`**: Menampilkan 3 data menu standar.
* Tombol **`Loading State`**: Menampilkan animasi skeleton shimmer.
* Tombol **`Empty State`**: Mengosongkan daftar dan memunculkan tampilan *empty state*.
* Tombol **`Error State`**: Memunculkan tampilan galat dan tombol coba lagi.

---

## Bagian D: Pemeriksaan (Tahap 4)

### 1. Pembandingan Nama dan Susunan Field dengan Skema Firestore

| Field di Skema | Tipe di Skema | Batasan di Skema | Implementasi di Form / UI | Status Kepatuhan |
| :--- | :--- | :--- | :--- | :--- |
| `nama` | `string` | 1 sampai 60 karakter | `input text`, `maxLength={60}`, validasi `1 <= length <= 60` | **SESUAI 100%** |
| `harga` | `number` (bulat) | Minimal 0 (tidak boleh negatif) | `input number`, `min={0}`, validasi bilangan bulat non-negatif | **SESUAI 100%** |
| `sisa_porsi` | `number` (bulat) | Minimal 0. Nilai 0 ditampilkan sebagai *Habis* | `input number`, `min={0}`, nilai 0 menampilkan badge merah **`HABIS`** | **SESUAI 100%** |
| `tersedia` | `boolean` | `true` tampil, `false` disembunyikan | `input checkbox`, nilai boolean `true/false` | **SESUAI 100%** |
| `dibuat_pada` | `timestamp` | Waktu dokumen dibuat | Format ISO string / timestamp date saat simpan | **SESUAI 100%** |

*Catatan: Tidak ada field tambahan atau nama field yang diubah dari dokumen [Skema-Firestore-Dapur-Nia.md].*

---

### 2. Pemeriksaan Seluruh Tombol dan Formulir dengan Data Contoh

| Elemen UI | Data Contoh yang Diuji | Tindakan Pengguna | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- |
| **Tampilan Awal** | Rendang (35k), Sate Ayam (25k), Soto Betawi (20k) | Membuka halaman di `http://localhost:5500` | Seluruh data contoh tampil dengan format rupiah titik (`35.000`, `25.000`, `20.000`) | **LULUS** |
| **Tombol `+ Tambah Menu`** | - | Diklik | Modal formulir tambah terbuka dengan field kosong | **LULUS** |
| **Formulir Tambah** | Nama: "Nasi Ayam Bakar", Harga: 25000, Porsi: 30 | Klik *"Simpan Menu"* | Data baru tersimpan ke daftar, toast notifikasi sukses muncul | **LULUS** |
| **Validasi Invariant 1** | Harga: -5000, Porsi: -1 | Klik *"Simpan Menu"* | Form menolak simpan, pesan galat merah muncul di bawah field terkait | **LULUS** |
| **Tombol `Ubah`** | Rendang (Rp35.000) | Klik *"Ubah"* → Ganti harga jadi 38000 → Klik *"Simpan Menu"* | Data lama terisi otomatis di formulir, nilai terbarui menjadi `38.000` | **LULUS** |
| **Tombol `Hapus`** | Sate Ayam | Klik *"Hapus"* → Klik *"Hapus Menu"* pada modal konfirmasi | Item terhapus dari daftar dan toast konfirmasi muncul | **LULUS** |
| **Status Habis** | Ubah Sisa Porsi menjadi 0 | Klik *"Simpan Menu"* | Label berubah menjadi badge merah **`HABIS`** | **LULUS** |
| **Tombol `DATA CONTOH`** | Data contoh skema Firestore | Diklik | Daftar kembali terisi lengkap dengan data contoh standar | **LULUS** |
| **Tombol `Coba Lagi`** | Pada Error State | Diklik | Error hilang dan data dipulihkan kembali | **LULUS** |

---

### 3. Catatan Perubahan Proyek (Changelog)

* **Fase 1 (Inisialisasi)**: Membuat proyek React berbasis Vite di port `5500` sesuai screenshot LMS.
* **Fase 2 (CRUD Menu)**: Membangun komponen `Header`, `ItemMenu`, `ModalFormMenu`, dan `ModalKonfirmasiHapus` lengkap dengan data contoh.
* **Fase 3 (Pemasangan Tiga State)**:
  * Menambahkan komponen `LoadingState` dengan animasi skeleton shimmer dan spinner.
  * Menambahkan komponen `EmptyState` dengan ilustrasi piring dan tombol penuntun.
  * Menambahkan komponen `ErrorState` dengan pesan ramah dan tombol coba lagi (*retry*).
  * Menambahkan panel penguji *State Switcher Bar* di atas kartu aplikasi.
* **Fase 4 (Pemeriksaan & Kepatuhan)**:
  * Memastikan kepatuhan ketat nama field terhadap [Skema-Firestore-Dapur-Nia.md].
  * Memverifikasi validasi *Invariant 1* (harga dan sisa porsi tidak pernah negatif).
  * Memastikan build produksi `npm run build` sukses 100% tanpa galat.

---

### 4. Kriteria Selesai (Definition of Done)

- [x] Struktur proyek React Vite berhasil dibangun dan berjalan di port `5500`.
- [x] Tampilan antarmuka identik dengan referensi desain (Header terakota, baris menu, tombol Ubah/Hapus, tombol kuning DATA CONTOH).
- [x] Operasi CRUD (Tambah, Baca, Ubah, Hapus) menu berfungsi penuh.
- [x] Validasi invariant harga non-negatif dan porsi non-negatif aktif.
- [x] Kondisi porsi = 0 menampilkan badge **HABIS**.
- [x] Tiga state (Loading, Empty, Error) terpasang rapi dan dapat diuji.
- [x] Build produksi (`npm run build`) berhasil (siap dipublikasikan ke Netlify).
- [x] Lembar kerja Bagian C dan D telah terisi lengkap.
