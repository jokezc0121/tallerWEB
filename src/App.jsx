import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Encabezado from './components/Encabezado.jsx';
import FormularioCarga from './components/FormularioCarga.jsx';
import Galeria from './components/Galeria.jsx';
import Notificaciones from './components/Notificaciones.jsx';
import { eliminarArchivo, obtenerArchivos } from './services/archivosApi.js';

const MAXIMO_NOTIFICACIONES = 4;

/**
 * Componente raíz. Mantiene la lista de archivos como única fuente de verdad
 * para que el formulario y la galería se sincronicen sin recargar la página.
 */
export default function App() {
  const [archivos, setArchivos] = useState([]);
  const [estadoGaleria, setEstadoGaleria] = useState('cargando');
  const [errorGaleria, setErrorGaleria] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);

  const controladorRef = useRef(null);
  const contadorNotificacionesRef = useRef(0);

  /* ----------------------------- Notificaciones ----------------------------- */

  const notificar = useCallback((tipo, titulo, mensaje) => {
    contadorNotificacionesRef.current += 1;
    const id = contadorNotificacionesRef.current;
    setNotificaciones((anteriores) =>
      [...anteriores, { id, tipo, titulo, mensaje }].slice(-MAXIMO_NOTIFICACIONES),
    );
  }, []);

  const cerrarNotificacion = useCallback((id) => {
    setNotificaciones((anteriores) => anteriores.filter((notificacion) => notificacion.id !== id));
  }, []);

  /* --------------------------- Carga de la galería -------------------------- */

  const cargarArchivos = useCallback(async () => {
    // Si había una carga en curso, se cancela para evitar respuestas desordenadas.
    controladorRef.current?.abort();
    const controlador = new AbortController();
    controladorRef.current = controlador;

    setEstadoGaleria('cargando');
    setErrorGaleria('');

    try {
      const lista = await obtenerArchivos({ signal: controlador.signal });
      if (controlador.signal.aborted) return;
      setArchivos(lista);
      setEstadoGaleria('listo');
    } catch (error) {
      if (controlador.signal.aborted || error.tipo === 'cancelado') return;
      setErrorGaleria(error.message);
      setEstadoGaleria('error');
    }
  }, []);

  useEffect(() => {
    cargarArchivos();
    // Limpieza: cancela la petición si el componente se desmonta.
    return () => controladorRef.current?.abort();
  }, [cargarArchivos]);

  /* ------------------------------ Subida (Rol 4) ----------------------------- */

  const alSubirArchivo = useCallback(
    (archivoNuevo) => {
      // Si el backend no devolvió el registro creado o la galería estaba en
      // error, se vuelve a pedir la lista completa.
      if (!archivoNuevo || estadoGaleria === 'error') {
        cargarArchivos();
        return;
      }
      setArchivos((anteriores) => [
        archivoNuevo,
        ...anteriores.filter((archivo) => archivo.id !== archivoNuevo.id),
      ]);
    },
    [cargarArchivos, estadoGaleria],
  );

  /* --------------------------- Eliminación (Rol 5) --------------------------- */

  const alEliminarArchivo = useCallback(
    async (archivoEliminado) => {
      // Actualización optimista: la tarjeta desaparece al instante.
      setArchivos((anteriores) => anteriores.filter((archivo) => archivo.id !== archivoEliminado.id));

      try {
        await eliminarArchivo(archivoEliminado.id);
        notificar('exito', 'Archivo eliminado', `"${archivoEliminado.titulo}" se eliminó correctamente.`);
      } catch (error) {
        if (error.estado === 404) {
          notificar('info', 'El archivo ya no existía', `"${archivoEliminado.titulo}" ya había sido eliminado.`);
          return;
        }
        // Si falla, se restaura la tarjeta y se informa el error.
        setArchivos((anteriores) =>
          anteriores.some((archivo) => archivo.id === archivoEliminado.id)
            ? anteriores
            : [...anteriores, archivoEliminado],
        );
        notificar(
          'error',
          error.tipo === 'red' ? 'Error de red al eliminar' : 'No se pudo eliminar',
          `${error.message} El archivo se restauró en la galería.`,
        );
      }
    },
    [notificar],
  );

  /* --------------------------------- Vista ---------------------------------- */

  const totalBytes = useMemo(
    () => archivos.reduce((suma, archivo) => suma + (Number(archivo.tamanoBytes) || 0), 0),
    [archivos],
  );

  return (
    <div className="app">
      <a className="saltar-contenido" href="#galeria">
        Saltar a la galería
      </a>

      <Encabezado
        totalArchivos={archivos.length}
        totalBytes={totalBytes}
        cargando={estadoGaleria === 'cargando' && archivos.length === 0}
      />

      <main className="contenido">
        <section className="panel panel--carga" aria-labelledby="titulo-carga">
          <FormularioCarga onArchivoSubido={alSubirArchivo} />
        </section>

        <section className="panel panel--galeria" id="galeria" aria-labelledby="titulo-galeria">
          <Galeria
            archivos={archivos}
            estado={estadoGaleria}
            error={errorGaleria}
            onReintentar={cargarArchivos}
            onEliminar={alEliminarArchivo}
          />
        </section>
      </main>

      <footer className="pie">
        <p>Vault · Desarrollo de Experiencias Multimedia para la Web</p>
      </footer>

      <Notificaciones lista={notificaciones} onCerrar={cerrarNotificacion} />
    </div>
  );
}
