const API_KEY = "AIzaSyCwJorMxxZM4r2TMyDCbHLTEbyQX_LlGBE";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// 🔹 Improved Response Generator with Structured + Conversational Style
async function generateResponse(prompt) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a friendly and knowledgeable AI assistant. 
Answer in a clear, conversational tone with short paragraphs or bullet points. 
Keep explanations simple, structured, and helpful. 
If examples are relevant, include them. 

User: ${prompt}  
Assistant:`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate response");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// 🔹 Clean Markdown / Extra Characters
function cleanMarkdown(text) {
  return text
    .replace(/#{1,6}\s?/g, "") // remove headings
    .replace(/\\/g, "") // remove backslashes
    .replace(/\n{3,}/g, "\n\n") // normalize spacing
    .trim();
}

// 🔹 Add Chat Message to UI
function addMessage(message, isUser) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isUser ? "user-message" : "bot-message");

  const profileImage = document.createElement("img");
  profileImage.classList.add("profile-image");
  profileImage.src = isUser ? "boy.png" : "assistant.png";
  profileImage.alt = isUser ? "User" : "Bot";

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.innerHTML = message.replace(/\n/g, "<br>");


  messageElement.appendChild(profileImage);
  messageElement.appendChild(messageContent);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 🔹 Handle User Input
async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, true);
    userInput.value = "";
    sendButton.disabled = true;
    userInput.disabled = true;

    try {
      const botMessage = await generateResponse(userMessage);
      addMessage(cleanMarkdown(botMessage), false);
    } catch (error) {
      console.error("Error:", error);
      addMessage("⚠️ Sorry, I encountered an error. Please try again.", false);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }
}

// 🔹 Event Listeners
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});
