import { useEffect, useId, useRef, useState } from 'react';
import { IconoSubir } from './Iconos.jsx';
import { ACCEPT_INPUT, FORMATOS_LEGIBLES, TAMANO_MAXIMO_MB } from '../utils/constantes.js';

/**
 * Zona de Drag & Drop con selector de archivo integrado.
 * Cambia de estilo mientras se arrastra un archivo encima.
 *
 * @param {(archivos: File[]) => void} onArchivos Recibe los archivos soltados o elegidos.
 */
export default function ZonaArrastre({ onArchivos, deshabilitado = false, hayArchivo = false, error }) {
  const [arrastrando, setArrastrando] = useState(false);
  const contadorArrastreRef = useRef(0);
  const inputRef = useRef(null);
  const idAyuda = useId();
  const idError = useId();

  // Evita que el navegador abra el archivo si se suelta fuera de la zona.
  useEffect(() => {
    const prevenir = (evento) => {
      if (evento.dataTransfer && Array.from(evento.dataTransfer.types).includes('Files')) {
        evento.preventDefault();
      }
    };
    window.addEventListener('dragover', prevenir);
    window.addEventListener('drop', prevenir);
    return () => {
      window.removeEventListener('dragover', prevenir);
      window.removeEventListener('drop', prevenir);
    };
  }, []);

  // Si la zona se deshabilita (por ejemplo, al empezar una subida) se quita el resaltado.
  useEffect(() => {
    if (deshabilitado) {
      contadorArrastreRef.current = 0;
      setArrastrando(false);
    }
  }, [deshabilitado]);

  const abrirSelector = () => {
    if (!deshabilitado) inputRef.current?.click();
  };

  const alPresionarTecla = (evento) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      abrirSelector();
    }
  };

  const alEntrar = (evento) => {
    evento.preventDefault();
    if (deshabilitado) return;
    contadorArrastreRef.current += 1;
    if (Array.from(evento.dataTransfer.types).includes('Files')) setArrastrando(true);
  };

  const alArrastrarEncima = (evento) => {
    evento.preventDefault();
    evento.dataTransfer.dropEffect = deshabilitado ? 'none' : 'copy';
  };

  const alSalir = (evento) => {
    evento.preventDefault();
    contadorArrastreRef.current = Math.max(0, contadorArrastreRef.current - 1);
    if (contadorArrastreRef.current === 0) setArrastrando(false);
  };

  const alSoltar = (evento) => {
    evento.preventDefault();
    contadorArrastreRef.current = 0;
    setArrastrando(false);
    if (deshabilitado) return;
    const archivos = Array.from(evento.dataTransfer.files ?? []);
    if (archivos.length) onArchivos(archivos);
  };

  const alSeleccionar = (evento) => {
    const archivos = Array.from(evento.target.files ?? []);
    // Se limpia el valor para poder volver a elegir el mismo archivo.
    evento.target.value = '';
    if (archivos.length) onArchivos(archivos);
  };

  const clases = [
    'zona-arrastre',
    arrastrando && 'zona-arrastre--activa',
    deshabilitado && 'zona-arrastre--deshabilitada',
    error && 'zona-arrastre--error',
    hayArchivo && 'zona-arrastre--compacta',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={clases}
        role="button"
        tabIndex={deshabilitado ? -1 : 0}
        aria-disabled={deshabilitado}
        aria-describedby={error ? `${idAyuda} ${idError}` : idAyuda}
        aria-label={hayArchivo ? 'Reemplazar archivo seleccionado' : 'Seleccionar archivo para subir'}
        onClick={abrirSelector}
        onKeyDown={alPresionarTecla}
        onDragEnter={alEntrar}
        onDragOver={alArrastrarEncima}
        onDragLeave={alSalir}
        onDrop={alSoltar}
      >
        <span className="zona-arrastre__icono">
          <IconoSubir tamano={hayArchivo ? 24 : 36} />
        </span>
        <p className="zona-arrastre__titulo">
          {arrastrando
            ? 'Suelta el archivo para cargarlo'
            : hayArchivo
              ? 'Arrastra otro archivo para reemplazarlo'
              : 'Arrastra y suelta tu archivo aquí'}
        </p>
        <p className="zona-arrastre__subtitulo">
          o <span className="zona-arrastre__enlace">haz clic para seleccionarlo</span>
        </p>
        <p className="zona-arrastre__ayuda" id={idAyuda}>
          {FORMATOS_LEGIBLES} · Máximo {TAMANO_MAXIMO_MB} MB
        </p>
      </div>

      {error && (
        <p className="campo__error" id={idError}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        className="visualmente-oculto"
        accept={ACCEPT_INPUT}
        onChange={alSeleccionar}
        disabled={deshabilitado}
        tabIndex={-1}
        aria-hidden="true"
      />
    </>
  );
}
