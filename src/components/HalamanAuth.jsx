import React, { useState } from "react";
import { masukDenganEmail, daftarDenganEmail, masukDenganGoogle } from "../services/firebase";

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
      case "auth/popup-closed-by-user":
        return "Jendela masuk Google ditutup sebelum selesai.";
      case "auth/unauthorized-domain":
        return "Domain web ini belum diizinkan di Firebase Authentication. Tambahkan domain ini ke Authorized Domains di Firebase Console.";
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

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      await masukDenganGoogle();
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      console.error("Google sign in error:", err);
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

        <div className="auth-divider">
          <span>atau</span>
        </div>

        <button
          type="button"
          className="auth-btn-google"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{mode === "masuk" ? "Masuk dengan Google" : "Daftar dengan Google"}</span>
        </button>

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
