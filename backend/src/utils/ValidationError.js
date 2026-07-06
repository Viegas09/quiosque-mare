/**
 * Erro de validação de entrada — controllers usam isto para sinalizar
 * "o cliente mandou algo inválido" (responde 400), diferenciando de erros
 * inesperados de servidor (que continuam caindo como 500).
 *
 * Uso:
 *   if (!numero) throw new ValidationError('Número da mesa é obrigatório');
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
