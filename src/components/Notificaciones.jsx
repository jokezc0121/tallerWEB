import Alerta from './Alerta.jsx';
import { DURACION_NOTIFICACION_MS } from '../utils/constantes.js';

/**
 * Pila de notificaciones flotantes (esquina inferior derecha).
 * Se usa para informar el resultado de acciones de la galería, como eliminar.
 */
export default function Notificaciones({ lista, onCerrar }) {
  return (
    <div className="notificaciones" aria-label="Notificaciones">
      {lista.map((notificacion) => (
        <Alerta
          key={notificacion.id}
          tipo={notificacion.tipo}
          titulo={notificacion.titulo}
          mensaje={notificacion.mensaje}
          duracion={DURACION_NOTIFICACION_MS}
          onCerrar={() => onCerrar(notificacion.id)}
        />
      ))}
    </div>
  );
}
