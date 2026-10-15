import React from "react";

export default function Header({ user, onLogout }) {
  // Ambil nama tampilan pengguna (displayName atau nama sebelum @ di email)
  const getNamaPanggilan = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) {
      const bagianAwal = user.email.split("@")[0];
      return bagianAwal.charAt(0).toUpperCase() + bagianAwal.slice(1);
    }
    return "Nia";
  };

  return (
    <header className="brand-header">
      <div className="brand-left">
        <div className="brand-logo" aria-hidden="true">
          DN
        </div>
        <div className="brand-info">
          <h1 className="brand-name">Dapur Nia</h1>
        </div>
      </div>

      <div className="brand-right">
        {user ? (
          <div className="user-auth-header-bar">
            <span className="user-display-name">{getNamaPanggilan()}</span>
            <span className="user-header-divider">·</span>
            <button
              type="button"
              className="btn-header-logout"
              onClick={onLogout}
              title="Keluar dari akun"
            >
              Keluar
            </button>
          </div>
        ) : (
          <span className="domain-badge" title="URL Publik Netlify">
            app2-dapur-nia.netlify.app
          </span>
        )}
      </div>
    </header>
  );
}
