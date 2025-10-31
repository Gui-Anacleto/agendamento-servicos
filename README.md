# 📅 Sistema de Agendamento de Serviços

Plataforma completa para agendamento de serviços (barbearia, manicure, etc.) com interface responsiva para desktop e mobile.

## 🚀 Tecnologias

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL
- API RESTful

### Frontend

- React
- Tailwind CSS
- Lucide Icons
- Design responsivo

## 📦 Estrutura do Projeto

```
agendamento-servicos/
├── backend/          # API Node.js
│   ├── src/
│   │   └── server.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
└── frontend/         # Interface React
    ├── src/
    │   ├── App.js
    │   └── index.js
    ├── public/
    └── package.json
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 16+ instalado
- PostgreSQL instalado (ou Docker)
- Git

### 1. Clonar o repositório

```bash
git clone
cd agendamento-servicos
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
# Edite o arquivo .env com suas credenciais do PostgreSQL
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamentos_db"

# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Rodar servidor
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar aplicação
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 🗄️ Banco de Dados

### Visualizar dados (Prisma Studio)

```bash
cd backend
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

### Criar migração

```bash
cd backend
npx prisma migrate dev --name nome_da_migracao
```

## 🌐 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamentos_db"
PORT=3001
NODE_ENV=development
```

## 📱 Funcionalidades

- ✅ Cadastro de agendamentos
- ✅ Listagem de agendamentos
- ✅ Filtro por data
- ✅ Atualização de status (agendado, confirmado, concluído, cancelado)
- ✅ Exclusão de agendamentos
- ✅ Gestão de serviços
- ✅ Interface responsiva (desktop e mobile)
- ✅ Validação de conflitos de horário

## 🚀 Deploy

### Opções recomendadas:

1. **Render.com** (Recomendado)

   - Backend + PostgreSQL grátis
   - Deploy automático via GitHub

2. **Railway.app**

   - $5 grátis/mês
   - Setup muito simples

3. **Vercel + Supabase**
   - Frontend no Vercel
   - Backend/DB no Supabase

## 📄 API Endpoints

### Serviços

- `GET /api/servicos` - Lista todos os serviços
- `POST /api/servicos` - Cria novo serviço

### Agendamentos

- `GET /api/agendamentos` - Lista agendamentos (filtros: data, status)
- `GET /api/agendamentos/:id` - Busca agendamento específico
- `POST /api/agendamentos` - Cria novo agendamento
- `PUT /api/agendamentos/:id` - Atualiza agendamento
- `DELETE /api/agendamentos/:id` - Remove agendamento

### Health Check

- `GET /api/health` - Verifica status da API

## 🛠️ Scripts Disponíveis

### Backend

```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:migrate   # Criar migração
```

### Frontend

```bash
npm start            # Desenvolvimento
npm run build        # Build para produção
npm test             # Rodar testes
```

## 🔮 Próximas Features

- [ ] Autenticação de usuários
- [ ] Sistema multi-estabelecimentos
- [ ] Notificações por email/SMS
- [ ] Dashboard com estatísticas
- [ ] Agendamento pelo cliente
- [ ] Sistema de pagamentos
- [ ] App mobile nativo

## 📝 Licença

MIT

## 👨‍💻 Autor

Guilherme F Anacleto - [GitHub](https://github.com/Gui-Anacleto)
