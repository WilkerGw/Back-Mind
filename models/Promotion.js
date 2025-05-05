const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['desconto', 'brinde'] },
  discount: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Promotion', promotionSchema);