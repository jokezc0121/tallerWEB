// Funciones para mostrar datos con un formato legible en español.

const formateadorNumero = new Intl.NumberFormat('es', { maximumFractionDigits: 1 });
const formateadorNumeroMb = new Intl.NumberFormat('es', { maximumFractionDigits: 2 });
const formateadorFecha = new Intl.DateTimeFormat('es', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Convierte un peso en bytes a un texto legible en B, KB o MB.
 * @param {number} bytes
 * @returns {string} Ejemplo: "2,35 MB", "512 KB".
 */
export function formatearTamano(bytes) {
  const numero = Number(bytes);
  if (!Number.isFinite(numero) || numero < 0) return 'Tamaño desconocido';
  if (numero < 1024) return `${numero} B`;
  if (numero < 1024 * 1024) return `${formateadorNumero.format(numero / 1024)} KB`;
  return `${formateadorNumeroMb.format(numero / (1024 * 1024))} MB`;
}

/**
 * Convierte una fecha (Date, texto ISO o milisegundos) a un texto legible.
 * @param {Date|string|number} fecha
 * @returns {string} Ejemplo: "16 nov 2026, 10:45".
 */
export function formatearFecha(fecha) {
  if (fecha === null || fecha === undefined || fecha === '') return 'Fecha desconocida';
  const valor = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(valor.getTime())) return 'Fecha desconocida';
  return formateadorFecha.format(valor);
}

/**
 * Devuelve el valor numérico (ms) de una fecha, o 0 si no es válida.
 * Se usa para ordenar los archivos del más reciente al más antiguo.
 */
export function marcaDeTiempo(fecha) {
  const valor = new Date(fecha ?? '').getTime();
  return Number.isNaN(valor) ? 0 : valor;
}

/**
 * Normaliza un texto para búsquedas: minúsculas y sin tildes.
 * @param {string} texto
 */
export function normalizarTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Devuelve el nombre de un archivo sin su extensión.
 * @param {string} nombre Ejemplo: "foto-vacaciones.jpg"
 * @returns {string} Ejemplo: "foto-vacaciones"
 */
export function nombreSinExtension(nombre) {
  const texto = String(nombre ?? '');
  const punto = texto.lastIndexOf('.');
  return punto > 0 ? texto.slice(0, punto) : texto;
}

/**
 * Obtiene la extensión (en minúsculas) de un nombre de archivo o URL.
 * @param {string} ruta
 * @returns {string} Ejemplo: "pdf", o "" si no tiene extensión.
 */
export function obtenerExtension(ruta) {
  const limpio = String(ruta ?? '').split(/[?#]/)[0];
  const ultimoSegmento = limpio.split('/').pop() ?? '';
  const punto = ultimoSegmento.lastIndexOf('.');
  return punto > 0 ? ultimoSegmento.slice(punto + 1).toLowerCase() : '';
}
