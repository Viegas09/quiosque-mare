#!/usr/bin/env node

/**
 * Script de Health Check
 * Verifica se o servidor está respondendo corretamente
 */

const http = require('http');

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

console.log('🏥 Verificando saúde do servidor...\n');

// Teste 1: Health Check
http.get(`http://${HOST}:${PORT}/health`, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('✅ Servidor está rodando!');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Mensagem: ${response.message}`);
        console.log(`   Timestamp: ${response.timestamp}\n`);
        
        // Teste 2: Rota raiz
        testRootEndpoint();
      } else {
        console.log('❌ Servidor respondeu mas com erro');
        process.exit(1);
      }
    } catch (error) {
      console.log('❌ Erro ao processar resposta:', error.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.log('❌ Erro ao conectar no servidor');
  console.log(`   Erro: ${err.message}`);
  console.log(`\n💡 Certifique-se de que o servidor está rodando:`);
  console.log(`   npm run dev\n`);
  process.exit(1);
});

function testRootEndpoint() {
  http.get(`http://${HOST}:${PORT}/`, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.success && response.endpoints) {
          console.log('✅ API configurada corretamente!');
          console.log('   Endpoints disponíveis:');
          Object.entries(response.endpoints).forEach(([name, path]) => {
            console.log(`   - ${name}: ${path}`);
          });
          console.log('\n🎉 Tudo funcionando! Backend pronto para uso.\n');
        }
      } catch (error) {
        console.log('⚠️  Erro ao verificar endpoints');
      }
    });
  }).on('error', (err) => {
    console.log('⚠️  Erro ao verificar endpoints:', err.message);
  });
}
