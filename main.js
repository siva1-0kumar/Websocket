// main.js

const http = require('http');
const WebSocket = require('ws');

// Change port if needed
let port = 8081;

// Create HTTP server with simple response to avoid hanging requests
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

// Create WebSocket server, attach to HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Echo back the received message
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to start server listening on a port, with retry on EADDRINUSE
function startServer(p) {
  server.listen(p, () => {
    console.log(`Server is listening on port ${p}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${p} is already in use, trying port ${p + 1}...`);
      server.close();
      startServer(p + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(port);

// Add process-level uncaught exception and unhandled rejection handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
