import { IconoBoveda } from './Iconos.jsx';
import { formatearTamano } from '../utils/formato.js';

/**
 * Encabezado de la aplicación con el nombre del proyecto y un resumen
 * de los archivos almacenados.
 */
export default function Encabezado({ totalArchivos, totalBytes, cargando }) {
  return (
    <header className="encabezado">
      <div className="encabezado__contenido">
        <div className="encabezado__marca">
          <span className="encabezado__logo">
            <IconoBoveda tamano={30} />
          </span>
          <div>
            <h1 className="encabezado__titulo">Vault</h1>
            <p className="encabezado__subtitulo">Gestor de activos multimedia en la nube</p>
          </div>
        </div>

        <dl className="encabezado__resumen" aria-busy={cargando}>
          <div className="resumen">
            <dt>Archivos</dt>
            <dd>{cargando ? '—' : totalArchivos}</dd>
          </div>
          <div className="resumen">
            <dt>Almacenado</dt>
            <dd>{cargando ? '—' : formatearTamano(totalBytes)}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
