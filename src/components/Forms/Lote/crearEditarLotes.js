import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "admin-lte/dist/css/adminlte.min.css";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  buscarIdLotes,
  editarLotes,
  guardarLotes,
  listarBloques,
  listarEtapas,
  listarProyectos,
  listarEtapaId,
  listarBloquesBloqueid,
} from "../../apiUrls";
import axios from "axios";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import { DataContext } from "../../context/DataContextLotes";
import { set } from "date-fns";
import InputMask from "react-input-mask";
import { da } from "date-fns/locale";
function CrearEditarLotes({ datosDelLote }) {
  const [bloques, setBloques] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [bloquesLista, setBloquesLista] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const [errorValor, serErrorValor] = useState(false);
  const [errorPrima, setErrorPrima] = useState(false);
  const [errorProyecto, setErrorProyecto] = useState(false);
  const [errorEtapa, setErrorEtapa] = useState(false);
  const [errorBloque, setErrorBloque] = useState(false);
  const { errores, setErrores } = useState([]);
  const [accion, setAccion] = useState();
  const { id } = useParams();

  const EstadosLotes = [
    {
      value: 1,
      label: "Vendido",
    },
    {
      value: 2,
      label: "Disponible",
    },
    {
      value: 3,
      label: "Reservado",
    },
    {
      value: 4,
      label: "Bloqueado",
    },
  ];

  const {
    lotesArray,
    setLotesArray,
    lotesLista,
    setLotesLista,
    lotesAccion,
    setLotesAccion,
    lotesModificar,
    setLotesModificar,
  } = useContext(DataContext);
  const navigate = useNavigate();

  let respuestaFormateada = [];

  const TraerSoloLote = async (id) => {
    if (id != null && id != 0) {
      try {
        setAccion(false);
        const response = await axios
          .get(buscarIdLotes + id)
          .then((response) => {
            // Obtener los datos de la respuesta
            const data = response.data;
            // Transformar los datos de la API en el formato requerido por react-select
            setFormularioLote({
              id: data.datos.id,
              nombre: data.datos.nombre,
              descripcion: data.datos.descripcion,
              valor: data.datos.valor,
              prima: data.datos.prima,
              estado: data.datos.estado,
              salario: data.datos.salario,
              activo: data.datos.activo,
              proyectoId: data.datos.proyectoId,
              etapaId: data.datos.etapaId,
              bloqueId: data.datos.bloqueId,
            });

            console.log(formularioLote);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setAccion(true);
      setFormularioLote({
        id: null,
        nombre: "",
        descripcion: "",
        valor: 0,
        prima: 0,
        estado: 2,
        salario: 0,
        activo: true,
        proyectoId: "",
        etapaId: "",
        bloqueId: "",
      });
    }
  };

  const TraerBloques = async (id) => {
    try {
      const response = await axios
        .get(listarBloquesBloqueid + id)
        .then((response) => {
          // Obtener los datos de la respuesta
          const data = response.data;

          const formattedOptions = data.datos.map((item) => ({
            value: item.id,
            label: item.nombre,
          }));
          setBloques(formattedOptions);
          console.log(bloques);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const TraerProyectos = async () => {
    try {
      const response = await axios.get(listarProyectos).then((response) => {
        // Obtener los datos de la respuesta
        const data = response.data;

        const formattedOptions = data.datos.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setProyectos(formattedOptions);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const TraerEtapas = async () => {
    try {
      const response = await axios.get(listarEtapas).then((response) => {
        // Obtener los datos de la respuesta
        const data = response.data;

        // Transformar los datos de la API en el formato requerido por react-select
        const formattedOptions = data.datos.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));

        setEtapas(formattedOptions);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [formularioLote, setFormularioLote] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    valor: 0,
    prima: 0,
    estado: 2,
    salario: 0,
    activo: true,
    proyectoId: "",
    etapaId: "",
    bloqueId: "",
  });

  useEffect(() => {
    if (lotesModificar != null) {
    } else {
    }
  }, []);

  const manejadorLotes = (event) => {
    setFormularioLote({
      ...formularioLote,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    TraerProyectos();
    TraerSoloLote(id);
  }, []);
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  const limpiarCampos = () => {
    setFormularioLote({
      id: null,
      nombre: "",
      descripcion: "",
      valor: 0,
      prima: 0,
      estado: "",
      salario: 0,
      activo: true,
      proyectoId: "",
      etapaId: "",
      bloqueId: "",
      // Reinicia los demás campos a su valor inicial
    });
  };

  const limpiarTodosLosCampos = (event) => {
    event.preventDefault();
    setFormularioLote({
      id: null,
      nombre: "",
      descripcion: "",
      valor: 0,
      prima: 0,
      estado: "",
      salario: 0,
      activo: true,
      proyectoId: "",
      etapaId: "",
      bloqueId: "",
      // Reinicia los demás campos a su valor inicial
    });
  };
  const filtlarEtapas = async (id) => {
    try {
      const response = await axios.get(listarEtapaId + id);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));
      setEtapas(formattedOptions);
    } catch (error) {}
  };
  const filtlarBloques = async (id) => {
    console.log("este es el " + id);
    try {
      const response = await axios.get(listarBloquesBloqueid + id);
      const data = response.data;

      if (data.datos.length >= 2) {
        const formattedOptions = data.datos.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));
        setBloques(formattedOptions);
      } else {
        const formattedOptions = [
          {
            value: data.datos.id,
            label: data.datos.nombre,
          },
        ];

        setBloques(formattedOptions);
      }

      console.log(bloques);
    } catch (error) {}
  };
  const saveLote = async (event) => {
    event.preventDefault();
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioLote.nombre === "") {
      console.log("Por favor, complete todos los campos");
      setErrorNombre(true);
      mostraAlerta("Por favor, complete el campo Nombre", "warning");
      return;
    }

    if (formularioLote.descripcion === "") {
      console.log("Por favor, revise los datos de descripcion");
      serErrorValor(true);
      mostraAlerta("Por favor, revise los datos de descripcion", "warning");
      return;
    }
    if (formularioLote.valor === "") {
      console.log("Por favor, revise los datos de Valor");
      setErrorPrima(true);
      mostraAlerta("Por favor, revise los datos de  Valor", "warning");
      return;
    }
    if (formularioLote.prima === "") {
      console.log("Por favor, revise los datos de Prima");
      setErrorProyecto(true);
      mostraAlerta("Por favor, revise los datos de Prima", "warning");
      return;
    }
    if (formularioLote.estado === "") {
      console.log("Por favor, Agregue un Estado");
      setErrorEtapa(true);
      mostraAlerta("Por favor, Agregue un Estado", "warning");
      return;
    }
    if (formularioLote.proyectoId === "") {
      console.log("Por favor, seleccione un Proyecto");
      setErrorEtapa(true);
      mostraAlerta("Por favor, seleccione un Proyecto", "warning");
      return;
    }
    // if (!/^\d+$/.test(formularioLote.salario)) {
    //   console.log("Por favor, ingrese solo números en el campo salario");
    //   setErrorDescripcion(true);
    //   mostraAlerta("Por favor, ingrese solo números en el campo salario", 'warning');
    //   return;
    // }

    setErrorNombre(false);
    setErrorDescripcion(false);
    setErrorPrima(false);
    serErrorValor(false);
    setErrorProyecto(false);
    setErrorEtapa(false);
    try {
      await axios
        .post(guardarLotes, formularioLote)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioLote);
          } else if (response.data.tipo == 0) {
            if (response.data.msj.length > 3) {
              for (let i = 0; i < response.data.msj.length; i++) {
                response.data.msj.forEach((element) => {
                  console.log(element);
                  mostraAlerta(element);
                });
              }
            } else {
              mostraAlerta(response.data.msj);
            }
          } else if (response.data.tipo == 2) {
            response.data.msj.forEach((element) => {
              console.log(element.campo + " " + element.msj);
              mostraAlerta("El campo : " + element.campo + ", " + element.msj);
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          mostraAlerta(error, "error");
        });

      navigate("/app/lotes");
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }

    return false;
  };

  const modificarLote = (event) => {
    event.preventDefault();
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioLote.nombre === "") {
      console.log("Por favor, complete todos los campos");
      setErrorNombre(true);
      mostraAlerta("Por favor, complete el campo Nombre", "warning");
      return;
    }

    if (formularioLote.descripcion === "") {
      console.log("Por favor, revise los datos de descripcion");
      serErrorValor(true);
      mostraAlerta("Por favor, revise los datos de descripcion", "warning");
      return;
    }
    if (formularioLote.valor === "") {
      console.log("Por favor, revise los datos de Valor");
      setErrorPrima(true);
      mostraAlerta("Por favor, revise los datos de  Valor", "warning");
      return;
    }
    if (formularioLote.prima === "") {
      console.log("Por favor, revise los datos de Prima");
      setErrorProyecto(true);
      mostraAlerta("Por favor, revise los datos de Prima", "warning");
      return;
    }
    if (formularioLote.estado === "") {
      console.log("Por favor, Agregue un Estado");
      setErrorEtapa(true);
      mostraAlerta("Por favor, Agregue un Estado", "warning");
      return;
    }
    if (formularioLote.proyectoId === "") {
      console.log("Por favor, seleccione un Cargo");
      setErrorEtapa(true);
      mostraAlerta("Por favor, seleccione un Cargo", "warning");
      return;
    }

    axios
      .put(editarLotes + formularioLote.id, formularioLote)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo == 1) {
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo == 0) {
          for (let i = 0; i < response.data.msj.length; i++) {
            response.data.msj.forEach((element) => {
              console.log(element);
              mostraAlerta(element);
            });
          }
        } else if (response.data.tipo == 2) {
          response.data.msj.forEach((element) => {
            console.log(element.campo + " " + element.msj);
            mostraAlerta("El campo : " + element.campo + ", " + element.msj);
          });
        }
        navigate("/app/lotes");
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });
  };

  const volver = (event) => {
    event.preventDefault();
    navigate("/app/lotes");
  };
  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Formulario de Lote</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Lote</a>
                  </li>
                  <li className="breadcrumb-item active">Formulario de Lote</li>
                </ol>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>

        <section className="container ">
          <div className="container  ">
            <div className="row justify-content-center">
              {/* left column */}
              <div className="col-xl-10">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    {accion ? (
                      <h3 className="card-title">
                        Ingrese la informacion del Lote
                      </h3>
                    ) : (
                      <h3 className="card-title card-info">
                        Actualice la informacion del Lote
                      </h3>
                    )}
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Nombre</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errorNombre ? "is-invalid" : ""
                              }`}
                              id="text"
                              placeholder="Ingrese el Nombre del lote"
                              name="nombre"
                              value={formularioLote.nombre}
                              onChange={manejadorLotes}
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">
                              Descripcion
                            </label>
                            <input
                              type="text"
                              className={`form-control ${
                                errorDescripcion ? "is-invalid" : ""
                              }`}
                              placeholder="Ingrese la descripcion"
                              name="descripcion"
                              value={formularioLote.descripcion}
                              onChange={manejadorLotes}
                            />
                          </div>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Valor</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errorValor ? "is-invalid" : ""
                              }`}
                              id="text"
                              placeholder="Ingrese el valor"
                              name="valor"
                              value={formularioLote.valor}
                              onChange={manejadorLotes}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">prima</label>
                            <InputMask
                              type="text"
                              className={`form-control ${
                                errorPrima ? "is-invalid" : ""
                              }`}
                              id="text"
                              placeholder="Ingrese la prima"
                              name="prima"
                              value={formularioLote.prima}
                              onChange={manejadorLotes}
                             
                              maskChar=""
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Estado</label>
                            <Select
                              value={
                                formularioLote.estado &&
                                EstadosLotes.find(
                                  (opcion) =>
                                    opcion.value === formularioLote.estado
                                )
                              }
                              onChange={(event) => {
                                setFormularioLote({
                                  ...formularioLote,
                                  estado: event.value,
                                });
                              }}
                              options={EstadosLotes}
                              isSearchable={true}
                            ></Select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Activo</label>
                            <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                              <span style={{ margin: "0 30px" }}></span>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customSwitch3"
                                name="activo"
                                checked={formularioLote.activo}
                                onChange={(event) => {
                                  setFormularioLote({
                                    ...formularioLote,
                                    activo: event.target.checked,
                                  });
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customSwitch3"
                              ></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Proyecto</label>
                            <Select
                              value={
                                formularioLote.proyectoId &&
                                proyectos.find(
                                  (opcion) =>
                                    opcion.value === formularioLote.proyectoId
                                )
                              }
                              onChange={(event) => {
                                filtlarEtapas(event.value);
                                setFormularioLote({
                                  ...formularioLote,
                                  proyectoId: event.value,
                                });
                              }}
                              options={proyectos}
                              isSearchable={true}
                            ></Select>
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Etapa</label>
                            <Select
                              value={
                                formularioLote &&
                                etapas.find(
                                  (opcion) => opcion.value === formularioLote
                                )
                              }
                              onChange={(event) => {
                                filtlarBloques(event.value);
                                setFormularioLote({
                                  ...formularioLote,
                                  etapaId: event.value,
                                });
                              }}
                              options={etapas}
                              isSearchable={true}
                            />
                          </div>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group">
                            <label>Seleccione El Bloque</label>
                            <Select
                              value={
                                formularioLote.bloqueId &&
                                bloques.find(
                                  (opcion) =>
                                    opcion.value === formularioLote.bloqueId
                                )
                              }
                              onChange={(selectedOption) => {
                                setFormularioLote({
                                  ...formularioLote,
                                  bloqueId: selectedOption.value,
                                });
                              }}
                              options={bloques}
                              isSearchable={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer justify-content-center">
                      {accion ? (
                        <button className="btn btn-primary" onClick={saveLote}>
                          Crear
                        </button>
                      ) : (
                        <button
                          className="btn btn-info"
                          onClick={modificarLote}
                        >
                          Modificar
                        </button>
                      )}
                      <span style={{ margin: "0 12px" }}></span>
                      {accion ? (
                        <button
                          className="btn btn-secondary"
                          onClick={limpiarTodosLosCampos}
                        >
                          Limpiar
                        </button>
                      ) : (
                        <></>
                      )}
                      <span style={{ margin: "0 12px" }}></span>
                      <button className="btn btn-success" onClick={volver}>
                        volver
                      </button>
                    </div>
                    {/* /.card-body */}
                  </form>
                </div>
              </div>
              <div></div>
              {/*/.col (right) */}
            </div>
            {/* /.row */}
          </div>
          <div></div>
          {/* /.container-fluid */}
        </section>
      </div>
    </div>
  );
}

export default CrearEditarLotes;
