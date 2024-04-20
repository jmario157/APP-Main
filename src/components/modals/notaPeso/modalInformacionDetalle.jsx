import React from 'react';
import { Modal } from "react-bootstrap";

// Componente de modal para mostrar información detallada de una nota de peso
const ModalInformacionDetalle = ({ datos, showModal, setShowModalInformacion }) => {
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}// Función para ocultar el modal al hacer clic en el botón de cerrar
            className="custom-modalView"
        >
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">Información del Detalle de la Nota de Peso</h4>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowModalInformacion(false)}// Función para ocultar el modal al hacer clic en la "x"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="col-md-12">
                    <div className="card card-widget widget-user shadow">
                        <div className="card-body">
                            {/* Mostramos la cantidad de sacos */}
                            <strong><i className="fas fa-cubes mr-1"></i> Cantidad de Sacos</strong>
                            <p className="text-muted">
                                {datos?.cantidad}
                            </p>
                            <hr></hr>
                            {/* Mostramos el peso neto del café */}
                            <strong><i className="fas fa-balance-scale mr-1"></i> Peso del cafe</strong>
                            <p className="text-muted">
                                {datos?.pesoNeto}
                            </p>
                            <hr></hr>
                            {/* Mostramos la tara */}
                            <strong><i className="fas fa-balance-scale mr-1"></i> Tara</strong>
                            <p className="text-muted">
                                {datos?.tara}
                            </p>
                            <hr></hr>
                            {/* Mostramos el total del peso */}
                            <strong><i className="fas fa-check mr-1"></i> Total del peso</strong>
                            <p className="text-muted">
                                {datos?.total}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer>
                {/* Aquí se pueden agregar botones u otros elementos en el pie de página del modal */}
            </Modal.Footer>
        </Modal>

    );
};

export default ModalInformacionDetalle;
