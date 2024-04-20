import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { guardarInventario, editarInventario } from "../../apiUrls";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ModalInformacionInventario from "./InventarioModalInformacion";
import { AxiosPrivado } from "../../axios/Axios";

function ModalInventarioForm({ accion, datosInventario, ActualizarTabla, datosProducto }) {
    // Estados para controlar la visibilidad del modal y gestionar los datos del formulario
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    const [errorStock, setErrorStock] = useState(false);
    const [errorFechaEntrada, setErrorFechaEntrada] = useState(false);
    const [ProductoId, setProductoId] = useState(null);
    const [datosCargados, setDatosCargados] = useState(false);

    // Transforma los datos de los productos en un formato adecuado para el componente Select
    const Productos = datosProducto?.map((f) => ({
        value: f.id,
        label: f.tipoProducto,
    }));

    // Estado para almacenar los datos del formulario
    const [formularioInventario, setFormularioInventario] = useState({
        id: datosInventario ? datosInventario.id : null,
        stock: datosInventario ? datosInventario.stock : "",
        fechaEntrada: datosInventario ? new Date(datosInventario.fechaEntrada) : new Date(),
        ProductoId: datosInventario ? datosInventario.ProductoId : null
    });

    // Efecto para cargar los datos del inventario cuando se edita un registro
    useEffect(() => {
        if (datosInventario != null) {
            setProductoId(datosInventario.ProductoId);
            setFormularioInventario(datosInventario);
        } else {
            limpiarCampos();
        }
    }, []);

    // Efecto para cargar los datos del inventario al abrir el modal de edición
    useEffect(() => {
        if (datosInventario != null && !datosCargados) {
            setProductoId(datosInventario.ProductoId);
            setFormularioInventario({
                ...formularioInventario,
                ...datosInventario
            });
            setDatosCargados(true);
        }
    }, [showModal, datosInventario, datosCargados]);

    // Efecto para actualizar el estado del ProductoId en el formulario
    useEffect(() => {
        setFormularioInventario({
            ...formularioInventario,
            ProductoId: ProductoId
        })
    }, [ProductoId])

    // Función para manejar los cambios en los campos del formulario
    const manejadorInventario = (event) => {
        const { name, value } = event.target;
        setFormularioInventario(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Función para guardar un nuevo registro de inventario
    const saveInventario = async () => {
        console.log("Guardando inventario:", formularioInventario);
        // Validaciones de campos
        if (!formularioInventario.stock || !formularioInventario.fechaEntrada) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorStock(!formularioInventario.stock);
            setErrorFechaEntrada(!formularioInventario.fechaEntrada);
            return;
        }

        // Resetear errores
        setErrorStock(false);
        setErrorFechaEntrada(false);

        try {
            const response = await AxiosPrivado.post(guardarInventario, formularioInventario);
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
            mostraAlertaError("Error al guardar el inventario.");
        }
    };

    // Función para modificar un registro de inventario existente
    const modificarInventario = () => {
        // Validaciones de campos
        if (!formularioInventario.stock || !formularioInventario.fechaEntrada) {
            mostraAlerta("Disculpe, Tiene que llenar todos los campos", "warning");
            setErrorStock(!formularioInventario.stock);
            setErrorFechaEntrada(!formularioInventario.fechaEntrada);
            return;
        }

        // Resetear errores
        setErrorStock(false);
        setErrorFechaEntrada(false);

        AxiosPrivado.put(editarInventario + formularioInventario.id, formularioInventario)
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
                mostraAlertaError("Error al modificar el inventario.");
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
        setFormularioInventario({
            id: null,
            stock: "",
            fechaEntrada: "",
            ProductoId: null
        });
        setProductoId(null);
    };

    // Funciones para manejar la apertura y cierre de los modales
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleOpenModal = () => setShowModalInformacion(true);

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Inventario
                    </Button>
                </div>

            ) : (
                <div>
                    <Button variant="info" onClick={handleOpenModal}>
                        <i className="fas fa-folder">
                        </i>
                    </Button>
                </div>

            )}
            {/* Modal para el formulario de inventario */}
            <Modal show={showModal} onHide={handleClose}>
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Formulario de Inventario</h4>
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
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="stock">Stock</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errorStock ? "is-invalid" : ""}`}
                                                id="stock"
                                                name="stock"
                                                value={formularioInventario.stock}
                                                onChange={manejadorInventario}
                                            />
                                            {errorStock && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="fechaEntrada">Fecha de Entrada</label>
                                            <DatePicker
                                                selected={formularioInventario.fechaEntrada}
                                                onChange={(date) => setFormularioInventario({ ...formularioInventario, fechaEntrada: date })}
                                                className={`form-control ${errorFechaEntrada ? "is-invalid" : ""}`}
                                                id="fechaEntrada"
                                                name="fechaEntrada"
                                            />
                                            {errorFechaEntrada && <div className="invalid-feedback">Este campo es requerido.</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">
                                                Producto
                                            </label>
                                            <Select
                                                value={
                                                    ProductoId &&
                                                    Productos?.find(
                                                        (opcion) => 
                                                            opcion.value === ProductoId
                                                    )
                                                }
                                                onChange={(event) => {
                                                    setProductoId(event.value);
                                                }}
                                                options={Productos}
                                                isSearchable={true}
                                            ></Select>
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
                        <Button variant="primary" onClick={saveInventario}>
                            Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarInventario}>
                            Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            {/* Modal para mostrar la información detallada de un elemento del inventario */}
            <ModalInformacionInventario datos={datosInventario} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionInventario>
        </>
    );
}

export default ModalInventarioForm;