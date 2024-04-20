import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";
import { listarProyectos, guardarProyectos, editarProyectos, imagenCliente } from "../../apiUrls";

const ModalInformacionClientes = ({ datos, showModal, setShowModalInformacion }) => {
  //const [showModal, setShowModalInformacion] = useState(false);
  console.log(datos);
  /* para paginacion */
  const verTelefonos = datos?.clientetelefonos.map((e, i) => {
    return (
      <li key={i} className="list-inline-item"> <p className="text-muted"><i className="fas fa-phone mr-1"></i>{e.numero}</p></li>
    )
  })

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
      size="lg"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información de Cliente</h4>
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
                <h3 className="widget-user-username">{datos?.nombreprimer} {datos?.nombresegundo} {datos?.apellidoprimer} {datos?.apellidosegundo}</h3>
                <h5 className="widget-user-desc">{datos?.identidad}</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <img className="product-image" src={imagenCliente + datos?.Imagen} alt="Cliente" />
                </div>
                <div className="col-sm-6">
                  <strong><i className="fas fa-map-marker-alt mr-1"></i> Dirección</strong>
                  <p className="text-muted">
                    {datos ? datos.direccion + ". " + datos.lugar?.nombre + ", " + datos.lugar?.municipio.nombre + ", " + datos.lugar?.municipio.departamento.nombre : ""}
                  </p>
                  <hr></hr>
                  <strong><i className="fas fa-list mr-1"></i> Teléfonos</strong>
                  <ul className="list-inline">
                    {verTelefonos}
                  </ul>
                  <hr></hr>
                  <strong><i className="fas fa-child mr-1"></i> Género</strong>
                  <p className="text-muted">
                    {datos?.genero == "M" ? "Masculino" : "Femenino"}
                  </p>
                  <hr></hr>
                  <strong><i className="far fa-file-alt mr-1"></i> Profesión</strong>
                  <p className="text-muted">
                    {datos?.profesion.nombre}
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

  );
};

export default ModalInformacionClientes;
