const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const migracaoController = require('../controllers/migracaoController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');
const { limiteLogin } = require('../middlewares/rateLimiters');

// Rotas públicas
router.post('/registro', limiteLogin, asyncHandler(authController.registrar));
router.post('/login', limiteLogin, asyncHandler(authController.login));

// Rotas protegidas
router.get('/me', protegerRota, asyncHandler(authController.me));

// Rota de migração única — vincula à conta logada dados criados antes do
// sistema de contas existir (suas 15 mesas e 22 produtos originais).
router.post('/migrar-dados-legado', protegerRota, asyncHandler(migracaoController.migrarDadosLegado));

module.exports = router;
