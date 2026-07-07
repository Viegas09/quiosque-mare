const Conta = require('../models/Conta');

class ContaPublicaController {

  /**
   * Usado pelo app do cliente (frontend-cliente) para descobrir a qual
   * quiosque uma URL do tipo /:slug/entrada pertence, e mostrar o nome
   * do quiosque na tela. Não expõe nada sensível.
   */
  async buscarPorSlug(req, res) {
    const { slug } = req.params;

    const conta = await Conta.findOne({ slug: slug.toLowerCase(), ativa: true });

    if (!conta) {
      return res.status(404).json({ success: false, message: 'Quiosque não encontrado' });
    }

    res.json({
      success: true,
      conta: {
        id: conta._id,
        nomeQuiosque: conta.nomeQuiosque,
        slug: conta.slug
      }
    });
  }
}

module.exports = new ContaPublicaController();
