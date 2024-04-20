import React, { useState } from "react";
import { Modal, Table, Button } from "react-bootstrap";

const obtenerNombreCompletoEmpleado = (empleado) => {
    const nombres = [empleado.primernombre, empleado.segundonombre];
    const apellidos = [empleado.primerapellido, empleado.segundoapellido];
    
    // Filtra elementos nulos y concatena los nombres
    const nombreCompleto = [...nombres, ...apellidos].filter(Boolean).join(" ");
  
    return nombreCompleto || "Empleado no encontrado";
  };
  
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + " || Hora: " + fechaObj.toLocaleTimeString();
    return fechaFormateada;
  };
  
  const DetallesSalidaModal = ({ salida, showModal, setShowModal }) => {
    console.log("salida:", salida);
    //const empleadoNombre = obtenerNombreCompletoEmpleado(salida.empleado);
    const handleClose = () => setShowModal(false);

  // Función para calcular el subtotal de un detalle
  const calcularSubtotal = (detalle) => {
    return detalle.cantidad * detalle.costo;
  };

  // Calcular el total de todos los detalles
  const calcularTotal = () => {
    let total = 0;
    if (salida?.detallesSalida) {
      salida.detallesSalida.forEach((detalle) => {
        total += calcularSubtotal(detalle);
      });
    }
    return total;
  };
  

  return (
    <>
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Detalles de la Salida</h4>
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
                <th>Empleado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatearFecha(salida?.fecha)}</td>
                <td>{salida?.empleado}</td>
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
                
            {salida.detallesSalida && salida.detallesSalida.map((detalle, index) => (
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
      </Modal>
    </>
  );
};

export default DetallesSalidaModal;
