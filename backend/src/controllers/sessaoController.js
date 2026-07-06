const Sessao = require('../models/Sessao');
const Pedido = require('../models/Pedido');
const Mesa = require('../models/Mesa');

class SessaoController {

  /**
   * Buscar sessão ativa de uma mesa
   */
  async buscarSessaoAtiva(req, res) {
    const { mesaId } = req.params;

    const sessao = await Sessao.findOne({
      mesa: mesaId,
      status: 'aberta'
    }).populate('pedidos');

    if (!sessao) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma sessão ativa encontrada para esta mesa'
      });
    }

    // Buscar pedidos detalhados
    const pedidos = await Pedido.find({
      _id: { $in: sessao.pedidos }
    }).sort({ createdAt: 1 });

    // Calcular total acumulado
    const totalAcumulado = pedidos
      .filter((p) => p.status !== 'cancelado')
      .reduce((sum, p) => sum + p.total, 0);

    sessao.totalAcumulado = totalAcumulado;
    await sessao.save();

    res.json({
      success: true,
      sessao,
      pedidos
    });
  }

  /**
   * Fechar conta (finalizar sessão)
   */
  async fecharConta(req, res) {
    const { mesaId } = req.params;

    const sessao = await Sessao.findOne({
      mesa: mesaId,
      status: 'aberta'
    });

    if (!sessao) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma sessão ativa encontrada'
      });
    }

    // Verificar se todos os pedidos foram entregues
    const pedidosPendentes = await Pedido.countDocuments({
      sessao: sessao._id,
      status: { $nin: ['entregue', 'cancelado'] }
    });

    if (pedidosPendentes > 0) {
      return res.status(400).json({
        success: false,
        message: `Ainda existem ${pedidosPendentes} pedido(s) pendente(s). Finalize todos os pedidos antes de fechar a conta.`
      });
    }

    // Buscar todos os pedidos para calcular total final
    const pedidos = await Pedido.find({
      sessao: sessao._id,
      status: { $ne: 'cancelado' }
    });

    const totalFinal = pedidos.reduce((sum, p) => sum + p.total, 0);

    // Fechar sessão
    sessao.status = 'fechada';
    sessao.fechadaEm = new Date();
    sessao.totalAcumulado = totalFinal;
    await sessao.save();

    // Liberar mesa
    const mesa = await Mesa.findById(mesaId);
    if (mesa) {
      mesa.status = 'livre';
      mesa.sessaoAtiva = null;
      await mesa.save();
    }

    res.json({
      success: true,
      message: 'Conta fechada com sucesso',
      sessao,
      totalFinal,
      quantidadePedidos: pedidos.length
    });
  }

  /**
   * Listar todas as sessões
   */
  async listar(req, res) {
    const { status } = req.query;

    const filtro = {};
    if (status) {
      filtro.status = status;
    }

    const sessoes = await Sessao.find(filtro)
      .populate('mesa')
      .sort({ abertaEm: -1 })
      .limit(50);

    res.json({
      success: true,
      sessoes
    });
  }

  /**
   * Buscar sessão por ID
   */
  async buscarPorId(req, res) {
    const { id } = req.params;

    const sessao = await Sessao.findById(id)
      .populate('mesa')
      .populate('pedidos');

    if (!sessao) {
      return res.status(404).json({
        success: false,
        message: 'Sessão não encontrada'
      });
    }

    res.json({
      success: true,
      sessao
    });
  }

  /**
   * Relatório de sessões fechadas (por período)
   */
  async relatorio(req, res) {
    const { dataInicio, dataFim } = req.query;

    const filtro = { status: 'fechada' };

    if (dataInicio) {
      filtro.fechadaEm = { $gte: new Date(dataInicio) };
    }

    if (dataFim) {
      filtro.fechadaEm = {
        ...filtro.fechadaEm,
        $lte: new Date(dataFim)
      };
    }

    const sessoes = await Sessao.find(filtro)
      .populate('mesa')
      .sort({ fechadaEm: -1 });

    const totalGeral = sessoes.reduce((sum, s) => sum + s.totalAcumulado, 0);
    const ticketMedio = sessoes.length > 0 ? totalGeral / sessoes.length : 0;

    res.json({
      success: true,
      relatorio: {
        totalSessoes: sessoes.length,
        receitaTotal: totalGeral,
        ticketMedio: ticketMedio.toFixed(2),
        sessoes
      }
    });
  }
}

module.exports = new SessaoController();
