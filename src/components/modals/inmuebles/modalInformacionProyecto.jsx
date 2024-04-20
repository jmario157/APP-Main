import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { imagenProyecto } from "../../apiUrls";

const ModalInformacionProyecto = ({ datos }) => {
  const [verModal, setVerModal] = useState(false);
  const abrirModal = () => setVerModal(true);
  return (
    <>
      <Button variant="info" onClick={abrirModal}>
        <i className="fas fa-eye">
        </i>
      </Button>
      <Modal
        show={verModal}
        onHide={() => setVerModal(false)}
        className="custom-modalView"
        size="lg"
      >
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Información del Proyecto</h4>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={() => setVerModal(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="col-md-12">
            <div className="card card-widget widget-user shadow">
              <div className="card-header">
                <div className="widget-user-header bg-info">
                  <h3 className="widget-user-username">{datos?.nombre}</h3>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6">
                    <img className="product-image" src={imagenProyecto + datos?.Imagen} alt="Imagen Proyecto" />
                  </div>
                  <div className="col-sm-6">
                    <strong><i className="fas fa-map-marker-alt mr-1"></i> Lugar</strong>
                    <p className="text-muted">
                      {datos ? datos.lugar.nombre + ", " + datos.lugar.municipio.nombre + ", " + datos.lugar.municipio.departamento.nombre : ""}
                    </p>
                    <hr></hr>
                    <strong><i className="far fa-file-alt mr-1"></i> Descripción</strong>
                    <p className="text-muted">
                      {datos?.descripcion}
                    </p>
                    <hr></hr>
                    <strong><i className="fas fa-check"></i> Estado</strong>
                    <p className="text-muted">
                      {datos?.activo ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>


  );
};

export default ModalInformacionProyecto;
