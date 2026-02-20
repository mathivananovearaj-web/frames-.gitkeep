/* ---------------- SCROLL ANIMATION ---------------- */

const frames = 240;
const canvas = document.getElementById("animation");
const context = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1920;

const images = [];
let loaded = 0;

function framePath(i) {
    const num = String(i).padStart(3, "0");
    return `frames/ezgif-frame-${num}.jpg`;
}

for (let i = 1; i <= frames; i++) {
    const img = new Image();
    img.src = framePath(i);
    img.onload = () => {
        loaded++;
        if (loaded === 1) drawFrame(1);
    };
    images.push(img);
}

function drawFrame(index) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index - 1], 0, 0, canvas.width, canvas.height);
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;
    const frameIndex = Math.min(frames, Math.ceil(scrollFraction * frames));
    drawFrame(frameIndex);
});

/* ---------------- CHATBOT ---------------- */

async function sendMessage() {
    let input = document.getElementById("user-input");
    let chatBody = document.getElementById("chat-body");

    if (!input.value.trim()) return;

    // Display user message
    chatBody.innerHTML += `<div><b>You:</b> ${input.value}</div>`;

    const systemPrompt = `
You are a resume-based assistant. 
You MUST answer ONLY using the details present in this resume:

Name: BHUVANAP
Phone: +91 9360129760
Email: bhuvi2052006@gmail.com
Address: Rajapalayam
Career Objective: Seeking internship in Electronics and Communication Engineering...
Skills: Python, C, Excel, PowerPoint, Embedded System, VLSI...
Internship: Industrial Automation using PLC...
Education: SSLC 94%, HSC, B.E ECE CGPA 8.74*...
Certifications: IR4.0 Technologies...
Projects: Driver Anti Sleep Device...
Achievements: Techathon 2025 Flood Detection...

If the answer is not in the resume, reply: "This information is not available in the resume."
`;

    // Gemini API call
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { role: "system", parts: [{ text: systemPrompt }] },
                    { role: "user", parts: [{ text: input.value }] }
                ]
            })
        }
    );

    const data = await response.json();
    const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Error fetching response.";

    chatBody.innerHTML += `<div><b>Bot:</b> ${botReply}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    input.value = "";
}
