import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import Select from "react-select";
import { guardarNotaPeso, editarNotaPeso, guardarDetalle, editarDetalle } from "../../apiUrls";
import ModalInformacionNotaPeso from "./modalInformacionNotaPeso";
import { AxiosPrivado } from "../../axios/Axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BuscarCliente from "../Clientes/BuscarCliente";
import moment from "moment";
import 'moment/locale/es'

function ModalNotaPesoForm({ accion, datosNotaPeso, ActualizarTabla, listaClientes, datosProductos }) {
    // Estado para controlar la visibilidad del modal
    const [showModal, setShowModal] = useState(false);
    const [showModalInformacion, setShowModalInformacion] = useState(false);
    // Funciones para abrir y cerrar el modal
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    // Estado para controlar si se muestra un error en la fecha de ingreso
    const [errorFechaIngreso, setErrorFechaIngreso] = useState(false);
    // Estado para el nombre del cliente seleccionado
    const [nombreCliente, setNombreCliente] = useState("Seleccione un cliente");
    // Estado para el ID del producto seleccionado
    const [ProductoId, setProductoId] = useState(null);
    const [datosCargados, setDatosCargados]= useState(false);
    // Estado para los detalles de la nota de peso
    const [DetalleId, setDetalleId] = useState([]);
    const [fechaIngreso, setFechaIngreso] = useState(new Date());
    // Estado para los totales de los detalles de la nota de peso
    const [totales, setTotales] = useState({ cantidadTotal: 0, pesoBrutoTotal: 0, taraTotal: 0, pesoNetoTotal: 0 });

    <DatePicker
    selected={fechaIngreso}
    onChange={date => setFechaIngreso(date)}
    dateFormat="dd/MM/yyyy HH:mm" // Formato de fecha
    />

    const Producto = datosProductos?.map((f) => ({
        value: f.id,
        label: f.tipoProducto
    }));

    // Función para agregar un nuevo detalle a la nota de peso
    const agregarDetalle = () => {
        setDetalleId([...DetalleId, { pesada: "", cantidad: "", pesoBruto: "", tara: "" }]);
    };

    // Estado para el formulario de la nota de peso
    const [formularioNotaPeso, setFormularioNotaPeso] = useState({
        id: datosNotaPeso ? datosNotaPeso.id : null,
        fechaIngreso: datosNotaPeso ? new Date(datosNotaPeso.fechaIngreso) : new Date(),        
        clienteId: datosNotaPeso ? datosNotaPeso.clienteId : null,
        ProductoId: datosNotaPeso ? datosNotaPeso.ProductoId : null,
        estado: datosNotaPeso ? datosNotaPeso.estado : true,
    });    

    // Efecto para cargar los datos de la nota de peso cuando se monta el componente
    useEffect (() => {
        if(datosNotaPeso != null){
            buscarIdcliente(datosNotaPeso.clienteId);
            setProductoId(datosNotaPeso.ProductoId);
            setFormularioNotaPeso({
                ...formularioNotaPeso,
                ...datosNotaPeso,
                //fechaIngreso: moment(datosNotaPeso.fechaIngreso)
            });
        } else{
            limpiarCampos();
        }
        console.log("Fecha de ingreso:", formularioNotaPeso.fechaIngreso);
    },[]);

    // Efecto para cargar los datos de la nota de peso cuando se actualizan ciertos estados
    useEffect(() => {
        if(datosNotaPeso != null && !datosCargados) {
            buscarIdcliente(datosNotaPeso.clienteId);
            setProductoId(datosNotaPeso.ProductoId);
            setFormularioNotaPeso({
                ...formularioNotaPeso,
                ...datosNotaPeso
            });
            setDatosCargados(true);
        }
    }, [showModal, datosNotaPeso, datosCargados]);

    // Función para buscar el cliente por su ID
    const buscarIdcliente = (id) => {
        const clienteSeleccionado = listaClientes?.find(
            (f) => 
                f.id == id
        );
        if (clienteSeleccionado){
            setFormularioNotaPeso({
                ...formularioNotaPeso,
                clienteId: parseInt(id)
            });
            setNombreCliente(clienteSeleccionado.nombreprimer + ' ' + clienteSeleccionado.nombresegundo + ' ' + clienteSeleccionado.apellidoprimer + ' ' + clienteSeleccionado.apellidosegundo);
        }
        else {
            setFormularioNotaPeso({
                ...formularioNotaPeso,
                clienteId: null
            });
            setNombreCliente("Seleccione un cliente");
        }
    };

    // Efecto para actualizar el ProductoId en el formularioNotaPeso
    useEffect(() => {
        setFormularioNotaPeso({
            ...formularioNotaPeso,
            ProductoId: ProductoId
        })
    }, [fechaIngreso, ProductoId]);

    // Función para manejar el cambio de valores en los detalles de la nota de peso
    const handleChangeDetalle = (index, event) => {
        const { name, value } = event.target;
        const newDetalles = [...DetalleId]; // Copia del array detalles
        newDetalles[index][name] = value;
        // Recalcular los totales
        let totalPesoBruto = 0;
        let totalTara = 0;
        let totalPesoNeto = 0;
        newDetalles.forEach(detalle => {
            const pesoBruto = detalle.pesoBruto ? parseFloat(detalle.pesoBruto) : 0;
            const tara = detalle.tara ? parseFloat(detalle.tara) : 0;
            const pesoNeto = pesoBruto - tara;
            totalPesoBruto += pesoBruto;
            totalTara += tara;
            totalPesoNeto += pesoNeto;
        });

        setDetalleId(newDetalles);
        setTotales({ totalPesoBruto, totalTara, totalPesoNeto });
    };
    

    // Función para guardar una nueva nota de peso
    const saveNotaPeso = async () => {
        if (formularioNotaPeso.fechaIngreso === "") {
            setErrorFechaIngreso(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }
        setErrorFechaIngreso(false);

        //const fechaFormateada = formularioNotaPeso.fechaIngreso.format("YYYY-MM-DD");
        
        // Agregar detalles al formularioNotaPeso
        const formularioConDetalles = {
            ...formularioNotaPeso,
            //fechaIngreso: fechaFormateada,
            DetalleId: DetalleId // Suponiendo que DetalleId es la propiedad esperada por el servidor para los detalles
        };

        console.log("Fecha de ingreso:", formularioNotaPeso.fechaIngreso);

        try {
            console.log(formularioConDetalles);
            await AxiosPrivado
                .post(guardarNotaPeso, formularioConDetalles)
                .then((response) => {
                    console.log("Respuesta:", response.data);
                    if (response.data.tipo == 1) {
                        ActualizarTabla();
                        mostraAlerta(response.data.msj, "success");
                        limpiarCampos();
                    } else if (response.data.tipo === 0) {
                        for (let i = 0; i < response.data.msj.length; i++) {
                            response.data.msj.forEach((element) => {
                                console.log(element);
                                mostraAlerta("Ha ocurrido un error", "warning");
                            });
                        }
                    } else if (response.data.tipo === 2) {
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
    
    const handleDateChange = (date) => {
        setFechaIngreso(date); // Actualizar el estado de la fecha de compra cuando cambia
    };

    // Función para modificar una nota de peso existente
    const modificarNotaPeso =  async () => {
        if(formularioNotaPeso.fechaIngreso === ""){
            console.log("Por favor completar los campos");
            setErrorFechaIngreso(true);
            mostraAlerta("Escriba la fecha de entrada del producto", "warning");
            return;
        }
        setErrorFechaIngreso(false);

        AxiosPrivado
            .put(editarNotaPeso + formularioNotaPeso.id, formularioNotaPeso)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if(response.data.tipo === 1){
                    ActualizarTabla();
                    mostraAlerta(response.data.msj, "success");
                    handleClose();
                    limpiarCampos();
                }else if(response.data.tipo === 0){
                    response.data.msj.forEach((element) => {
                        console.log(element.campo + " " + element.msj);
                        mostraAlerta("El campo: " + element.campo + ", " + element.msj)
                    });
                }else if(response.data.tipo === 2){
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

    // Función para limpiar los campos del formulario
    const limpiarCampos = () => {
        setFormularioNotaPeso({
            id: "",
            fechaIngreso: new Date(),
            clienteId: null,
            ProductoId: null,
            estado: ""
        });
        setDetalleId([]);
        setNombreCliente("Seleccione un cliente");
        setProductoId(null);
    };

    const handleOpenModal = () => {
        setShowModalInformacion(true);
    };

    return (
        <>
            {accion ? (
                <div>
                    <Button variant="primary" onClick={handleShow}>
                        Crear Nota de Peso
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
                    <h4 className="modal-title text-primary">Formulario de Nota de Peso</h4>
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
                                    <div className="form-group col-md-5">
                                        <label htmlFor="fechaIngreso">Fecha de Ingreso</label>
                                        <DatePicker
                                            //type="date"
                                            className={`form-control ${errorFechaIngreso ? "is-invalid" : ""}`}
                                            selected={fechaIngreso}
                                            //value={formularioNotaPeso.fechaIngreso.format("YYYY-MM-DD")}
                                            onChange={date => setFechaIngreso(date)}
                                            dateFormat="dd/MM/yyyy HH:mm a" // Formato de fecha
                                            id="fechaIngreso"
                                            name="fechaIngreso"
                                        />
                                        {errorFechaIngreso && <div className="alert alert-danger">Este campo es obligatorio</div>}
                                    </div>
                                    <div className="col-sm-10">
                                        <div className="form-group">
                                            <label>Cliente</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Ej: 0123"
                                                    value={nombreCliente}
                                                    disabled
                                                />
                                                <BuscarCliente lista={listaClientes} buscarIdcliente={buscarIdcliente}></BuscarCliente>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">
                                                Tipo de Producto
                                            </label>
                                            <Select
                                                value={
                                                    ProductoId &&
                                                    Producto?.find(
                                                        (opcion) => 
                                                            opcion.value === ProductoId
                                                    )
                                                }
                                                onChange={(event) => {
                                                    setProductoId(event.value);
                                                }}
                                                options={Producto}
                                                isSearchable={true}
                                            ></Select>
                                        </div>
                                    </div>
                                </div> 
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Pesada</th>
                                                        <th>Cantidad</th>
                                                        <th>Peso Bruto</th>
                                                        <th>Tara</th>
                                                        <th>Peso Neto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {DetalleId.map((detalle, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Pesada"
                                                                    name="pesada"
                                                                    value={detalle.pesada}
                                                                    onChange={(e) => handleChangeDetalle(index, e)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Cantidad"
                                                                    name="cantidad"
                                                                    value={detalle.cantidad}
                                                                    onChange={(e) => handleChangeDetalle(index, e)}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Peso Bruto"
                                                                    name="pesoBruto"
                                                                    value={detalle.pesoBruto}
                                                                    onChange={(e) => handleChangeDetalle(index, e)}
                                                                />
                                                                <br/>
                                                                {index === DetalleId.length - 1 && <div> {totales.totalPesoBruto}</div>}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Tara"
                                                                    name="tara"
                                                                    value={detalle.tara}
                                                                    onChange={(e) => handleChangeDetalle(index, e)}
                                                                />
                                                                <br/>
                                                                {index === DetalleId.length - 1 && <div> {totales.totalTara}</div>}
                                                            </td>
                                                            <td>
                                                                <input type="" 
                                                                className="form-control"
                                                                value={detalle.pesoBruto && detalle.tara ? detalle.pesoBruto - detalle.tara : ''}
                                                                />
                                                                <br/>
                                                                {index === DetalleId.length - 1 && <div> {totales.totalPesoNeto}</div>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <Button variant="success" onClick={agregarDetalle}>Agregar Detalle</Button>
                                        </div>
                                    </div>
                                </div>   
                                <div className="col-sm-2">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">
                                            Estado
                                        </label>
                                        <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitch3"
                                                name="estado"
                                                checked={formularioNotaPeso.estado}
                                                onChange={(event) => {
                                                    setFormularioNotaPeso({
                                                        ...formularioNotaPeso,
                                                        estado: event.target.checked,
                                                    });
                                                }}
                                            />
                                            <label
                                                className="custom-control-label"
                                                htmlFor="customSwitch3"
                                            >
                                                {formularioNotaPeso.estado ? 'Deposito' : 'Pendiente'}
                                            </label>
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
                        <Button variant="primary" onClick={saveNotaPeso}>
                            Crear
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={modificarNotaPeso}>
                            Actualizar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <ModalInformacionNotaPeso datos={datosNotaPeso} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionNotaPeso>
        </>
    );
}

export default ModalNotaPesoForm;



