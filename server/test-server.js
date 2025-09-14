const { io } = require("socket.io-client");

console.log("🧪 Testando conexão com servidor...");

// Tentar conectar no servidor
const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("✅ Conectado ao servidor:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado do servidor");
});

socket.on("connect_error", (error) => {
  console.error("🚨 Erro de conexão:", error.message);
  process.exit(1);
});

socket.on("ballAssigned", (data) => {
  console.log("🎯 Ball atribuída:", data);
});

socket.on("initialBalls", (balls) => {
  console.log("🔄 Estado inicial:", balls);
  console.log("📊 Total de balls:", Object.keys(balls).length);
  
  // Desconectar após receber os dados
  setTimeout(() => {
    console.log("✨ Teste concluído com sucesso!");
    socket.disconnect();
    process.exit(0);
  }, 1000);
});

// Timeout para caso não consiga conectar
setTimeout(() => {
  console.error("⏰ Timeout: Não foi possível conectar ao servidor em 5 segundos");
  process.exit(1);
}, 5000);