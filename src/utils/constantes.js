// Constantes compartidas por toda la aplicación.

/** Límite de peso por archivo, en megabytes. */
export const TAMANO_MAXIMO_MB = 10;

/** Límite de peso por archivo, en bytes (10 MB). */
export const TAMANO_MAXIMO_BYTES = TAMANO_MAXIMO_MB * 1024 * 1024;

/** Longitudes permitidas para los campos de texto del formulario. */
export const LIMITE_TITULO = 100;
export const LIMITE_AUTOR = 60;
export const MINIMO_CARACTERES = 3;

/**
 * Tipos MIME permitidos. Cada uno indica su categoría, una etiqueta corta
 * para mostrar en la interfaz y las extensiones que le corresponden.
 */
export const TIPOS_PERMITIDOS = {
  'image/jpeg': { categoria: 'imagen', etiqueta: 'JPG', extensiones: ['jpg', 'jpeg'] },
  'image/png': { categoria: 'imagen', etiqueta: 'PNG', extensiones: ['png'] },
  'image/webp': { categoria: 'imagen', etiqueta: 'WEBP', extensiones: ['webp'] },
  'image/gif': { categoria: 'imagen', etiqueta: 'GIF', extensiones: ['gif'] },
  'video/mp4': { categoria: 'video', etiqueta: 'MP4', extensiones: ['mp4'] },
  'video/webm': { categoria: 'video', etiqueta: 'WEBM', extensiones: ['webm'] },
  'application/pdf': { categoria: 'pdf', etiqueta: 'PDF', extensiones: ['pdf'] },
};

/** Lista de tipos MIME permitidos. */
export const MIME_PERMITIDOS = Object.keys(TIPOS_PERMITIDOS);

/** Relación extensión → tipo MIME (se usa cuando el navegador no informa el tipo). */
export const MIME_POR_EXTENSION = Object.entries(TIPOS_PERMITIDOS).reduce(
  (mapa, [mime, { extensiones }]) => {
    extensiones.forEach((extension) => {
      mapa[extension] = mime;
    });
    return mapa;
  },
  {},
);

/** Valor del atributo `accept` del input de archivo. */
export const ACCEPT_INPUT = [
  ...MIME_PERMITIDOS,
  ...Object.keys(MIME_POR_EXTENSION).map((extension) => `.${extension}`),
].join(',');

/** Texto corto con los formatos aceptados, para mostrar en la interfaz. */
export const FORMATOS_LEGIBLES = 'JPG, PNG, WEBP, GIF, MP4, WEBM o PDF';

/** Categorías de archivo y sus etiquetas en español. */
export const CATEGORIAS = {
  imagen: { singular: 'Imagen', plural: 'Imágenes' },
  video: { singular: 'Video', plural: 'Videos' },
  pdf: { singular: 'PDF', plural: 'PDF' },
  otro: { singular: 'Archivo', plural: 'Otros' },
};

/** Opciones del filtro por tipo de la galería. */
export const FILTROS_TIPO = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'imagen', etiqueta: 'Imágenes' },
  { valor: 'video', etiqueta: 'Videos' },
  { valor: 'pdf', etiqueta: 'PDF' },
];

/** Tiempo (ms) que una notificación flotante permanece visible. */
export const DURACION_NOTIFICACION_MS = 5000;
