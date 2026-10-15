import React, { useState } from "react";
import { masukDenganEmail, daftarDenganEmail } from "../services/firebase";

export default function HalamanAuth({ onAuthSuccess, onNavigate, initialMode = "masuk" }) {
  const [mode, setMode] = useState(initialMode); // "masuk" | "daftar"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleToggleMode = (newMode) => {
    setMode(newMode);
    setErrorMsg("");
    if (onNavigate) {
      onNavigate(newMode === "masuk" ? "/masuk" : "/daftar");
    }
  };

  const terjemahkanGalatFirebase = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email atau kata sandi salah. Silakan periksa kembali.";
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Silakan gunakan menu Masuk.";
      case "auth/weak-password":
        return "Kata sandi terlalu pendek. Minimal 6 karakter.";
      case "auth/invalid-email":
        return "Format alamat email tidak sah.";
      case "auth/network-request-failed":
        return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.";
      default:
        return "Terjadi kendala saat memproses akun. Silakan coba lagi.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi harus minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "masuk") {
        await masukDenganEmail(email, password);
      } else {
        await daftarDenganEmail(email, password, nama || "Nia");
      }
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      console.error("Auth error:", err);
      const friendly = terjemahkanGalatFirebase(err.code);
      setErrorMsg(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  // Shortcut Akun Uji Coba untuk Memudahkan Praktik Bootcamp
  const isiAkunUji = (emailUji, passUji = "password123") => {
    setEmail(emailUji);
    setPassword(passUji);
    if (mode === "daftar") setNama("Nia");
    setErrorMsg("");
  };

  return (
    <div className="auth-card-wrapper">
      <div className="auth-card">
        <h2 className="auth-card-title">
          {mode === "masuk" ? "Masuk" : "Daftar"}
        </h2>

        {errorMsg && (
          <div className="auth-alert-error" role="alert">
            <span className="auth-alert-icon">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {mode === "daftar" && (
            <div className="auth-form-group">
              <label htmlFor="auth-nama" className="auth-label">
                Nama Panggilan
              </label>
              <input
                id="auth-nama"
                type="text"
                className="auth-input"
                placeholder="Contoh: Nia"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="auth-email" className="auth-label">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="nia@dapurnia.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-password" className="auth-label">
              Kata Sandi
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete={mode === "masuk" ? "current-password" : "new-password"}
            />
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-btn-loading">
                <span className="mini-spinner" aria-hidden="true" />
                <span>Memproses...</span>
              </span>
            ) : mode === "masuk" ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {mode === "masuk" ? (
            <p>
              Belum punya akun?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => handleToggleMode("daftar")}
                disabled={isLoading}
              >
                Daftar
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => handleToggleMode("masuk")}
                disabled={isLoading}
              >
                Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
