// Utilidades para identificar la categoría y la etiqueta de un archivo.
import { CATEGORIAS, MIME_POR_EXTENSION, TIPOS_PERMITIDOS } from './constantes.js';
import { obtenerExtension } from './formato.js';

/**
 * Determina la categoría (imagen, video, pdf u otro) a partir del tipo de
 * archivo que guarda el backend. Acepta tipos MIME ("image/png"), categorías
 * ("imagen", "image", "video", "pdf") y, como último recurso, la extensión de la URL.
 * @param {string} tipoArchivo
 * @param {string} [url]
 * @returns {'imagen'|'video'|'pdf'|'otro'}
 */
export function obtenerCategoria(tipoArchivo, url = '') {
  const tipo = String(tipoArchivo ?? '').toLowerCase().trim();

  if (tipo.startsWith('image') || tipo.startsWith('imagen')) return 'imagen';
  if (tipo.startsWith('video')) return 'video';
  if (tipo.includes('pdf')) return 'pdf';

  const mimeDesdeUrl = MIME_POR_EXTENSION[obtenerExtension(url)];
  if (mimeDesdeUrl) return TIPOS_PERMITIDOS[mimeDesdeUrl].categoria;

  return 'otro';
}

/**
 * Devuelve una etiqueta corta del formato (JPG, MP4, PDF...).
 * @param {string} tipoArchivo
 * @param {string} [url]
 */
export function obtenerEtiquetaTipo(tipoArchivo, url = '') {
  const tipo = String(tipoArchivo ?? '').toLowerCase().trim();
  if (TIPOS_PERMITIDOS[tipo]) return TIPOS_PERMITIDOS[tipo].etiqueta;

  const extension = obtenerExtension(url);
  if (extension) return extension.toUpperCase();

  return CATEGORIAS[obtenerCategoria(tipo, url)].singular;
}

/**
 * Devuelve el nombre en español de una categoría.
 * @param {'imagen'|'video'|'pdf'|'otro'} categoria
 */
export function nombreCategoria(categoria) {
  return (CATEGORIAS[categoria] ?? CATEGORIAS.otro).singular;
}
