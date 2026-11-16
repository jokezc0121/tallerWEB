import { IconoBuscar, IconoCarpeta, IconoError, IconoRecargar } from './Iconos.jsx';

const ICONOS = {
  vacio: IconoCarpeta,
  'sin-resultados': IconoBuscar,
  error: IconoError,
};

/**
 * Mensaje para los estados especiales de la galería:
 * - "vacio": todavía no hay archivos.
 * - "sin-resultados": los filtros no coinciden con ningún archivo.
 * - "error": no se pudo cargar la galería (incluye botón para reintentar).
 */
export default function EstadoVacio({ variante = 'vacio', titulo, descripcion, textoAccion, onAccion }) {
  const Icono = ICONOS[variante] ?? IconoCarpeta;

  return (
    <div className={`estado estado--${variante}`} role={variante === 'error' ? 'alert' : 'status'}>
      <span className="estado__icono">
        <Icono tamano={40} />
      </span>
      <h3 className="estado__titulo">{titulo}</h3>
      {descripcion && <p className="estado__descripcion">{descripcion}</p>}
      {textoAccion && onAccion && (
        <button
          type="button"
          className={`boton ${variante === 'error' ? 'boton--primario' : 'boton--secundario'}`}
          onClick={onAccion}
        >
          {variante === 'error' && <IconoRecargar tamano={16} />}
          {textoAccion}
        </button>
      )}
    </div>
  );
}
