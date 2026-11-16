import { memo, useState } from 'react';
import {
  IconoBasura,
  IconoBalanza,
  IconoCalendario,
  IconoCategoria,
  IconoExterno,
  IconoPdf,
  IconoUsuario,
} from './Iconos.jsx';
import { formatearFecha, formatearTamano } from '../utils/formato.js';
import { nombreCategoria, obtenerEtiquetaTipo } from '../utils/tiposArchivo.js';

/** Vista previa nativa según el tipo de archivo. */
function VistaPreviaRemota({ archivo }) {
  const [fallo, setFallo] = useState(false);
  const { categoria, url, titulo } = archivo;

  if (!url || fallo) {
    return (
      <div className="tarjeta__sin-vista">
        <IconoCategoria categoria={categoria} tamano={40} />
        <span>Vista previa no disponible</span>
      </div>
    );
  }

  if (categoria === 'imagen') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="tarjeta__enlace-imagen">
        <img
          src={url}
          alt={titulo}
          loading="lazy"
          decoding="async"
          className="tarjeta__imagen"
          onError={() => setFallo(true)}
        />
      </a>
    );
  }

  if (categoria === 'video') {
    return (
      <video
        src={url}
        className="tarjeta__video"
        controls
        preload="metadata"
        playsInline
        aria-label={`Video: ${titulo}`}
        onError={() => setFallo(true)}
      />
    );
  }

  if (categoria === 'pdf') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="tarjeta__pdf">
        <IconoPdf tamano={56} />
        <span className="enlace-icono">
          Abrir PDF <IconoExterno tamano={14} />
        </span>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="tarjeta__sin-vista">
      <IconoCategoria categoria={categoria} tamano={40} />
      <span>Abrir archivo</span>
    </a>
  );
}

/**
 * Tarjeta de un archivo de la galería: vista previa, título, peso, tipo,
 * fecha de subida, autor y botón para eliminar.
 */
function TarjetaArchivo({ archivo, onSolicitarEliminar }) {
  const { categoria } = archivo;

  return (
    <article className="tarjeta">
      <div className={`tarjeta__medio tarjeta__medio--${categoria}`}>
        <VistaPreviaRemota archivo={archivo} />
        <span className={`insignia insignia--${categoria} tarjeta__insignia`}>
          <IconoCategoria categoria={categoria} tamano={14} />
          {nombreCategoria(categoria)}
        </span>
      </div>

      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__titulo" title={archivo.titulo}>
          {archivo.titulo}
        </h3>

        <dl className="tarjeta__datos">
          <div className="tarjeta__dato">
            <dt>
              <IconoBalanza tamano={14} />
              <span className="visualmente-oculto">Peso</span>
            </dt>
            <dd>
              {formatearTamano(archivo.tamanoBytes)} · {obtenerEtiquetaTipo(archivo.tipoArchivo, archivo.url)}
            </dd>
          </div>
          <div className="tarjeta__dato">
            <dt>
              <IconoCalendario tamano={14} />
              <span className="visualmente-oculto">Fecha de subida</span>
            </dt>
            <dd>
              <time dateTime={archivo.fechaSubida ?? undefined}>{formatearFecha(archivo.fechaSubida)}</time>
            </dd>
          </div>
          <div className="tarjeta__dato">
            <dt>
              <IconoUsuario tamano={14} />
              <span className="visualmente-oculto">Autor</span>
            </dt>
            <dd title={archivo.subidoPor}>{archivo.subidoPor}</dd>
          </div>
        </dl>
      </div>

      <footer className="tarjeta__acciones">
        {archivo.url && (
          <a href={archivo.url} target="_blank" rel="noopener noreferrer" className="boton boton--fantasma boton--pequeno">
            <IconoExterno tamano={16} />
            Abrir
          </a>
        )}
        <button
          type="button"
          className="boton boton--peligro-suave boton--pequeno"
          onClick={() => onSolicitarEliminar(archivo)}
          aria-label={`Eliminar ${archivo.titulo}`}
        >
          <IconoBasura tamano={16} />
          Eliminar
        </button>
      </footer>
    </article>
  );
}

export default memo(TarjetaArchivo);
