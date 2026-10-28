const suggestions = [
  {
    icon: "＋",
    title: "Create a task",
    description: "Add a new task to your list",
    prompt: "Mere liye ek naya task create karne mein madad karo.",
  },
  {
    icon: "☷",
    title: "View my tasks",
    description: "See all your saved tasks",
    prompt: "Mere tamam tasks dikhao.",
  },
  {
    icon: "✓",
    title: "Update a task",
    description: "Change task status",
    prompt: "Mere tasks ke statuses dikhao taa-ke main update kar sakoon.",
  },
];

export default function Sidebar({ onSuggestionClick }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-section">
        <p className="sidebar-label">WORKSPACE</p>

        <button
          type="button"
          className="sidebar-nav-item active"
          onClick={() => onSuggestionClick?.("Mere tamam tasks dikhao.")}
        >
          <span className="sidebar-nav-icon">▦</span>
          <span>AI Assistant</span>
          <span className="nav-arrow">›</span>
        </button>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <p className="sidebar-label">QUICK ACTIONS</p>

        <div className="suggestion-list">
          {suggestions.map((item) => (
            <button
              type="button"
              className="suggestion-card"
              key={item.title}
              onClick={() => onSuggestionClick?.(item.prompt)}
            >
              <span className="suggestion-icon">{item.icon}</span>

              <span className="suggestion-text">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">✦</div>
        <div>
          <strong>Powered by Gemini</strong>
          <p>Your AI task companion</p>
        </div>
      </div>
    </aside>
  );
}