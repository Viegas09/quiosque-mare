const Produto = require('../models/Produto');
const Conta = require('../models/Conta');
const Mesa = require('../models/Mesa');
const ValidationError = require('../utils/ValidationError');

class ProdutoController {

  /**
   * Criar novo produto (painel, autenticado)
   */
  async criar(req, res) {
    const { nome, descricao, preco, categoria } = req.body;

    if (!nome || !descricao || preco === undefined || !categoria) {
      throw new ValidationError('nome, descricao, preco e categoria são obrigatórios');
    }

    if (typeof preco !== 'number' || preco < 0) {
      throw new ValidationError('preco precisa ser um número maior ou igual a zero');
    }

    const produto = new Produto({ ...req.body, conta: req.conta._id });
    await produto.save();

    res.status(201).json({
      success: true,
      produto
    });
  }

  /**
   * Listar produtos da conta logada (painel, autenticado — inclui indisponíveis,
   * pra dar pra gerenciar tudo)
   */
  async listar(req, res) {
    const { categoria, disponivel } = req.query;

    const filtro = { conta: req.conta._id };

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (disponivel !== undefined) {
      filtro.disponivel = disponivel === 'true';
    }

    const produtos = await Produto.find(filtro)
      .sort({ categoria: 1, ordem: 1, nome: 1 });

    res.json({
      success: true,
      produtos
    });
  }

  /**
   * Cardápio público (rota pública — usada pelo app do cliente). Recebe o
   * ID da mesa (que o cliente já tem, depois de escanear o QR ou digitar o
   * número), descobre a qual conta ela pertence, e devolve só os produtos
   * disponíveis daquela conta.
   */
  async listarPublicoPorMesa(req, res) {
    const { mesaId } = req.params;

    const mesa = await Mesa.findById(mesaId);
    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }

    const produtos = await Produto.find({ conta: mesa.conta, disponivel: true })
      .sort({ categoria: 1, ordem: 1, nome: 1 });

    res.json({
      success: true,
      produtos
    });
  }

  /**
   * Buscar produto por ID (painel, autenticado)
   */
  async buscarPorId(req, res) {
    const { id } = req.params;

    const produto = await Produto.findOne({ _id: id, conta: req.conta._id });

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      produto
    });
  }

  /**
   * Atualizar produto (painel, autenticado)
   */
  async atualizar(req, res) {
    const { id } = req.params;

    // Impede que o campo conta seja sobrescrito via body
    const { conta, ...dadosAtualizacao } = req.body;

    const produto = await Produto.findOneAndUpdate(
      { _id: id, conta: req.conta._id },
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      produto
    });
  }

  /**
   * Atualizar disponibilidade (painel, autenticado)
   */
  async toggleDisponibilidade(req, res) {
    const { id } = req.params;

    const produto = await Produto.findOne({ _id: id, conta: req.conta._id });

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    produto.disponivel = !produto.disponivel;
    await produto.save();

    if (req.io) {
      req.io.emit('produto:disponibilidade_alterada', {
        produtoId: produto._id,
        disponivel: produto.disponivel
      });
    }

    res.json({
      success: true,
      produto
    });
  }

  /**
   * Deletar produto (painel, autenticado)
   */
  async deletar(req, res) {
    const { id } = req.params;

    const produto = await Produto.findOneAndDelete({ _id: id, conta: req.conta._id });

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  }

  /**
   * Listar categorias em uso pela conta logada (painel, autenticado)
   */
  async listarCategorias(req, res) {
    const categorias = await Produto.distinct('categoria', { conta: req.conta._id });

    res.json({
      success: true,
      categorias
    });
  }
}

module.exports = new ProdutoController();
