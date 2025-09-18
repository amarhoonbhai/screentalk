import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));

app.get("/", (_req, res) => {
  res.send("🎬 ScreenTalk Backend Running!");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    socket.emit("system", `Joined room: ${room}`);
    console.log(`➡️  ${socket.id} joined ${room}`);
  });

  socket.on("send_message", (payload) => {
    // payload: { room, username, message }
    payload.timestamp = new Date().toISOString();
    io.to(payload.room).emit("receive_message", payload);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 ScreenTalk backend on :${PORT}`);
});
