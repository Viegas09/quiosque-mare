/**
 * Envolve uma rota assíncrona e encaminha qualquer erro para o middleware
 * central de tratamento de erros (definido em server.js), em vez de cada
 * controller precisar repetir seu próprio try/catch + res.status(500).
 *
 * Uso:
 *   router.get('/', asyncHandler(controller.listar));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
