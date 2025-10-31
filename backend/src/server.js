const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();

// Prisma Client com URL direta (temporário para desenvolvimento)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:senha123@localhost:5432/agendamentos_db",
    },
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Função para popular banco com dados iniciais
async function popularDadosIniciais() {
  const count = await prisma.servico.count();
  if (count === 0) {
    await prisma.servico.createMany({
      data: [
        { nome: "Corte de Cabelo", duracao: 30, preco: 35.0 },
        { nome: "Barba", duracao: 20, preco: 25.0 },
        { nome: "Manicure", duracao: 45, preco: 30.0 },
        { nome: "Pedicure", duracao: 45, preco: 35.0 },
        { nome: "Corte + Barba", duracao: 50, preco: 55.0 },
      ],
    });
    console.log("✅ Serviços iniciais criados");
  }
}

// Rotas - Serviços
app.get("/api/servicos", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      orderBy: { nome: "asc" },
    });
    res.json(servicos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar serviços" });
  }
});

app.post("/api/servicos", async (req, res) => {
  try {
    const { nome, duracao, preco } = req.body;
    const servico = await prisma.servico.create({
      data: { nome, duracao, preco },
    });
    res.status(201).json(servico);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar serviço" });
  }
});

// Rotas - Agendamentos
app.get("/api/agendamentos", async (req, res) => {
  try {
    const { data, status } = req.query;

    const where = {};
    if (data) where.data = data;
    if (status) where.status = status;

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        servico: true,
      },
      orderBy: [{ data: "desc" }, { horaEntrada: "asc" }],
    });

    // Formatar resposta para manter compatibilidade com frontend
    const agendamentosFormatados = agendamentos.map((ag) => ({
      id: ag.id,
      nomeCliente: ag.nomeCliente,
      servico: ag.servico.nome,
      servicoId: ag.servicoId,
      data: ag.data,
      horaEntrada: ag.horaEntrada,
      horaSaida: ag.horaSaida,
      status: ag.status,
      criadoEm: ag.createdAt,
      atualizadoEm: ag.updatedAt,
    }));

    res.json(agendamentosFormatados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar agendamentos" });
  }
});

app.get("/api/agendamentos/:id", async (req, res) => {
  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: req.params.id },
      include: { servico: true },
    });

    if (!agendamento) {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }

    res.json({
      id: agendamento.id,
      nomeCliente: agendamento.nomeCliente,
      servico: agendamento.servico.nome,
      servicoId: agendamento.servicoId,
      data: agendamento.data,
      horaEntrada: agendamento.horaEntrada,
      horaSaida: agendamento.horaSaida,
      status: agendamento.status,
      criadoEm: agendamento.createdAt,
      atualizadoEm: agendamento.updatedAt,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar agendamento" });
  }
});

app.post("/api/agendamentos", async (req, res) => {
  try {
    const { nomeCliente, servicoId, data, horaEntrada, horaSaida } = req.body;

    if (!nomeCliente || !servicoId || !data || !horaEntrada || !horaSaida) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    // Verificar se serviço existe
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
    });

    if (!servico) {
      return res.status(404).json({ erro: "Serviço não encontrado" });
    }

    // Verificar conflito de horário (opcional - pode implementar depois)
    const conflito = await prisma.agendamento.findFirst({
      where: {
        data,
        status: { not: "cancelado" },
        OR: [
          {
            AND: [
              { horaEntrada: { lte: horaEntrada } },
              { horaSaida: { gt: horaEntrada } },
            ],
          },
          {
            AND: [
              { horaEntrada: { lt: horaSaida } },
              { horaSaida: { gte: horaSaida } },
            ],
          },
        ],
      },
    });

    if (conflito) {
      return res.status(409).json({
        erro: "Já existe um agendamento neste horário",
        conflito: {
          cliente: conflito.nomeCliente,
          horario: `${conflito.horaEntrada} - ${conflito.horaSaida}`,
        },
      });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        nomeCliente,
        servicoId,
        data,
        horaEntrada,
        horaSaida,
        status: "agendado",
      },
      include: { servico: true },
    });

    res.status(201).json({
      id: agendamento.id,
      nomeCliente: agendamento.nomeCliente,
      servico: agendamento.servico.nome,
      servicoId: agendamento.servicoId,
      data: agendamento.data,
      horaEntrada: agendamento.horaEntrada,
      horaSaida: agendamento.horaSaida,
      status: agendamento.status,
      criadoEm: agendamento.createdAt,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar agendamento" });
  }
});

app.put("/api/agendamentos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: dados,
      include: { servico: true },
    });

    res.json({
      id: agendamento.id,
      nomeCliente: agendamento.nomeCliente,
      servico: agendamento.servico.nome,
      servicoId: agendamento.servicoId,
      data: agendamento.data,
      horaEntrada: agendamento.horaEntrada,
      horaSaida: agendamento.horaSaida,
      status: agendamento.status,
      atualizadoEm: agendamento.updatedAt,
    });
  } catch (erro) {
    console.error(erro);
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }
    res.status(500).json({ erro: "Erro ao atualizar agendamento" });
  }
});

app.delete("/api/agendamentos/:id", async (req, res) => {
  try {
    await prisma.agendamento.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    if (erro.code === "P2025") {
      return res.status(404).json({ erro: "Agendamento não encontrado" });
    }
    res.status(500).json({ erro: "Erro ao excluir agendamento" });
  }
});

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

// Inicializar servidor
const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
  try {
    // Conectar ao banco e popular dados iniciais
    await prisma.$connect();
    console.log("✅ Conectado ao PostgreSQL");

    await popularDadosIniciais();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}/api/health`);
    });
  } catch (erro) {
    console.error("❌ Erro ao iniciar servidor:", erro);
    process.exit(1);
  }
}

// Desconectar do banco ao encerrar
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

iniciarServidor();
