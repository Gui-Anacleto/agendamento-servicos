const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:senha123@localhost:5432/agendamentos_db",
    },
  },
  log: ["query", "info", "warn", "error"],
});

async function testar() {
  try {
    console.log("Tentando conectar...");
    await prisma.$connect();
    console.log("✅ Conectado!");

    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Query executada:", result);

    await prisma.$disconnect();
    console.log("✅ Desconectado!");
  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
}

testar();
