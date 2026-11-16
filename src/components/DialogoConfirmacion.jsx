import { useEffect, useId, useRef } from 'react';
import { IconoAdvertencia } from './Iconos.jsx';

/**
 * Ventana modal para confirmar acciones destructivas (eliminar un archivo).
 * Se cierra con Escape, con el botón Cancelar o haciendo clic fuera.
 */
export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  onConfirmar,
  onCancelar,
}) {
  const botonCancelarRef = useRef(null);
  const idTitulo = useId();
  const idMensaje = useId();

  useEffect(() => {
    if (!abierto) return undefined;

    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    botonCancelarRef.current?.focus();

    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') onCancelar();
    };
    document.addEventListener('keydown', alPresionarTecla);

    return () => {
      document.removeEventListener('keydown', alPresionarTecla);
      document.body.style.overflow = overflowAnterior;
      if (elementoAnterior instanceof HTMLElement && elementoAnterior.isConnected) {
        elementoAnterior.focus();
      }
    };
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="dialogo__fondo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCancelar();
      }}
    >
      <div
        className="dialogo"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idMensaje}
      >
        <span className="dialogo__icono">
          <IconoAdvertencia tamano={24} />
        </span>
        <h2 className="dialogo__titulo" id={idTitulo}>
          {titulo}
        </h2>
        <p className="dialogo__mensaje" id={idMensaje}>
          {mensaje}
        </p>
        <div className="dialogo__acciones">
          <button ref={botonCancelarRef} type="button" className="boton boton--secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="boton boton--peligro" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
