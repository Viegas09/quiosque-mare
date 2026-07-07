const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const asyncHandler = require('../middlewares/asyncHandler');
const protegerRota = require('../middlewares/authMiddleware');

// Rota pública (cardápio do cliente, sem login) — filtrado pela mesa
router.get('/publico-mesa/:mesaId', asyncHandler(produtoController.listarPublicoPorMesa));

// Rotas administrativas (painel do quiosque, exigem login)
router.get('/', protegerRota, asyncHandler(produtoController.listar));
router.get('/categorias', protegerRota, asyncHandler(produtoController.listarCategorias));
router.get('/:id', protegerRota, asyncHandler(produtoController.buscarPorId));
router.post('/', protegerRota, asyncHandler(produtoController.criar));
router.put('/:id', protegerRota, asyncHandler(produtoController.atualizar));
router.patch('/:id/disponibilidade', protegerRota, asyncHandler(produtoController.toggleDisponibilidade));
router.delete('/:id', protegerRota, asyncHandler(produtoController.deletar));

module.exports = router;
