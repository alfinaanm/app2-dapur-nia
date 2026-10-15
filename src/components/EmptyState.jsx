import React from "react";

export default function EmptyState({ onTambah, onMuatContoh }) {
  return (
    <div className="state-container empty-state" role="region" aria-label="Daftar menu kosong">
      <div className="empty-icon-wrap" aria-hidden="true">
        🍲
      </div>
      <h3 className="empty-title">Belum Ada Menu Masakan</h3>
      <p className="empty-desc">
        Daftar menu harian masih kosong. Silakan tambahkan menu baru atau muat data contoh untuk memulai.
      </p>
      <div className="empty-actions">
        <button type="button" className="btn-empty-tambah" onClick={onTambah}>
          + Tambah Menu
        </button>
        <button type="button" className="btn-empty-contoh" onClick={onMuatContoh}>
          Muat Data Contoh
        </button>
      </div>
    </div>
  );
}
