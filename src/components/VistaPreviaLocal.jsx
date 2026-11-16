import { useEffect, useState } from 'react';
import { IconoCerrar, IconoExterno, IconoPdf } from './Iconos.jsx';
import { formatearTamano } from '../utils/formato.js';
import { obtenerCategoria, obtenerEtiquetaTipo } from '../utils/tiposArchivo.js';
import { obtenerMimeArchivo } from '../utils/validaciones.js';

/**
 * Vista previa del archivo seleccionado ANTES de subirlo.
 * Crea un object URL local y lo libera con URL.revokeObjectURL al cambiar
 * de archivo o al desmontarse el componente.
 */
export default function VistaPreviaLocal({ archivo, onQuitar, deshabilitado = false }) {
  const mime = obtenerMimeArchivo(archivo);
  const categoria = obtenerCategoria(mime, archivo.name);

  // Se guarda el archivo junto a su URL para no usar nunca una URL ya liberada.
  const [vista, setVista] = useState({ archivo: null, url: null });

  useEffect(() => {
    const url = URL.createObjectURL(archivo);
    setVista({ archivo, url });
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  const urlLocal = vista.archivo === archivo ? vista.url : null;

  return (
    <div className="vista-local">
      <div className={`vista-local__medio vista-local__medio--${categoria}`}>
        {!urlLocal && <div className="vista-local__cargando" aria-hidden="true" />}

        {urlLocal && categoria === 'imagen' && (
          <img src={urlLocal} alt={`Vista previa de ${archivo.name}`} className="vista-local__imagen" />
        )}

        {urlLocal && categoria === 'video' && (
          <video
            src={urlLocal}
            className="vista-local__video"
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={`Vista previa de ${archivo.name}`}
          />
        )}

        {urlLocal && categoria === 'pdf' && (
          <div className="vista-local__pdf">
            <IconoPdf tamano={56} />
            <a href={urlLocal} target="_blank" rel="noopener noreferrer" className="enlace-icono">
              Abrir vista previa <IconoExterno tamano={14} />
            </a>
          </div>
        )}
      </div>

      <div className="vista-local__info">
        <p className="vista-local__nombre" title={archivo.name}>
          {archivo.name}
        </p>
        <p className="vista-local__detalle">
          <span className={`insignia insignia--${categoria}`}>{obtenerEtiquetaTipo(mime, archivo.name)}</span>
          <span>{formatearTamano(archivo.size)}</span>
        </p>
      </div>

      <button
        type="button"
        className="boton-icono vista-local__quitar"
        onClick={onQuitar}
        disabled={deshabilitado}
        aria-label={`Quitar ${archivo.name}`}
        title="Quitar archivo"
      >
        <IconoCerrar tamano={18} />
      </button>
    </div>
  );
}
