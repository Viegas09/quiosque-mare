/**
 * Transforma "Quiosque do Vini" em "quiosque-do-vini" — usado como
 * identificador único e amigável na URL de cada conta (ex: seusite.com/quiosque-do-vini/entrada).
 */
function gerarSlugBase(texto) {
  return texto
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Garante que o slug seja único, testando slug, slug-2, slug-3... até achar
 * um livre. Recebe uma função `existe(slug)` que verifica no banco.
 */
async function gerarSlugUnico(texto, existe) {
  const base = gerarSlugBase(texto) || 'quiosque';
  let slug = base;
  let contador = 2;

  while (await existe(slug)) {
    slug = `${base}-${contador}`;
    contador++;
  }

  return slug;
}

module.exports = { gerarSlugBase, gerarSlugUnico };
