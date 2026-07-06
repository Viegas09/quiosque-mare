const Mesa = require('../models/Mesa');
const Sessao = require('../models/Sessao');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const ValidationError = require('../utils/ValidationError');

class MesaController {

  /**
   * Criar nova mesa
   */
  async criar(req, res) {
    const { numero, localizacao } = req.body;

    if (!numero || !localizacao) {
      throw new ValidationError('numero e localizacao são obrigatórios');
    }

    // Verificar se já existe
    const mesaExistente = await Mesa.findOne({ numero });
    if (mesaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Mesa com este número já existe'
      });
    }

    // Gerar token único para QR Code
    const qrcodeToken = uuidv4();

    const mesa = new Mesa({
      numero,
      localizacao,
      qrcodeToken
    });

    await mesa.save();

    // Gerar QR Code
    const qrcodeUrl = `${process.env.CLIENT_URL}/mesa/${qrcodeToken}`;
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
   * Listar todas as mesas
   */
  async listar(req, res) {
    const mesas = await Mesa.find({ ativa: true })
      .populate('sessaoAtiva')
      .sort({ numero: 1 });

    res.json({
      success: true,
      mesas
    });
  }

  /**
   * Buscar mesa por QR Code token
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
   * Buscar mesa por número
   */
  async buscarPorNumero(req, res) {
    const { numero } = req.params;

    const mesa = await Mesa.findOne({ numero, ativa: true });

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
   * Atualizar status da mesa
   */
  async atualizarStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!['livre', 'ocupada'].includes(status)) {
      throw new ValidationError('Status inválido. Use "livre" ou "ocupada"');
    }

    const mesa = await Mesa.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
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
   * Gerar novo QR Code para mesa
   */
  async gerarNovoQRCode(req, res) {
    const { id } = req.params;

    const qrcodeToken = uuidv4();

    const mesa = await Mesa.findByIdAndUpdate(
      id,
      { qrcodeToken },
      { new: true }
    );

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    const qrcodeUrl = `${process.env.CLIENT_URL}/mesa/${qrcodeToken}`;
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
