const { createServer } = require('http');
const { Server } = require('ws');
require('dotenv').config({ path: `.env.local` });

const server = createServer();
const wss = new Server({ server });
const activeStreams = new Map(); // Map to keep track of active streams per client

let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Handle HTTP requests
server.on('request', (req, res) => {
  if (req.method === 'GET' && req.url === '/streams') {
    const activeStreamsList = [];
    
    activeStreams.forEach((streams, ws) => {
      streams.forEach((stream, streamId) => {
        activeStreamsList.push({ clientId: ws._socket.remoteAddress, streamId });
      });
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(activeStreamsList));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Initialize active streams for the new client
  activeStreams.set(ws, new Map());

  ws.on('message', async (message) => {
    try {
      const { action, streamId, params } = JSON.parse(message);

      if (action === 'startStream') {
        if (activeStreams.get(ws).has(streamId)) {
          ws.send(JSON.stringify({ error: 'Stream with this ID already active' }));
          return;
        }

        // Start a new stream for this client
        const stream = await startStream(params, ws, streamId);
        activeStreams.get(ws).set(streamId, stream);
      } else if (action === 'stopStream') {
        const stream = activeStreams.get(ws).get(streamId);
        if (stream) {
          stream.destroy();
          activeStreams.get(ws).delete(streamId);
        } else {
          ws.send(JSON.stringify({ error: 'No stream found with this ID' }));
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    const streams = activeStreams.get(ws);
    if (streams) {
      streams.forEach(stream => stream.destroy());
      activeStreams.delete(ws);
    }
  });

  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
});

async function startStream(params, ws, streamId) {
  const url = 'https://api.twitter.com/2/tweets/search/stream';
  const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to connect to X streaming endpoint: ${JSON.stringify(response)}`);
  }

  const stream = response.body;

  stream.on('data', (chunk) => {
    const message = chunk.toString();
    // Send data with stream ID
    ws.send(JSON.stringify({ streamId, data: message }));
  });

  stream.on('end', () => {
    console.log('X stream ended');
  });

  stream.on('error', (error) => {
    console.error('X stream error:', error);
  });

  return stream;
}

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
