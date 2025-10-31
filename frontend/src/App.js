import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:10000/api";

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroData, setFiltroData] = useState("");
  const [formData, setFormData] = useState({
    nomeCliente: "",
    servicoId: "",
    data: "",
    horaEntrada: "",
    horaSaida: "",
  });

  useEffect(() => {
    carregarServicos();
    carregarAgendamentos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await fetch(`${API_URL}/servicos`);
      const data = await response.json();
      setServicos(data);
    } catch (erro) {
      console.error("Erro ao carregar serviços:", erro);
    }
  };

  const carregarAgendamentos = async (data = "") => {
    try {
      const url = data
        ? `${API_URL}/agendamentos?data=${data}`
        : `${API_URL}/agendamentos`;
      const response = await fetch(url);
      const dados = await response.json();
      setAgendamentos(dados);
    } catch (erro) {
      console.error("Erro ao carregar agendamentos:", erro);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.nomeCliente ||
      !formData.servicoId ||
      !formData.data ||
      !formData.horaEntrada ||
      !formData.horaSaida
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          servicoId: parseInt(formData.servicoId),
        }),
      });

      if (response.ok) {
        setFormData({
          nomeCliente: "",
          servicoId: "",
          data: "",
          horaEntrada: "",
          horaSaida: "",
        });
        setMostrarForm(false);
        carregarAgendamentos(filtroData);
      }
    } catch (erro) {
      console.error("Erro ao criar agendamento:", erro);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await fetch(`${API_URL}/agendamentos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      carregarAgendamentos(filtroData);
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);
    }
  };

  const excluirAgendamento = async (id) => {
    if (window.confirm("Deseja realmente excluir este agendamento?")) {
      try {
        await fetch(`${API_URL}/agendamentos/${id}`, {
          method: "DELETE",
        });
        carregarAgendamentos(filtroData);
      } catch (erro) {
        console.error("Erro ao excluir agendamento:", erro);
      }
    }
  };

  const handleFiltroData = (data) => {
    setFiltroData(data);
    carregarAgendamentos(data);
  };

  const getStatusColor = (status) => {
    const cores = {
      agendado: "bg-blue-100 text-blue-800",
      confirmado: "bg-green-100 text-green-800",
      concluido: "bg-gray-100 text-gray-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return cores[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icones = {
      agendado: <AlertCircle size={16} />,
      confirmado: <CheckCircle size={16} />,
      concluido: <CheckCircle size={16} />,
      cancelado: <XCircle size={16} />,
    };
    return icones[status] || <AlertCircle size={16} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Scissors className="text-indigo-600" size={32} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Agendamentos
              </h1>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
            >
              {mostrarForm ? "Cancelar" : "+ Novo Agendamento"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Calendar className="text-indigo-600" size={20} />
            <label className="font-medium text-gray-700">
              Filtrar por data:
            </label>
            <input
              type="date"
              value={filtroData}
              onChange={(e) => handleFiltroData(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {filtroData && (
              <button
                onClick={() => handleFiltroData("")}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Limpar filtro
              </button>
            )}
          </div>
        </div>

        {mostrarForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Novo Agendamento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={formData.nomeCliente}
                  onChange={(e) =>
                    setFormData({ ...formData, nomeCliente: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Digite o nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço *
                </label>
                <select
                  value={formData.servicoId}
                  onChange={(e) =>
                    setFormData({ ...formData, servicoId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nome} ({s.duracao} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Entrada *
                </label>
                <input
                  type="time"
                  value={formData.horaEntrada}
                  onChange={(e) =>
                    setFormData({ ...formData, horaEntrada: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Saída *
                </label>
                <input
                  type="time"
                  value={formData.horaSaida}
                  onChange={(e) =>
                    setFormData({ ...formData, horaSaida: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-md"
                >
                  Criar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {agendamentos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 text-lg">
                {filtroData
                  ? "Nenhum agendamento encontrado para esta data"
                  : "Nenhum agendamento cadastrado"}
              </p>
            </div>
          ) : (
            agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <User className="text-indigo-600" size={20} />
                      <span className="font-bold text-lg text-gray-900">
                        {agendamento.nomeCliente}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          agendamento.status
                        )}`}
                      >
                        {getStatusIcon(agendamento.status)}
                        {agendamento.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Scissors size={16} />
                      <span>{agendamento.servico}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {new Date(
                            agendamento.data + "T00:00:00"
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>
                          {agendamento.horaEntrada} - {agendamento.horaSaida}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={agendamento.status}
                      onChange={(e) =>
                        atualizarStatus(agendamento.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>

                    <button
                      onClick={() => excluirAgendamento(agendamento.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
