import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";

const ModalInformacionApertura = ({ datos, showModal, setShowModalInformacion }) => {

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información de la apertura</h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setShowModalInformacion(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="col-md-12">
          <div className="card card-widget widget-user shadow">
            <div className="card-header">
              <div className="widget-user-header bg-info">
                <h3 className="widget-user-username">{"Id: " + datos?.id}</h3>
                <h5 className="widget-user-username">{"Fecha: " + moment(datos?.createdAt).format('DD-MM-YYYY, h:mm:ss a')}</h5>
                <h3 className="widget-user-username">{"Efectivo: " + "L "+ new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(datos?.efectivo) }</h3>
              </div>
            </div>
            <div className="card-body">
              <strong><i className="fas fa-map-marker-alt mr-1"></i> Caja</strong>
              <p className="text-muted">
                {datos?.caja.nombre}
              </p>
              <hr></hr>
              <strong><i className="far fa-file-alt mr-1"></i> Usuario</strong>
              <p className="text-muted">
                {datos ? datos.usuario.empleado.primernombre + " " + datos.usuario.empleado.segundonombre + " " + datos.usuario.empleado.primerapellido + " " + datos.usuario.empleado.segundoapellido : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>

  );
};

export default ModalInformacionApertura;
