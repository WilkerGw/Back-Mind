// backend/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  phone: String,
  birthDate: Date,
  gender: String,
  address: String,
  cep: String,
  receiptImage: String, // Imagem da receita (opcional)
  notes: String,

  // --- Dados da Receita (Opcionais no Schema) ---
  possuiReceita: { type: Boolean, default: false }, // Novo campo para indicar se há receita
  esfericoDireito: { type: String }, // Esférico Direito
  cilindricoDireito: { type: String }, // Cilíndrico Direito
  eixoDireito: { type: String }, // Eixo Direito
  esfericoEsquerdo: { type: String }, // Esférico Esquerdo
  cilindricoEsquerdo: { type: String }, // Cilíndrico Esquerdo
  eixoEsquerdo: { type: String }, // Eixo Esquerdo
  adicao: { type: String }, // Adição (se presente)
  vencimentoReceita: { type: Date }, // Data de vencimento da receita (opcional no schema)
  // -------------------------------------------

  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }]
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Client', clientSchema);