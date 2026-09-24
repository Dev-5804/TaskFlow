import http from "node:http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = Number(process.env.REALTIME_PORT || 4001);
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: corsOrigin }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "taskflow-realtime" });
});

const io = new Server(server, {
  cors: { origin: corsOrigin },
});

io.on("connection", (socket) => {
  socket.on("board:join", (boardId) => {
    socket.join(`board:${boardId}`);
  });

  socket.on("board:leave", (boardId) => {
    socket.leave(`board:${boardId}`);
  });
});

server.listen(port, () => {
  console.log(`TaskFlow real-time service is running on http://localhost:${port}`);
});
