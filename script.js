const sendBtn = document.querySelector(".send-btn");
const textarea = document.querySelector(".ask-card textarea");
const chatContainer = document.getElementById("chat-container");

// Function to add message to chat
function appendMessage(text, sender, isHTML = false) {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", sender);
  msg.innerHTML = isHTML ? text : text.replace(/\n/g, "<br>");
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send message to OpenRouter AI
async function sendMessage() {
  const input = textarea.value.trim();
  if (!input) return;
    appendMessage(input, "user");
  textarea.value = "";

  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("chat-message", "ai");
  loadingMsg.textContent = "Typing...";
  chatContainer.appendChild(loadingMsg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const lowerInput = input.toLowerCase();

  // ✅ Custom AI identity response for all such questions
  const aiIdentityTriggers = [
    "who are you",
    "what is askme",
    "what can you do",
    "who made you",
    "tum kaun ho",
    "tum kya kar sakte ho",
    "tum kisne banaya",
    "you are",
    "who you are",
    "who created you",
    "who created you?",
    "who has made you"
  ];

  if (aiIdentityTriggers.some(trigger => lowerInput.includes(trigger))) {
    loadingMsg.remove();
    appendMessage(
      "Hello! I'm <strong>AskMe.ai</strong> — created by UjjwalByte. I'm here to help, how can help you?",
      "ai",
      true
    );
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost", // Change in production
        "X-Title": "AskMe.ai",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: input }],
      }),
    });

    const data = await response.json();
    const markdown = data.choices?.[0]?.message?.content || "No response received.";
    loadingMsg.innerHTML = marked.parse(markdown);
  } catch (error) {
    loadingMsg.textContent = "Error: " + error.message;
  }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Typewriter welcome screen
const typewriterText = document.getElementById("typewriter-text");
const messages = [
  "Your futuristic AI chat assistant is ready.",
  "Type anything in the box below and hit send.",
  "Need answers? Ideas? Just ask!",
  "Built for speed, clarity, and intelligence.",
  "Try asking a question now — it's that simple.",
];

let messageIndex = 0;
let charIndex = 0;
let currentText = "";
let typing = true;

function typeWriter() {
  if (typing) {
    if (charIndex < messages[messageIndex].length) {
      currentText += messages[messageIndex][charIndex++];
      typewriterText.textContent = currentText;
      setTimeout(typeWriter, 50);
    } else {
      typing = false;
      setTimeout(typeWriter, 1200);
    }
  } else {
    if (charIndex > 0) {
      currentText = currentText.slice(0, --charIndex);
      typewriterText.textContent = currentText;
      setTimeout(typeWriter, 30);
    } else {
      typing = true;
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(typeWriter, 100);
    }
  }
}

typeWriter();

// First message typing on load
const aiText = "Hello! I'm AskMe.ai — created by UjjwalByte. How can I help you today?";
const aiMessageDiv = document.getElementById("ai-message");
let i = 0;

function typeAiMessage() {
  if (i < aiText.length) {
    aiMessageDiv.textContent += aiText.charAt(i);
    i++;
    setTimeout(typeAiMessage, 40);
  }
}
window.addEventListener("load", typeAiMessage);
