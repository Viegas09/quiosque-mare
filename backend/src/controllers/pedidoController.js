const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const Mesa = require('../models/Mesa');
const Sessao = require('../models/Sessao');
const pagamentoService = require('../services/pagamentoService');
const ValidationError = require('../utils/ValidationError');
const { PEDIDO_STATUS, PEDIDO_STATUS_VALUES } = require('../constants/status');

class PedidoController {

  /**
   * Criar novo pedido (rota pública — o cliente não faz login; a conta do
   * pedido é sempre herdada da mesa escaneada/selecionada, nunca do body)
   */
  async criar(req, res) {
    const { mesaId, itens } = req.body;

    if (!mesaId) {
      throw new ValidationError('mesaId é obrigatório');
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      throw new ValidationError('O pedido precisa ter pelo menos um item');
    }

    for (const item of itens) {
      if (!item.produtoId) {
        throw new ValidationError('Cada item precisa de um produtoId');
      }
      if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
        throw new ValidationError('A quantidade de cada item precisa ser um número inteiro maior que zero');
      }
    }

    // Validar mesa — é dela que descobrimos a qual conta este pedido pertence
    const mesa = await Mesa.findById(mesaId);
    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    // Validar e processar itens (sempre exigindo que o produto seja da MESMA
    // conta da mesa — evita pedir um produto de outro quiosque)
    const itensProcessados = [];
    let total = 0;
    let tempoEstimadoTotal = 0;

    for (const item of itens) {
      const produto = await Produto.findOne({ _id: item.produtoId, conta: mesa.conta });

      if (!produto) {
        return res.status(404).json({
          success: false,
          message: `Produto ${item.produtoId} não encontrado`
        });
      }

      if (!produto.disponivel) {
        return res.status(400).json({
          success: false,
          message: `Produto ${produto.nome} não está disponível`
        });
      }

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      // Tempo estimado é o maior tempo entre os produtos
      if (produto.tempoPreparoEstimado > tempoEstimadoTotal) {
        tempoEstimadoTotal = produto.tempoPreparoEstimado;
      }

      itensProcessados.push({
        produto: produto._id,
        nomeProduto: produto.nome,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        observacoes: item.observacoes || '',
        subtotal
      });
    }

    // Criar ou encontrar sessão ativa
    let sessao = await Sessao.findOne({
      mesa: mesaId,
      status: 'aberta'
    });

    if (!sessao) {
      sessao = new Sessao({
        conta: mesa.conta,
        mesa: mesaId,
        numeroMesa: mesa.numero
      });
      await sessao.save();

      // Atualizar mesa
      mesa.sessaoAtiva = sessao._id;
      mesa.status = 'ocupada';
      await mesa.save();
    }

    // Criar pedido
    const pedido = new Pedido({
      conta: mesa.conta,
      mesa: mesaId,
      numeroMesa: mesa.numero,
      localizacaoMesa: mesa.localizacao,
      itens: itensProcessados,
      total,
      tempoEstimadoPreparo: tempoEstimadoTotal,
      sessao: sessao._id,
      status: PEDIDO_STATUS.AGUARDANDO_PAGAMENTO
    });

    await pedido.save();

    // Vincular pedido à sessão (necessário para a tela de Contas do quiosque)
    sessao.pedidos.push(pedido._id);
    await sessao.save();

