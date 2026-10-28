export default function TypingIndicator() {
  return (
    <div className="message-row message-row-assistant">
      <div className="message-avatar assistant-avatar" aria-label="AI Assistant">
        AI
      </div>

      <div className="message-content">
        <div className="message-sender">AI Assistant</div>

        <div className="typing-indicator" role="status" aria-label="AI is typing">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-label">Thinking...</span>
        </div>
      </div>
    </div>
  );
}