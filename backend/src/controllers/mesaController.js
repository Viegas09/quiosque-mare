const Mesa = require('../models/Mesa');
const Sessao = require('../models/Sessao');
const Conta = require('../models/Conta');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const ValidationError = require('../utils/ValidationError');

class MesaController {

  /**
   * Criar nova mesa (painel do quiosque, autenticado)
   */
  async criar(req, res) {
    const { numero, localizacao } = req.body;

    if (!numero || !localizacao) {
      throw new ValidationError('numero e localizacao são obrigatórios');
    }

    // Verificar se já existe uma mesa com esse número NESTA conta
    // (outros quiosques podem ter uma mesa com o mesmo número, sem problema)
    const mesaExistente = await Mesa.findOne({ conta: req.conta._id, numero });
    if (mesaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Você já tem uma mesa com este número'
      });
    }

    // Gerar token único para QR Code
    const qrcodeToken = uuidv4();

    const mesa = new Mesa({
      conta: req.conta._id,
      numero,
      localizacao,
      qrcodeToken
    });

    await mesa.save();

    // Gerar QR Code apontando para a URL pública do quiosque (com o slug)
    const qrcodeUrl = `${process.env.CLIENT_URL}/${req.conta.slug}/mesa/${qrcodeToken}`;
    const qrcodeImagem = await QRCode.toDataURL(qrcodeUrl);

    res.status(201).json({
      success: true,
      mesa,
      qrcode: {
        url: qrcodeUrl,
        imagem: qrcodeImagem
      }
    });
  }

  /**
   * Listar mesas da conta logada (painel do quiosque, autenticado)
   */
  async listar(req, res) {
    const mesas = await Mesa.find({ conta: req.conta._id, ativa: true })
      .populate('sessaoAtiva')
      .sort({ numero: 1 });

    res.json({
      success: true,
      mesas
    });
  }

  /**
   * Buscar mesa por QR Code token (rota pública — usada quando o cliente
   * escaneia o QR code físico na mesa)
   */
  async buscarPorQRCode(req, res) {
    const { token } = req.params;

    const mesa = await Mesa.findOne({ qrcodeToken: token, ativa: true });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    res.json({
      success: true,
      mesa
    });
  }

  /**
   * Buscar mesa por número dentro de um quiosque específico (rota pública —
   * usada quando o cliente digita o número da mesa manualmente, dentro da
   * URL própria do quiosque: /:slug/entrada)
   */
  async buscarPorSlugENumero(req, res) {
    const { slug, numero } = req.params;

    const conta = await Conta.findOne({ slug: slug.toLowerCase(), ativa: true });
    if (!conta) {
      return res.status(404).json({ success: false, message: 'Quiosque não encontrado' });
    }

    const mesa = await Mesa.findOne({ conta: conta._id, numero, ativa: true });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    res.json({
      success: true,
      mesa
    });
  }

  /**
   * Atualizar status da mesa (painel, autenticado)
   */
  async atualizarStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!['livre', 'ocupada'].includes(status)) {
      throw new ValidationError('Status inválido. Use "livre" ou "ocupada"');
    }

    const mesa = await Mesa.findOneAndUpdate(
      { _id: id, conta: req.conta._id },
      { status },
      { returnDocument: 'after', runValidators: true }
    );

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    res.json({
      success: true,
      mesa
    });
  }

  /**
   * Editar número e/ou localização da mesa (painel, autenticado)
   */
  async editar(req, res) {
    const { id } = req.params;
    const { numero, localizacao } = req.body;

    if (!numero && !localizacao) {
      throw new ValidationError('Informe numero e/ou localizacao para atualizar');
    }

    const mesa = await Mesa.findOne({ _id: id, conta: req.conta._id });
    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }

    if (numero && numero !== mesa.numero) {
      const conflito = await Mesa.findOne({ conta: req.conta._id, numero, _id: { $ne: id } });
      if (conflito) {
        return res.status(400).json({ success: false, message: 'Você já tem outra mesa com este número' });
      }
      mesa.numero = numero;
    }

    if (localizacao) {
      mesa.localizacao = localizacao;
    }

    await mesa.save();

    res.json({ success: true, mesa });
  }

  /**
   * Excluir mesa (painel, autenticado)
   */
  async deletar(req, res) {
    const { id } = req.params;

    const mesa = await Mesa.findOne({ _id: id, conta: req.conta._id });
    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa não encontrada' });
    }

    if (mesa.status === 'ocupada') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível excluir uma mesa ocupada. Feche a conta da mesa primeiro.'
      });
    }

    await Mesa.deleteOne({ _id: id });

    res.json({ success: true, message: 'Mesa excluída com sucesso' });
  }

  /**
   * Gerar novo QR Code para mesa (painel, autenticado)
   */
  async gerarNovoQRCode(req, res) {
    const { id } = req.params;

    const qrcodeToken = uuidv4();

    const mesa = await Mesa.findOneAndUpdate(
      { _id: id, conta: req.conta._id },
      { qrcodeToken },
      { returnDocument: 'after' }
    );

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    const qrcodeUrl = `${process.env.CLIENT_URL}/${req.conta.slug}/mesa/${qrcodeToken}`;
    const qrcodeImagem = await QRCode.toDataURL(qrcodeUrl);

    res.json({
      success: true,
      mesa,
      qrcode: {
        url: qrcodeUrl,
        imagem: qrcodeImagem
      }
    });
  }
}

module.exports = new MesaController();
