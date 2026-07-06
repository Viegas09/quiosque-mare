const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Mesa = require('../models/Mesa');
const Produto = require('../models/Produto');

// Rota temporária: GET /api/seed-temp?chave=SUACHAVE
// Depois de rodar uma vez com sucesso, REMOVA este arquivo e a linha
// que o importa em server.js — ele não deve ficar exposto em produção.
router.get('/', async (req, res) => {
  try {
    if (req.query.chave !== process.env.SEED_KEY) {
      return res.status(403).json({ success: false, message: 'Chave inválida' });
    }

    await Mesa.deleteMany({});
    await Produto.deleteMany({});

    const mesas = [];
    for (let i = 1; i <= 15; i++) {
      mesas.push({
        numero: i.toString(),
        localizacao: i <= 10 ? `Guarda-sol ${i}` : `Mesa ${i}`,
        qrcodeToken: uuidv4(),
        status: 'livre',
        ativa: true
      });
    }
    await Mesa.insertMany(mesas);

    const produtos = [
      { nome: 'Água Mineral', descricao: 'Água mineral natural 500ml', preco: 5.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 2, ordem: 1 },
      { nome: 'Água de Coco', descricao: 'Água de coco natural gelada', preco: 8.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 2, ordem: 2 },
      { nome: 'Refrigerante Lata', descricao: 'Coca-Cola, Guaraná ou Sprite 350ml', preco: 7.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 2, ordem: 3 },
      { nome: 'Suco Natural', descricao: 'Laranja, limão, abacaxi ou morango 500ml', preco: 12.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 5, ordem: 4 },
      { nome: 'Cerveja Lata', descricao: 'Skol, Brahma ou Antarctica 350ml', preco: 8.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 2, ordem: 5 },
      { nome: 'Cerveja Long Neck', descricao: 'Heineken, Stella ou Corona 330ml', preco: 12.00, categoria: 'bebidas', disponivel: true, tempoPreparoEstimado: 2, ordem: 6 },
      { nome: 'Caipirinha', descricao: 'Limão, vodka, cachaça ou sakê', preco: 18.00, categoria: 'drinks', disponivel: true, tempoPreparoEstimado: 5, ordem: 1 },
      { nome: 'Piña Colada', descricao: 'Abacaxi, coco e rum', preco: 22.00, categoria: 'drinks', disponivel: true, tempoPreparoEstimado: 7, ordem: 2 },
      { nome: 'Mojito', descricao: 'Hortelã, limão e rum', preco: 20.00, categoria: 'drinks', disponivel: true, tempoPreparoEstimado: 7, ordem: 3 },
      { nome: 'Amendoim', descricao: 'Amendoim torrado com sal', preco: 10.00, categoria: 'petiscos', disponivel: true, tempoPreparoEstimado: 2, ordem: 1 },
      { nome: 'Batata Frita', descricao: 'Porção de batata frita crocante', preco: 25.00, categoria: 'petiscos', disponivel: true, tempoPreparoEstimado: 15, ordem: 2 },
      { nome: 'Isca de Peixe', descricao: 'Tilápia empanada com molho tártaro', preco: 35.00, categoria: 'petiscos', disponivel: true, tempoPreparoEstimado: 20, ordem: 3 },
      { nome: 'Camarão à Milanesa', descricao: 'Camarão empanado crocante (300g)', preco: 45.00, categoria: 'petiscos', disponivel: true, tempoPreparoEstimado: 20, ordem: 4 },
      { nome: 'Porção de Fritas', descricao: 'Batata frita grande (serve 2-3 pessoas)', preco: 35.00, categoria: 'porcoes', disponivel: true, tempoPreparoEstimado: 15, ordem: 1 },
      { nome: 'Frango à Passarinho', descricao: 'Frango frito temperado (500g)', preco: 40.00, categoria: 'porcoes', disponivel: true, tempoPreparoEstimado: 25, ordem: 2 },
      { nome: 'Calabresa Acebolada', descricao: 'Linguiça calabresa com cebola (400g)', preco: 38.00, categoria: 'porcoes', disponivel: true, tempoPreparoEstimado: 20, ordem: 3 },
      { nome: 'Espetinho Misto', descricao: '3 espetinhos (carne, frango e linguiça) com farofa', preco: 32.00, categoria: 'pratos', disponivel: true, tempoPreparoEstimado: 25, ordem: 1 },
      { nome: 'Peixe Grelhado', descricao: 'Tilápia grelhada com arroz e salada', preco: 48.00, categoria: 'pratos', disponivel: true, tempoPreparoEstimado: 30, ordem: 2 },
      { nome: 'Moqueca de Camarão', descricao: 'Moqueca capixaba com arroz e pirão', preco: 65.00, categoria: 'pratos', disponivel: true, tempoPreparoEstimado: 35, ordem: 3 },
      { nome: 'Sorvete', descricao: 'Picolé ou sorvete de massa (diversos sabores)', preco: 8.00, categoria: 'sobremesas', disponivel: true, tempoPreparoEstimado: 2, ordem: 1 },
      { nome: 'Açaí', descricao: 'Açaí 300ml com banana e granola', preco: 18.00, categoria: 'sobremesas', disponivel: true, tempoPreparoEstimado: 5, ordem: 2 },
      { nome: 'Pudim', descricao: 'Pudim de leite condensado', preco: 12.00, categoria: 'sobremesas', disponivel: true, tempoPreparoEstimado: 3, ordem: 3 }
    ];
    await Produto.insertMany(produtos);

    res.json({
      success: true,
      message: `Seed concluído: ${mesas.length} mesas e ${produtos.length} produtos criados.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
