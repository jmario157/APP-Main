import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { mostraAlerta } from "../../Alerts/sweetAlert";
import { DataContextClientes } from "../../context/DataContextClientes";
import {
  listarEmpleado,
  listarClientes,
  guardarClientes,
  editarClientes,
} from "../../apiUrls";
function ModalUsuarioForm({ accion, datosUsuario }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [clientes, setClientes] = useState([]);
  const [empleado, setEmpleado] = useState([]);

  const { clienteLista, setClientesLista, clientesArray, setClientesArray } =
    useContext(DataContextClientes);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const [errorPrimerNombre, setErrorPrimerNombre] = useState(false);
  const [errorSalario, setErrorSalario] = useState(false);
  const [errorSegundoNombre, setErrorSegundoNombre] = useState(false);
  const [errorPrimerApellido, setErrorPrimerApellido] = useState(false);
  const [errorSegundoApellido, setErrorSegundoApellido] = useState(false);
  const [errorLogin, setErrorIdentidad] = useState(false);
  const [errorCargo, setErrorCargo] = useState(false);
  const { errores, setErrores } = useState([]);
  const telefonos = datosUsuario?.numeros || [];
  const telefonosFormateados = telefonos.map((telefono) => {
    return { numero: telefono.numero };
  });
  const EstadosUsuarios = [
    {
      value: 1,
      label: "Activo",
    },
    {
      value: 2,
      label: "Inactivo",
    },
    {
      value: 3,
      label: "Bloqueado",
    },
  ];


  const [formularioUsuario, setFormularioUsuario] = useState({
    id: null,
    login: "",
    correo: "",
    gmail: "",
    facebook: "",
    contrasena: "",
    logueado: "",
    activo: true,
    estado: "",
    empleadoId: "",
    usuarioaccesos: [{ numero: "" }],
  });
  useEffect(() => {
    traerEmpleados();
    if (datosUsuario != null) {
      setFormularioUsuario({
        id: datosUsuario.id,
       login: datosUsuario.login,
       correo: datosUsuario.correo,
       gmail: datosUsuario.gmail,
       facebook: datosUsuario.facebook,
       contrasena: datosUsuario.contrasena,
       logueado: datosUsuario.logueado,
       activo: datosUsuario.activo,
       estado: datosUsuario.estado,
       empleadoId: datosUsuario.empleadoId,
       usuarioaccesos: [{ numero: "" }],
      });
    } else {
      setFormularioUsuario({
        id: null,
        login: "",
        correo: "",
        gmail: "",
        facebook: "",
        contrasena: "",
        logueado: "",
        activo: true,
        estado: "",
        empleadoId: "",
        usuarioaccesos: [{ numero: "" }],
      });
    }
  }, [datosUsuario]);
  const fetchData = async () => {
    try {
      const response = await axios.get(listarClientes);
      setClientesLista(response.data);

      setClientes([]);
      response.data.datos.forEach((element) => {
        clientes.push(element);
      });

      setClientesArray(clientes);
    } catch (error) {
      console.log(error);
    }
  };



  const saveClientes = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos

    if (
      (formularioUsuario.identidad,
      formularioUsuario.nombreprimer,
      formularioUsuario.nombresegundo,
      formularioUsuario.apellidoprimer === "")
    ) {
      mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
      setErrorPrimerNombre(true);
      setErrorSegundoNombre(true);
      setErrorPrimerApellido(true);
      setErrorSegundoApellido(true);
      setErrorIdentidad(true);
      return;
    }
    if (formularioUsuario.identidad === "") {
      console.log("Por favor, complete todos los campos");
      setErrorIdentidad(true);
      mostraAlerta("Por favor, complete todos los campos", "warning");
      return;
    }

    const identidadPattern = /^\d{13}$/;
    if (!identidadPattern.test(formularioUsuario.identidad)) {
      console.log("El número de identidad debe tener 13 dígitos");
      setErrorIdentidad(true);
      mostraAlerta("El número de identidad debe tener 13 dígitos", "warning");
      return;
    }
    if (!regex.test(formularioUsuario.nombreprimer)) {
      console.log("El campo primernombre solo debe contener letras");
      setErrorPrimerNombre(true);
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (
      formularioUsuario.nombresegundo === "" ||
      !regex.test(formularioUsuario.nombresegundo)
    ) {
      console.log("Por favor, revise los datos de Segundo Nombre");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise los datos de Segundo Nombre", "warning");
      return;
    }
    if (
      formularioUsuario.apellidoprimer === "" ||
      !regex.test(formularioUsuario.apellidoprimer)
    ) {
      console.log("Por favor, revise los datos de Primer Apellido");
      setErrorPrimerApellido(true);
      mostraAlerta(
        "Por favor, revise los datos de Primero Apellido",
        "warning"
      );
      return;
    }

    setErrorPrimerNombre(false);
    setErrorSalario(false);
    setErrorPrimerApellido(false);
    setErrorSegundoNombre(false);
    setErrorSegundoApellido(false);
    setErrorIdentidad(false);
    try {
      await axios
        .post(guardarClientes, formularioUsuario)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo === 1) {
            mostraAlerta(response.data.msj, "success");
            limpiarCampos(setFormularioUsuario);
          } else if (response.data.tipo === 0) {
            for (let i = 0; i < response.data.msj.length; i++) {
              response.data.msj.forEach((element) => {
                console.log(element);
                mostraAlerta("ha ocurrido un error", "warning");
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
          mostraAlerta(error, "comuniquese con el administrador");
        });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador", "danger");
    }
  };
  const manejadorClientes = (event) => {
    setFormularioUsuario({
      ...formularioUsuario,
      [event.target.name]: event.target.value,
    });
  };

  const manejarCambioNumeros = (index, value) => {
    const nuevosNumeros = [...formularioUsuario.numeros];
    nuevosNumeros[index] = { numero: value };

    setFormularioUsuario({
      ...formularioUsuario,
      numeros: nuevosNumeros,
    });
  };

  const agregarNumero = () => {
    setFormularioUsuario({
      ...formularioUsuario,
      numeros: [...formularioUsuario.numeros, { numero: "" }],
    });
  };

  const modificarCliente = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioUsuario.identidad === "") {
      console.log("Por favor, complete todos los campos");
      setErrorPrimerNombre(true);
      mostraAlerta("Por favor, complete todos los campos", "warning");
      return;
    }
    if (!regex.test(formularioUsuario.nombreprimer)) {
      console.log("El campo primernombre solo debe contener letras");
      setErrorPrimerNombre(true);
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (
      formularioUsuario.nombresegundo === "" ||
      !regex.test(formularioUsuario.nombresegundo)
    ) {
      console.log("Por favor, revise los datos de Segundo Nombre");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise los datos de Segundo Nombre", "warning");
      return;
    }
    if (
      formularioUsuario.apellidoprimer === "" ||
      !regex.test(formularioUsuario.apellidoprimer)
    ) {
      console.log("Por favor, revise los datos de Primer Apellido");
      setErrorPrimerApellido(true);
      mostraAlerta(
        "Por favor, revise los datos de Primero Apellido",
        "warning"
      );
      return;
    }

    setErrorPrimerNombre(false);
    setErrorSalario(false);
    setErrorPrimerApellido(false);
    setErrorSegundoNombre(false);
    setErrorSegundoApellido(false);
    setErrorIdentidad(false);

    axios
      .put(editarClientes + formularioUsuario.id, formularioUsuario)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          mostraAlerta(response.data.msj, "success");
        } else if (response.data.tipo === 0) {
          mostraAlerta(response.data.msj);
        } else if (response.data.tipo === 2) {
          mostraAlerta(response.data.msj);
        }
        fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        mostraAlerta(error);
      });
  };

  const limpiarCampos = (setFormularioUsuario) => {
    setErrorPrimerNombre(false);
    setErrorSegundoNombre(false);
    setErrorPrimerApellido(false);
    setErrorSegundoApellido(false);

    setErrorIdentidad(false);
    setFormularioUsuario({
      id: null,
      identidad: "",
      nombreprimer: "",
      nombresegundo: "",
      apellidoprimer: "",
      apellidosegundo: "",
      direccion: "",
      activo: true,
      Imagen:
        "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
      numeros: [{ numero: "" }],
    });
  };

  const limpiarBien = () => {
    setErrorPrimerNombre(false);
    setErrorSegundoNombre(false);
    setErrorPrimerApellido(false);
    setErrorSegundoApellido(false);

    setErrorIdentidad(false);
    setFormularioUsuario({
      id: null,
      identidad: "",
      nombreprimer: "",
      nombresegundo: "",
      apellidoprimer: "",
      apellidosegundo: "",
      direccion: "",
      activo: true,
      Imagen:
        "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
      numeros: [{ numero: "" }],
    });
  };

  const traerEmpleados = async () => {
    try {
      const response = await axios.get(listarEmpleado);
      const data = response.data;
      const formattedOptions = data.datos.map((item) => ({
        value: item.id,
        label: item.primernombre + " " + item.primerapellido,
      }));
      setEmpleado(formattedOptions);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {accion ? (
        <Button variant="primary" onClick={handleShow}>
          Crear Usuario
        </Button>
      ) : (
        <Button variant="warning" onClick={handleShow}>
          Modificar
        </Button>
      )}

      <Modal show={showModal} onHide={handleClose} className="custom-modal">
        <div className="modal-content modal-xl">
          <div className="modal-header modal-primary">
            <h4 className="modal-title text-primary">Formulario de Usuario</h4>
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
          <div className="modal-body">
            <p>Ingrese la información del Usuario</p>
            <form>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorLogin ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="Ingrese el usuario"
                        name="login"
                        value={formularioUsuario.identidad}
                        onChange={manejadorClientes}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Seleccione el Empleado
                      </label>
                      <Select
                        value={
                          formularioUsuario.empleadoId &&
                          empleado.find(
                            (opcion) =>
                              opcion.value === formularioUsuario.empleadoId
                          )
                        }
                        onChange={(event) => {
                          setFormularioUsuario({
                            ...formularioUsuario,
                            empleadoId: event.value,
                          });
                        }}
                        options={empleado}
                        isSearchable={true}
                      ></Select>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Email</label>
                      <input
                        type="email"
                        className={`form-control ${
                          errorSegundoNombre ? "is-invalid" : ""
                        }`}
                        id="text"
                        placeholder="ejemplo@gmail.com"
                        name="email"
                        value={formularioUsuario.nombresegundo}
                        onChange={manejadorClientes}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label>Estado</label>
                      <Select
                        value={
                          formularioUsuario.estado &&
                          EstadosUsuarios.find(
                            (opcion) =>
                              opcion.value === formularioUsuario.estado
                          )
                        }
                        onChange={(event) => {
                          setFormularioUsuario({
                            ...formularioUsuario,
                            estado: event.value,
                          });
                        }}
                        options={EstadosUsuarios}
                        isSearchable={true}
                      ></Select>
                    </div>
                  </div>
             
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Contraseña</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errorSegundoApellido ? "is-invalid" : ""
                        }`}
                        id="password"
                        placeholder=""
                        name="password"
                        value={formularioUsuario.apellidosegundo}
                        onChange={manejadorClientes}
                      />
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errorSegundoApellido ? "is-invalid" : ""
                        }`}
                        id="password-config"
                        placeholder=""
                        name="password-config"
                        value={formularioUsuario.apellidosegundo}
                        onChange={manejadorClientes}
                      />
                    </div>
                  </div>
                  <div className="col-sm-1">
                    <div className="form-group">
                      <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch3"
                          name="activo"
                          checked={formularioUsuario.activo}
                          onChange={(event) => {
                            setFormularioUsuario({
                              ...formularioUsuario,
                              activo: event.target.checked,
                            });
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch3"
                        >
                          Activo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-xl-12">
                    <div className="form-group">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 0 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(0)}
                          >
                            Proyectos
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 1 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(1)}
                          >
                            Etapas
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 2 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(2)}
                          >
                            Bloques
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 3 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(3)}
                          >
                            Lotes
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 4 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(4)}
                          >
                            Empleado
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 5 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(5)}
                          >
                            Cargos
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            type="button"
                            className={`nav-link ${
                              activeTab === 6 ? "active" : ""
                            }`}
                            onClick={() => handleTabClick(6)}
                          >
                           Clientes
                          </button>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className={`tab-pane ${
                            activeTab === 0 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox2"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkbox2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 1 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEtapasListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEtapasCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckEtapasListar"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEtapasEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 2 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckBloquesListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckBloquesCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckBloquesCrear"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckBloquesEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 3 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckLotesListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckLotesCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckBloquesCrear"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckLotesEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 4 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEmpleadoListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEmpleadoCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckBloquesCrear"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckEmpleadoEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 5 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckCargosListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckCargosCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckCargosCrear"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckCargosEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                        <div
                          className={`tab-pane ${
                            activeTab === 6 ? "active" : ""
                          }`}
                        >
                       
                          <div className="form-check" style={{ padding: '25px 20px 5px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckClientesListar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox1"
                            >
                              Listar
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckClientesCrear"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="ckClientesCrear"
                            >
                              Crear
                            </label>
                          </div>
                          <div className="form-check"  style={{ padding: '5px 20px' }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="ckClientesEditar"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="checkbox3"
                            >
                              editar
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-sm-4">
                    <div className="form-group">
                      <label>Números de Teléfono</label>
                      {formularioUsuario.numeros.map((numero, index) => (
                        <input
                          type="text"
                          className="form-control"
                          id="text"
                          placeholder="Ejemplo: 98908767"
                          name="numeros"
                          key={index}
                          value={numero.numero }
                          onChange={(event) =>
                            manejarCambioNumeros(index, event.target.value)
                          }
                        />
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
              {/* /.card-body */}
            </form>
          </div>
          <div className="modal-footer ">
          <div className="card-footer">
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            <Button variant="warning" onClick={limpiarBien}>
              limpiar Campos
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            {accion ? (
              <Button variant="primary" onClick={saveClientes}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarCliente}>
                Modificar
              </Button>
            )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalUsuarioForm;
