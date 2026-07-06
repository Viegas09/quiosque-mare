require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Importar models
const Mesa = require('../models/Mesa');
const Produto = require('../models/Produto');

// Conectar ao banco
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiosque-praia')
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    seedDatabase();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar:', err);
    process.exit(1);
  });

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Limpar dados existentes
    await Mesa.deleteMany({});
    await Produto.deleteMany({});
    console.log('🗑️  Dados antigos removidos\n');

    // Criar mesas
    console.log('🪑 Criando mesas...');
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
    console.log(`✅ ${mesas.length} mesas criadas\n`);

    // Criar produtos
    console.log('🍹 Criando produtos...');
    
    const produtos = [
      // BEBIDAS
      {
        nome: 'Água Mineral',
        descricao: 'Água mineral natural 500ml',
        preco: 5.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 1
      },
      {
        nome: 'Água de Coco',
        descricao: 'Água de coco natural gelada',
        preco: 8.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 2
      },
      {
        nome: 'Refrigerante Lata',
        descricao: 'Coca-Cola, Guaraná ou Sprite 350ml',
        preco: 7.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 3
      },
      {
        nome: 'Suco Natural',
        descricao: 'Laranja, limão, abacaxi ou morango 500ml',
        preco: 12.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 5,
        ordem: 4
      },
      {
        nome: 'Cerveja Lata',
        descricao: 'Skol, Brahma ou Antarctica 350ml',
        preco: 8.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 5
      },
      {
        nome: 'Cerveja Long Neck',
        descricao: 'Heineken, Stella ou Corona 330ml',
        preco: 12.00,
        categoria: 'bebidas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 6
      },

      // DRINKS
      {
        nome: 'Caipirinha',
        descricao: 'Limão, vodka, cachaça ou sakê',
        preco: 18.00,
        categoria: 'drinks',
        disponivel: true,
        tempoPreparoEstimado: 5,
        ordem: 1
      },
      {
        nome: 'Piña Colada',
        descricao: 'Abacaxi, coco e rum',
        preco: 22.00,
        categoria: 'drinks',
        disponivel: true,
        tempoPreparoEstimado: 7,
        ordem: 2
      },
      {
        nome: 'Mojito',
        descricao: 'Hortelã, limão e rum',
        preco: 20.00,
        categoria: 'drinks',
        disponivel: true,
        tempoPreparoEstimado: 7,
        ordem: 3
      },

      // PETISCOS
      {
        nome: 'Amendoim',
        descricao: 'Amendoim torrado com sal',
        preco: 10.00,
        categoria: 'petiscos',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 1
      },
      {
        nome: 'Batata Frita',
        descricao: 'Porção de batata frita crocante',
        preco: 25.00,
        categoria: 'petiscos',
        disponivel: true,
        tempoPreparoEstimado: 15,
        ordem: 2
      },
      {
        nome: 'Isca de Peixe',
        descricao: 'Tilápia empanada com molho tártaro',
        preco: 35.00,
        categoria: 'petiscos',
        disponivel: true,
        tempoPreparoEstimado: 20,
        ordem: 3
      },
      {
        nome: 'Camarão à Milanesa',
        descricao: 'Camarão empanado crocante (300g)',
        preco: 45.00,
        categoria: 'petiscos',
        disponivel: true,
        tempoPreparoEstimado: 20,
        ordem: 4
      },

      // PORÇÕES
      {
        nome: 'Porção de Fritas',
        descricao: 'Batata frita grande (serve 2-3 pessoas)',
        preco: 35.00,
        categoria: 'porcoes',
        disponivel: true,
        tempoPreparoEstimado: 15,
        ordem: 1
      },
      {
        nome: 'Frango à Passarinho',
        descricao: 'Frango frito temperado (500g)',
        preco: 40.00,
        categoria: 'porcoes',
        disponivel: true,
        tempoPreparoEstimado: 25,
        ordem: 2
      },
      {
        nome: 'Calabresa Acebolada',
        descricao: 'Linguiça calabresa com cebola (400g)',
        preco: 38.00,
        categoria: 'porcoes',
        disponivel: true,
        tempoPreparoEstimado: 20,
        ordem: 3
      },

      // PRATOS
      {
        nome: 'Espetinho Misto',
        descricao: '3 espetinhos (carne, frango e linguiça) com farofa',
        preco: 32.00,
        categoria: 'pratos',
        disponivel: true,
        tempoPreparoEstimado: 25,
        ordem: 1
      },
      {
        nome: 'Peixe Grelhado',
        descricao: 'Tilápia grelhada com arroz e salada',
        preco: 48.00,
        categoria: 'pratos',
        disponivel: true,
        tempoPreparoEstimado: 30,
        ordem: 2
      },
      {
        nome: 'Moqueca de Camarão',
        descricao: 'Moqueca capixaba com arroz e pirão',
        preco: 65.00,
        categoria: 'pratos',
        disponivel: true,
        tempoPreparoEstimado: 35,
        ordem: 3
      },

      // SOBREMESAS
      {
        nome: 'Sorvete',
        descricao: 'Picolé ou sorvete de massa (diversos sabores)',
        preco: 8.00,
        categoria: 'sobremesas',
        disponivel: true,
        tempoPreparoEstimado: 2,
        ordem: 1
      },
      {
        nome: 'Açaí',
        descricao: 'Açaí 300ml com banana e granola',
        preco: 18.00,
        categoria: 'sobremesas',
        disponivel: true,
        tempoPreparoEstimado: 5,
        ordem: 2
      },
      {
        nome: 'Pudim',
        descricao: 'Pudim de leite condensado',
        preco: 12.00,
        categoria: 'sobremesas',
        disponivel: true,
        tempoPreparoEstimado: 3,
        ordem: 3
      }
    ];

    await Produto.insertMany(produtos);
    console.log(`✅ ${produtos.length} produtos criados\n`);

    console.log('✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   - ${mesas.length} mesas`);
    console.log(`   - ${produtos.length} produtos`);
    console.log('\n🚀 Você pode iniciar o servidor agora!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}
