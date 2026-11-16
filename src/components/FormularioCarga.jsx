import { useEffect, useId, useRef, useState } from 'react';
import Alerta from './Alerta.jsx';
import BarraProgreso from './BarraProgreso.jsx';
import VistaPreviaLocal from './VistaPreviaLocal.jsx';
import ZonaArrastre from './ZonaArrastre.jsx';
import { IconoSubir } from './Iconos.jsx';
import { subirArchivo } from '../services/archivosApi.js';
import { LIMITE_AUTOR, LIMITE_TITULO } from '../utils/constantes.js';
import { nombreSinExtension } from '../utils/formato.js';
import { validarArchivo, validarFormulario } from '../utils/validaciones.js';

const TITULOS_ERROR = {
  red: 'Error de red',
  tiempo: 'Tiempo de espera agotado',
  respuesta: 'Respuesta inesperada del servidor',
};

/**
 * Formulario de carga (Rol 4): archivo + título + autor, con validación en
 * el cliente, vista previa local, envío con FormData y progreso real.
 *
 * @param {(archivo: object|null) => void} onArchivoSubido Se llama al terminar con éxito.
 */
export default function FormularioCarga({ onArchivoSubido }) {
  const [archivo, setArchivo] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [subidoPor, setSubidoPor] = useState('');
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const subidaRef = useRef(null);
  const tituloAutomaticoRef = useRef(false);
  const idTitulo = useId();
  const idAutor = useId();

  // Si el componente se desmonta durante una subida, se cancela la petición.
  useEffect(() => () => subidaRef.current?.cancelar(), []);

  const limpiarError = (campo) => {
    setErrores((anteriores) => {
      if (!anteriores[campo]) return anteriores;
      const { [campo]: _omitido, ...resto } = anteriores;
      return resto;
    });
  };

  const seleccionarArchivos = (archivos) => {
    if (archivos.length > 1) {
      const mensaje = 'Solo se puede subir un archivo a la vez. Arrastra o selecciona un único archivo.';
      setErrores((anteriores) => ({ ...anteriores, archivo: mensaje }));
      setAlerta({ tipo: 'error', titulo: 'Error de validación', mensaje });
      return;
    }

    const [nuevoArchivo] = archivos;
    const error = validarArchivo(nuevoArchivo);
    if (error) {
      setArchivo(null);
      setErrores((anteriores) => ({ ...anteriores, archivo: error }));
      setAlerta({ tipo: 'error', titulo: 'Error de validación', mensaje: error });
      return;
    }

    setArchivo(nuevoArchivo);
    setProgreso(0);
    setAlerta(null);
    limpiarError('archivo');

    // Propone el nombre del archivo como título si el usuario aún no escribió uno.
    if (!titulo.trim() || tituloAutomaticoRef.current) {
      setTitulo(nombreSinExtension(nuevoArchivo.name).slice(0, LIMITE_TITULO));
      tituloAutomaticoRef.current = true;
      limpiarError('titulo');
    }
  };

  const quitarArchivo = () => {
    setArchivo(null);
    setProgreso(0);
    if (tituloAutomaticoRef.current) {
      setTitulo('');
      tituloAutomaticoRef.current = false;
    }
  };

  const reiniciarFormulario = () => {
    setArchivo(null);
    setTitulo('');
    setSubidoPor('');
    setErrores({});
    setProgreso(0);
    tituloAutomaticoRef.current = false;
  };

  const cancelarSubida = () => {
    subidaRef.current?.cancelar();
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    if (subiendo) return;

    const nuevosErrores = validarFormulario({ archivo, titulo, subidoPor });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setAlerta({
        tipo: 'error',
        titulo: 'Error de validación',
        mensaje: 'Revisa los campos marcados en rojo antes de subir el archivo.',
      });
      return;
    }

    const tituloFinal = titulo.trim();
    setSubiendo(true);
    setProgreso(0);
    setAlerta(null);

    const subida = subirArchivo(
      { archivo, titulo: tituloFinal, subidoPor: subidoPor.trim() },
      { onProgreso: setProgreso },
    );
    subidaRef.current = subida;

    try {
      const archivoCreado = await subida.promesa;
      reiniciarFormulario();
      setAlerta({
        tipo: 'exito',
        titulo: '¡Archivo subido con éxito!',
        mensaje: `"${tituloFinal}" se guardó en la nube y ya aparece en la galería.`,
      });
      onArchivoSubido(archivoCreado);
    } catch (error) {
      setProgreso(0);
      if (error.tipo === 'cancelado') {
        setAlerta({ tipo: 'advertencia', titulo: 'Subida cancelada', mensaje: 'El archivo no se subió.' });
      } else if (error.tipo === 'servidor') {
        setAlerta({
          tipo: 'error',
          titulo: `Error del servidor${error.estado ? ` (${error.estado})` : ''}`,
          mensaje: error.message,
        });
      } else {
        setAlerta({
          tipo: 'error',
          titulo: TITULOS_ERROR[error.tipo] ?? 'Error inesperado',
          mensaje: error.message || 'Ocurrió un error inesperado al subir el archivo.',
        });
      }
    } finally {
      subidaRef.current = null;
      setSubiendo(false);
    }
  };

  const textoBoton = progreso >= 100 ? 'Procesando…' : `Subiendo… ${progreso}%`;

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <header className="panel__cabecera">
        <h2 className="panel__titulo" id="titulo-carga">
          Subir archivo
        </h2>
        <p className="panel__descripcion">Imágenes, videos o documentos PDF de hasta 10 MB.</p>
      </header>

      {alerta && (
        <Alerta
          tipo={alerta.tipo}
          titulo={alerta.titulo}
          mensaje={alerta.mensaje}
          onCerrar={() => setAlerta(null)}
        />
      )}

      <fieldset className="formulario__campos" disabled={subiendo}>
        <legend className="visualmente-oculto">Datos del archivo</legend>

        <div className="campo">
          <span className="campo__etiqueta">
            Archivo <span className="campo__obligatorio">*</span>
          </span>
          <ZonaArrastre
            onArchivos={seleccionarArchivos}
            deshabilitado={subiendo}
            hayArchivo={Boolean(archivo)}
            error={errores.archivo}
          />
        </div>

        {archivo && <VistaPreviaLocal archivo={archivo} onQuitar={quitarArchivo} deshabilitado={subiendo} />}

        <div className="campo">
          <label className="campo__etiqueta" htmlFor={idTitulo}>
            Título <span className="campo__obligatorio">*</span>
            <span className="campo__contador">
              {titulo.length}/{LIMITE_TITULO}
            </span>
          </label>
          <input
            id={idTitulo}
            type="text"
            className="campo__control"
            value={titulo}
            maxLength={LIMITE_TITULO}
            placeholder="Ej.: Logo de la empresa"
            autoComplete="off"
            aria-invalid={Boolean(errores.titulo)}
            aria-describedby={errores.titulo ? `${idTitulo}-error` : undefined}
            onChange={(evento) => {
              setTitulo(evento.target.value);
              tituloAutomaticoRef.current = false;
              limpiarError('titulo');
            }}
          />
          {errores.titulo && (
            <p className="campo__error" id={`${idTitulo}-error`}>
              {errores.titulo}
            </p>
          )}
        </div>

        <div className="campo">
          <label className="campo__etiqueta" htmlFor={idAutor}>
            Autor <span className="campo__obligatorio">*</span>
          </label>
          <input
            id={idAutor}
            type="text"
            className="campo__control"
            value={subidoPor}
            maxLength={LIMITE_AUTOR}
            placeholder="Ej.: Joseph Zamora"
            autoComplete="name"
            aria-invalid={Boolean(errores.subidoPor)}
            aria-describedby={errores.subidoPor ? `${idAutor}-error` : undefined}
            onChange={(evento) => {
              setSubidoPor(evento.target.value);
              limpiarError('subidoPor');
            }}
          />
          {errores.subidoPor && (
            <p className="campo__error" id={`${idAutor}-error`}>
              {errores.subidoPor}
            </p>
          )}
        </div>
      </fieldset>

      {subiendo && (
        <BarraProgreso
          progreso={progreso}
          etiqueta={progreso >= 100 ? 'Procesando en la nube…' : 'Subiendo archivo…'}
        />
      )}

      <div className="formulario__acciones">
        <button type="submit" className="boton boton--primario boton--bloque" disabled={subiendo}>
          {subiendo ? (
            <>
              <span className="spinner" aria-hidden="true" />
              {textoBoton}
            </>
          ) : (
            <>
              <IconoSubir tamano={18} />
              Subir archivo
            </>
          )}
        </button>
        {subiendo && (
          <button type="button" className="boton boton--secundario" onClick={cancelarSubida}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
