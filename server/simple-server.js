// SIMPLE SERVER - Versão simplificada
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { simpleTimer } from './simple-timer.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// Armazenar clientes conectados
const clients = new Set();

// WebSocket para sincronização em tempo real
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Enviar estado atual para o novo cliente
  ws.send(JSON.stringify({
    type: 'timer_update',
    data: simpleTimer.getState()
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      // Por enquanto, apenas log das mensagens
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Função para enviar atualizações para todos os clientes
function broadcastUpdate() {
  const state = simpleTimer.getState();
  const message = JSON.stringify({
    type: 'timer_update',
    data: state
  });

  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Configurar timer para enviar atualizações
simpleTimer.onUpdate = broadcastUpdate;

// Rotas da API
app.get('/api/timer/current', (req, res) => {
  res.json(simpleTimer.getState());
});

app.post('/api/timer/config', (req, res) => {
  try {
    const { rounds, fightTime, restTime } = req.body;
    simpleTimer.setConfig({ rounds, fightTime, restTime });
    res.json(simpleTimer.getState());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/timer/control', (req, res) => {
  try {
    const { action } = req.body;
    
    switch (action) {
      case 'start':
        simpleTimer.start();
        break;
      case 'pause':
        simpleTimer.pause();
        break;
      case 'reset':
        simpleTimer.reset();
        break;
      default:
        throw new Error('Invalid action');
    }
    
    res.json(simpleTimer.getState());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Servir arquivos estáticos
app.use(express.static('client'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Simple Timer Server running on port ${PORT}`);
  console.log('Timer state:', simpleTimer.getState());
});
