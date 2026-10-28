import { useEffect } from "react";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import useChat from "../../hooks/useChat";

export default function ChatWindow() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  } = useChat();

  useEffect(() => {
    const handleSuggestion = (event) => {
      const prompt = event.detail?.prompt;

      if (typeof prompt === "string" && prompt.trim()) {
        sendMessage(prompt);
      }
    };

    window.addEventListener(
      "task-assistant-suggestion",
      handleSuggestion
    );

    return () => {
      window.removeEventListener(
        "task-assistant-suggestion",
        handleSuggestion
      );
    };
  }, [sendMessage]);

  const handleSend = (message) => {
    clearError();
    sendMessage(message);
  };

  return (
    <section className="chat-window" aria-label="AI Task Assistant chat">
      <div className="chat-heading">
        <div>
          <p className="chat-eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h2>AI Task Assistant</h2>
          <p className="chat-subtitle">
            Manage your tasks with simple conversations.
          </p>
        </div>

        <div className="connection-status">
          <span className="status-dot" />
          Ready to help
        </div>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      {error && (
        <div className="chat-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </section>
  );
}