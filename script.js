const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const conversationHistory = [
  {
    role: "system",
    content: `You are a friendly and knowledgeable L'Oréal beauty advisor. 
    You help customers find the right L'Oréal products and build personalized skincare 
    and haircare routines. You have deep knowledge of L'Oréal's product lines including 
    L'Oréal Paris, Lancôme, Garnier, Maybelline, NYX, Kérastase, and Redken.
    
    IMPORTANT RULES:
    - Only answer questions related to beauty, skincare, haircare, makeup, and L'Oréal products
    - If someone asks about something unrelated to beauty or L'Oréal, politely decline and redirect
    - Always recommend specific L'Oréal products when possible
    - Be warm, encouraging and professional
    - Use emojis occasionally to be friendly
    - Keep responses concise and helpful`
  }
];

const WORKER_URL = "https://sparkling-tree-9291loreal-chatbot.ss7671.workers.dev";

addMessage("ai", "👋 Welcome to L'Oréal's Smart Beauty Advisor! I'm here to help you find the perfect products and build your ideal beauty routine. What can I help you with today? ✨");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  conversationHistory.push({
    role: "user",
    content: message
  });

  const loadingId = addMessage("ai", "✨ Finding the best answer for you...");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory })
    });

    const data = await response.json();
    console.log("API response:", data);

    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();

    if (data.choices && data.choices[0]) {
      const aiReply = data.choices[0].message.content;
      addMessage("ai", aiReply);
      conversationHistory.push({
        role: "assistant",
        content: aiReply
      });
    } else {
      addMessage("ai", "Sorry, I couldn't get a response. Error: " + JSON.stringify(data));
    }

  } catch (error) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();
    addMessage("ai", "Sorry, something went wrong. Please try again!");
    console.error("Error:", error);
  }
});

function addMessage(role, text) {
  const id = "msg-" + Date.now();
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.id = id;

  if (role === "user") {
    div.innerHTML = `<span class="msg-label">You</span><p>${text}</p>`;
  } else {
    div.innerHTML = `<span class="msg-label">L'Oréal Advisor</span><p>${text}</p>`;
  }

  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return id;
}
