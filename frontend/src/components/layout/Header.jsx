export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo" aria-label="Task Assistant logo">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>

        <div className="brand-text">
          <h1>TaskFlow</h1>
          <p>AI-powered productivity</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-ai-badge">
          <span className="status-dot" />
          Gemini AI
        </div>

        <div className="header-avatar" title="Your workspace">
          U
        </div>
      </div>
    </header>
  );
}