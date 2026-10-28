export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-row ${
        isUser ? "message-row-user" : "message-row-assistant"
      }`}
    >
      {!isUser && (
        <div className="message-avatar assistant-avatar" aria-label="AI Assistant">
          AI
        </div>
      )}

      <div className="message-content">
        <div className="message-sender">
          {isUser ? "You" : "AI Assistant"}
        </div>

        <div
          className={`message-bubble ${
            isUser ? "user-bubble" : "assistant-bubble"
          }`}
        >
          <p>{message.content}</p>
        </div>
      </div>

      {isUser && (
        <div className="message-avatar user-avatar" aria-label="You">
          You
        </div>
      )}
    </div>
  );
}