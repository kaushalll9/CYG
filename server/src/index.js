import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection, getDbStatus } from './db/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Real-time Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Health check endpoint for Phase 0 & frontend status check
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    phase: 'Phase 0: Planning and project setup',
    message: 'Backend relay server is online and operational',
    timestamp: new Date().toISOString(),
    database: dbHealth.connected ? 'Connected (PostgreSQL)' : 'Awaiting credentials / Offline'
  });
});

// Basic Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

export function startServer(port = PORT) {
  return new Promise((resolve) => {
    server.listen(port, async () => {
      console.log(`\n=================================================`);
      console.log(`🚀 CipherChat Relay Server running on port ${port}`);
      console.log(`📡 WebSocket server ready for Socket.IO clients`);
      console.log(`=================================================`);
      const dbStatus = await checkDatabaseConnection();
      if (dbStatus.connected) {
        console.log(`✅ PostgreSQL database connected successfully.`);
      } else {
        console.log(`ℹ️  PostgreSQL check: ${dbStatus.error || 'not connected'}`);
        console.log(`   (Database connection can be configured in server/.env)`);
      }
      resolve(server);
    });
  });
}

// Auto-start only when run directly (not when imported in tests)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer();
}

export { app, server, io };
