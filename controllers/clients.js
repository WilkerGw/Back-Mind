// backend/controllers/clients.js
const Client = require('../models/Client');

exports.getAllClients = async (req, res) => {
  try {
    // Ordenar por nome ou data de criação, por exemplo
    const clients = await Client.find().sort({ fullName: 1 });
    res.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: 'Erro interno ao buscar clientes.' });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  } catch (error) {
    // Verifica se é um erro de ID inválido do Mongoose
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID do cliente inválido' });
    }
    console.error("Erro ao buscar cliente por ID:", error);
    res.status(500).json({ error: 'Erro interno ao buscar cliente.' });
  }
};

exports.createClient = async (req, res) => {
  const {
    fullName,
    cpf,
    phone,
    birthDate,
    gender,
    address,
    cep,
    receiptImage,
    notes,
    // Campos da receita agora são potencialmente enviados
    possuiReceita, // Recebe o estado do checkbox
    esfericoDireito,
    cilindricoDireito,
    eixoDireito,
    esfericoEsquerdo,
    cilindricoEsquerdo,
    eixoEsquerdo,
    adicao,
    vencimentoReceita
  } = req.body;

  // Validação básica (poderia ser mais robusta com Joi ou express-validator)
  if (!fullName || !cpf) {
    return res.status(400).json({ error: 'Nome completo e CPF são obrigatórios.' });
  }

  // Validação condicional da receita
  if (possuiReceita === true) {
    if (!esfericoDireito || !cilindricoDireito || !eixoDireito || !esfericoEsquerdo || !cilindricoEsquerdo || !eixoEsquerdo || !vencimentoReceita) {
        return res.status(400).json({ error: 'Se "Possui Receita" está marcado, todos os campos da receita (exceto Adição) e o vencimento são obrigatórios.' });
    }
  }


  try {
    // Garante que CPF seja único (o índice `unique: true` no schema ajuda, mas verificar antes previne erro 500)
    const existingClient = await Client.findOne({ cpf });
    if (existingClient) {
      return res.status(409).json({ error: 'CPF já cadastrado.' }); // 409 Conflict
    }

    const clientData = {
        fullName, cpf, phone, birthDate, gender, address, cep, receiptImage, notes, possuiReceita
    };

    // Adiciona dados da receita apenas se possuiReceita for true
    if (possuiReceita === true) {
        clientData.esfericoDireito = esfericoDireito;
        clientData.cilindricoDireito = cilindricoDireito;
        clientData.eixoDireito = eixoDireito;
        clientData.esfericoEsquerdo = esfericoEsquerdo;
        clientData.cilindricoEsquerdo = cilindricoEsquerdo;
        clientData.eixoEsquerdo = eixoEsquerdo;
        clientData.adicao = adicao; // Adicao é opcional mesmo com receita
        clientData.vencimentoReceita = vencimentoReceita;
    } else {
        // Garante que campos da receita sejam nulos se não houver receita
        clientData.esfericoDireito = null;
        clientData.cilindricoDireito = null;
        clientData.eixoDireito = null;
        clientData.esfericoEsquerdo = null;
        clientData.cilindricoEsquerdo = null;
        clientData.eixoEsquerdo = null;
        clientData.adicao = null;
        clientData.vencimentoReceita = null;
    }


    const client = new Client(clientData);
    await client.save();
    res.status(201).json(client);

  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    // Trata erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno ao criar cliente.' });
  }
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validação condicional da receita na atualização
  if (updateData.possuiReceita === true) {
    if (!updateData.esfericoDireito || !updateData.cilindricoDireito || !updateData.eixoDireito || !updateData.esfericoEsquerdo || !updateData.cilindricoEsquerdo || !updateData.eixoEsquerdo || !updateData.vencimentoReceita) {
        return res.status(400).json({ error: 'Se "Possui Receita" está marcado, todos os campos da receita (exceto Adição) e o vencimento são obrigatórios.' });
    }
  } else if (updateData.hasOwnProperty('possuiReceita') && updateData.possuiReceita === false) {
     // Se está desmarcando a receita, limpa os campos relacionados
     updateData.esfericoDireito = null;
     updateData.cilindricoDireito = null;
     updateData.eixoDireito = null;
     updateData.esfericoEsquerdo = null;
     updateData.cilindricoEsquerdo = null;
     updateData.eixoEsquerdo = null;
     updateData.adicao = null;
     updateData.vencimentoReceita = null;
  }


  try {
    // Verifica se o CPF está sendo alterado e se já existe em outro cliente
    if (updateData.cpf) {
        const existingClient = await Client.findOne({ cpf: updateData.cpf, _id: { $ne: id } });
        if (existingClient) {
            return res.status(409).json({ error: 'CPF já pertence a outro cliente.' });
        }
    }

    // { new: true } retorna o documento atualizado
    // { runValidators: true } garante que as validações do schema sejam executadas na atualização
    const client = await Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
     // Verifica se é um erro de ID inválido do Mongoose
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID do cliente inválido' });
    }
    // Trata erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno ao atualizar cliente.' });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    // Retorna 200 OK com uma mensagem em vez de 204 No Content para confirmação
    res.status(200).json({ message: 'Cliente excluído com sucesso.' });
  } catch (error) {
     // Verifica se é um erro de ID inválido do Mongoose
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID do cliente inválido' });
    }
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: 'Erro interno ao excluir cliente.' });
  }
};