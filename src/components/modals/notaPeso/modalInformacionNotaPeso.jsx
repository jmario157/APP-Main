import React from "react";
import { Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from '../../../imagenes/inca.png'


const ModalInformacionNotaPeso = ({ datos, showModal, setShowModalInformacion }) => {

    // Función para calcular el total del peso neto de todos los detalles
    const calcularTotalPesoNeto = () => {
        let total = 0;
        datos?.Detalles.forEach((detalle) => {
            total += detalle.pesoNeto;
        });
        return total;
    };

    // Función para generar y descargar el PDF del ticket de la nota de peso
    const handlePrintPDF = () => {
        const pdf = new jsPDF();
        pdf.setFontSize(14);
        // Título en negrita
        pdf.setFont("helvetica", "bold");
        pdf.text("Beneficio de café alianza ", 100, 15);
        pdf.setFontSize(12);
        pdf.text("Florida de San José La Paz ", 100, 20);
        pdf.text("Cel. 98263554", 100, 25);
        pdf.text("RTN 12121985000940", 100, 30);
        pdf.text("Cliente:", 15, 60);
        pdf.text("Fecha y Hora:", 15, 70);
        pdf.text("Tipo de café:", 15, 80);
        pdf.text("Estado:", 15, 90);

        pdf.addImage(logo, 'PNG', 15, 10, 30, 30);

        // Contenido en texto normal
        pdf.setFont("helvetica", "normal");
        pdf.text(`${datos?.cliente.nombreprimer} ${datos?.cliente.nombresegundo} ${datos?.cliente.apellidoprimer} ${datos?.cliente.apellidosegundo}`, 40, 60);
        pdf.text(`${datos?.fechaIngreso}`, 50, 70);
        pdf.text(`${datos?.Producto.tipoProducto}`, 50, 80);
        pdf.text(`${datos?.estado ? "Deposito" : "Pendiente"}`, 50, 90);
    
        let y = 100;
    
        // Mostrar detalles en formato de tabla
        pdf.autoTable({
            startY: y,
            head: [['No.', 'Sacos', 'Peso Bruto', 'Tara', 'Peso Neto']],
            body: datos?.Detalles.map(detalle => [
                detalle.pesada,
                detalle.cantidad,
                detalle.pesoBruto,
                detalle.tara,
                detalle.pesoNeto
            ]),
        });
    
        // Calcular total peso neto
        const totalPesoNeto = calcularTotalPesoNeto();
        pdf.setFont("helvetica", "bold"); // Establecer estilo en negrita
        pdf.text("Total Nota Peso:", 15, pdf.autoTable.previous.finalY + 15);
        pdf.setFont("helvetica", "normal"); // Restaurar estilo normal
        pdf.text(`${totalPesoNeto}`, 50, pdf.autoTable.previous.finalY + 15);
    
        pdf.save("ticket_nota_peso.pdf");
    };
    
    // Renderizado del modal con la información de la nota de peso y el botón para imprimir el ticket en PDF
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className="custom-modalView"
            size="lg"
        >
            {/* Cabecera del modal */}
            <div className="modal-header modal-primary">
                <h4 className="modal-title text-primary">Información de la Nota de Peso</h4>
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
            {/* Cuerpo del modal */}
            <div className="modal-body">
                {/* Información general de la nota de peso */}
                <div className="col-md-15">
                    {/* Datos del cliente, fecha, tipo de café, estado, etc. */}
                    <div className="card card-widget widget-user shadow">
                        <div className="card-header">
                            <div className="widget-header">
                                <h3 className="widget-user-username"><strong>DESOFIW</strong><br></br></h3>Nota de peso: {datos?.id}
                            </div>
                        </div>
                        <div className="card-body">
                            <strong><i className="fas fa-user mr-1"></i> Cliente: </strong> {datos?.cliente.nombreprimer + " " + datos?.cliente.nombresegundo + " " + datos?.cliente.apellidoprimer + " " + datos?.cliente.apellidosegundo}
                            <hr></hr>
                            <strong><i className="fas fa-calendar-alt mr-1"></i> Fecha: </strong> {datos?.fechaIngreso}
                            <hr></hr>
                            <strong><i className="fas fa-calendar-alt mr-1"></i> Tipo de cafe: </strong> {datos?.Producto.tipoProducto}
                            <hr></hr>
                        </div>
                    </div>
                </div>
                {/* Detalles de la nota de peso */}
                <div className="row">
                    {/* Detalles como número de sacos, peso bruto, tara, peso neto */}
                    <div className="col-md-2">
                        <div className="card card-widget widget-user shadow">
                            {/* Estado de la nota de peso */}
                            <div className="card-body">
                                {/* Estado: Pendiente o Deposito */}
                                <strong><i className="fas fa-cubes mr-1"></i> No.</strong>
                                {datos?.Detalles.map((detalle, index) => (
                                    <p key={index} className="text-muted">{detalle.pesada}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card card-widget widget-user shadow">
                            <div className="card-body">
                                <strong><i className="fas fa-cubes mr-1"></i> Sacos</strong>
                                {datos?.Detalles.map((detalle, index) => (
                                    <p key={index} className="text-muted">{detalle.cantidad}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card card-widget widget-user shadow">
                            <div className="card-body">
                                <strong><i className="fas fa-balance-scale mr-1"></i> Peso Bruto</strong>
                                {datos?.Detalles.map((detalle, index) => (
                                    <p key={index} className="text-muted">{detalle.pesoBruto}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card card-widget widget-user shadow">
                            <div className="card-body">
                                <strong><i className="fas fa-balance-scale mr-1"></i> Tara</strong>
                                {datos?.Detalles.map((detalle, index) => (
                                    <p key={index} className="text-muted">{detalle.tara}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card card-widget widget-user shadow">
                            <div className="card-body">
                                <strong><i className="fas fa-check mr-1"></i> Peso Neto</strong>
                                {datos?.Detalles.map((detalle, index) => (
                                    <p key={index} className="text-muted">{detalle.pesoNeto}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-muted"><strong>Total Peso Neto: </strong>{calcularTotalPesoNeto()}</p>
                </div>
                <div className="card-body">
                    <strong><i className="fas fa-info-circle mr-1"></i> Estado</strong>
                    <p className="text-muted">
                        {datos?.estado ? "Deposito" : "Pendiente"}
                    </p>
                </div>
            </div>
            {/* Pie del modal con el botón para imprimir el ticket en PDF */}
            <Modal.Footer>
                <button className="btn btn-primary" onClick={handlePrintPDF}>Obtener Ticket</button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalInformacionNotaPeso;
