const express = require('express');
const router = express.Router();
const { getAllClients, getClientById, createClient, updateClient, deleteClient } = require('../controllers/clients');

// Rota para listar todos os clientes
router.get('/', getAllClients);

// Rota para buscar cliente por ID
router.get('/:id', getClientById);

// Rota para criar um novo cliente
router.post('/', createClient);

// Rota para atualizar dados de um cliente
router.put('/:id', updateClient);

// Rota para excluir um cliente
router.delete('/:id', deleteClient);

module.exports = router;
