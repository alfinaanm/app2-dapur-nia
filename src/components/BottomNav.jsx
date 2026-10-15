import React from "react";

export default function BottomNav({ activeTab = "menu", onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi Utama">
      {/* Tab 1: Menu (Aktif) */}
      <button
        type="button"
        className={`nav-tab ${activeTab === "menu" ? "tab-active" : ""}`}
        onClick={() => onTabChange("menu")}
      >
        <svg
          className="nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Mangkok masakan / steaming soup */}
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="2" x2="6" y2="4"></line>
          <line x1="10" y1="2" x2="10" y2="4"></line>
          <line x1="14" y1="2" x2="14" y2="4"></line>
        </svg>
        <span className="nav-label">Menu</span>
      </button>

      {/* Tab 2: Pesanan */}
      <button
        type="button"
        className={`nav-tab ${activeTab === "pesanan" ? "tab-active" : ""}`}
        onClick={() => onTabChange("pesanan")}
      >
        <svg
          className="nav-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Ikon Struk / Pesanan */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className="nav-label">Pesanan</span>
      </button>
    </nav>
  );
}
