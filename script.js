// --- SCROLL ANIMATION LOGIC ---
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

canvas.width = 1158;
canvas.height = 770;

const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const resumeState = {
  frame: 0
};

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = render;

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[resumeState.frame], 0, 0);
}

window.addEventListener('scroll', () => {  
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  resumeState.frame = frameIndex;
  requestAnimationFrame(render);
});

const html = document.documentElement;

// --- CHATBOT LOGIC ---
const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const closeChat = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');

// Resume Data to be used as Context
const RESUME_CONTENT = `
Siva Subramanian M, ECE Student at Government College of Engineering, Tirunelveli (CGPA: 8.56). 
Skills: Python, IoT, automation, embedded systems. 
Projects: Obstacle Avoiding Robot (Arduino, Ultrasonic), Smart Irrigation System (IoT, soil moisture). 
Certifications: IBM Python 101, Excel Beginners. 
Internship: 1M1B Green Internship by Salesforce. 
Soft Skills: Empathetic Listener, Time Management, Adaptability, Strategic Thinking.
Contact: +91-7010913957, siva31102005@gmail.com.
`;

const SYSTEM_PROMPT = `You are an AI assistant for Siva Subramanian M. You must ONLY answer questions using the following resume details: ${RESUME_CONTENT}. If a user asks something not in this text, politely say you only have information regarding Siva's professional background.`;

chatToggle.onclick = () => chatWidget.classList.toggle('chat-closed');
closeChat.onclick = () => chatWidget.classList.add('chat-closed');

async function callGemini(message) {
    // Replace YOUR_API_KEY with your actual Google Gemini API Key
    const API_KEY = "YOUR_API_KEY_HERE"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }] }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

sendBtn.onclick = async () => {
    const text = userInput.value;
    if (!text) return;

    appendMessage('user-msg', text);
    userInput.value = '';

    try {
        const botResponse = await callGemini(text);
        appendMessage('bot-msg', botResponse);
    } catch (e) {
        appendMessage('bot-msg', "Sorry, I'm having trouble connecting right now.");
    }
};

function appendMessage(className, text) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
