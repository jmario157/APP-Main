import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";

const ModalInformacionAlquileres = ({
    datos,
    showModal,
    setShowModalInformacion
}) => {
    //const [showModal, setShowModalInformacion] = useState(false);

    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
            size="lg"
        >
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">Información de Alquileres</h4>
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
                        <div className="card-body">
                            <strong><i class="fas fa-tools mr1"></i> Maquinaria</strong>
                            <p className="text-muted">
                                {datos?.maquinaria}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-clock mr-1"></i> Duracion</strong>
                            <p className="text-muted">
                                {datos?.duracion}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-money-bill-alt mr-1"></i> Costo</strong>
                            <p className="text-muted">
                                {datos?.costo}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default ModalInformacionAlquileres;
