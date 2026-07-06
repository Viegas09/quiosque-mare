const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const asyncHandler = require('../middlewares/asyncHandler');

// Rotas públicas
router.get('/qrcode/:token', asyncHandler(mesaController.buscarPorQRCode));
router.get('/numero/:numero', asyncHandler(mesaController.buscarPorNumero));

// Rotas administrativas (adicionar auth depois)
router.post('/', asyncHandler(mesaController.criar));
router.get('/', asyncHandler(mesaController.listar));
router.patch('/:id/status', asyncHandler(mesaController.atualizarStatus));
router.post('/:id/novo-qrcode', asyncHandler(mesaController.gerarNovoQRCode));

module.exports = router;
