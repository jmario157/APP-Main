import React from "react";
import { Modal } from "react-bootstrap";

// Componente funcional que muestra información detallada de un producto en un modal
const ModalInformacionProductos = ({ datos, showModal, setShowModalInformacion }) => {
    return (
        // Modal que muestra la información del producto
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
        >
            <div className="modal-header modal-primary">
                {/* Encabezado del modal */}
                <h4 className="modal-title text-primary">Información del Producto</h4>
                {/* Botón para cerrar el modal */}
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowModalInformacion(false)}
                >
                    {/* Ícono de cierre del modal */}
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="col-md-12">
                    <div className="card card-widget widget-user shadow">
                        <div className="card-header">
                            <div className="widget-user-header bg-info">
                                {/* Nombre del producto */}
                                <h3 className="widget-user-username">{datos?.tipoProducto}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Detalles del producto */}
                            {/* Fecha de entrada del producto */}
                            <strong><i className="fas fa-cubes mr-1"></i> Fecha de Entrada</strong>
                            <p className="text-muted">
                                {datos?.fechaEntrada}
                            </p>
                            <hr></hr>
                            {/* Cantidad de café del producto */}
                            <strong><i className="fas fa-cubes mr-1"></i> Cantidad de Cafe</strong>
                            <p className="text-muted">
                                {datos?.cantidad}
                            </p>
                            <hr></hr>
                            {/* Peso del café por unidad */}
                            <strong><i className="fas fa-balance-scale mr-1"></i> Peso del cafe por unidad</strong>
                            <p className="text-muted">
                                {datos?.pesoUnidad}
                            </p>
                            <hr></hr>
                            {/* Unidad de medición del peso */}
                            <strong><i className="fas fa-balance-scale mr-1"></i> Unidad de medicion del peso</strong>
                            <p className="text-muted">
                                {datos?.medidaPeso}
                            </p>
                            <hr></hr>
                            {/* Total del peso */}
                            <strong><i className="fas fa-check mr-1"></i> Total del peso</strong>
                            <p className="text-muted">
                                {datos?.total}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer>
                {/* Pie del modal */}
                {/* Aquí puedes agregar botones u otras acciones */}
            </Modal.Footer>
        </Modal>

    );
};

export default ModalInformacionProductos;
