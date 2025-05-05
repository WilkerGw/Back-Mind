const Agendamento = require('../models/Agendamento');

// Função para obter todos os agendamentos
exports.getAllAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error });
  }
};

// Função para obter um agendamento pelo ID
exports.getAgendamentoById = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamento', error });
  }
};

// Função para criar um novo agendamento
exports.createAgendamento = async (req, res) => {
  try {
    const { name, telephone, date, hour, observation } = req.body;
    const newAgendamento = new Agendamento({ name, telephone, date, hour, observation });
    const savedAgendamento = await newAgendamento.save();
    res.status(201).json(savedAgendamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar agendamento', error });
  }
};

// Função para atualizar um agendamento existente
exports.updateAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, telephone, date, hour, observation } = req.body;
    const updatedAgendamento = await Agendamento.findByIdAndUpdate(
      id,
      { name, telephone, date, hour, observation },
      { new: true }
    );
    if (!updatedAgendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.status(200).json(updatedAgendamento);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento', error });
  }
};

// Função para deletar um agendamento
exports.deleteAgendamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAgendamento = await Agendamento.findByIdAndDelete(id);
    if (!deletedAgendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar agendamento', error });
  }
};

// Função para obter o total de agendamentos
exports.getTotalAgendamentos = async (req, res) => {
  try {
    const total = await Agendamento.countDocuments();
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contar agendamentos', error });
  }
};

// Função para obter o histórico de agendamentos
exports.getAgendamentosHistory = async (req, res) => {
  try {
    // Supondo que o histórico seja apenas os agendamentos passados
    const history = await Agendamento.find({ date: { $lt: new Date() } });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico de agendamentos', error });
  }
};