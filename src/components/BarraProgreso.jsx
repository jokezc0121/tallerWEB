/**
 * Barra de progreso accesible. Muestra el porcentaje real de la subida.
 */
export default function BarraProgreso({ progreso, etiqueta = 'Progreso' }) {
  const valor = Math.max(0, Math.min(100, Math.round(progreso)));
  const completo = valor >= 100;

  return (
    <div className="progreso">
      <div className="progreso__cabecera">
        <span className="progreso__etiqueta">{etiqueta}</span>
        <span className="progreso__valor">{valor}%</span>
      </div>
      <div
        className={`progreso__pista${completo ? ' progreso__pista--completa' : ''}`}
        role="progressbar"
        aria-label={etiqueta}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valor}
      >
        <div className="progreso__relleno" style={{ width: `${valor}%` }} />
      </div>
    </div>
  );
}
