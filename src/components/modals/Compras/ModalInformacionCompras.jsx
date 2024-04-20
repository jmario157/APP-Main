import React,{ useState } from "react";
import { Modal, Table, Button } from "react-bootstrap"; // Asegúrate de importar Table desde react-bootstrap
import { imagenCompra } from "../../apiUrls";

const DetallesCompraModal = ({ compra, showModal, setShowModal }) => {
  const proveedorNombre = compra?.proveedor?.nombre || "Proveedor no encontrado";
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [ urlImagen, setUrlImagen] = useState(imagenCompra + "factura-vacia.png");

  const mostrarImagenCompra = (imagen) => {
    setUrlImagen(imagenCompra + imagen);
    setShowImageModal(true);
  }
  // Función para formatear una fecha en el formato deseado (dd/mm/yyyy - HH:MM:SS)
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + " || Hora: " + fechaObj.toLocaleTimeString();
    return fechaFormateada;
  };

  // Función para calcular el subtotal de un detalle
  const calcularSubtotal = (detalle) => {
    return detalle.cantidad * detalle.costo;
  };

  // Calcular el total de todos los detalles
  const calcularTotal = () => {
    let total = 0;
    console.log(compra)
    compra?.detallesCompra.forEach((detalle) => {
      total += calcularSubtotal(detalle);
    });
    return total;
  };

  return (  
  <> 
    <Modal
      show={showModal}
      onHide={handleClose}
      className="modal fade"
      size="lg"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Detalles de la Compra</h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setShowModal(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Número de Factura</th>
              <th>Proveedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatearFecha(compra?.fecha)}</td>
              <td>{compra?.numerofactura}</td>
              <td>{compra?.proveedor?.nombre || "Proveedor no encontrado"}</td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Costo</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {compra?.detallesCompra.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.producto?.nombre}</td>
                <td>{detalle.cantidad}</td>
                <td>{detalle.costo}</td>
                <td>{calcularSubtotal(detalle)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        <div className="text-right">
        <strong className="total">Total: {calcularTotal()}</strong> 
      </div>
      <style>
        {`
          .total {
            margin-right: 50px; 
        `}
      </style>
      <div className="modal-footer">
        <div className="card-footer">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </div>
      </div>
        </div>
        <Button
          variant="primary"
          onClick={()=> mostrarImagenCompra(compra?.Imagen)}
        >
          Ver Imagen
        </Button>
    </Modal> 
    <Modal
      show={showImageModal}
      onHide={() => setShowImageModal(false)}
      className="modal fade"
      size="lg">
        <div className="modal-body">
          <img src={urlImagen} alt="Imagen Compra"/>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={()=> setShowImageModal(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DetallesCompraModal;
