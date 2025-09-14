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
  
  // Criar uma nova bolinha para o cliente IMEDIATAMENTE
  const ballId = nextBallId++;
  const color = colors[(ballId - 1) % colors.length];
  
  balls[ballId] = {
    id: ballId,
    x: Math.random() * 252 + 24, // Posição inicial aleatória dentro da canvas 300x300
    y: Math.random() * 252 + 24, // Considerando raio da bolinha (24px)
    color: color,
    socketId: socket.id
  };
  
  console.log(`🎯 Criando nova bolinha para ${socket.id}:`, balls[ballId]);
  
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
