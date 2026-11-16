// Validaciones del formulario de carga (se ejecutan en el cliente antes del envío).
import {
  FORMATOS_LEGIBLES,
  LIMITE_AUTOR,
  LIMITE_TITULO,
  MIME_POR_EXTENSION,
  MINIMO_CARACTERES,
  TAMANO_MAXIMO_BYTES,
  TAMANO_MAXIMO_MB,
  TIPOS_PERMITIDOS,
} from './constantes.js';
import { formatearTamano, obtenerExtension } from './formato.js';

/**
 * Obtiene el tipo MIME de un archivo. Si el navegador no lo informa
 * (ocurre en algunos sistemas), se deduce por la extensión.
 * @param {File} archivo
 * @returns {string}
 */
export function obtenerMimeArchivo(archivo) {
  if (!archivo) return '';
  if (archivo.type) return archivo.type.toLowerCase();
  return MIME_POR_EXTENSION[obtenerExtension(archivo.name)] ?? '';
}

/**
 * Valida el formato y el peso de un archivo.
 * @param {File|null} archivo
 * @returns {string|null} Mensaje de error en español, o null si es válido.
 */
export function validarArchivo(archivo) {
  if (!archivo) {
    return 'Selecciona o arrastra un archivo para subirlo.';
  }

  const mime = obtenerMimeArchivo(archivo);
  if (!TIPOS_PERMITIDOS[mime]) {
    const formato = mime || obtenerExtension(archivo.name).toUpperCase() || 'desconocido';
    return `El formato de "${archivo.name}" (${formato}) no está permitido. Solo se aceptan archivos ${FORMATOS_LEGIBLES}.`;
  }

  if (archivo.size === 0) {
    return `El archivo "${archivo.name}" está vacío (0 bytes). Elige otro archivo.`;
  }

  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return `El archivo "${archivo.name}" pesa ${formatearTamano(archivo.size)} y supera el límite de ${TAMANO_MAXIMO_MB} MB.`;
  }

  return null;
}

/**
 * Valida un campo de texto obligatorio.
 * @returns {string|null}
 */
function validarTexto(valor, { nombre, maximo }) {
  const texto = String(valor ?? '').trim();
  if (!texto) return `El campo ${nombre} es obligatorio.`;
  if (texto.length < MINIMO_CARACTERES) {
    return `El campo ${nombre} debe tener al menos ${MINIMO_CARACTERES} caracteres.`;
  }
  if (texto.length > maximo) {
    return `El campo ${nombre} no puede superar los ${maximo} caracteres.`;
  }
  return null;
}

/**
 * Valida todo el formulario de carga.
 * @param {{ archivo: File|null, titulo: string, subidoPor: string }} datos
 * @returns {{ archivo?: string, titulo?: string, subidoPor?: string }}
 *   Objeto con los errores encontrados (vacío si todo es válido).
 */
export function validarFormulario({ archivo, titulo, subidoPor }) {
  const errores = {};

  const errorArchivo = validarArchivo(archivo);
  if (errorArchivo) errores.archivo = errorArchivo;

  const errorTitulo = validarTexto(titulo, { nombre: '"Título"', maximo: LIMITE_TITULO });
  if (errorTitulo) errores.titulo = errorTitulo;

  const errorAutor = validarTexto(subidoPor, { nombre: '"Autor"', maximo: LIMITE_AUTOR });
  if (errorAutor) errores.subidoPor = errorAutor;

  return errores;
}
