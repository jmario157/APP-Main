import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import BuscarProveedor from "./BuscarProveedor";

function ModalCompraForm({ showModal, setShowModal }) {
  const [nombreProveedor, setNombreProveedor] = useState("Seleccione un proveedor");
  const [productoNombre, setProductoNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [existencia, setExistencia] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleProveedorSelect = (selectedOption) => {
    if (selectedOption) {
      setNombreProveedor(selectedOption.label);
    } else {
      setNombreProveedor("Seleccione un proveedor");
    }
  };

  return (
    <div>
      <Button variant="info" onClick={handleOpenModal}>
        Abrir Modal de Compra
      </Button>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Compra</h4>
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
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Proveedor</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Proveedor 1"
                        value={nombreProveedor}
                        readOnly
                      />
                      <BuscarProveedor onSelect={handleProveedorSelect} />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese el nombre del producto"
                      value={productoNombre}
                      onChange={(e) => setProductoNombre(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Costo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: 100.00"
                      value={costo}
                      onChange={(e) => setCosto(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Existencia</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: 10"
                      value={existencia}
                      onChange={(e) => setExistencia(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={guardarCompra}>
            Guardar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalCompraForm;
