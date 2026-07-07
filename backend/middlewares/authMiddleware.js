const jwt = require('jsonwebtoken');
const Conta = require('../models/Conta');

/**
 * Protege rotas do painel: exige um token válido no header Authorization
 * (formato "Bearer <token>"). Se válido, disponibiliza a conta logada em
 * req.conta, pra os controllers filtrarem os dados só dessa conta.
 *
 * Uso:
 *   router.get('/', protegerRota, asyncHandler(produtoController.listar));
 */
const protegerRota = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Não autenticado. Faça login novamente.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const conta = await Conta.findOne({ _id: payload.contaId, ativa: true });

    if (!conta) {
      return res.status(401).json({ success: false, message: 'Conta não encontrada ou inativa.' });
    }

    req.conta = conta;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Sessão expirada. Faça login novamente.' });
  }
};

module.exports = protegerRota;
