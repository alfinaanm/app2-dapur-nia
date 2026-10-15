import React from "react";
import { formatRupiah } from "../utils/formatters";

export default function ItemMenu({ item, onEdit, onDelete }) {
  const isHabis = item.sisa_porsi === 0;

  return (
    <div className="menu-card">
      {/* Bagian Atas: Nama Menu dan Harga (Rp) */}
      <div className="card-top-row">
        <h3 className="card-menu-name">{item.nama}</h3>
        <span className="card-menu-price">Rp{formatRupiah(item.harga)}</span>
      </div>

      {/* Bagian Tengah: Badge Sisa Porsi atau Habis */}
      <div className="card-badge-row">
        {isHabis ? (
          <span className="badge-habis-pill">Habis</span>
        ) : (
          <span className="badge-porsi-pill">Sisa {item.sisa_porsi} porsi</span>
        )}
      </div>

      {/* Garis Pemisah Halus */}
      <div className="card-divider"></div>

      {/* Bagian Bawah: Aksi Ubah dan Hapus (Kanan Bawah) */}
      <div className="card-actions-row">
        <button
          type="button"
          className="btn-card-ubah"
          onClick={() => onEdit(item)}
          aria-label={`Ubah menu ${item.nama}`}
        >
          Ubah
        </button>
        <button
          type="button"
          className="btn-card-hapus"
          onClick={() => onDelete(item)}
          aria-label={`Hapus menu ${item.nama}`}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
