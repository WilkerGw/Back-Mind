const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  observation: {
    type: String,
    required: true
  },
  contactado: {
    type: Boolean,
    default: false
  },
  compareceu: {
    type: Boolean,
    default: false
  },
  faltou: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);