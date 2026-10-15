import React from "react";

export default function ModalKonfirmasiHapus({ isOpen, item, onConfirm, onCancel }) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card modal-confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Konfirmasi Hapus Menu</h2>
          <button type="button" className="btn-close" onClick={onCancel} aria-label="Batal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p>
            Apakah Anda yakin ingin menghapus menu <strong>"{item.nama}"</strong>? Tindakan ini
            tidak dapat dibatalkan.
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-batal" onClick={onCancel}>
            Batal
          </button>
          <button
            type="button"
            className="btn-hapus-konfirmasi"
            onClick={() => onConfirm(item.id)}
          >
            Hapus Menu
          </button>
        </div>
      </div>
    </div>
  );
}