    res.status(201).json({
      success: true,
      pedido,
      sessao
    });
  }

  /**
   * Iniciar pagamento do pedido (rota pública)
   */
  async iniciarPagamento(req, res) {
    const { id } = req.params;
    const { metodoPagamento, dadosCartao } = req.body;

    if (!['pix', 'cartao_credito', 'cartao_debito'].includes(metodoPagamento)) {
      throw new ValidationError('Método de pagamento inválido');
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    if (pedido.status !== PEDIDO_STATUS.AGUARDANDO_PAGAMENTO) {
      return res.status(400).json({
        success: false,
        message: 'Pedido já foi processado'
      });
    }

    let resultadoPagamento;

    if (metodoPagamento === 'pix') {
      resultadoPagamento = await pagamentoService.criarPreferenciaPix(pedido);
    } else {
      resultadoPagamento = await pagamentoService.processarPagamentoCartao(dadosCartao, pedido);
    }

    if (!resultadoPagamento.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao processar pagamento',
        error: resultadoPagamento.error
      });
    }

    // Atualizar pedido
    pedido.metodoPagamento = metodoPagamento;

    if (metodoPagamento === 'pix') {
      pedido.paymentId = resultadoPagamento.preferenceId;
    } else {
      pedido.paymentId = resultadoPagamento.paymentId;
      pedido.paymentStatus = resultadoPagamento.status;

      // Se pagamento aprovado imediatamente (cartão)
      if (resultadoPagamento.status === 'approved') {
        pedido.status = PEDIDO_STATUS.PAGO;

        // Emitir evento para o quiosque (só pra sala dessa conta)
        if (req.io) {
          req.io.to(`quiosque:${pedido.conta}`).emit('pedido:novo', pedido);
        }
      }
    }

    await pedido.save();

    res.json({
      success: true,
      pedido,
      pagamento: resultadoPagamento
    });
  }

  /**
   * Webhook do Mercado Pago
   */
  async webhookMercadoPago(req, res) {
    const { type, data } = req.body;

    if (type === 'payment' && data?.id) {
      const paymentId = data.id;

      // Buscar informações do pagamento direto na API do Mercado Pago
      // (nunca confiar no status vindo do corpo da notificação)
      const statusPagamento = await pagamentoService.verificarStatusPagamento(paymentId);

      if (statusPagamento.success) {
        const pedido = await Pedido.findOne({ paymentId: String(paymentId) });

        if (pedido) {
          pedido.paymentStatus = statusPagamento.status;

          if (statusPagamento.status === 'approved') {
            pedido.status = PEDIDO_STATUS.PAGO;

            if (req.io) {
              req.io.to(`quiosque:${pedido.conta}`).emit('pedido:novo', pedido);
              req.io.to(`pedido:${pedido._id}`).emit('pedido:pagamento_aprovado', {
                pedidoId: pedido._id,
                status: pedido.status
              });
            }
          }

          await pedido.save();
        }
      }
    }

    res.sendStatus(200);
  }

  /**
   * Listar pedidos da conta logada (painel, autenticado)
   */
  async listar(req, res) {
    const { status, mesaId } = req.query;

    const filtro = { conta: req.conta._id };

    if (status) {
      const statusList = status.split(',');
      const statusInvalido = statusList.find((s) => !PEDIDO_STATUS_VALUES.includes(s));
      if (statusInvalido) {
        throw new ValidationError(`Status inválido: ${statusInvalido}`);
      }
      filtro.status = statusList.length > 1 ? { $in: statusList } : statusList[0];
    }

    if (mesaId) {
      filtro.mesa = mesaId;
    }

    const pedidos = await Pedido.find(filtro)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      pedidos
    });
  }

  /**
   * Buscar pedido por ID (rota pública — usada pelo cliente pra acompanhar
   * o próprio pedido; o id já é imprevisível o suficiente para servir de chave)
   */
  async buscarPorId(req, res) {
    const { id } = req.params;

    const pedido = await Pedido.findById(id)
      .populate('mesa')
      .populate('itens.produto');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      pedido
    });
  }

  /**
   * Atualizar status do pedido (painel, autenticado)
   */
  async atualizarStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!PEDIDO_STATUS_VALUES.includes(status)) {
      throw new ValidationError(`Status inválido. Use um de: ${PEDIDO_STATUS_VALUES.join(', ')}`);
    }

    const pedido = await Pedido.findOne({ _id: id, conta: req.conta._id });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const statusAntigo = pedido.status;
    pedido.status = status;

    // Atualizar timestamps
    if (status === PEDIDO_STATUS.EM_PREPARACAO) {
      pedido.iniciadoPreparoEm = new Date();
    } else if (status === PEDIDO_STATUS.PRONTO) {
      pedido.prontoEm = new Date();
    } else if (status === PEDIDO_STATUS.ENTREGUE) {
      pedido.entregueEm = new Date();
    }

    await pedido.save();

    // Emitir evento para cliente e quiosque
    if (req.io) {
      req.io.to(`pedido:${pedido._id}`).emit('pedido:status_atualizado', {
        pedidoId: pedido._id,
        status: pedido.status,
        statusAntigo
      });

      req.io.to(`quiosque:${pedido.conta}`).emit('pedido:status_atualizado', {
        pedidoId: pedido._id,
        status: pedido.status
      });
    }

    res.json({
      success: true,
      pedido
    });
  }

  /**
   * Dashboard de estatísticas da conta logada (painel, autenticado)
   */
  async dashboard(req, res) {
    const contaId = req.conta._id;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const stats = {
      pedidosHoje: await Pedido.countDocuments({
        conta: contaId,
        createdAt: { $gte: hoje }
      }),
      pedidosAtivos: await Pedido.countDocuments({
        conta: contaId,
        status: { $in: [PEDIDO_STATUS.PAGO, PEDIDO_STATUS.EM_PREPARACAO] }
      }),
      pedidosProntos: await Pedido.countDocuments({
        conta: contaId,
        status: PEDIDO_STATUS.PRONTO
      }),
      receitaHoje: 0,
      tempoMedioPreparacao: 0
    };

    // Calcular receita de hoje
    const pedidosPagos = await Pedido.find({
      conta: contaId,
      createdAt: { $gte: hoje },
      status: { $in: [PEDIDO_STATUS.PAGO, PEDIDO_STATUS.EM_PREPARACAO, PEDIDO_STATUS.PRONTO, PEDIDO_STATUS.ENTREGUE] }
    });

    stats.receitaHoje = pedidosPagos.reduce((sum, p) => sum + p.total, 0);

    // Calcular tempo médio (pedidos finalizados hoje)
    const pedidosFinalizados = await Pedido.find({
      conta: contaId,
      prontoEm: { $gte: hoje },
      iniciadoPreparoEm: { $ne: null }
    });

    if (pedidosFinalizados.length > 0) {
      const tempoTotal = pedidosFinalizados.reduce((sum, p) => {
        const tempo = (p.prontoEm - p.iniciadoPreparoEm) / 60000; // minutos
        return sum + tempo;
      }, 0);
      stats.tempoMedioPreparacao = Math.round(tempoTotal / pedidosFinalizados.length);
    }

    res.json({
      success: true,
      stats
    });
  }
}

module.exports = new PedidoController();
