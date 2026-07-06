// Status possíveis de um pedido, na ordem em que ocorrem no fluxo.
// Centralizado aqui para evitar strings soltas (e typos) espalhadas pelos controllers.
const PEDIDO_STATUS = {
  AGUARDANDO_PAGAMENTO: 'aguardando_pagamento',
  PAGO: 'pago',
  EM_PREPARACAO: 'em_preparacao',
  PRONTO: 'pronto',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
};

const PEDIDO_STATUS_VALUES = Object.values(PEDIDO_STATUS);

const MESA_STATUS = {
  LIVRE: 'livre',
  OCUPADA: 'ocupada',
};

const MESA_STATUS_VALUES = Object.values(MESA_STATUS);

const SESSAO_STATUS = {
  ABERTA: 'aberta',
  FECHADA: 'fechada',
};

const SESSAO_STATUS_VALUES = Object.values(SESSAO_STATUS);

module.exports = {
  PEDIDO_STATUS,
  PEDIDO_STATUS_VALUES,
  MESA_STATUS,
  MESA_STATUS_VALUES,
  SESSAO_STATUS,
  SESSAO_STATUS_VALUES,
};
