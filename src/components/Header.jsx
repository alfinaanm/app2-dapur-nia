import React from "react";

export default function Header() {
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
        <span className="domain-badge" title="URL Publik Netlify">
          app2-dapur-nia.netlify.app
        </span>
      </div>
    </header>
  );
}
