const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      }
    }
  ],
  seller: { 
    type: String, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['PIX', 'débito', 'dinheiro', 'cartão', 'boleto'], 
    required: true 
  },
  parcels: [
    {
      installment: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      value: { 
        type: Number, 
        required: true, 
        min: 0 
      },
      dueDate: { 
        type: Date, 
        required: true 
      }
    }
  ],
  saleDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `Data inválida: ${props.value} não está no formato YYYY-MM-DD`
    }
  },
  warranty: Boolean,
  warrantyPeriod: String,
  notes: String,
  total: { 
    type: Number, 
    required: true, 
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Total deve ser um número válido e não negativo'
    }
  }
});

module.exports = mongoose.model('Sale', saleSchema);