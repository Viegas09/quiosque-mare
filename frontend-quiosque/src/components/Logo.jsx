/**
 * Marca Maré — ondas monoline + wordmark.
 * Baseado no Guia de Identidade Visual (paleta Maré / Aqua / Coral / Tinta).
 */
const Logo = ({ variant = 'full', size = 32, light = false, className = '' }) => {
  const primaryColor = light ? '#FFFFFF' : '#0B7A8C';
  const accentColor = light ? '#CFF3F7' : '#14C0D4';

  const mark = (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 20 85 Q 50 45 80 85 T 180 85"
        fill="none"
        stroke={primaryColor}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 20 130 Q 50 90 80 130 T 180 130"
        fill="none"
        stroke={accentColor}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'mark') {
    return <span className={className}>{mark}</span>;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      <span
        className={`font-display font-semibold ${light ? 'text-white' : 'text-mare-800'}`}
        style={{ fontSize: size * 0.75 }}
      >
        Maré
      </span>
    </span>
  );
};

export default Logo;
