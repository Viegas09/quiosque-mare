const Mesa = require('../models/Mesa');
const Produto = require('../models/Produto');
const Sessao = require('../models/Sessao');
const Pedido = require('../models/Pedido');

class MigracaoController {

  /**
   * Vincula à conta logada todos os dados "órfãos" (mesas, produtos, sessões
   * e pedidos criados antes do sistema de contas existir, que por isso não
   * têm dono ainda). Protegida por login: só quem estiver logado pode
   * "adotar" esses dados pra própria conta.
   *
   * Seguro rodar mais de uma vez — depois da primeira migração não sobra
   * nenhum dado órfão, então não faz nada nas vezes seguintes.
   */
  async migrarDadosLegado(req, res) {
    const contaId = req.conta._id;

    const semDono = { conta: { $exists: false } };

    const resultado = {
      mesas: (await Mesa.updateMany(semDono, { conta: contaId })).modifiedCount,
      produtos: (await Produto.updateMany(semDono, { conta: contaId })).modifiedCount,
      sessoes: (await Sessao.updateMany(semDono, { conta: contaId })).modifiedCount,
      pedidos: (await Pedido.updateMany(semDono, { conta: contaId })).modifiedCount
    };

    res.json({
      success: true,
      message: 'Dados antigos vinculados à sua conta com sucesso.',
      resultado
    });
  }
}

module.exports = new MigracaoController();
