import React, { useContext, useEffect, useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Cargando from "../../components/Cargando";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../components/Alerts/sweetAlert";
import { Link } from "react-router-dom";
import Select from "react-select";
import { AxiosImagen, AxiosPrivado } from "../../components/axios/Axios";
import { Button, Modal } from "react-bootstrap";
import {
    guardarProyectos,
    editarProyectos,
    proyectoEditarImagen,
    imagenProyecto,
    listarLugares,
} from "../../components/apiUrls";
import BuscarLugar from "../../components/modals/lugares/BuscarLugar";
import { useContextInmobiliario } from "../../contexto/inmobiliario/InmobiliarioContext";
const ProyectoNuevo = () => {
    const { listaLugares } = useContextInmobiliario();
    const [errorNombre, setErrorNombre] = useState(false);
    const [nombreLugar, setNombreLugar] = useState("Selecione un lugar");
    const [errorLugar, setErrorLugar] = useState(false);
    const [ActulizarImagen, setActualizarImagen] = useState(false);
    const [formularioProyecto, setFormularioProyecto] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        lugarId: null,
        activo: true,
        Imagen: "proyectos.jpg",
    });

    const saveProyecto = async () => {
        const regex = /^[a-zA-Z]+$/;
        // Validar campos vacíos

        if (formularioProyecto.nombre == "") {
            mostraAlerta("Escriba el nombre del proyecto", "warning");
            setErrorNombre(true);
            return;
        }
        if ((formularioProyecto.nombre.length < 3)) {
            setErrorNombre(true);
            mostraAlerta(
                "El campo nombre debe contener como minimo 3 letras",
                "warning"
            );
            return;
        }
        if (formularioProyecto.lugarId == null) {
            mostraAlerta("Escriba el lugar", "warning");
            setErrorLugar(true);
            return;
        }

        setErrorNombre(false);
        setErrorLugar(false);
        try {
            await AxiosPrivado
                .post(guardarProyectos, formularioProyecto)
                .then((response) => {
                    console.log("Respuesta:", response.data);
                    if (response.data.tipo == 1) {
                        mostraAlerta(response.data.msj, "success");
                        limpiarCampos()
                    } else if (response.data.tipo === 0) {
                        for (let i = 0; i < response.data.msj.length; i++) {
                            response.data.msj.forEach((element) => {
                                console.log(element);
                                mostraAlerta(element.msj, "warning");
                            });
                        }
                    } else if (response.data.tipo === 2) {
                        response.data.msj.forEach((element) => {
                            console.log(element.campo + " " + element.msj);
                            mostraAlerta("El campo : " + element.campo + ", " + element.msj);
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    mostraAlerta("Error al momento de guardar", "error");
                });

            //fetchData();
        } catch (error) {
            console.error("Error:", error);
            mostraAlerta(error, "error");
        }
    };
    const manejadorProyecto = (event) => {
        setFormularioProyecto({
            ...formularioProyecto,
            [event.target.name]: event.target.value,
        });
    };


    const modificarProyecto = () => {
        const regex = /^[a-zA-Z]+$/;
        // Validar campos vacíos
        if (formularioProyecto.id === null) {
            mostraAlerta("Debe seleccionar un proyecto", "warning");
            return;
        }
        if (formularioProyecto.nombre == "") {
            mostraAlerta("Escriba el nombre del proyecto", "warning");
            setErrorNombre(true);
            return;
        }
        if ((formularioProyecto.nombre.length < 3)) {
            setErrorNombre(true);
            mostraAlerta(
                "El campo nombre debe contener como minimo 3 letras",
                "warning"
            );
            return;
        }
        if (formularioProyecto.lugarId == null) {
            mostraAlerta("Selecione un lugar", "warning");
            setErrorLugar(true);
            return;
        }

        setErrorNombre(false);
        setErrorLugar(false);
        AxiosPrivado
            .put(editarProyectos + formularioProyecto.id, formularioProyecto)
            .then((response) => {
                console.log("Respuesta:", response.data);
                if (response.data.tipo === 1) {
                    mostraAlerta(response.data.msj, "success");
                } else if (response.data.tipo === 0) {
                    mostraAlerta(response.data.msj);
                } else if (response.data.tipo === 2) {
                    mostraAlerta(response.data.msj);
                }
                //fetchData();
            })
            .catch((error) => {
                // Ha ocurrido un error,
                console.error("Error:", error);
                mostraAlerta(error);
            });


    };

    const limpiarCampos = () => {
        setErrorNombre(false);
        setFormularioProyecto({
            id: null,
            nombre: "",
            descripcion: "",
            lugarId: null,
            activo: true,
            Imagen: "proyectos.jpg",
        });
    };

    const inputRef = useRef(null);

    const SeleccionarImagen = () => {
        // 👇️ open file input box on click of another element
        inputRef.current.click();
    };

    const handleFileChange = async event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        else {
            try {
                let formData = new FormData();
                formData.append('imagen', event.target.files[0]);
                const respuesta = await AxiosImagen.put(proyectoEditarImagen + formularioProyecto.id,
                    formData,
                );
                if (respuesta.data.tipo === 1) {
                    formularioProyecto.Imagen = respuesta.data.datos.Imagen;
                    mostraAlertaOk(respuesta.data.msj);
                }
            } catch (error) {
                console.log(error);
                mostraAlertaError("Error al actualizar la imagen");
            }
        }
    };
    const buscarIdlugarInicial = (id) => {
        const lugarSeleccionado = listaLugares?.find(
            (f) =>
                f.id == id
        );

        if (lugarSeleccionado) {
            setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
        }
        else {
            setNombreLugar("Seleccione un lugar");
        }
    };
    const buscarIdlugar = (id) => {
        const lugarSeleccionado = listaLugares?.find(
            (f) =>
                f.id == id
        );

        if (lugarSeleccionado) {
            setFormularioProyecto({
                ...formularioProyecto,
                lugarId: id
            });
            setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
        }
        else {
            setFormularioProyecto({
                ...formularioProyecto,
                lugarId: 0
            });
            setNombreLugar("Seleccione un lugar");
        }
    };
    return (
        <React.StrictMode>

            <Header></Header>
            <SideNav />

            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Nuevo Proyecto</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/app/inmobiliario/proyecto">Proyectos</Link></li>
                                    <li className="breadcrumb-item active">Nuevo Proyecto</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card card-primary card-outline">
                            <div className="card-header">
                                <h3 className="card-title">Datos del proyecto</h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <div className="text-center">
                                                <img className="product-image" src={imagenProyecto + "proyectos.jpg"} alt="Foto" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="exampleInputEmail1">Nombre</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errorNombre ? "is-invalid" : ""
                                                        }`}
                                                    id="text"
                                                    placeholder="Ingrese el nombre"
                                                    name="nombre"
                                                    value={formularioProyecto.nombre}
                                                    onChange={manejadorProyecto}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-sm-12">
                                                <label htmlFor="descripcion">Descripción</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    placeholder="Descripción del proyecto"
                                                    name="descripcion"
                                                    value={formularioProyecto.descripcion}
                                                    onChange={manejadorProyecto}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-10">
                                        <label>Lugar</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Ej: 0123"
                                                value={nombreLugar}
                                                disabled
                                            />
                                            <BuscarLugar lista={listaLugares} buscarIdlugar={buscarIdlugar}></BuscarLugar>
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
                                                    name="activo"
                                                    checked={formularioProyecto.activo}
                                                    onChange={(event) => {
                                                        setFormularioProyecto({
                                                            ...formularioProyecto,
                                                            activo: event.target.checked,
                                                        });
                                                    }}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="customSwitch3"
                                                >
                                                    {formularioProyecto.activo ? 'Activo' : 'Inactivo'}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">

                                <span style={{ margin: "0 12px" }}></span>
                                <Button variant="warning" onClick={limpiarCampos}>
                                    Limpiar Campos
                                </Button>
                                <span style={{ margin: "0 12px" }}></span>
                                <Button variant="primary" onClick={saveProyecto}>
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </React.StrictMode>
    );
}

export default ProyectoNuevo;