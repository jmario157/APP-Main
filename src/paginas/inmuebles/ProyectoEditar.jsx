import React, { useContext, useEffect, useState, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../components/Alerts/sweetAlert";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import Proyecto from "./Proyectos";
const ProyectoEditar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { listaLugares, listaProyectos, ActualizarProyectos } = useContextInmobiliario();
    const [errorNombre, setErrorNombre] = useState(false);
    const [nombreLugar, setNombreLugar] = useState("Selecione un lugar");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [Imagen, setImagen] = useState("");
    const [urlImagen, setUrlImagen] = useState(imagenProyecto+"proyectos.jpg");
    const [lugarId, setLugarId] = useState(null);
    const [idProyecto, setIdProyecto] = useState("");
    const [activo, setActivo] = useState(1);
    const [errorLugar, setErrorLugar] = useState(false);
    const [proyecto, setProyecto] = useState(null);
    const [formularioProyecto, setFormularioProyecto] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        lugarId: null,
        activo: true,
        Imagen: "proyectos.jpg",
    });
    useEffect(() => {
        try {
            const buscarProyecto = listaProyectos?.find((f) => f.id == id);
            setIdProyecto(buscarProyecto.id);
            setNombre(buscarProyecto.nombre);
            setDescripcion(buscarProyecto.descripcion);
            setActivo(buscarProyecto.activo);
            setLugarId(buscarProyecto?.lugarId);
            setImagen(buscarProyecto?.Imagen);
            buscarIdlugar(buscarProyecto?.lugarId);
        } catch (error) {
            console.log(error);
            navigate("/app/inmobiliario/proyecto")
        }
    }, []);
    useEffect(()=>{
        setUrlImagen(imagenProyecto+Imagen);
    },[Imagen])
    const modificarProyecto = () => {
        const regex = /^[a-zA-Z]+$/;
        // Validar campos vacíos
        console.log(idProyecto);
        if (idProyecto === null) {
            mostraAlerta("Debe seleccionar un proyecto", "warning");
            return;
        }
        if (nombre == "") {
            mostraAlerta("Escriba el nombre del proyecto", "warning");
            setErrorNombre(true);
            return;
        }
        if ((nombre.length < 3)) {
            setErrorNombre(true);
            mostraAlerta(
                "El campo nombre debe contener como minimo 3 letras",
                "warning"
            );
            return;
        }
        if (lugarId == null) {
            mostraAlerta("Selecione un lugar", "warning");
            setErrorLugar(true);
            return;
        }

        setErrorNombre(false);
        setErrorLugar(false);
        AxiosPrivado
            .put(editarProyectos + idProyecto, {
                id: parseInt(idProyecto),
                nombre,
                descripcion,
                lugarId,
                activo
            })
            .then((response) => {
                console.log("Respuesta:", response.data);
                if (response.data.tipo === 1) {
                    ActualizarProyectos();
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
        setNombre("");
        setDescripcion("");
        setLugarId(null);
        setActivo(true);
        setIdProyecto(null);
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
        else if(idProyecto==null){
            mostraAlertaWarning("Debe seleccionar el proyecto");
        }
        else {
            try {
                let formData = new FormData();
                formData.append('imagen', event.target.files[0]);
                const respuesta = await AxiosImagen.put(proyectoEditarImagen + idProyecto,
                    formData,
                );
                if (respuesta.data.tipo === 1) {
                    setImagen(respuesta.data.datos.Imagen);
                    mostraAlertaOk(respuesta.data.msj);
                }
            } catch (error) {
                console.log(error);
                mostraAlertaError("Error al actualizar la imagen");
            }
        }
    };
    const buscarIdlugar = (id) => {
        const lugarSeleccionado = listaLugares?.find(
            (f) =>
                f.id == id
        );

        if (lugarSeleccionado) {
            setProyecto({
                ...proyecto,
                lugarId: id
            });
            setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre);
        }
        else {
            setProyecto({
                ...proyecto,
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
                                <h1>Proyectos</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="/app/inmobiliario/proyecto">Proyectos</Link></li>
                                    <li className="breadcrumb-item active">Editar Proyecto</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card card-primary card-outline">
                            <div className="card-header">
                                <h3 className="card-title">Editar Proyecto</h3>
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
                                                <img className="product-image" src={urlImagen} alt="Foto" />
                                            </div>

                                            <input
                                                style={{ display: 'none' }}
                                                ref={inputRef}
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <Button variant="light" className="btn btn-block btn-outline-info btn-xs" onClick={SeleccionarImagen}>Actualizar</Button>
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
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
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
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
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
                                                    checked={activo}
                                                    onChange={(event) => {
                                                        setActivo(event.target.checked);
                                                    }}
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="customSwitch3"
                                                >
                                                    {activo ? 'Activo' : 'Inactivo'}
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
                                <Button variant="info" onClick={modificarProyecto}>
                                    Modificar
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

export default ProyectoEditar;