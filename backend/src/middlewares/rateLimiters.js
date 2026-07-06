const rateLimit = require('express-rate-limit');

// Limite geral, aplicado a toda a API — protege contra abuso básico.
const limiteGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas requisições. Tente novamente em alguns minutos.' }
});

// Limite mais rígido só para criação de pedido — é a rota pública mais
// sensível a abuso (spam de pedidos falsos via QR code na praia).
const limiteCriacaoPedido = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitos pedidos em pouco tempo. Aguarde alguns minutos.' }
});

module.exports = { limiteGeral, limiteCriacaoPedido };
