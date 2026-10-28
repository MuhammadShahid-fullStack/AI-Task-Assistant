import { useCallback, useState } from "react";
import { sendChatMessage } from "../services/chatService";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Assalam-o-Alaikum! Main aapka AI Task Assistant hoon. Aap mujhe tasks create karne, list dekhne, update karne ya delete karne ke liye keh sakte hain.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = useCallback(
    async (text) => {
      const message = text.trim();

      if (!message || isLoading) {
        return;
      }

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      };

      setMessages((previous) => [...previous, userMessage]);
      setIsLoading(true);
      setError("");

      try {
        const reply = await sendChatMessage(message);

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply,
          },
        ]);
      } catch (err) {
        setError(
          err.message || "Message send nahi ho saka. Dobara try karein."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}