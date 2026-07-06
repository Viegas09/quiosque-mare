const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  localizacao: {
    type: String,
    required: true,
    trim: true
  },
  qrcodeToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['livre', 'ocupada'],
    default: 'livre'
  },
  sessaoAtiva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessao',
    default: null
  },
  ativa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para busca rápida por QR Code
mesaSchema.index({ qrcodeToken: 1 });

module.exports = mongoose.model('Mesa', mesaSchema);
