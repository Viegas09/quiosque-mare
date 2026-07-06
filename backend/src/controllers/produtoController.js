const Produto = require('../models/Produto');
const ValidationError = require('../utils/ValidationError');

class ProdutoController {

  /**
   * Criar novo produto
   */
  async criar(req, res) {
    const { nome, descricao, preco, categoria } = req.body;

    if (!nome || !descricao || preco === undefined || !categoria) {
      throw new ValidationError('nome, descricao, preco e categoria são obrigatórios');
    }

    if (typeof preco !== 'number' || preco < 0) {
      throw new ValidationError('preco precisa ser um número maior ou igual a zero');
    }

    const produto = new Produto(req.body);
    await produto.save();

    res.status(201).json({
      success: true,
      produto
    });
  }

  /**
   * Listar produtos (cardápio)
   */
  async listar(req, res) {
    const { categoria, disponivel } = req.query;

    const filtro = {};

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
   * Buscar produto por ID
   */
  async buscarPorId(req, res) {
    const { id } = req.params;

    const produto = await Produto.findById(id);

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
   * Atualizar produto
   */
  async atualizar(req, res) {
    const { id } = req.params;

    const produto = await Produto.findByIdAndUpdate(
      id,
      req.body,
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
   * Atualizar disponibilidade
   */
  async toggleDisponibilidade(req, res) {
    const { id } = req.params;

    const produto = await Produto.findById(id);

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
   * Deletar produto
   */
  async deletar(req, res) {
    const { id } = req.params;

    const produto = await Produto.findByIdAndDelete(id);

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
   * Listar categorias disponíveis
   */
  async listarCategorias(req, res) {
    const categorias = await Produto.distinct('categoria');

    res.json({
      success: true,
      categorias
    });
  }
}

module.exports = new ProdutoController();
