import express, { type Request, type Response } from 'express';
import { globalErrorHandler } from './middlewares/global-error-handler.js';
import v1Router from './routes/index.js';
import http from "http";
import { initializeChatSocket } from './sockets/chat/chat-socket.js';

export const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
export const server = http.createServer(app);

app.use(express.json());
app.use("/api/v1", v1Router);

// keep error handler as last use statement
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws/chat`);

  try {
    initializeChatSocket(server);
    console.log("WebSocket initialization called");
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
  }
});