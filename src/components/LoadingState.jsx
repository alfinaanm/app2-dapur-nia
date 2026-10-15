import React from "react";

export default function LoadingState() {
  return (
    <div className="state-container loading-state" role="status" aria-live="polite">
      <div className="skeleton-cards-list">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton-card">
            <div className="skeleton-top-row">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-price"></div>
            </div>
            <div className="skeleton-badge-row">
              <div className="skeleton-pill"></div>
            </div>
            <div className="card-divider"></div>
            <div className="skeleton-actions-row">
              <div className="skeleton-action-text"></div>
              <div className="skeleton-action-text"></div>
            </div>
          </div>
        ))}
      </div>
      <p className="loading-text">
        <span className="spinner"></span> Memuat daftar menu Dapur Nia...
      </p>
    </div>
  );
}
