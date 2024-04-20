import React from "react";
import { Modal } from "react-bootstrap";

const ModalInformacionTicket = ({ datos, showModal, setShowModalInformacion }) => {
    console.log(datos)

    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
            size="lg"
        >
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">listado de tickets</h4>
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
                                <h3 className="widget-user-username">Ticket</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <strong><i class="fas fa-tools mr1"></i> Titulo</strong>
                            <p className="text-muted">
                                {datos?.titulo}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-clock mr-1"></i> Descripcion</strong>
                            <p className="text-muted">
                                {datos?.descripcion}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-money-bill-alt mr-1"></i> Estado</strong>
                            <p className="text-muted">
                                {datos?.activo ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default ModalInformacionTicket;
