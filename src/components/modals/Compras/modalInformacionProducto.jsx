import React from "react";
import { Modal } from "react-bootstrap";

const ModalInformacionProducto = ({ datos, showModal, setShowModalInformacion }) => {
  
  const calcularImpuesto = () => {
    const impuestoProcentaje = datos?.impuesto;
    const costo = datos?.costo;

    const porcentajeImpuesto = {
      "15%": 0.15,
      "18%": 0.18,
      "Exento": 0,
    };

    const impuesto = costo * porcentajeImpuesto[impuestoProcentaje];
    return impuesto;
  }

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información del Producto</h4>
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
                <h3 className="widget-user-username">{datos?.nombre}</h3>
              </div>
            </div>
            <div className="card-body">
              <strong>Nombre:</strong>
              <p className="text-muted">{datos?.nombre}</p>
              <hr />
              <strong>Descripción:</strong>
              <p className="text-muted">{datos?.descripcion}</p>
              <hr />
              <strong>Existencia:</strong>
              <p className="text-muted">{datos?.existencia}</p>
              <hr />
              <strong>Costo:</strong>
              <p className="text-muted">L.{datos?.costo}</p>
              <hr />
              <strong>Impuesto:</strong>
              <p className="text-muted">{datos?.impuesto}</p>
              <hr />
              <strong>Valor del Impuesto:</strong>
              <p className="text-muted">L.{calcularImpuesto()}</p>
              <hr />
              <strong>Código de Barras:</strong>
              <p className="text-muted">{datos?.codigobarra}</p>
              <hr />
              <strong>Código de Catálogo:</strong>
              <p className="text-muted">{datos?.codigocatalogo}</p>
            </div>
          </div>
        </div>
      </div>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ModalInformacionProducto;
