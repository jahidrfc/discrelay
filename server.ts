// server.ts
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import botInit from "@/lib/bot";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res);
});

// Attach Socket.IO to the same server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Example: broadcast Discord events
botInit(io);
io.on("connection", (socket) => {
  console.log("Client connected");
});

httpServer.listen(Number(Bun.env.PORT || 3000), () => {
  console.log("🚀 Next.js + Bun + Discord bot running at http://localhost:3000");
});
