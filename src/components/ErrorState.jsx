import React from "react";

export default function ErrorState({ pesan, onRetry }) {
  return (
    <div className="state-container error-state" role="alert">
      <div className="error-icon-wrap" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="error-title">Gagal Memuat Menu</h3>
      <p className="error-desc">
        {pesan || "Terjadi kendala saat mengambil data menu. Silakan periksa koneksi internet Anda dan coba lagi."}
      </p>
      <div className="error-actions">
        <button type="button" className="btn-retry" onClick={onRetry}>
          🔄 Coba Lagi
        </button>
      </div>
    </div>
  );
}
