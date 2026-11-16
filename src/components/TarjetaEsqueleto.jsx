/**
 * Tarjeta "skeleton" que se muestra mientras se cargan los archivos.
 */
export default function TarjetaEsqueleto() {
  return (
    <div className="tarjeta tarjeta--esqueleto" aria-hidden="true">
      <div className="esqueleto esqueleto--medio" />
      <div className="tarjeta__cuerpo">
        <div className="esqueleto esqueleto--titulo" />
        <div className="esqueleto esqueleto--linea" />
        <div className="esqueleto esqueleto--linea esqueleto--corta" />
        <div className="esqueleto esqueleto--linea esqueleto--media" />
      </div>
      <div className="tarjeta__acciones">
        <div className="esqueleto esqueleto--boton" />
      </div>
    </div>
  );
}
