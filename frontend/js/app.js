const backendURL = window.BACKEND_URL || "http://localhost:3001";
const socket = io(backendURL, { transports: ["websocket"] });

// UI elements
const roomEl = document.getElementById("room");
const userEl = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const logEl = document.getElementById("log");
const msgEl = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

let joinedRoom = null;
let username = null;

function line(html) {
  const p = document.createElement("div");
  p.className = "msg";
  p.innerHTML = html;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

socket.on("system", (txt) => {
  line(`<span class="meta">🟢 ${txt}</span>`);
});

socket.on("receive_message", (data) => {
  const t = new Date(data.timestamp).toLocaleTimeString();
  line(`<div><b>${data.username}</b> <span class="meta">(${t})</span><br/>${data.message}</div>`);
});

joinBtn.onclick = () => {
  const r = roomEl.value.trim();
  const u = userEl.value.trim();
  if (!r || !u) return alert("Enter room and username");
  socket.emit("join_room", r);
  joinedRoom = r;
  username = u;
  line(`<span class="meta">Joined <b>${r}</b> as <b>${u}</b></span>`);
};

sendBtn.onclick = () => {
  const text = msgEl.value.trim();
  if (!text || !joinedRoom || !username) return;
  socket.emit("send_message", { room: joinedRoom, username, message: text });
  msgEl.value = "";
};

msgEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
