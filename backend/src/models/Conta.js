const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const contaSchema = new mongoose.Schema({
  nomeQuiosque: {
    type: String,
    required: true,
    trim: true
  },
  // Identificador único usado na URL pública do cliente
  // (ex: seusite.com/quiosque-do-vini/entrada). Gerado automaticamente
  // a partir do nomeQuiosque no cadastro — ver authController.js.
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  senha: {
    type: String,
    required: true,
    select: false // nunca volta em consultas normais, só quando pedido explicitamente
  },
  // Preenchido na Fase 5, quando a conta conecta o Mercado Pago (split de pagamento)
  mercadoPago: {
    conectado: { type: Boolean, default: false },
    accessToken: { type: String, default: null, select: false },
    userId: { type: String, default: null }
  },
  ativa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Criptografa a senha automaticamente sempre que ela for criada/alterada
contaSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Compara a senha digitada no login com o hash salvo
contaSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Conta', contaSchema);
