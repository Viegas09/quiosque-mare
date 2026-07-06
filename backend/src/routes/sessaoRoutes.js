const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessaoController');
const asyncHandler = require('../middlewares/asyncHandler');

// Rotas de sessão
router.get('/mesa/:mesaId', asyncHandler(sessaoController.buscarSessaoAtiva));
router.post('/mesa/:mesaId/fechar', asyncHandler(sessaoController.fecharConta));
router.get('/', asyncHandler(sessaoController.listar));
router.get('/relatorio', asyncHandler(sessaoController.relatorio));
router.get('/:id', asyncHandler(sessaoController.buscarPorId));

module.exports = router;
