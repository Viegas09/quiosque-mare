const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessaoController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');

// Rotas públicas (usadas pelo cliente, sem login)
router.get('/mesa/:mesaId', asyncHandler(sessaoController.buscarSessaoAtiva));
router.post('/mesa/:mesaId/fechar', asyncHandler(sessaoController.fecharConta));

// Rotas administrativas (painel do quiosque, exigem login)
router.get('/', protegerRota, asyncHandler(sessaoController.listar));
router.get('/relatorio', protegerRota, asyncHandler(sessaoController.relatorio));
router.get('/:id', protegerRota, asyncHandler(sessaoController.buscarPorId));

module.exports = router;
