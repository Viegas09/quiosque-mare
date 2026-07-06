const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const asyncHandler = require('../middlewares/asyncHandler');

// Rotas públicas (cardápio)
router.get('/', asyncHandler(produtoController.listar));
router.get('/categorias', asyncHandler(produtoController.listarCategorias));
router.get('/:id', asyncHandler(produtoController.buscarPorId));

// Rotas administrativas
router.post('/', asyncHandler(produtoController.criar));
router.put('/:id', asyncHandler(produtoController.atualizar));
router.patch('/:id/disponibilidade', asyncHandler(produtoController.toggleDisponibilidade));
router.delete('/:id', asyncHandler(produtoController.deletar));

module.exports = router;
