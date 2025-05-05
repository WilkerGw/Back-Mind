const Boleto = require('../models/Boleto');
const Client = require('../models/Client');

// Listar todos os boletos com populate
exports.getAllBoletos = async (req, res) => {
  try {
    const boletos = await Boleto.find()
      .populate('client', 'fullName') // Apenas o campo 'fullName' do cliente
      .sort({ dueDate: 1 }); // Ordenação por data de vencimento
    res.json(boletos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar boleto por ID
exports.getBoletoById = async (req, res) => {
  try {
    const boleto = await Boleto.findById(req.params.id)
      .populate('client', 'fullName'); // Apenas 'fullName'
    if (!boleto) return res.status(404).json({ error: 'Boleto não encontrado' });
    res.json(boleto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo boleto
exports.createBoleto = async (req, res) => {
  try {
    const { client, parcelValue, dueDate, status } = req.body;

    // Validação de campos obrigatórios
    if (!client || !parcelValue || !dueDate) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
    }

    // Verifica se o cliente existe
    const validClient = await Client.findById(client);
    if (!validClient) {
      return res.status(400).json({ error: 'Cliente não encontrado.' });
    }

    // Validação de valor positivo
    if (parcelValue <= 0) {
      return res.status(400).json({ error: 'Valor da parcela deve ser positivo.' });
    }

    // Validação de data válida
    if (isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: 'Data de vencimento inválida.' });
    }

    // Validação de status (opcional, já validado pelo Mongoose)
    if (status && !['pago', 'aberto', 'atrasado'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    // Cria o boleto
    const boleto = new Boleto(req.body);
    await boleto.save();
    res.status(201).json(boleto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar boleto
exports.updateBoleto = async (req, res) => {
  try {
    const boleto = await Boleto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('client', 'fullName'); // Apenas 'fullName'
    if (!boleto) return res.status(404).json({ error: 'Boleto não encontrado' });
    res.json(boleto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Excluir boleto
exports.deleteBoleto = async (req, res) => {
  try {
    const boleto = await Boleto.findByIdAndDelete(req.params.id);
    if (!boleto) return res.status(404).json({ error: 'Boleto não encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};