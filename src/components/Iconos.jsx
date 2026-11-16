// Íconos SVG en línea (sin librerías externas). Heredan el color del texto.

function Icono({ children, tamano = 20, ...props }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconoNube(props) {
  return (
    <Icono {...props}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </Icono>
  );
}

/**
 * Logo de Vault: caja fuerte con puerta, perilla, bisagras y patas.
 * Es un ícono relleno; los detalles se recortan con una máscara SVG.
 */
export function IconoBoveda({ tamano = 24, ...props }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <mask id="mascara-boveda" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="white" />
          <rect x="5.25" y="4.75" width="11.5" height="11.5" rx="1.5" fill="none" stroke="black" strokeWidth="1.5" />
          <circle cx="11" cy="10.5" r="2.6" fill="none" stroke="black" strokeWidth="1.5" />
          <circle cx="11" cy="10.5" r="0.9" fill="black" />
          <rect x="16" y="6.5" width="2.2" height="2.6" rx="0.6" fill="black" />
          <rect x="16" y="11.9" width="2.2" height="2.6" rx="0.6" fill="black" />
        </mask>
      </defs>
      <g fill="currentColor" mask="url(#mascara-boveda)">
        <rect x="2.5" y="2" width="19" height="17" rx="2.5" />
        <rect x="4.5" y="17.5" width="3.5" height="4" rx="1.2" />
        <rect x="16" y="17.5" width="3.5" height="4" rx="1.2" />
      </g>
    </svg>
  );
}

export function IconoSubir(props) {
  return (
    <Icono {...props}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </Icono>
  );
}

export function IconoImagen(props) {
  return (
    <Icono {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </Icono>
  );
}

export function IconoVideo(props) {
  return (
    <Icono {...props}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </Icono>
  );
}

export function IconoPdf(props) {
  return (
    <Icono {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontSize="5.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill="currentColor"
        stroke="none"
      >
        PDF
      </text>
    </Icono>
  );
}

export function IconoArchivo(props) {
  return (
    <Icono {...props}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </Icono>
  );
}

export function IconoBasura(props) {
  return (
    <Icono {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Icono>
  );
}

export function IconoBuscar(props) {
  return (
    <Icono {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icono>
  );
}

export function IconoCerrar(props) {
  return (
    <Icono {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icono>
  );
}

export function IconoExito(props) {
  return (
    <Icono {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icono>
  );
}

export function IconoError(props) {
  return (
    <Icono {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icono>
  );
}

export function IconoAdvertencia(props) {
  return (
    <Icono {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icono>
  );
}

export function IconoInfo(props) {
  return (
    <Icono {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Icono>
  );
}

export function IconoRecargar(props) {
  return (
    <Icono {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Icono>
  );
}

export function IconoExterno(props) {
  return (
    <Icono {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </Icono>
  );
}

export function IconoCarpeta(props) {
  return (
    <Icono {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icono>
  );
}

export function IconoUsuario(props) {
  return (
    <Icono {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icono>
  );
}

export function IconoCalendario(props) {
  return (
    <Icono {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Icono>
  );
}

export function IconoBalanza(props) {
  return (
    <Icono {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </Icono>
  );
}

/** Devuelve el ícono que corresponde a una categoría de archivo. */
export function IconoCategoria({ categoria, ...props }) {
  if (categoria === 'imagen') return <IconoImagen {...props} />;
  if (categoria === 'video') return <IconoVideo {...props} />;
  if (categoria === 'pdf') return <IconoPdf {...props} />;
  return <IconoArchivo {...props} />;
}
