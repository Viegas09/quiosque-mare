const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');
const { limiteCriacaoPedido } = require('../middlewares/rateLimiters');

// Rotas do cliente (públicas — o cliente não faz login)
router.post('/', limiteCriacaoPedido, asyncHandler(pedidoController.criar));
router.post('/:id/pagamento', asyncHandler(pedidoController.iniciarPagamento));
router.get('/:id', asyncHandler(pedidoController.buscarPorId));

// Webhook do Mercado Pago
router.post('/webhook/mercadopago', asyncHandler(pedidoController.webhookMercadoPago));

// Rotas do quiosque (painel, exigem login)
router.get('/', protegerRota, asyncHandler(pedidoController.listar));
router.patch('/:id/status', protegerRota, asyncHandler(pedidoController.atualizarStatus));
router.get('/dashboard/stats', protegerRota, asyncHandler(pedidoController.dashboard));

module.exports = router;
