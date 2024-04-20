import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarProductos, editarProductos } from "../../apiUrls";
import ModalInformacionProductos from "./modalInformacionProductos";
import { AxiosPrivado } from "../../axios/Axios";
import DatePicker from "react-datepicker";

function ModalProductosForm({ accion, datosProductos, ActualizarTabla }) {
    // Estados para controlar el modal y los errores de validación
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [errorFechaEntrada, setErrorFechaEntrada] = useState(false);
    const [errorProducto, setErrorProducto] = useState(false);
    const [errorCantidad, setErrorCantidad] = useState(false);
    const [errorPeso, setErrorPeso] = useState(false);
    const [errorMedida, setErrorMedida] = useState(false);
    const [fechaEntrada, setFechaEntrada] = useState(new Date());

    <DatePicker
    selected={fechaEntrada}
    onChange={date => setFechaEntrada(date)}
    dateFormat="dd/MM/yyyy HH:mm" // Formato de fecha
    />

    // Estado para almacenar los datos del formulario
    const [formularioProductos, setFormularioProductos] = useState({
        id: datosProductos ? datosProductos.id : null,
        fechaEntrada: datosProductos ? new Date(datosProductos.fechaEntrada) : new Date(),
        tipoProducto: datosProductos ? datosProductos.tipoProducto : "",
        cantidad: datosProductos ? datosProductos.cantidad : "",
        pesoUnidad: datosProductos ? datosProductos.pesoUnidad : "",
        medidaPeso: datosProductos ? datosProductos.medidaPeso : "",
    });

    // Efecto para actualizar el formulario cuando se reciben nuevos datosProductos
    useEffect(() => {
        if (datosProductos != null) {
            setFormularioProductos(datosProductos);
        } else {
            limpiarCampos();
        }
    }, [datosProductos]);

    // Manejador para actualizar el estado del formulario en función de los cambios en los inputs
    const manejadorProductos = (event) => {
        setFormularioProductos({
            ...formularioProductos,
            [event.target.name]: event.target.value,
        });
    };
    
    // Función para guardar un nuevo producto
    const saveProductos = async () => {
        // Validaciones de campos
        if (!formularioProductos.fechaEntrada || !formularioProductos.tipoProducto || !formularioProductos.cantidad || !formularioProductos.pesoUnidad || !formularioProductos.medidaPeso) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorFechaEntrada(!formularioProductos.fechaEntrada);
            setErrorProducto(!formularioProductos.tipoProducto);
            setErrorCantidad(!formularioProductos.cantidad);
            setErrorPeso(!formularioProductos.pesoUnidad);
            setErrorMedida(!formularioProductos.medidaPeso);
            return;
        }

        // Resetear errores
        setErrorFechaEntrada(false);
        setErrorProducto(false);
        setErrorCantidad(false);
        setErrorPeso(false);
        setErrorMedida(false);

        try {
            const response = await AxiosPrivado.post(guardarProductos, formularioProductos);
            console.log("Respuesta:", response.data);
            if (response.data.tipo === 1) {
                mostraAlerta(response.data.msj, "success");
                ActualizarTabla();
                limpiarCampos();
            } else {
                handleErrorResponse(response.data);
            }
        } catch (error) {
            console.error("Error:", error);
            mostraAlertaError("Error al guardar el producto.");
        }
    };

    const handleDateChange = (date) => {
        setFechaEntrada(date); // Actualizar el estado de la fecha de compra cuando cambia
    };

    // Función para modificar un producto existente
    const modificarProductos = () => {
        // Validaciones de campos
        if (!formularioProductos.fechaEntrada || !formularioProductos.tipoProducto || !formularioProductos.cantidad || !formularioProductos.pesoUnidad || !formularioProductos.medidaPeso) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorFechaEntrada(!formularioProductos.fechaEntrada);
            setErrorProducto(!formularioProductos.tipoProducto);
            setErrorCantidad(!formularioProductos.cantidad);
            setErrorPeso(!formularioProductos.pesoUnidad);
            setErrorMedida(!formularioProductos.medidaPeso);
            return;
        }

        // Resetear errores
        setErrorFechaEntrada(false);
        setErrorProducto(false);
        setErrorCantidad(false);
        setErrorPeso(false);
        setErrorMedida(false);

        AxiosPrivado.put(editarProductos + formularioProductos.id, formularioProductos)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if (response.data.tipo === 1) {
                    ActualizarTabla();
                    mostraAlerta(response.data.msj, "success");
                } else {
                    handleErrorResponse(response.data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                mostraAlertaError("Error al modificar el producto.");
            });
    };

    // Función para manejar la respuesta de error del servidor
    const handleErrorResponse = (data) => {
        if (Array.isArray(data.msj)) {
            data.msj.forEach((element) => {
                console.log(element.campo + " " + element.msj);
                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
            });
        } else {
            mostraAlertaWarning(data.msj);
        }
    };

    // Función para limpiar los campos del formulario
    const limpiarCampos = () => {
        setFormularioProductos({
            id: null,
            fechaEntrada: new Date(),
            tipoProducto: "",
            cantidad: "",
            pesoUnidad: "",
            medidaPeso: "",
        });
    };

    // Función para mostrar el modal
    const handleShow = () => setShowModal(true);
    // Función para cerrar el modal
    const handleClose = () => setShowModal(false);
    // Función para abrir el modal de información
    const handleOpenModal = () => setShowModalInformacion(true);

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Agregar Producto
                    </Button>
                </div>

            ) : (
                <div>
                    <Button variant="info" onClick={handleOpenModal}>
                        <i className="fas fa-folder">
                        </i>
                    </Button>

                    <Button variant="warning" onClick={handleShow}>
                        <i className="fas fa-pencil-alt">
                        </i>
                    </Button>
                </div>

            )}

            <Modal show={showModal} onHide={handleClose}>
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Productos</h4>
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
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="fechaEntrada">Fecha de Entrada</label>
                                            <DatePicker
                                            //type="date"
                                            className={`form-control ${errorFechaEntrada ? "is-invalid" : ""}`}
                                            selected={fechaEntrada}
                                            //value={formularioNotaPeso.fechaIngreso.format("YYYY-MM-DD")}
                                            onChange={date => setFechaEntrada(date)}
                                            dateFormat="dd/MM/yyyy HH:mm a" // Formato de fecha
                                            id="fechaIngreso"
                                            name="fechaIngreso"
                                        />
                                            {errorFechaEntrada && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">Tipo de Cafe</label>
                                            <select
                                                className={`form-control ${errorProducto ? "is-invalid" : ""}`}
                                                id="tipoProducto"
                                                name="tipoProducto"
                                                value={formularioProductos.tipoProducto}
                                                onChange={manejadorProductos}
                                            >
                                                <option value=""></option>
                                                <option value="Cafe en uva">Cafe en uva</option>
                                                <option value="Cafe en oro">Cafe en oro</option>
                                                <option value="Cafe pergamino humedo">Cafe pergamino humedo</option>
                                                <option value="Cafe pergamino seco">Cafe pergamino seco</option>
                                            </select>
                                            {errorProducto && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="cantidad">Cantidad de Sacos</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorCantidad ? "is-invalid" : ""}`}
                                                id="cantidad"
                                                name="cantidad"
                                                value={formularioProductos.cantidad}
                                                onChange={manejadorProductos}
                                            />
                                            {errorCantidad && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="pesoUnidad">Peso por Unidad</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorPeso ? "is-invalid" : ""}`}
                                                id="pesoUnidad"
                                                name="pesoUnidad"
                                                value={formularioProductos.pesoUnidad}
                                                onChange={manejadorProductos}
                                            />
                                            {errorPeso && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="medidaPeso">Unidad de Medida (lb)</label>
                                            <select
                                                className={`form-control ${errorMedida ? "is-invalid" : ""}`}
                                                id="medidaPeso"
                                                name="medidaPeso"
                                                value={formularioProductos.medidaPeso}
                                                onChange={manejadorProductos} 
                                            >
                                                <option value=""></option>
                                                <option value="lb">lb</option>
                                                <option value="kg">kg</option>
                                            </select>
                                            {errorMedida && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
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
                        <Button variant="primary" onClick={saveProductos}>
                            Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarProductos}>
                            Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionProductos datos={datosProductos} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionProductos>
        </>
    );
}

export default ModalProductosForm;
