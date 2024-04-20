import React from "react";
import { Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ModalInformacionFactura = ({ datos, showModal, setShowModalInformacion }) => {
    // Función para calcular el total del peso neto de todas las notas de peso
    const calcularTotalPesoNetoTotal = () => {
        let total = 0;
        datos?.Nota.forEach((nota) => {
            nota.Detalles.forEach((detalle) => {
                total += detalle.pesoNeto;
            });
        });
        return total;
    };

    // Función para imprimir el PDF de la factura
    const handlePrintPDF = () => {
        const pdf = new jsPDF();
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("DESOFIW", 100, 20);
        pdf.text(`Fecha de Emision: ${datos?.fechaEmision}`, 20, 30);

        let y = 40;

        datos?.Nota.forEach((nota) => {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Nota de Peso No.: ${nota.id}`, 20, y);
            y += 10;
            pdf.text(`Cliente: ${nota.cliente.nombreprimer} ${nota.cliente.nombresegundo} ${nota.cliente.apellidoprimer} ${nota.cliente.apellidosegundo}`, 20, y);
            y += 10;
            pdf.text(`Tipo de Cafe: ${nota.Producto.tipoProducto}`, 20, y);
            y += 10;
            pdf.autoTable({
                startY: y,
                head: [['No.', 'Sacos', 'Peso Bruto', 'Tara', 'Peso Neto']],
                body: nota.Detalles.map(detalle => [
                    detalle.pesada,
                    detalle.cantidad,
                    detalle.pesoBruto,
                    detalle.tara,
                    detalle.pesoNeto
                ]),
            });
            y = pdf.autoTable.previous.finalY + 10;
            pdf.text(`Total Peso Neto Nota de Peso: ${nota.Detalles.reduce((acc, detalle) => acc + detalle.pesoNeto, 0)}`, 20, y);
            y += 20;
        });

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Total Peso Neto Factura: ${calcularTotalPesoNetoTotal()}`, 20, y);

        pdf.save("factura.pdf");
    };

    // Renderiza el modal con la información de la factura y un botón para imprimir el PDF
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
            size="lg"
        >
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">Información de Facturas</h4>
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
                            <div className="widget-user-header bg-inf">
                                <h3 className="widget-user-username">Factura No. {datos?.id}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Muestra la información de la factura y sus notas de peso */}
                            <strong><i className="fas fa-clock mr-1"></i> Fecha de Emisión</strong>
                            <p className="text-muted">{datos?.fechaEmision}</p>
                            <hr />
                            <strong><i className="fas fa-box mr-1"></i> Método de Pago</strong>
                            <p className="text-muted">{datos?.tipoPago}</p>
                            <hr />
                            <strong><i className="fas fa-cubes  mr-1"></i> Notas de Peso</strong>
                            {datos?.Nota.map((nota) => (
                                <div key={nota.id}>
                                    <p className="text-muted"><strong>ID:</strong> {nota.id}</p>
                                    <p className="text-muted"><strong>Fecha de Ingreso:</strong> {nota.fechaIngreso}</p>
                                    <p className="text-muted"><strong>Nombre del Cliente:</strong> {nota.cliente.nombreprimer + " " + nota.cliente.nombresegundo + " " + nota.cliente.apellidoprimer + " " + nota.cliente.apellidosegundo}</p>
                                    <p className="text-muted"><strong>Tipo de Producto:</strong> {nota.Producto.tipoProducto}</p>
                                    <p className="text-muted"><strong>Total Peso Neto:</strong> {nota.Detalles.reduce((acc, detalle) => acc + detalle.pesoNeto, 0)}</p>
                                    <hr />
                                </div>
                            ))}
                            <p className="text-muted"><strong>Total Peso Neto Factura:</strong> {calcularTotalPesoNetoTotal()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={handlePrintPDF}>Imprimir PDF</button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalInformacionFactura;
