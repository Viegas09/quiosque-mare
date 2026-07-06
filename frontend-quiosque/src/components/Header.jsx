import { ArrowLeft } from 'lucide-react';

/**
 * Cabeçalho compartilhado das telas internas (não a tela de entrada/dashboard,
 * que têm o logo completo). Mantém a marca consistente em Cardápio, Carrinho,
 * Checkout, Acompanhar, Produtos e Contas sem duplicar o markup em cada uma.
 *
 * size="md" -> apps do cliente (bg-mare-600, título menor)
 * size="lg" -> painel do quiosque (bg-mare-700, título maior)
 */
const Header = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  sticky = true,
  size = 'md',
}) => {
  const estilos = size === 'lg'
    ? { pad: 'p-6', titulo: 'text-3xl', bg: 'bg-mare-700' }
    : { pad: 'p-4', titulo: 'text-2xl', bg: 'bg-mare-600' };

  return (
    <div className={`${estilos.bg} text-white ${estilos.pad} ${sticky ? 'sticky top-0 z-10' : ''} shadow-lg`}>
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="shrink-0 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className={`${estilos.titulo} font-display font-semibold truncate`}>{title}</h1>
          {subtitle && <p className="text-aqua-100 text-sm mt-0.5 truncate">{subtitle}</p>}
        </div>
        {rightSlot}
      </div>
    </div>
  );
};

export default Header;
