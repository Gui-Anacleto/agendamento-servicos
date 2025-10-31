const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  } else {
    console.log("Serviços iniciais já existem. Nada foi criado.");
  }
}

async function main() {
  await popularDadosIniciais();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
