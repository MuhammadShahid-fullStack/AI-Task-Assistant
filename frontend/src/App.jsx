import { useRef } from "react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";

import "./styles/global.css";
import "./styles/chat.css";

export default function App() {
  const chatInputRef = useRef(null);

  const handleSuggestionClick = (prompt) => {
    window.dispatchEvent(
      new CustomEvent("task-assistant-suggestion", {
        detail: { prompt },
      })
    );
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <Sidebar onSuggestionClick={handleSuggestionClick} />

        <ChatWindow />
      </main>
    </div>
  );
}