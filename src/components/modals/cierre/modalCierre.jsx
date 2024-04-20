import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import {
  guardarApertura,
  editarApertura,
  guardarCierre,datoIdApertura
} from "../../apiUrls";
import { AxiosPrivado } from "../../axios/Axios";
import ModalInformacionCierre from "./modalInformacionCierre";
function ModalCirreForm({ accion, datosCierre, ActualizarTabla, datosCaja, datosUsuario, CargarDatosCaja }) {
  console.log('Datos caja MODAL:',datosCaja)
  console.log('Datos cierre MODAL:',datosCierre)
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const [idApertura, setIdApertura]= useState();
  const [efectivoApertura, setEfectivoApertura] = useState();
  const handleClose = () => {
    limpiarCampos();
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  const [errorEfectivo, setErrorEfectivo] = useState(false);
  const [formularioCierre, setFormularioCierre] = useState({
    id: null,
    efectivo: 0,
    pos: 0,
    transferencias: 0,
    efectivosistema: datosCierre?.pagoefectivos,
    possistema: datosCierre?.pagotarjeta,
    transferenciassistema: datosCierre?.pagotransferencia,
    efectivocompra: datosCierre?.compraefectivos,
    transferenciascompra: datosCierre?.compratransferencia,
    creditocompra: datosCierre?.compracredito,
    cajaId: datosCaja.id,
    caja: datosCaja?.nombre,
    usuarioId: datosUsuario?.id,
    usuario: datosUsuario,
    aperturaId: null
  });

  useEffect(() => {
    console.log(datosCierre);
    if (datosCierre == null) {
      setFormularioCierre({
        ...formularioCierre,
        ...datosCierre
      });
    } else {
      
      setFormularioCierre({
        id: null,
        efectivo: 0,
        pos: 0,
        transferencias: 0,
        efectivosistema: datosCierre?.pagoefectivos,
        possistema: datosCierre?.pagotarjeta,
        transferenciassistema: datosCierre?.pagotransferencia,
        efectivocompra: datosCierre?.compraefectivos,
        transferenciascompra: datosCierre?.compratransferencia,
        creditocompra: datosCierre?.compracredito,
        cajaId: datosCaja?.id,
        caja: datosCaja?.nombre,
        usuarioId: datosUsuario?.id,
        usuario: datosUsuario,
        aperturaId: null
      });
      actualizarApertura();
      console.log("APERTURA ID",idApertura)
      console.log('formulario',formularioCierre)
    }
  }, [showModal]);
  const actualizarApertura = async () => {
    try {
      const responseApertura = await AxiosPrivado.get(datoIdApertura + datosCaja.id);
      setIdApertura(responseApertura.data.datos.id);
      setEfectivoApertura(responseApertura.data.datos.efectivo);
      console.log("AQUI PROBAMOS ID",responseApertura.data.datos.id);
      setFormularioCierre((prevFormulario) => ({
        ...prevFormulario,
        aperturaId: responseApertura.data.datos.id,
      }));
      console.log('Datos Apertura:', responseApertura.data.datos);
      console.log(idApertura)
    } catch (error) {
      console.log(error);
      //mostraAlertaError("El servidor no responde. Revise su conexión.");
    }
  }

  const saveApertura = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioCierre.efectivo + formularioCierre.pos + formularioCierre.transferencias == 0)
    ) {
      mostraAlerta("Escriba un valor de efectivo, pos o transferencia", "warning");
      return;
    }
    if ((formularioCierre.cajaId == null)) {
      mostraAlerta(
        "Debe seleccionar una caja",
        "warning"
      );
      return;
    }
    if ((formularioCierre.usuarioId == null)) {
      mostraAlerta(
        "Debe seleccionar un usuario",
        "warning"
      );
      return;
    }
    if ((formularioCierre.aperturaId == null)) {
      mostraAlerta(
        "Debe seleccionar una Apertura",
        "warning"
      );
      return;
    }
    setErrorEfectivo(false);
    try {
      await AxiosPrivado
        .post(guardarCierre, formularioCierre)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            ActualizarTabla();
            CargarDatosCaja();
            limpiarCampos();
          } else if (response.data.tipo === 0) {
            if (response.data.msj.isArray) {
              response.data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
              });
            }
            else {
              mostraAlertaWarning(response.data.msj);
            }
          } else if (response.data.tipo === 2) {
            if (response.data.msj.isArray) {
              response.data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
              });
            }
            else {
              mostraAlertaWarning(response.data.msj);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta("Error al guardar", "Error");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorCierre = (event) => {
    setFormularioCierre({
      ...formularioCierre,
      [event.target.name]: event.target.value,
    });
  };


  const modificarCierre = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioCierre.id === null) {
      mostraAlerta("Debe seleccionar un cierre", "warning");
      return;
    }
    if ((formularioCierre.cajaId == null)) {
      mostraAlerta(
        "Debe seleccionar una caja",
        "warning"
      );
      return;
    }
    if ((formularioCierre.usuarioId == null)) {
      mostraAlerta(
        "Debe seleccionar un usuario",
        "warning"
      );
      return;
    }
    setErrorEfectivo(false);
    AxiosPrivado
      .put(editarApertura + formularioCierre.id, formularioCierre)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          ActualizarTabla();
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo === 2) {
          mostraAlerta(response.data.msj);
        }
        //fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });


  };

  const limpiarCampos = () => {
    setErrorEfectivo(false);
    setFormularioCierre({
      id: null,
      efectivo: 0,
      pos: 0,
      transferencias: 0,
      efectivosistema: datosCierre?.pagoefectivos,
      possistema: datosCierre?.pagotarjeta,
      transferenciassistema: datosCierre?.transferencias,
      efectivocompra: datosCierre?.compraefectivos,
      transferenciascompra: datosCierre?.compratransferencia,
      creditocompra: datosCierre?.compracredito,
      cajaId: datosCaja?.id,
      caja: datosCaja?.nombre,
      usuarioId: datosUsuario?.id,
      usuario: datosUsuario,
      aperturaId: null
    });
  };

  const handleOpenModal = () => {
    setShowModalInformacion(true);
  };


  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear Cierre
          </Button>
        </div>

      ) : (
        <div>
          <Button variant="info" onClick={handleOpenModal}>
            <i className="fas fa-folder">
            </i>
          </Button>

          <Button variant="warning" onClick={handleShow} disabled>
            <i className="fas fa-pencil-alt">
            </i>
          </Button>
        </div>

      )}
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Cierre</h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
          <div className="row">
  {/* Primera Columna */}
  <div className="col-sm-4">
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Efectivo</label>
      <input
        type="number"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        placeholder="Ingrese el efectivo"
        name="efectivo"
        value={formularioCierre.efectivo}
        onChange={manejadorCierre}
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Pos</label>
      <input
        type="number"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        placeholder="Ingrese el valor de pos"
        name="pos"
        value={formularioCierre.pos}
        onChange={manejadorCierre}
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Transferencias</label>
      <input
        type="number"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        placeholder="Ingrese las transferencias"
        name="transferencias"
        value={formularioCierre.transferencias}
        onChange={manejadorCierre}
      />
    </div>
  </div>

  {/* Segunda Columna */}
  <div className="col-sm-4">
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Efectivo Pagos</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        value={formularioCierre.efectivosistema}
        disabled
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Pos Pagos</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        name="possistema"
        value={formularioCierre.possistema}
        disabled
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Transferencias Pagos</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        value={formularioCierre.transferenciassistema}
        disabled
      />
    </div>
  </div>

  {/* Tercera Columna */}
  <div className="col-sm-4">
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Efectivo Compras</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        value={formularioCierre.efectivocompra}
        disabled
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Transferencias Compras</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        value={formularioCierre.transferenciascompra}
        disabled
      />
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">Crédito Compras</label>
      <input
        type="text"
        className={`form-control ${errorEfectivo ? "is-invalid" : ""}`}
        value={formularioCierre.creditocompra}
        disabled
      />
    </div>
  </div>
