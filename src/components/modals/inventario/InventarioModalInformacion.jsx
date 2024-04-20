import React from "react";
import { Modal } from "react-bootstrap";

const ModalInformacionInventario = ({ datos, showModal, setShowModalInformacion }) => {
    // Imprime los datos del inventario en la consola para propósitos de depuración
    console.log(datos);
    return (
        // Modal de Bootstrap para mostrar la información detallada del inventario
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
            size="lg"
        >
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">Información de Inventario</h4>
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
                            <div className="widget-user-header bg-inf"o>
                                <h3 className="widget-user-username">Inventario No. {datos?.id}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <strong><i className="fas fa-clock mr-1"></i> Fecha de Entrada</strong>
                            <p className="text-muted">
                                {datos?.Producto?.fechaEntrada}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-box mr-1"></i> Tipo de Cafe</strong>
                            <p className="text-muted">
                                {datos?.Producto?.tipoProducto}
                            </p>
                            <hr></hr>
                            <strong><i className="fas fa-cubes  mr-1"></i> Stock</strong>
                            <p className="text-muted">
                                {datos?.Producto?.cantidad}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pie de página del modal */}
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default ModalInformacionInventario;
