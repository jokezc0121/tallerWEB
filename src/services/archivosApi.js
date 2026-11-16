// Servicio de comunicación con la API REST de Vault.
// Todas las llamadas HTTP del frontend pasan por este archivo.

/* ------------------------------------------------------------------ */
/* Configuración                                                      */
/* ------------------------------------------------------------------ */

/** URL base de la API (definida en .env con VITE_API_URL). */
export const URL_BASE_API = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(
  /\/+$/,
  '',
);

/** Ruta del recurso de archivos. */
export const RUTA_ARCHIVOS = `${URL_BASE_API}/api/archivos`;

/** Tiempo máximo de espera para GET y DELETE (15 s). */
const TIEMPO_LIMITE_PETICION_MS = 15_000;

/** Tiempo máximo de espera para una subida (5 min). */
const TIEMPO_LIMITE_SUBIDA_MS = 5 * 60_000;

/* ------------------------------------------------------------------ */
/* Nombres de campos centralizados                                    */
/* Si el backend usa otros nombres, solo hay que ajustarlos aquí.      */
/* ------------------------------------------------------------------ */

/** Nombres de los campos que se envían en el FormData de POST /api/archivos. */
export const CAMPOS_ENVIO = {
  archivo: 'archivo',
  titulo: 'titulo',
  subidoPor: 'subidoPor',
};

/** Nombres de los parámetros opcionales de GET /api/archivos. */
export const PARAMETROS_CONSULTA = {
  tipo: 'tipo',
  busqueda: 'busqueda',
};

/**
 * Campos que devuelve el backend. Para cada campo del frontend se indican los
 * nombres posibles en la respuesta, en orden de prioridad (por ejemplo `_id`
 * si se usa MongoDB, o `secure_url` si se reenvía la respuesta de Cloudinary).
 */
export const CAMPOS_RESPUESTA = {
  id: ['id', '_id'],
  titulo: ['titulo', 'title', 'nombre'],
  url: ['url', 'secure_url', 'secureUrl'],
  publicId: ['publicId', 'public_id'],
  tipoArchivo: ['tipoArchivo', 'tipo_archivo', 'mimetype', 'mimeType', 'tipo'],
  tamanoBytes: ['tamanoBytes', 'tamano_bytes', 'tamano', 'bytes', 'size'],
  fechaSubida: ['fechaSubida', 'fecha_subida', 'createdAt', 'created_at'],
  subidoPor: ['subidoPor', 'subido_por', 'autor'],
};

/** Claves en las que el backend podría envolver los datos ({ datos: [...] }, { data: {...} }...). */
const CLAVES_CONTENEDOR = ['datos', 'data', 'archivos', 'archivo', 'resultado', 'result'];

/** Claves en las que el backend podría enviar un mensaje de error. */
const CLAVES_MENSAJE = ['mensaje', 'message', 'error', 'detalle', 'detail'];

/* ------------------------------------------------------------------ */
/* Errores                                                            */
/* ------------------------------------------------------------------ */

/**
 * Error de la API con información adicional.
 * tipo: 'red' | 'servidor' | 'tiempo' | 'cancelado' | 'respuesta'
 */
export class ErrorApi extends Error {
  constructor(mensaje, { tipo = 'servidor', estado = 0 } = {}) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.tipo = tipo;
    this.estado = estado;
  }
}

const MENSAJE_RED = `No se pudo conectar con el servidor (${URL_BASE_API}). Revisa tu conexión a internet o verifica que la API esté en ejecución.`;
const MENSAJE_TIEMPO = 'El servidor tardó demasiado en responder. Inténtalo de nuevo en unos segundos.';
const MENSAJE_CANCELADO = 'La operación fue cancelada.';

function mensajePorEstado(estado) {
  if (estado === 400) return 'La solicitud no es válida. Revisa los datos enviados.';
  if (estado === 401 || estado === 403) return 'No tienes permiso para realizar esta acción.';
  if (estado === 404) return 'El recurso solicitado no existe en el servidor.';
  if (estado === 413) return 'El archivo es demasiado grande para el servidor.';
  if (estado === 415) return 'El servidor no admite este formato de archivo.';
  if (estado === 429) return 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';
  if (estado >= 500) return `Error interno del servidor (${estado}). Inténtalo de nuevo más tarde.`;
  return `El servidor respondió con un error inesperado (${estado}).`;
}

