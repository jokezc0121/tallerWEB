import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import DialogoConfirmacion from './DialogoConfirmacion.jsx';
import EstadoVacio from './EstadoVacio.jsx';
import FiltrosGaleria from './FiltrosGaleria.jsx';
import TarjetaArchivo from './TarjetaArchivo.jsx';
import TarjetaEsqueleto from './TarjetaEsqueleto.jsx';
import { IconoRecargar } from './Iconos.jsx';
import { FILTROS_TIPO } from '../utils/constantes.js';
import { marcaDeTiempo, normalizarTexto } from '../utils/formato.js';
import { obtenerCategoria } from '../utils/tiposArchivo.js';

const CANTIDAD_ESQUELETOS = 6;

/**
 * Galería multimedia (Rol 5): filtros, estados (cargando, vacía, sin
 * resultados, error) y cuadrícula de tarjetas con opción de eliminar.
 *
 * @param {'cargando'|'listo'|'error'} estado
 */
export default function Galeria({ archivos, estado, error, onReintentar, onEliminar }) {
  const [tipo, setTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [archivoPorEliminar, setArchivoPorEliminar] = useState(null);

  // La búsqueda se aplica con un valor "diferido" para que escribir sea fluido.
  const busquedaDiferida = useDeferredValue(busqueda);

  // Se agrega la categoría y se ordena del más reciente al más antiguo.
  const archivosOrdenados = useMemo(
    () =>
      archivos
        .map((archivo) => ({ ...archivo, categoria: obtenerCategoria(archivo.tipoArchivo, archivo.url) }))
        .sort((a, b) => marcaDeTiempo(b.fechaSubida) - marcaDeTiempo(a.fechaSubida)),
    [archivos],
  );

  const conteos = useMemo(() => {
    const totales = Object.fromEntries(FILTROS_TIPO.map(({ valor }) => [valor, 0]));
    totales.todos = archivosOrdenados.length;
    archivosOrdenados.forEach(({ categoria }) => {
      if (categoria in totales) totales[categoria] += 1;
    });
    return totales;
  }, [archivosOrdenados]);

  const archivosVisibles = useMemo(() => {
    const textoBuscado = normalizarTexto(busquedaDiferida);
    return archivosOrdenados.filter(
      (archivo) =>
        (tipo === 'todos' || archivo.categoria === tipo) &&
        (!textoBuscado || normalizarTexto(archivo.titulo).includes(textoBuscado)),
    );
  }, [archivosOrdenados, tipo, busquedaDiferida]);

  const limpiarFiltros = useCallback(() => {
    setTipo('todos');
    setBusqueda('');
  }, []);

  const cancelarEliminacion = useCallback(() => setArchivoPorEliminar(null), []);

  const confirmarEliminacion = useCallback(() => {
    if (archivoPorEliminar) onEliminar(archivoPorEliminar);
    setArchivoPorEliminar(null);
  }, [archivoPorEliminar, onEliminar]);

  const cargando = estado === 'cargando';
  const hayFiltros = tipo !== 'todos' || busqueda.trim() !== '';

  let contenido;
  if (cargando && archivos.length === 0) {
    contenido = (
      <div className="galeria__cuadricula" aria-busy="true">
        <span className="visualmente-oculto" role="status">
          Cargando archivos…
        </span>
        {Array.from({ length: CANTIDAD_ESQUELETOS }, (_, indice) => (
          <TarjetaEsqueleto key={indice} />
        ))}
      </div>
    );
  } else if (estado === 'error') {
    contenido = (
      <EstadoVacio
        variante="error"
        titulo="No se pudo cargar la galería"
        descripcion={error || 'Ocurrió un error al obtener los archivos.'}
        textoAccion="Reintentar"
        onAccion={onReintentar}
      />
    );
  } else if (archivos.length === 0) {
    contenido = (
      <EstadoVacio
        variante="vacio"
        titulo="Aún no hay archivos"
        descripcion="Sube tu primera imagen, video o PDF con el formulario y aparecerá aquí al instante."
      />
    );
  } else if (archivosVisibles.length === 0) {
    contenido = (
      <EstadoVacio
        variante="sin-resultados"
        titulo="Sin resultados"
        descripcion={
          busquedaDiferida.trim()
            ? `Ningún archivo coincide con "${busquedaDiferida.trim()}" en el filtro seleccionado.`
            : 'No hay archivos de este tipo todavía.'
        }
        textoAccion="Limpiar filtros"
        onAccion={limpiarFiltros}
      />
    );
  } else {
    contenido = (
      <ul className="galeria__cuadricula" aria-busy={cargando}>
        {archivosVisibles.map((archivo) => (
          <li key={archivo.id} className="galeria__elemento">
            <TarjetaArchivo archivo={archivo} onSolicitarEliminar={setArchivoPorEliminar} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="galeria">
      <header className="panel__cabecera panel__cabecera--fila">
        <div>
          <h2 className="panel__titulo" id="titulo-galeria">
            Galería multimedia
          </h2>
          <p className="panel__descripcion" aria-live="polite">
            {cargando && archivos.length === 0
              ? 'Cargando archivos…'
              : hayFiltros
                ? `Mostrando ${archivosVisibles.length} de ${archivos.length} archivos`
                : `${archivos.length} ${archivos.length === 1 ? 'archivo' : 'archivos'} en la nube`}
          </p>
        </div>
        <button
          type="button"
          className="boton boton--secundario boton--pequeno"
          onClick={onReintentar}
          disabled={cargando}
          aria-label="Actualizar galería"
        >
          <span className={cargando ? 'girando' : undefined}>
            <IconoRecargar tamano={16} />
          </span>
          <span className="ocultar-en-movil">Actualizar</span>
        </button>
      </header>

      <FiltrosGaleria
        tipo={tipo}
        busqueda={busqueda}
        conteos={conteos}
        onCambiarTipo={setTipo}
        onCambiarBusqueda={setBusqueda}
      />

      {contenido}

      <DialogoConfirmacion
        abierto={Boolean(archivoPorEliminar)}
        titulo="¿Eliminar este archivo?"
        mensaje={
          archivoPorEliminar
            ? `"${archivoPorEliminar.titulo}" se eliminará de la nube y de la base de datos. Esta acción no se puede deshacer.`
            : ''
        }
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={cancelarEliminacion}
      />
    </div>
  );
}
