const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendChatMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Assistant se response nahi mila."
      );
    }

    return data.reply;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Backend se connection nahi ho raha. Check karein ke backend server chal raha hai."
      );
    }

    throw error;
  }
}