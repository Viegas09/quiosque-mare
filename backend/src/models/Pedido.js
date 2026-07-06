const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  nomeProduto: String, // Cache para evitar lookup
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  observacoes: {
    type: String,
    default: ''
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const pedidoSchema = new mongoose.Schema({
  mesa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mesa',
    required: true
  },
  numeroMesa: String, // Cache
  localizacaoMesa: String, // Cache
  itens: [itemPedidoSchema],
  status: {
    type: String,
    enum: [
      'aguardando_pagamento',
      'pago',
      'em_preparacao',
      'pronto',
      'entregue',
      'cancelado'
    ],
    default: 'aguardando_pagamento'
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPagamento: {
    type: String,
    enum: ['pix', 'cartao_credito', 'cartao_debito'],
    default: null
  },
  paymentId: {
    type: String,
    default: null,
    index: true
  },
  paymentStatus: {
    type: String,
    default: null
  },
  sessao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessao',
    default: null
  },
  tempoEstimadoPreparo: {
    type: Number, // em minutos
    default: null
  },
  iniciadoPreparoEm: {
    type: Date,
    default: null
  },
  prontoEm: {
    type: Date,
    default: null
  },
  entregueEm: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índices para queries frequentes
pedidoSchema.index({ status: 1, createdAt: -1 });
pedidoSchema.index({ mesa: 1, createdAt: -1 });

// Virtual para tempo de preparação total
pedidoSchema.virtual('tempoPreparacaoReal').get(function() {
  if (this.prontoEm && this.iniciadoPreparoEm) {
    return Math.round((this.prontoEm - this.iniciadoPreparoEm) / 60000); // em minutos
  }
  return null;
});

module.exports = mongoose.model('Pedido', pedidoSchema);
