/**
 * Format angka ke format rupiah sesuai tampilan di Dapur Nia
 * Contoh: 35000 -> "35.000"
 */
export function formatRupiah(angka) {
  if (angka === null || angka === undefined || isNaN(angka)) return "0";
  return new Intl.NumberFormat("id-ID").format(angka);
}

/**
 * Validasi aturan invariant dan batasan field koleksi menu
 * Sesuai PRD-App-2-Dapur-Nia.md dan Skema-Firestore-Dapur-Nia.md
 */
export function validasiMenu({ nama, harga, sisa_porsi }) {
  const errors = {};

  if (!nama || !nama.trim()) {
    errors.nama = "Nama menu wajib diisi";
  } else if (nama.trim().length < 1 || nama.trim().length > 60) {
    errors.nama = "Nama menu harus 1 sampai 60 karakter";
  }

  const hargaNum = Number(harga);
  if (harga === "" || harga === null || harga === undefined || isNaN(hargaNum)) {
    errors.harga = "Harga wajib diisi dengan angka bulat";
  } else if (!Number.isInteger(hargaNum)) {
    errors.harga = "Harga harus bilangan bulat";
  } else if (hargaNum < 0) {
    errors.harga = "Harga tidak boleh bernilai negatif (minimal 0)";
  }

  const porsiNum = Number(sisa_porsi);
  if (sisa_porsi === "" || sisa_porsi === null || sisa_porsi === undefined || isNaN(porsiNum)) {
    errors.sisa_porsi = "Sisa porsi wajib diisi dengan angka bulat";
  } else if (!Number.isInteger(porsiNum)) {
    errors.sisa_porsi = "Sisa porsi harus bilangan bulat";
  } else if (porsiNum < 0) {
    errors.sisa_porsi = "Sisa porsi tidak boleh bernilai negatif (minimal 0)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