function extraerMensajeServidor(cuerpo) {
  if (!cuerpo) return null;
  if (typeof cuerpo === 'string') return cuerpo.trim() || null;
  if (typeof cuerpo !== 'object') return null;

  for (const clave of CLAVES_MENSAJE) {
    const valor = cuerpo[clave];
    if (typeof valor === 'string' && valor.trim()) return valor.trim();
    if (valor && typeof valor === 'object' && typeof valor.message === 'string') return valor.message;
  }

  if (Array.isArray(cuerpo.errores)) {
    const mensajes = cuerpo.errores
      .map((error) => (typeof error === 'string' ? error : error?.mensaje ?? error?.msg ?? error?.message))
      .filter(Boolean);
    if (mensajes.length) return mensajes.join(' ');
  }
  return null;
}

function crearErrorServidor(estado, cuerpo) {
  return new ErrorApi(extraerMensajeServidor(cuerpo) ?? mensajePorEstado(estado), {
    tipo: 'servidor',
    estado,
  });
}

/* ------------------------------------------------------------------ */
/* Normalización de respuestas                                        */
/* ------------------------------------------------------------------ */

function leerJsonSeguro(texto) {
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

function leerCampo(objeto, claves) {
  for (const clave of claves) {
    if (objeto[clave] !== undefined && objeto[clave] !== null) return objeto[clave];
  }
  return undefined;
}

/** Quita las envolturas típicas ({ datos: ... }, { data: ... }) de una respuesta. */
function desenvolver(cuerpo) {
  let actual = cuerpo;
  for (let nivel = 0; nivel < 3; nivel += 1) {
    if (!actual || typeof actual !== 'object' || Array.isArray(actual)) return actual;
    if (leerCampo(actual, CAMPOS_RESPUESTA.id) !== undefined) return actual;
    const clave = CLAVES_CONTENEDOR.find((nombre) => actual[nombre] !== undefined);
    if (!clave) return actual;
    actual = actual[clave];
  }
  return actual;
}

/**
 * Convierte un objeto del backend al formato que usa el frontend:
 * { id, titulo, url, publicId, tipoArchivo, tamanoBytes, fechaSubida, subidoPor }
 * @returns {object|null}
 */
export function normalizarArchivo(crudo) {
  if (!crudo || typeof crudo !== 'object') return null;

  const id = leerCampo(crudo, CAMPOS_RESPUESTA.id);
  const url = leerCampo(crudo, CAMPOS_RESPUESTA.url);
  const publicId = leerCampo(crudo, CAMPOS_RESPUESTA.publicId);
  const identificador = id ?? publicId ?? url;
  if (identificador === undefined) return null;

  const tamano = Number(leerCampo(crudo, CAMPOS_RESPUESTA.tamanoBytes));

  return {
    id: String(identificador),
    titulo: String(leerCampo(crudo, CAMPOS_RESPUESTA.titulo) ?? 'Sin título'),
    url: url ? String(url) : '',
    publicId: publicId ? String(publicId) : '',
    tipoArchivo: String(leerCampo(crudo, CAMPOS_RESPUESTA.tipoArchivo) ?? ''),
    tamanoBytes: Number.isFinite(tamano) ? tamano : 0,
    fechaSubida: leerCampo(crudo, CAMPOS_RESPUESTA.fechaSubida) ?? null,
    subidoPor: String(leerCampo(crudo, CAMPOS_RESPUESTA.subidoPor) ?? 'Anónimo'),
  };
}

/* ------------------------------------------------------------------ */
/* Petición genérica con fetch (GET / DELETE)                         */
/* ------------------------------------------------------------------ */

async function peticion(url, { method = 'GET', signal } = {}) {
  const controlador = new AbortController();
  let expiroTiempo = false;
  const temporizador = setTimeout(() => {
    expiroTiempo = true;
    controlador.abort();
  }, TIEMPO_LIMITE_PETICION_MS);

  const alAbortarExterno = () => controlador.abort();
  if (signal) {
    if (signal.aborted) controlador.abort();
    else signal.addEventListener('abort', alAbortarExterno, { once: true });
  }

  try {
    const respuesta = await fetch(url, {
      method,
      signal: controlador.signal,
      headers: { Accept: 'application/json' },
    });
    const cuerpo = leerJsonSeguro(await respuesta.text());

    if (!respuesta.ok) throw crearErrorServidor(respuesta.status, cuerpo);
    return cuerpo;
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    if (expiroTiempo) throw new ErrorApi(MENSAJE_TIEMPO, { tipo: 'tiempo' });
    if (signal?.aborted) throw new ErrorApi(MENSAJE_CANCELADO, { tipo: 'cancelado' });
    throw new ErrorApi(MENSAJE_RED, { tipo: 'red' });
  } finally {
    clearTimeout(temporizador);
    signal?.removeEventListener('abort', alAbortarExterno);
  }
}

/* ------------------------------------------------------------------ */
/* Endpoints                                                          */
/* ------------------------------------------------------------------ */

/**
 * GET /api/archivos
 * @param {{ tipo?: string, busqueda?: string, signal?: AbortSignal }} [opciones]
 * @returns {Promise<Array<object>>} Lista de archivos normalizados.
 */
export async function obtenerArchivos({ tipo, busqueda, signal } = {}) {
  const parametros = new URLSearchParams();
  if (tipo && tipo !== 'todos') parametros.set(PARAMETROS_CONSULTA.tipo, tipo);
  if (busqueda?.trim()) parametros.set(PARAMETROS_CONSULTA.busqueda, busqueda.trim());

  const consulta = parametros.toString();
  const cuerpo = await peticion(consulta ? `${RUTA_ARCHIVOS}?${consulta}` : RUTA_ARCHIVOS, {
    signal,
  });

  const lista = desenvolver(cuerpo);
  if (!Array.isArray(lista)) {
    throw new ErrorApi(
      'La respuesta del servidor no tiene el formato esperado (se esperaba una lista de archivos).',
      { tipo: 'respuesta' },
    );
  }
  return lista.map(normalizarArchivo).filter(Boolean);
}

/**
 * POST /api/archivos (multipart/form-data) con progreso real de subida.
 * Usa XMLHttpRequest porque fetch no informa el progreso de envío.
 *
 * @param {{ archivo: File, titulo: string, subidoPor: string }} datos
 * @param {{ onProgreso?: (porcentaje: number) => void }} [opciones]
 * @returns {{ promesa: Promise<object|null>, cancelar: () => void }}
 *   `promesa` se resuelve con el archivo creado (normalizado) o null si el
 *   backend no devuelve el registro.
 */
export function subirArchivo({ archivo, titulo, subidoPor }, { onProgreso } = {}) {
  const formData = new FormData();
  formData.append(CAMPOS_ENVIO.archivo, archivo, archivo.name);
  formData.append(CAMPOS_ENVIO.titulo, titulo);
  formData.append(CAMPOS_ENVIO.subidoPor, subidoPor);

  const xhr = new XMLHttpRequest();

  const promesa = new Promise((resolve, reject) => {
    xhr.open('POST', RUTA_ARCHIVOS);
    xhr.timeout = TIEMPO_LIMITE_SUBIDA_MS;
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable && onProgreso) {
        onProgreso(Math.min(100, Math.round((evento.loaded / evento.total) * 100)));
      }
    };
    xhr.upload.onload = () => onProgreso?.(100);

    xhr.onload = () => {
      const cuerpo = leerJsonSeguro(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        const datos = desenvolver(cuerpo);
        resolve(normalizarArchivo(Array.isArray(datos) ? datos[0] : datos));
      } else {
        reject(crearErrorServidor(xhr.status, cuerpo));
      }
    };
    xhr.onerror = () => reject(new ErrorApi(MENSAJE_RED, { tipo: 'red' }));
    xhr.ontimeout = () => reject(new ErrorApi(MENSAJE_TIEMPO, { tipo: 'tiempo' }));
    xhr.onabort = () => reject(new ErrorApi('La subida fue cancelada.', { tipo: 'cancelado' }));

    xhr.send(formData);
  });

  return {
    promesa,
    cancelar: () => xhr.abort(),
  };
}

/**
 * DELETE /api/archivos/:id
 * @param {string} id
 */
export async function eliminarArchivo(id) {
  await peticion(`${RUTA_ARCHIVOS}/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return true;
}
