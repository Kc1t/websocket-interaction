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

// Estado global das bolinhas
let balls = {};
let nextBallId = 1;

// Cores disponíveis para as bolinhas
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  // Criar uma nova bolinha para o cliente
  const ballId = nextBallId++;
  const color = colors[(ballId - 1) % colors.length];
  
  balls[ballId] = {
    id: ballId,
    x: Math.random() * 252 + 24, // Posição inicial aleatória dentro da canvas 300x300
    y: Math.random() * 252 + 24, // Considerando raio da bolinha (24px)
    color: color,
    socketId: socket.id
  };
  
  // Enviar o ID da bolinha para o cliente
  socket.emit('ballAssigned', { ballId, color });
  
  // Enviar todas as bolinhas existentes para o novo cliente
  socket.emit('initialBalls', balls);
  
  // Notificar outros clientes sobre a nova bolinha
  socket.broadcast.emit('ballAdded', balls[ballId]);
  
  // Lidar com movimento de bolinha
  socket.on('moveBall', (data) => {
    const { ballId, x, y } = data;
    
    if (balls[ballId] && balls[ballId].socketId === socket.id) {
      // Aceitar qualquer coordenada válida (validação feita no cliente)
      balls[ballId].x = x;
      balls[ballId].y = y;
      
      // Enviar atualização para todos os clientes
      io.emit('ballMoved', {
        ballId,
        x: x,
        y: y
      });
    }
  });
  
  // Lidar com desconexão
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    
    // Encontrar e remover a bolinha do cliente desconectado
    const ballToRemove = Object.values(balls).find(ball => ball.socketId === socket.id);
    if (ballToRemove) {
      delete balls[ballToRemove.id];
      // Notificar outros clientes sobre a remoção
      socket.broadcast.emit('ballRemoved', ballToRemove.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
