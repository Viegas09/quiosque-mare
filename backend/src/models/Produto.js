const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true,
    index: true
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: ['bebidas', 'porcoes', 'pratos', 'sobremesas', 'petiscos', 'drinks'],
  },
  imagemUrl: {
    type: String,
    default: null
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  tempoPreparoEstimado: {
    type: Number, // em minutos
    default: 15
  },
  ordem: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para busca por categoria, já escopado por conta
produtoSchema.index({ conta: 1, categoria: 1, disponivel: 1 });

module.exports = mongoose.model('Produto', produtoSchema);
