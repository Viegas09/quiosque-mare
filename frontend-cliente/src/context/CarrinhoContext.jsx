import { useState, useEffect } from 'react';
import { CarrinhoContext } from './carrinhoContextInstance';

// Funções de leitura do localStorage usadas como inicializador "preguiçoso"
// do useState — evita um efeito que dispara setState logo no primeiro
// render (o que causaria uma renderização em cascata desnecessária).
const carregarCarrinhoSalvo = () => {
  try {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    return [];
  }
};

const carregarMesaSalva = () => {
  try {
    const mesaSalva = localStorage.getItem('mesa');
    return mesaSalva ? JSON.parse(mesaSalva) : null;
  } catch (error) {
    console.error('Erro ao carregar mesa:', error);
    return null;
  }
};

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState(carregarCarrinhoSalvo);
  const [mesa, setMesa] = useState(carregarMesaSalva);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  useEffect(() => {
    if (mesa) {
      localStorage.setItem('mesa', JSON.stringify(mesa));
    }
  }, [mesa]);

  // Adicionar item ao carrinho
  const adicionarItem = (produto, quantidade = 1, observacoes = '') => {
    setItens((prevItens) => {
      const itemExistente = prevItens.find(
        (item) => item.produto._id === produto._id && item.observacoes === observacoes
      );

      if (itemExistente) {
        return prevItens.map((item) =>
          item.produto._id === produto._id && item.observacoes === observacoes
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }

      return [
        ...prevItens,
        {
          produto,
          quantidade,
          observacoes,
          subtotal: produto.preco * quantidade,
        },
      ];
    });
  };

  // Remover item do carrinho
  const removerItem = (produtoId, observacoes = '') => {
    setItens((prevItens) =>
      prevItens.filter(
        (item) => !(item.produto._id === produtoId && item.observacoes === observacoes)
      )
    );
  };

  // Atualizar quantidade
  const atualizarQuantidade = (produtoId, observacoes, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(produtoId, observacoes);
      return;
    }

    setItens((prevItens) =>
      prevItens.map((item) =>
        item.produto._id === produtoId && item.observacoes === observacoes
          ? {
              ...item,
              quantidade: novaQuantidade,
              subtotal: item.produto.preco * novaQuantidade,
            }
          : item
      )
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setItens([]);
    localStorage.removeItem('carrinho');
  };

  // Calcular total
  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.subtotal, 0);
  };

  // Quantidade total de itens
  const quantidadeTotal = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  // Definir mesa
  const definirMesa = (mesaData) => {
    setMesa(mesaData);
  };

  // Limpar mesa
  const limparMesa = () => {
    setMesa(null);
    localStorage.removeItem('mesa');
  };

  const value = {
    itens,
    mesa,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularTotal,
    quantidadeTotal,
    definirMesa,
    limparMesa,
  };

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
};
