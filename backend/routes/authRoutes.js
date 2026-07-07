const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');
const { limiteLogin } = require('../middlewares/rateLimiters');

// Rotas públicas
router.post('/registro', limiteLogin, asyncHandler(authController.registrar));
router.post('/login', limiteLogin, asyncHandler(authController.login));

// Rota protegida — usada pelo painel pra validar o token salvo
router.get('/me', protegerRota, asyncHandler(authController.me));

module.exports = router;
