const jwt = require('jsonwebtoken');
const Conta = require('../models/Conta');
const ValidationError = require('../utils/ValidationError');

const gerarToken = (contaId) => {
  return jwt.sign({ contaId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

class AuthController {

  /**
   * Cadastrar uma nova conta (dono de quiosque)
   */
  async registrar(req, res) {
    const { nomeQuiosque, email, senha } = req.body;

    if (!nomeQuiosque || !email || !senha) {
      throw new ValidationError('nomeQuiosque, email e senha são obrigatórios');
    }

    if (senha.length < 6) {
      throw new ValidationError('A senha precisa ter pelo menos 6 caracteres');
    }

    const contaExistente = await Conta.findOne({ email: email.toLowerCase() });
    if (contaExistente) {
      return res.status(409).json({
        success: false,
        message: 'Já existe uma conta com este email'
      });
    }

    const conta = new Conta({ nomeQuiosque, email, senha });
    await conta.save();

    const token = gerarToken(conta._id);

    res.status(201).json({
      success: true,
      token,
      conta: {
        id: conta._id,
        nomeQuiosque: conta.nomeQuiosque,
        email: conta.email
      }
    });
  }

  /**
   * Login — devolve um token JWT que identifica a conta
   */
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new ValidationError('email e senha são obrigatórios');
    }

    // .select('+senha') porque o campo senha tem select:false por padrão no model
    const conta = await Conta.findOne({ email: email.toLowerCase(), ativa: true }).select('+senha');

    if (!conta) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const senhaCorreta = await conta.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const token = gerarToken(conta._id);

    res.json({
      success: true,
      token,
      conta: {
        id: conta._id,
        nomeQuiosque: conta.nomeQuiosque,
        email: conta.email
      }
    });
  }

  /**
   * Retorna os dados da conta logada (usado pelo painel pra confirmar
   * que o token ainda é válido e trazer o nome do quiosque)
   */
  async me(req, res) {
    res.json({
      success: true,
      conta: {
        id: req.conta._id,
        nomeQuiosque: req.conta.nomeQuiosque,
        email: req.conta.email
      }
    });
  }
}

module.exports = new AuthController();
