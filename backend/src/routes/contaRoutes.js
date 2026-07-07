const express = require('express');
const router = express.Router();
const contaPublicaController = require('../controllers/contaPublicaController');
const asyncHandler = require('../middlewares/asyncHandler');

// Rota pública — usada pelo app do cliente para resolver /:slug em um quiosque
router.get('/:slug', asyncHandler(contaPublicaController.buscarPorSlug));

module.exports = router;
