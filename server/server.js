const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Estado global dos jogadores
let players = {};
let nextPlayerId = 1;

// Estado global dos pontos
let points = {
  1: { id: 1, x: 250, y: 420, width: 20, height: 20, collected: false, type: "coin" },
  2: { id: 2, x: 450, y: 320, width: 20, height: 20, collected: false, type: "gem" },
  3: { id: 3, x: 650, y: 220, width: 20, height: 20, collected: false, type: "coin" },
  4: { id: 4, x: 100, y: 500, width: 20, height: 20, collected: false, type: "gem" },
  5: { id: 5, x: 350, y: 200, width: 20, height: 20, collected: false, type: "coin" },
};

// NPCs do jogo
const npcs = [
  {
    id: 1,
    x: 150,
    y: 510,
    width: 30,
    height: 30,
    name: "Friendly Guard",
    dialogue: "Welcome to our magical world! I've been guarding this area for years. The platforms above hold many treasures - be careful jumping around!",
    emoji: "🛡️",
  },
  {
    id: 2,
    x: 300,
    y: 410,
    width: 30,
    height: 30,
    name: "Wise Merchant",
    dialogue: "Ah, a fellow adventurer! I see you're collecting coins and gems. Did you know the purple gems are worth twice as much as the golden coins?",
    emoji: "🧙‍♂️",
  },
  {
    id: 3,
    x: 550,
    y: 210,
    width: 30,
    height: 30,
    name: "Sky Watcher",
    dialogue: "From up here, I can see the whole world! The view is amazing, but it took me many tries to reach this high platform. Keep practicing your jumps!",
    emoji: "🔭",
  },
];

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  // Criar um novo jogador para o cliente
  const playerId = nextPlayerId++;
  const playerName = `Player ${playerId}`;
  
  players[playerId] = {
    id: playerId,
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    name: playerName,
    socketId: socket.id
  };
  
  // Enviar o ID do jogador para o cliente
  socket.emit('playerAssigned', { playerId, name: playerName });
  
  // Enviar todos os jogadores existentes para o novo cliente
  socket.emit('initialPlayers', players);
  
  // Enviar pontos e NPCs para o novo cliente
  socket.emit('initialPoints', points);
  socket.emit('initialNPCs', npcs);
  
  // Notificar outros clientes sobre o novo jogador
  socket.broadcast.emit('playerAdded', players[playerId]);
  
  // Lidar com atualização de jogador
  socket.on('playerUpdate', (data) => {
    const { playerId, x, y, velocityX, velocityY, onGround } = data;
    
    if (players[playerId] && players[playerId].socketId === socket.id) {
      // Atualizar dados do jogador
      players[playerId].x = x;
      players[playerId].y = y;
      players[playerId].velocityX = velocityX;
      players[playerId].velocityY = velocityY;
      players[playerId].onGround = onGround;
      
      // Enviar atualização para todos os clientes
      io.emit('playerUpdated', {
        playerId,
        x,
        y,
        velocityX,
        velocityY,
        onGround
      });
    }
  });

  // Lidar com coleta de pontos
  socket.on('collectPoint', (data) => {
    const { pointId, playerId } = data;
    
    if (points[pointId] && !points[pointId].collected) {
      points[pointId].collected = true;
      
      // Notificar todos os clientes sobre a coleta
      io.emit('pointCollected', {
        pointId,
        playerId
      });
    }
  });

  // Lidar com respawn do jogador
  socket.on('playerRespawn', (data) => {
    const { playerId, x, y, velocityX, velocityY, onGround } = data;
    
    if (players[playerId] && players[playerId].socketId === socket.id) {
      players[playerId].x = x;
      players[playerId].y = y;
      players[playerId].velocityX = velocityX;
      players[playerId].velocityY = velocityY;
      players[playerId].onGround = onGround;
      
      // Notificar todos os clientes sobre o respawn
      io.emit('playerUpdated', {
        playerId,
        x,
        y,
        velocityX,
        velocityY,
        onGround
      });
    }
  });
  
  // Lidar com desconexão
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    
    // Encontrar e remover o jogador desconectado
    const playerToRemove = Object.values(players).find(player => player.socketId === socket.id);
    if (playerToRemove) {
      delete players[playerToRemove.id];
      // Notificar outros clientes sobre a remoção
      socket.broadcast.emit('playerRemoved', playerToRemove.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
