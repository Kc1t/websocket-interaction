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
  
  // Criar uma nova bolinha para o cliente IMEDIATAMENTE
  const ballId = nextBallId++;
  const color = colors[(ballId - 1) % colors.length];
  
    balls[ballId] = {
      id: ballId,
      x: Math.random() * 800 + 50, // Posição inicial para canvas full-width
      y: Math.random() * 400 + 50, // Posição inicial para canvas full-height  
      color: color,
      socketId: socket.id
    };  console.log(`🎯 Criando nova bolinha para ${socket.id}:`, balls[ballId]);
  
  // Enviar IMEDIATAMENTE
  console.log(`📤 Enviando ballAssigned IMEDIATAMENTE para ${socket.id}:`, { ballId, color });
  socket.emit('ballAssigned', { ballId, color });
  
  console.log(`📤 Enviando initialBalls IMEDIATAMENTE para ${socket.id}:`, balls);
  socket.emit('initialBalls', balls);
  
  // Notificar outros clientes sobre a nova bolinha
  console.log(`📢 Notificando outros clientes sobre nova bolinha:`, balls[ballId]);
  socket.broadcast.emit('ballAdded', balls[ballId]);
  
  // TAMBÉM enviar com timeout como backup
  setTimeout(() => {
    console.log(`🔄 BACKUP: Reenviando dados para ${socket.id} após timeout`);
    
    // Enviar o ID da bolinha para o cliente
    console.log(`📤 Enviando ballAssigned para ${socket.id}:`, { ballId, color });
    const ballAssignedResult = socket.emit('ballAssigned', { ballId, color });
    console.log(`📤 Resultado ballAssigned:`, ballAssignedResult);
    
    // Enviar todas as bolinhas existentes para o novo cliente
    console.log(`📤 Enviando initialBalls para ${socket.id}:`, balls);
    const initialBallsResult = socket.emit('initialBalls', balls);
    console.log(`📤 Resultado initialBalls:`, initialBallsResult);
  }, 100); // Aguardar 100ms
  
  // Handler para reenviar dados se solicitado
  socket.on('requestData', () => {
    console.log(`🔄 Cliente ${socket.id} solicitou reenvio de dados`);
    const clientBall = Object.values(balls).find(ball => ball.socketId === socket.id);
    if (clientBall) {
      console.log(`📤 Reenviando ballAssigned para ${socket.id}:`, { ballId: clientBall.id, color: clientBall.color });
      socket.emit('ballAssigned', { ballId: clientBall.id, color: clientBall.color });
      
      console.log(`📤 Reenviando initialBalls para ${socket.id}:`, balls);
      socket.emit('initialBalls', balls);
    }
  });

  // Teste de ping-pong para verificar comunicação básica
  socket.on('ping', (data) => {
    console.log(`🏓 Ping recebido de ${socket.id}:`, data);
    socket.emit('pong', { message: 'Pong from server!', timestamp: Date.now() });
  });
  
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
