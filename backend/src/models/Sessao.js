const mongoose = require('mongoose');

const sessaoSchema = new mongoose.Schema({
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true,
    index: true
  },
  mesa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mesa',
    required: true
  },
  numeroMesa: String,
  status: {
    type: String,
    enum: ['aberta', 'fechada'],
    default: 'aberta'
  },
  pedidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido'
  }],
  totalAcumulado: {
    type: Number,
    default: 0,
    min: 0
  },
  abertaEm: {
    type: Date,
    default: Date.now
  },
  fechadaEm: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índice para buscar sessões abertas
sessaoSchema.index({ mesa: 1, status: 1 });
sessaoSchema.index({ conta: 1, status: 1 });

module.exports = mongoose.model('Sessao', sessaoSchema);
