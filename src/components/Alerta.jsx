import { useEffect, useRef } from 'react';
import { IconoAdvertencia, IconoCerrar, IconoError, IconoExito, IconoInfo } from './Iconos.jsx';

const ICONOS = {
  exito: IconoExito,
  error: IconoError,
  advertencia: IconoAdvertencia,
  info: IconoInfo,
};

/**
 * Mensaje de estado (éxito, error, advertencia o información).
 * Si recibe `duracion`, se cierra sola pasado ese tiempo (en ms).
 */
export default function Alerta({ tipo = 'info', titulo, mensaje, onCerrar, duracion }) {
  const Icono = ICONOS[tipo] ?? IconoInfo;

  // Se guarda la última versión de onCerrar para que el temporizador no se
  // reinicie cada vez que el componente padre vuelve a renderizar.
  const onCerrarRef = useRef(onCerrar);
  useEffect(() => {
    onCerrarRef.current = onCerrar;
  });

  useEffect(() => {
    if (!duracion) return undefined;
    const temporizador = setTimeout(() => onCerrarRef.current?.(), duracion);
    return () => clearTimeout(temporizador);
  }, [duracion]);

  return (
    <div
      className={`alerta alerta--${tipo}`}
      role={tipo === 'error' ? 'alert' : 'status'}
      aria-live={tipo === 'error' ? 'assertive' : 'polite'}
    >
      <span className="alerta__icono">
        <Icono tamano={20} />
      </span>
      <div className="alerta__contenido">
        {titulo && <p className="alerta__titulo">{titulo}</p>}
        {mensaje && <p className="alerta__mensaje">{mensaje}</p>}
      </div>
      {onCerrar && (
        <button type="button" className="alerta__cerrar" onClick={onCerrar} aria-label="Cerrar mensaje">
          <IconoCerrar tamano={16} />
        </button>
      )}
    </div>
  );
}
