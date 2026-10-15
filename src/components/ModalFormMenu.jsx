import React, { useState, useEffect } from "react";
import { validasiMenu } from "../utils/formatters";

export default function ModalFormMenu({ isOpen, mode, initialData, onSave, onClose, isSaving }) {
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    sisa_porsi: "",
    tersedia: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === "ubah") {
      setFormData({
        nama: initialData.nama || "",
        harga: initialData.harga !== undefined ? initialData.harga : "",
        sisa_porsi: initialData.sisa_porsi !== undefined ? initialData.sisa_porsi : "",
        tersedia: initialData.tersedia !== undefined ? initialData.tersedia : true,
      });
    } else {
      setFormData({
        nama: "",
        harga: "",
        sisa_porsi: "",
        tersedia: true,
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validasiMenu(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      ...formData,
      nama: formData.nama.trim(),
      harga: Math.round(Number(formData.harga)),
      sisa_porsi: Math.round(Number(formData.sisa_porsi)),
      tersedia: Boolean(formData.tersedia),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "ubah" ? "Ubah Menu" : "Tambah Menu Baru"}</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Tutup form">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-menu" noValidate>
          {/* Field: Nama Menu */}
          <div className="form-group">
            <label htmlFor="input-nama" className="form-label">
              Nama Menu <span className="required">*</span>
            </label>
            <input
              id="input-nama"
              name="nama"
              type="text"
              className={`form-input ${errors.nama ? "input-error" : ""}`}
              placeholder="Contoh: Rendang Sapi"
              maxLength={60}
              value={formData.nama}
              onChange={handleChange}
              autoFocus
            />
            {errors.nama && <span className="field-error">{errors.nama}</span>}
            <span className="field-hint">Maksimal 60 karakter ({formData.nama.length}/60)</span>
          </div>

          {/* Field: Harga */}
          <div className="form-group">
            <label htmlFor="input-harga" className="form-label">
              Harga Satuan (Rp) <span className="required">*</span>
            </label>
            <input
              id="input-harga"
              name="harga"
              type="number"
              min={0}
              step={1}
              className={`form-input ${errors.harga ? "input-error" : ""}`}
              placeholder="Contoh: 35000"
              value={formData.harga}
              onChange={handleChange}
            />
            {errors.harga && <span className="field-error">{errors.harga}</span>}
            <span className="field-hint">Angka bulat dalam rupiah, tidak boleh negatif</span>
          </div>

          {/* Field: Sisa Porsi */}
          <div className="form-group">
            <label htmlFor="input-porsi" className="form-label">
              Sisa Porsi <span className="required">*</span>
            </label>
            <input
              id="input-porsi"
              name="sisa_porsi"
              type="number"
              min={0}
              step={1}
              className={`form-input ${errors.sisa_porsi ? "input-error" : ""}`}
              placeholder="Contoh: 20"
              value={formData.sisa_porsi}
              onChange={handleChange}
            />
            {errors.sisa_porsi && <span className="field-error">{errors.sisa_porsi}</span>}
            <span className="field-hint">Minimal 0. Nilai 0 otomatis berstatus Habis</span>
          </div>

          {/* Field: Ketersediaan */}
          <div className="form-group form-checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tersedia"
                checked={formData.tersedia}
                onChange={handleChange}
              />
              <span>Tersedia untuk dipesan pelanggan</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-batal" onClick={onClose} disabled={isSaving}>
              Batal
            </button>
            <button type="submit" className="btn-simpan" disabled={isSaving}>
              {isSaving ? "Menyimpan Menu..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
