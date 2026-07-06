const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const asyncHandler = require('../middlewares/asyncHandler');
const { limiteCriacaoPedido } = require('../middlewares/rateLimiters');

// Rotas do cliente
router.post('/', limiteCriacaoPedido, asyncHandler(pedidoController.criar));
router.post('/:id/pagamento', asyncHandler(pedidoController.iniciarPagamento));
router.get('/:id', asyncHandler(pedidoController.buscarPorId));

// Webhook do Mercado Pago
router.post('/webhook/mercadopago', asyncHandler(pedidoController.webhookMercadoPago));

// Rotas do quiosque
router.get('/', asyncHandler(pedidoController.listar));
router.patch('/:id/status', asyncHandler(pedidoController.atualizarStatus));
router.get('/dashboard/stats', asyncHandler(pedidoController.dashboard));

module.exports = router;
