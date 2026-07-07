const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');

// Rotas públicas (usadas pelo app do cliente, sem login)
router.get('/qrcode/:token', asyncHandler(mesaController.buscarPorQRCode));
router.get('/:slug/numero/:numero', asyncHandler(mesaController.buscarPorSlugENumero));

// Rotas administrativas (painel do quiosque, exigem login)
router.post('/', protegerRota, asyncHandler(mesaController.criar));
router.get('/', protegerRota, asyncHandler(mesaController.listar));
router.put('/:id', protegerRota, asyncHandler(mesaController.editar));
router.delete('/:id', protegerRota, asyncHandler(mesaController.deletar));
router.patch('/:id/status', protegerRota, asyncHandler(mesaController.atualizarStatus));
router.post('/:id/novo-qrcode', protegerRota, asyncHandler(mesaController.gerarNovoQRCode));

module.exports = router;
