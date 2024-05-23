import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import Select from "react-select";
import { guardarFactura, editarFactura } from "../../apiUrls";
import ModalInformacionFactura from "./modalInformacionFactura";
import { AxiosPrivado } from "../../axios/Axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BuscarNotaPeso from "../notaPeso/BuscarNotaPeso"

function ModalFacturaForm({ accion, datosFactura, ActualizarTabla, listaNotaPeso }) {
    // Estado para controlar si el modal está abierto o cerrado
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    // Función para abrir y cerrar el modal
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    // Estado para controlar si hay errores en la fecha de emisión
    const [errorFechaEmision, setErrorFechaEmision] = useState(false);
    // Estado para controlar si hay errores en el tipo de pago
    const [errorTipoPago, setErrorTipoPago] = useState(false);
    // Estado para controlar si los datos de la factura han sido cargados
    const [datosCargados, setDatosCargados]= useState(false);
    // Estado para la fecha de emisión de la factura
    const [fechaEmision, setFechaEmision] = useState(new Date());
    // Estado para almacenar el peso neto total de cada nota de peso

    const [notasPeso, setNotasPeso] = useState([]);

    <DatePicker
    selected={fechaEmision}
    onChange={date => setFechaEmision(date)}
    dateFormat="dd/MM/yyyy HH:mm" // Formato de fecha
    />

    const [formularioFactura, setFormularioFactura] = useState({
        id: datosFactura ? datosFactura.id : null,
        fechaEmision: datosFactura ? new Date(datosFactura.fechaEmision) : new Date(),        
        tipoPago: datosFactura ? datosFactura.tipoPago : "",
        NotumId: datosFactura ? (Array.isArray(datosFactura.NotumId) ? datosFactura.NotumId : [datosFactura.NotumId]) : [], // Inicializa con la nota de peso existente
    }); 

    useEffect(() => {
        if(datosFactura != null){
            buscarIdnota(datosFactura.NotumId);
            setFormularioFactura({
                ...formularioFactura,
                ...datosFactura,
                NotumId: Array.isArray(datosFactura.NotumId) ? datosFactura.NotumId : [datosFactura.NotumId]
            });
        } else{
            limpiarCampos();
        }
    }, []);

    useEffect(() => {
        if(datosFactura != null && !datosCargados) {
            buscarIdnota(datosFactura.NotumId);
            setFormularioFactura({
                ...formularioFactura,
                ...datosFactura,
                NotumId: Array.isArray(datosFactura.NotumId) ? datosFactura.NotumId : [datosFactura.NotumId]
            });
            setDatosCargados(true);
        }
    }, [showModal, datosFactura, datosCargados]);

    const buscarIdnota = (id) => {
        if (id == null) return; // Evita errores si id es null o undefined
        const notaSeleccionada = listaNotaPeso?.find((nota) => nota.id == id);
        if (notaSeleccionada) {
            if (!notasPeso.includes(id)) {
                setNotasPeso([...notasPeso, id]); // Agrega el ID a la lista
            }
        } else {
            setNotasPeso(notasPeso.filter((notaId) => notaId !== id)); // Remueve el ID de la lista
        }
    };      

    const saveFactura = async () => {
        if (formularioFactura.fechaEmision === "") {
            setErrorFechaEmision(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }
        if (formularioFactura.tipoPago === "") {
            setErrorTipoPago(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }

        setErrorFechaEmision(false);
        setErrorTipoPago(false);

        try {
            console.log(formularioFactura);
            await AxiosPrivado
                .post(guardarFactura, formularioFactura)
                .then((response) => {
                    console.log("Respuesta:", response.data);
                    if (response.data.tipo == 1) {
                        ActualizarTabla();
                        mostraAlerta(response.data.msj, "success");
                        limpiarCampos();
                    } else if (response.data.tipo == 0) {
                        for (let i = 0; i < response.data.msj.length; i++) {
                            response.data.msj.forEach((element) => {
                                console.log(element);
                                mostraAlerta("Ha ocurrido un error", "warning");
                            });
                        }
                    } else if (response.data.tipo == 2) {
                        response.data.msj.forEach((element) => {
                            console.log(element.campo + " " + element.msj);
                            mostraAlerta("El campo: " + element.campo + ", " + element.msj);
                        });
                    }
                })
                .catch((error) => {
                    console.log("Error: ", error);
                    mostraAlerta("Revise los datos", "warning");
                });
        } catch (error) {
            console.error("Error:", error);
            mostraAlerta(error, "error");
        }
    };

    // Función para manejar cambios en los campos de la factura
    const manejadorFacturas = (event) => {
        // Actualiza el estado del formulario con el nuevo valor del campo modificado
        setFormularioFactura({
            ...formularioFactura,
            [event.target.name]: event.target.value,
        });
    };

    // Función para manejar cambios en los IDs de las notas de peso
    const manejadorIds = (event) => {
        const { value } = event.target;
        const ids = value.trim() === "" ? [] : value.split(",").map((id) => id.trim());
        setFormularioFactura({
            ...formularioFactura,
            NotumId: ids,
        });
        setNotasPeso(ids);
    };   

    const modificarFactura =  async () => {
        if (formularioFactura.fechaEmision === "") {
            setErrorFechaEmision(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }
        if (formularioFactura.tipoPago === "") {
            setErrorTipoPago(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }

        setErrorFechaEmision(false);
        setErrorTipoPago(false);

        AxiosPrivado
            .put(editarFactura + formularioFactura.id, formularioFactura)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if(response.data.tipo == 1){
                    ActualizarTabla();
                    mostraAlerta(response.data.msj, "success");
                    handleClose();
                    limpiarCampos();
                }else if(response.data.tipo == 0){
                    response.data.msj.forEach((element) => {
                        console.log(element.campo + " " + element.msj);
                        mostraAlerta("El campo: " + element.campo + ", " + element.msj)
                    });
                }else if(response.data.tipo == 2){
                    response.data.msj.forEach((element) => {
                        console.log(element.campo + " " + element.msj);
                        mostraAlerta("El campo: " + element.campo + ", " + element.msj)
                    });
                }
            })
            .catch((error) => {
                console.log("Error: ", error);
                mostraAlerta("Revise los datos", "warning");
            });
    };

    const limpiarCampos = () => {
        setFormularioFactura({
            id: "",
            fechaEmision: new Date(),
            tipoPago: "",
            NotumId: null,
        });
        setNotasPeso([]);
    };

    const handleOpenModal = () => {
        setShowModalInformacion(true);
    };

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Factura
                    </Button>
                </div>

            ) : (
                <div>
                    <Button variant="info" onClick={handleOpenModal}>
                        <i className="fas fa-folder">
                        </i>
                    </Button>

                    {/* <Button variant="warning" onClick={handleShow}>
                        <i className="fas fa-pencil-alt">
                        </i>
                    </Button> */}
                </div>

            )}

            <Modal show={showModal} onHide={handleClose} size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Factura</h4>
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
                <Modal.Body>
                    <div className="modal-body">
                        <form>
                            <div className="card-header">
                                <div className="widget-header">
                                    <h3 className="widget-user-username"><i className="fas fa-desktop"></i> DESOFIW</h3>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="fechaEmision">Fecha de Emision</label>
                                        <DatePicker
                                            //type="date"
                                            className={`form-control ${errorFechaEmision ? "is-invalid" : ""}`}
                                            selected={fechaEmision}
                                            //value={formularioNotaPeso.fechaIngreso.format("YYYY-MM-DD")}
                                            onChange={date => setFechaEmision(date)}
                                            dateFormat="dd/MM/yyyy HH:mm a" // Formato de fecha
                                            id="fechaEmision"
                                            name="fechaEmision"
                                        />
                                        {errorFechaEmision && <div className="alert alert-danger">Este campo es obligatorio</div>}
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="tipoPago">Metodo de Pago</label>
                                            <select
                                                className={`form-control ${errorTipoPago ? "is-invalid" : ""}`}
                                                id="tipoPago"
                                                name="tipoPago"
                                                value={formularioFactura.tipoPago}
                                                onChange={manejadorFacturas} 
                                            >
                                                <option value=""></option>
                                                <option value="Efectivo">Efectivo</option>
                                                <option value="Tarjeta">Tarjeta</option>
                                                <option value="Transferencia">Transferencia</option>
                                            </select>
                                            {errorTipoPago && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="form-group col-sm-12">
                                        <label>Notas de Peso:</label>
                                        <Select
                                            isMulti
                                            options={listaNotaPeso ? listaNotaPeso.map((nota) => ({
                                                value: nota.id,
                                                label: `Nota ${nota.id} - Fecha: ${nota.fechaIngreso} - Cliente: ${nota.cliente.nombreprimer + " " + nota.cliente.apellidoprimer} - Producto: ${nota.Producto.tipoProducto}`,
                                            })) : []}
                                            value={notasPeso ? notasPeso.map((id) => ({
                                                value: id,
                                                label: `Nota ${id}`,
                                            })) : []}
                                            onChange={(selectedOptions) => {
                                                const ids = selectedOptions.map((option) => option.value);
                                                setFormularioFactura({
                                                    ...formularioFactura,
                                                    NotumId: ids,
                                                });
                                                setNotasPeso(ids);
                                            }}
                                        />
                                    </div>
                                </div> 
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="warning" onClick={limpiarCampos}>
                        Limpiar Campos
                    </Button>
                    {accion ? (
                        <Button variant="primary" onClick={saveFactura}>
                            Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarFactura}>
                            Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionFactura datos={datosFactura} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionFactura>
        </>
    );
}

export default ModalFacturaForm;