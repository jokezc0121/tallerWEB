import { useId } from 'react';
import { IconoBuscar, IconoCerrar } from './Iconos.jsx';
import { FILTROS_TIPO } from '../utils/constantes.js';

/**
 * Filtros de la galería: botones por tipo de archivo y búsqueda por título.
 * Los filtros se aplican en el cliente.
 */
export default function FiltrosGaleria({ tipo, busqueda, conteos, onCambiarTipo, onCambiarBusqueda }) {
  const idBusqueda = useId();

  return (
    <div className="filtros">
      <div className="filtros__tipos" role="group" aria-label="Filtrar por tipo de archivo">
        {FILTROS_TIPO.map((filtro) => {
          const activo = tipo === filtro.valor;
          return (
            <button
              key={filtro.valor}
              type="button"
              className={`chip${activo ? ' chip--activo' : ''}`}
              aria-pressed={activo}
              onClick={() => onCambiarTipo(filtro.valor)}
            >
              {filtro.etiqueta}
              <span className="chip__conteo">{conteos[filtro.valor] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="buscador">
        <label htmlFor={idBusqueda} className="visualmente-oculto">
          Buscar por título
        </label>
        <span className="buscador__icono">
          <IconoBuscar tamano={18} />
        </span>
        <input
          id={idBusqueda}
          type="search"
          className="buscador__control"
          placeholder="Buscar por título…"
          value={busqueda}
          onChange={(evento) => onCambiarBusqueda(evento.target.value)}
          autoComplete="off"
        />
        {busqueda && (
          <button
            type="button"
            className="buscador__limpiar"
            onClick={() => onCambiarBusqueda('')}
            aria-label="Limpiar búsqueda"
          >
            <IconoCerrar tamano={16} />
          </button>
        )}
      </div>
    </div>
  );
}