</div>

{/* Sección de Abajo */}
<div className="row">
  <div className="col-sm-12">
    <strong><i className="fas fa-map-marker-alt mr-1"></i> Caja</strong>
    <p className="text-muted">
      {formularioCierre.caja}
    </p>
    <hr></hr>
    <strong><i className="far fa-file-alt mr-1"></i> Usuario</strong>
    <p className="text-muted">
      {formularioCierre.usuario ? formularioCierre.usuario.empleado.primernombre + " " + formularioCierre.usuario.empleado.segundonombre + " " + formularioCierre.usuario.empleado.primerapellido + " " + formularioCierre.usuario.empleado.segundoapellido : ""}
    </p>
    <strong><i className="far fa-file-alt mr-1"></i> Efectivo Apertura</strong>
    <p className="text-muted">
      {efectivoApertura ? efectivoApertura : ""}
    </p>
    <strong><i className="far fa-file-alt mr-1"></i> Efectivo Estimado</strong>
    <p className="text-muted">
      {efectivoApertura + formularioCierre.efectivosistema - formularioCierre.efectivocompra}
    </p>
  </div>
</div>
           
          </form>
        </div>
        <div className="modal-footer ">
          <div className="card-footer">
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            <Button variant="warning" onClick={limpiarCampos}>
              Limpiar Campos
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            {accion ? (
              <Button variant="primary" onClick={saveApertura}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarCierre}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionCierre datos={datosCierre} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion} ></ModalInformacionCierre>
    </>
  );
}

export default ModalCirreForm;
