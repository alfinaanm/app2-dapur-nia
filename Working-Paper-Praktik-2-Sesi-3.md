**Working Paper: Praktik 2 Sesi 3**

Kasus Aplikasi Pemesanan Katering Dapur Nia

**Identitas**

| Keterangan | Isian |
| :---- | :---- |
| Nama peserta | Peserta Bootcamp |
| Tanggal | 15 Oktober 2026 |
| Sesi | Sesi 3 · Praktik 2 |
| Nama proyek Antigravity | App 2 Dapur Nia · Kelola Menu |
| Nama proyek Firebase | app2-dapur-nia |
| Nama pasangan | [Nama Pasangan] |
| URL pasangan | [URL Pasangan] |

**A. Koneksi dan Koleksi Firestore (Tahap 1 & 2)**

| No | Koleksi | Dokumen awal | Read | Create | Catatan |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | `menu` | 4 dokumen awal: Rendang (35k, 12 porsi), Sate Ayam (25k, 20 porsi), Nasi Ayam Bakar (25k, 30 porsi), Soto Betawi (20k, 10 porsi) | \[x\] | \[x\] | Terhubung 100% ke Cloud Firestore `app2-dapur-nia`. Data dibaca via *real-time listener* (`onSnapshot`), bukan data statis/lokal. |
| 2 | `pelanggan` | Data profil & no WA pelanggan | \[ \] | \[ \] | Disiapkan pada tahap integrasi berikutnya. |
| 3 | `pesanan` | Data pesanan & status alur dapur | \[ \] | \[ \] | Disiapkan pada tahap integrasi berikutnya. |

**B. Pemeriksaan CRUD (Tahap 2: Menyelesaikan CRUD)**

| Operasi | Data atau dokumen | Hasil UI & Konsol Firestore | Sudah |
| :---- | :---- | :---- | :---- |
| **Create** | Tambah menu baru "Ayam Bakar Madu", Rp28.000, 15 porsi | Dokumen baru tersimpan ke Firestore dengan ID otomatis (`addDoc`) dan langsung muncul di antarmuka web secara *real-time*. | \[x\] |
| **Read** | Pembacaan koleksi `menu` diurutkan berdasarkan `dibuat_pada desc` | 4 kartu menu awal tampil lengkap dari Firestore dengan nama, format harga mata uang `RpXX.XXX`, dan badge hijau sisa porsi. | \[x\] |
| **Update** | Mengubah harga "Ayam Bakar Madu" menjadi Rp29.000 dan sisa porsi 14 | Menggunakan `updateDoc(doc(db, "menu", id), ...)`. Nilai di dokumen konsol Firestore dan tampilan kartu terbarui seketika. | \[x\] |
| **Delete** | Menghapus dokumen "Ayam Bakar Madu" melalui tombol Hapus | Menggunakan `deleteDoc(doc(db, "menu", id))`. Dokumen terhapus permanen dari konsol Firestore dan kartu langsung hilang dari UI. | \[x\] |

**C. Tiga Invariant**

| No | Invariant | Akibat bila dilanggar | Ditegakkan pada | Hasil uji |
| :---- | :---- | :---- | :---- | :---- |
| 1 | `harga >= 0` dan `sisa_porsi >= 0` | Pendapatan bernilai minus dan porsi melebihi kapasitas dapur (*overselling*) | Formulir input UI & Firestore Security Rules | **Lulus**: Input angka negatif ditolak dengan pesan galat merah di UI dan `PERMISSION_DENIED` di Firestore |
| 2 | `jumlah_porsi >= 1` dan `<= sisa_porsi` menu | Terjadi pesanan kosong (0 porsi) atau pesanan melebihi stok yang dimasak | Modul Pesanan | Disiapkan pada alur pesanan |
| 3 | `total == (harga_satuan × jumlah_porsi) + ongkir` | Perhitungan tagihan salah dan uang masuk tidak cocok dengan kas | Modul Pesanan | Disiapkan pada alur pesanan |

**D. Uji Tembus Enam Masukan Tidak Sah (Tahap 3)**

| No | Kategori Masukan Tidak Sah | Contoh Masukan yang Diuji | Respon Validasi UI | Respon Cloud Firestore Rules | Status Uji |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | **Field kosong** | `nama: ""` | Ditolak: *"Nama menu wajib diisi"* | Ditolak (`size() >= 1`) | **Lulus** |
| 2 | **Tipe salah** | `harga: "gratis"` | Ditolak: *"Harga wajib diisi dengan angka bulat"* | Ditolak (`harga is number`) | **Lulus** |
| 3 | **Teks terlalu panjang** | `nama` > 60 karakter | Ditolak: *"Nama menu harus 1 sampai 60 karakter"* | Ditolak (`size() <= 60`) | **Lulus** |
| 4 | **Nilai negatif** | `harga: -15000, sisa_porsi: -5` | Ditolak: *"Harga & sisa porsi tidak boleh negatif"* | Ditolak (`harga >= 0 && sisa_porsi >= 0`) | **Lulus** |
| 5 | **Nilai di luar batas (pecahan)** | `harga: 20000.5, sisa_porsi: 10.25` | Ditolak: *"Harus bilangan bulat"* | Ditolak (*integer check*) | **Lulus** |
| 6 | **Pelanggaran Security Rules** | Bypass form via script: `nama: "", harga: -100` | Form tidak mengirim | Ditolak Firestore: `PERMISSION_DENIED` | **Lulus** |
