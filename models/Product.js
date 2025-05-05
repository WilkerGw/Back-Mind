const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Óculos de Sol', 'Aramação de Grau', 'Lente', 'Serviço/Conserto'],
    required: true
  },
  design: {
    type: String,
    enum: ['Quadrado', 'Redondo', 'Hexagonal', 'Gatinho', 'Ballgriff'],
    required: true
  },
  material: {
    type: String,
    enum: [
      'Acetato',
      'TR-90',
      'Metal',
      'TR-90+METAL',
      'ACETATO+METAL'
    ],
    required: true
  },
  stock: {
    type: Number,
    min: 0,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);