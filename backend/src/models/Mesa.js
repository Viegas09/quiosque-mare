const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true,
    index: true
  },
  numero: {
    type: String,
    required: true,
    trim: true
    // Não é mais unique:true globalmente — dois quiosques diferentes podem
    // ter, cada um, uma "Mesa 1". A unicidade real é por conta (ver índice
    // composto abaixo).
  },
  localizacao: {
    type: String,
    required: true,
    trim: true
  },
  qrcodeToken: {
    type: String,
    required: true,
    unique: true, // este continua único globalmente — é a chave pública do QR code
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

// Número da mesa só precisa ser único dentro da mesma conta
mesaSchema.index({ conta: 1, numero: 1 }, { unique: true });

// Índice para busca rápida por QR Code
mesaSchema.index({ qrcodeToken: 1 });

module.exports = mongoose.model('Mesa', mesaSchema);
