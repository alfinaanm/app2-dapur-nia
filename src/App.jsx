import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ItemMenu from "./components/ItemMenu";
import ModalFormMenu from "./components/ModalFormMenu";
import ModalKonfirmasiHapus from "./components/ModalKonfirmasiHapus";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import HalamanAuth from "./components/HalamanAuth";
import {
  listenDaftarMenu,
  tambahMenuFirestore,
  ubahMenuFirestore,
  hapusMenuFirestore,
  seedContohMenuFirestore,
  pantauStatusAuth,
  keluarAplikasi,
} from "./services/firebase";

export default function App() {
  // State Otentikasi Pengguna (Praktik 2: Halaman Masuk Dapur Nia)
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname || "/masuk");

  // State Data Menu dari Cloud Firestore
  const [daftarMenu, setDaftarMenu] = useState([]);

  // Tiga State Utama (Loading, Empty, Error)
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Tab Navigasi Aktif (Menu atau Pesanan)
  const [activeTab, setActiveTab] = useState("menu");

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("tambah"); // "tambah" | "ubah"
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Modal Konfirmasi Hapus State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  // Toast Notifikasi State
  const [notif, setNotif] = useState(null);

  const tampilkanNotif = (pesan, tipe = "sukses") => {
    setNotif({ pesan, tipe });
    setTimeout(() => {
      setNotif(null);
    }, 3200);
  };

  // Navigasi URL Rute SPA
  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
  };

  // Dengarkan perubahan URL dari tombol Back/Forward browser
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 1. Pantau Status Sesi Pengguna secara Real-Time (Tetap Masuk walau dimuat ulang)
  useEffect(() => {
    const unsubscribeAuth = pantauStatusAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Proteksi Halaman (Route Guard): Halaman Kelola Menu hanya terbuka setelah masuk
  useEffect(() => {
    if (authLoading) return;

    const path = window.location.pathname;

    if (!currentUser) {
      // Jika belum masuk dan mencoba buka /kelola-menu atau root /
      if (path === "/kelola-menu" || path === "/" || path === "") {
        navigate("/masuk");
      }
    } else {
      // Jika sudah masuk dan berada di halaman /masuk atau /daftar
      if (path === "/masuk" || path === "/daftar" || path === "/" || path === "") {
        navigate("/kelola-menu");
      }
    }
  }, [currentUser, authLoading, currentPath]);

  // Berlangganan Data Firestore Real-Time hanya jika pengguna sudah masuk
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    setIsError(false);

    const unsubscribe = listenDaftarMenu(
      (items) => {
        setDaftarMenu(items);
        setIsLoading(false);
        setIsError(false);
      },
      (err) => {
        console.error("Firestore read error:", err);
        setErrorMessage("Gagal menghubungkan ke Cloud Firestore. Silakan periksa jaringan dan aturan keamanan.");
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [currentUser]);

  // Handler: Keluar dari Akun (Logout)
  const handleLogout = async () => {
    try {
      await keluarAplikasi();
      tampilkanNotif("Berhasil keluar dari akun.", "info");
      navigate("/masuk");
    } catch (err) {
      console.error("Gagal keluar:", err);
      tampilkanNotif("Gagal keluar dari akun.", "error");
    }
  };

  // Handler: Tab Navigation
  const handleTabChange = (tab) => {
    if (tab === "menu") {
      setActiveTab("menu");
    } else {
      tampilkanNotif("Fitur Pesanan akan diaktifkan pada langkah berikutnya.", "info");
    }
  };

  // Handler: Buka Form Tambah
  const handleOpenTambah = () => {
    setSelectedMenu(null);
    setFormMode("tambah");
    setIsModalOpen(true);
  };

  // Handler: Buka Form Ubah
  const handleOpenEdit = (item) => {
    setSelectedMenu(item);
    setFormMode("ubah");
    setIsModalOpen(true);
  };

  // Handler: Simpan Menu ke Cloud Firestore (Fungsi CREATE & UPDATE Praktik 2)
  const handleSaveMenu = async (formData) => {
    setIsSaving(true);
    try {
      if (formMode === "tambah") {
        await tambahMenuFirestore(formData);
        tampilkanNotif(`Menu "${formData.nama}" berhasil disimpan ke Firestore.`);
      } else {
        await ubahMenuFirestore(selectedMenu.id, formData);
        tampilkanNotif(`Menu "${formData.nama}" berhasil diperbarui di Firestore.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan ke Firestore:", err);
      tampilkanNotif("Gagal menyimpan data ke Firestore. Silakan coba lagi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Buka Konfirmasi Hapus
  const handleOpenDelete = (item) => {
    setMenuToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handler: Konfirmasi Hapus Menu di Cloud Firestore (Fungsi DELETE)
  const handleConfirmDelete = async (id) => {
    const namaMenu = menuToDelete?.nama;
    try {
      await hapusMenuFirestore(id);
      setIsDeleteModalOpen(false);
      setMenuToDelete(null);
      tampilkanNotif(`Menu "${namaMenu}" berhasil dihapus dari Firestore.`);
    } catch (err) {
      console.error("Gagal menghapus dari Firestore:", err);
      tampilkanNotif("Gagal menghapus menu dari Firestore.", "error");
    }
  };

  // Handler: Masukkan Dokumen Awal ke Cloud Firestore (Tahap 1 Praktik 2)
  const handleMuatDataContoh = async () => {
    setIsLoading(true);
    try {
      await seedContohMenuFirestore();
      tampilkanNotif("Dokumen awal berhasil disimpan ke Cloud Firestore!");
    } catch (err) {
      console.error("Gagal memasukkan data contoh ke Firestore:", err);
      tampilkanNotif("Gagal memasukkan data awal ke Firestore.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Coba Lagi saat Error
  const handleRetry = () => {
    setIsError(false);
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  // State untuk pengujian manual 3 state tampilan (Tahap 3)
  const [manualState, setManualState] = useState(null); // null | 'loading' | 'empty' | 'error'

  const handleTestState = (state) => {
    if (state === "normal") {
      setManualState(null);
    } else {
      setManualState(state);
    }
  };

  // Layar Loading Sesi Awal (Mencegah kedipan redirect saat refresh)
  if (authLoading) {
    return (
      <div className="mobile-app-wrapper">
        <div className="mobile-phone-container auth-loading-container">
          <Header user={null} onLogout={null} />
          <div className="auth-loading-body">
            <div className="auth-spinner" />
            <p className="auth-loading-text">Memeriksa sesi Dapur Nia...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-app-wrapper">
      {/* Toast Alert Feedback */}
      {notif && (
        <div className={`toast-alert toast-${notif.tipe}`} role="status">
          {notif.pesan}
        </div>
      )}

      {/* Jika Belum Masuk: Tampilkan Halaman Masuk / Daftar */}
      {!currentUser ? (
        <div className="mobile-phone-container">
          <Header user={null} onLogout={null} />
          <main className="mobile-main-content auth-view-content">
            <HalamanAuth
              initialMode={currentPath === "/daftar" ? "daftar" : "masuk"}
              onAuthSuccess={() => {
                tampilkanNotif("Berhasil masuk! Selamat datang di Dapur Nia.");
                navigate("/kelola-menu");
              }}
              onNavigate={(path) => navigate(path)}
            />
          </main>
        </div>
      ) : (
        /* Jika Sudah Masuk: Tampilkan Halaman Terproteksi Kelola Menu */
        <>
          {/* Panel Mini Pengujian 3 State (Tahap 3) */}
          <div className="test-state-toolbar">
            <span className="test-toolbar-label">Uji 3 State:</span>
            <div className="test-toolbar-buttons">
              <button
                type="button"
                className={`btn-test-chip ${manualState === null ? "active" : ""}`}
                onClick={() => handleTestState("normal")}
              >
                Normal (Firestore)
              </button>
              <button
                type="button"
                className={`btn-test-chip ${manualState === "loading" ? "active" : ""}`}
                onClick={() => handleTestState("loading")}
              >
                Loading
              </button>
              <button
                type="button"
                className={`btn-test-chip ${manualState === "empty" ? "active" : ""}`}
                onClick={() => handleTestState("empty")}
              >
                Empty
              </button>
              <button
                type="button"
                className={`btn-test-chip ${manualState === "error" ? "active" : ""}`}
                onClick={() => handleTestState("error")}
              >
                Error
              </button>
            </div>
          </div>

          {/* Container Layar Telepon Genggam (Mobile Layout) */}
          <div className="mobile-phone-container">
            {/* Header Bar dengan Nama Pengguna & Tombol Keluar */}
            <Header user={currentUser} onLogout={handleLogout} />

            {/* Konten Utama Menu */}
            <main className="mobile-main-content">
              {/* Baris Judul & Tombol + Tambah Menu */}
              <div className="section-title-bar">
                <h2 className="section-title">Kelola Menu</h2>
                <button
                  type="button"
                  className="btn-tambah-menu-primary"
                  onClick={handleOpenTambah}
                  disabled={isLoading || isError || manualState === "loading" || manualState === "error"}
                >
                  + Tambah Menu
                </button>
              </div>

              {/* Area Kartu Menu dengan 3 State */}
              <div className="menu-cards-container">
                {manualState === "loading" || (manualState === null && isLoading) ? (
                  <LoadingState />
                ) : manualState === "error" || (manualState === null && isError) ? (
                  <ErrorState
                    pesan={manualState === "error" ? "Simulasi Uji State: Terjadi kendala saat mengambil data menu." : errorMessage}
                    onRetry={manualState === "error" ? () => handleTestState("normal") : handleRetry}
                  />
                ) : manualState === "empty" || (manualState === null && daftarMenu.length === 0) ? (
                  <EmptyState onTambah={handleOpenTambah} onMuatContoh={handleMuatDataContoh} />
                ) : (
                  <div className="cards-list">
                    {daftarMenu.map((item) => (
                      <ItemMenu
                        key={item.id}
                        item={item}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>

            {/* Bottom Navigation: Menu & Pesanan */}
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Modal Form Tambah / Ubah */}
          <ModalFormMenu
            isOpen={isModalOpen}
            mode={formMode}
            initialData={selectedMenu}
            isSaving={isSaving}
            onSave={handleSaveMenu}
            onClose={() => setIsModalOpen(false)}
          />

          {/* Modal Konfirmasi Hapus */}
          <ModalKonfirmasiHapus
            isOpen={isDeleteModalOpen}
            item={menuToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setMenuToDelete(null);
            }}
          />
        </>
      )}
    </div>
  );
}
