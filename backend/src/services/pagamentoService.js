const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configurar Mercado Pago (SDK v2)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const paymentClient = new Payment(client);

class PagamentoService {

  /**
   * Criar pagamento PIX (retorna o código copia-e-cola e o QR Code em base64)
   */
  async criarPreferenciaPix(pedido) {
    try {
      const payment = await paymentClient.create({
        body: {
          transaction_amount: pedido.total,
          description: `Pedido #${pedido._id}`,
          payment_method_id: 'pix',
          payer: {
            email: 'cliente@email.com' // Pode ser coletado do cliente
          },
          external_reference: pedido._id.toString(),
          notification_url: `${process.env.BACKEND_URL}/api/pedidos/webhook/mercadopago`,
        },
      });

      const dadosPix = payment.point_of_interaction?.transaction_data;

      if (!dadosPix?.qr_code) {
        return {
          success: false,
          error: 'Mercado Pago não retornou os dados do PIX (verifique se o método pix está habilitado na conta)',
        };
      }

      return {
        success: true,
        preferenceId: payment.id,
        qrCode: dadosPix.qr_code,
        qrCodeBase64: dadosPix.qr_code_base64,
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Criar pagamento com cartão
   */
  async processarPagamentoCartao(dadosCartao, pedido) {
    try {
      const payment = await paymentClient.create({
        body: {
          transaction_amount: pedido.total,
          token: dadosCartao.token, // Token gerado pelo frontend
          description: `Pedido #${pedido._id}`,
          installments: dadosCartao.installments || 1,
          payment_method_id: dadosCartao.payment_method_id,
          payer: {
            email: dadosCartao.email || 'cliente@email.com'
          },
          external_reference: pedido._id.toString(),
        },
      });

      return {
        success: payment.status === 'approved',
        paymentId: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail
      };
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar status de pagamento
   */
  async verificarStatusPagamento(paymentId) {
    try {
      const payment = await paymentClient.get({ id: paymentId });
      return {
        success: true,
        status: payment.status,
        statusDetail: payment.status_detail
      };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PagamentoService();
