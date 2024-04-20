import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { formToJSON } from "axios";
import { mostraAlerta, mostraAlertaError, mostraAlertaOk } from "../../Alerts/sweetAlert";
import Select from "react-select";
import {
  guardarClientes,
  editarClientes,
  imagenCliente,
  clientesEditarImagen,
} from "../../apiUrls";
import ModalInformacionClientes from "./modalInformacionClientes";
import { AxiosImagen, AxiosPrivado } from "../../axios/Axios";
import BuscarLugar from "../lugares/BuscarLugar";

function ModalClienteForm({ accion, datosClientes, ActualizarTabla, datosProfesiones, listaLugares }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalInformacion, setShowModalInformacion] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [profesionId, setProfesionId] = useState(null);
  const [errorPrimerNombre, setErrorPrimerNombre] = useState(false);
  const [errorSalario, setErrorSalario] = useState(false);
  const [errorSegundoNombre, setErrorSegundoNombre] = useState(false);
  const [errorPrimerApellido, setErrorPrimerApellido] = useState(false);
  const [errorSegundoApellido, setErrorSegundoApellido] = useState(false);
  const [errorIdentidad, setErrorIdentidad] = useState(false);
  const [nombreLugar, setNombreLugar] = useState("Selecione un lugar");
  const [generoId, setGeneroId] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(false);
  const [datosCargados, setDatosCargados]= useState(false);
  
  
  
  const profesiones = datosProfesiones?.map((f) => ({
    value: f.id,
    label: f.nombre
  }));
  const generos = [
    {
      value: 1,
      label: "Masculino",
      otro: "M"
    },
    {
      value: 2,
      label: "Femenino",
      otro: "F"
    },
  ]
  const [formularioClientes, setFormularioClientes] = useState({
    id: datosClientes?datosClientes.id:null,
    identidad: datosClientes?datosClientes.identidad:"",
    nombreprimer: datosClientes?datosClientes.nombreprimer:"",
    nombresegundo: datosClientes?datosClientes.nombresegundo:"",
    apellidoprimer: datosClientes?datosClientes.apellidoprimer:"",
    apellidosegundo: datosClientes?datosClientes.apellidosegundo:"",
    lugarId: datosClientes?datosClientes.lugarId:null,
    direccion: datosClientes?datosClientes.direccion:"",
    genero: datosClientes?datosClientes.genero:"M",
    activo: datosClientes?datosClientes.activo:true,
    Imagen: datosClientes?datosClientes.Imagen:"cliente-sin-imagen.png",
    profesionId: datosClientes?datosClientes.profesionId:null,
    numeros: datosClientes?datosClientes.clientetelefonos:[{ numero: "" }],
  });
  const [urlImagen, setUrlImagen] = useState(imagenCliente + "cliente-sin-imagen.png");
  
  useEffect(()=>{
    
    if(datosClientes!=null){
      
      setProfesionId(datosClientes.profesionId);
      setUrlImagen(imagenCliente+datosClientes.Imagen);
      if (datosClientes.genero === "M") {
        setGeneroId(1);
      } else {
        setGeneroId(2);
      }
      buscarIdlugar(datosClientes.lugarId);
      setFormularioClientes({
        ...formularioClientes,
        ...datosClientes
      });  
      setUrlImagen(imagenCliente + datosClientes.Imagen)
    }
    else{
      limpiarCampos();
    }
  },[])
  useEffect(() => {
    if (datosClientes != null && !datosCargados) {
      setProfesionId(datosClientes.profesionId);
      setUrlImagen(imagenCliente + datosClientes.Imagen);
      if (datosClientes.genero === "M") {
        setGeneroId(1);
      } else {
        setGeneroId(2);
      }
      buscarIdlugar(datosClientes.lugarId);
      setFormularioClientes({
        ...formularioClientes,
        ...datosClientes
      });
      setUrlImagen(imagenCliente + datosClientes.Imagen);
      setDatosCargados(true); // Marcar los datos como cargados
    }
  }, [showModal, datosClientes, datosCargados]);

  useEffect(()=>{
    setFormularioClientes({
      ...formularioClientes,
      profesionId: profesionId
    })
  },[profesionId])
  useEffect(()=>{
    var genero = "M"
    if(generoId===2)
      genero = "F"
    setFormularioClientes({
      ...formularioClientes,
      genero: genero
    })
  },[generoId])

  const buscarIdlugar = (id) => {
    const lugarSeleccionado = listaLugares?.find(
      (f) =>
        f.id == id
    );
    if (lugarSeleccionado) {
      setFormularioClientes({
        ...formularioClientes,
        lugarId: parseInt(id)
      });
      setNombreLugar(lugarSeleccionado.nombre + ", " + lugarSeleccionado.municipio.nombre + ", " + lugarSeleccionado.municipio.departamento.nombre );
    }
    else {
      setFormularioClientes({
        ...formularioClientes,
        lugarId: null
      });
      setNombreLugar("Seleccione un lugar");
    }
  };

  const saveClientes = async () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (
      (formularioClientes.identidad,
        formularioClientes.nombreprimer,
        formularioClientes.nombresegundo,
        formularioClientes.apellidoprimer === "")
    ) {
      mostraAlerta("Disculpe, Tiene que llenar estos campos", "warning");
      setErrorPrimerNombre(true);
      setErrorPrimerApellido(true);
      setErrorIdentidad(true);
      return;
    }
    if (formularioClientes.identidad == "") {
      console.log("Por favor, complete todos los campos");
      setErrorIdentidad(true);
      mostraAlerta("Escriba la identidad", "warning");
      return;
    }

    const identidadPattern = /^\d{13}$/;
    if (!identidadPattern.test(formularioClientes.identidad)) {
      console.log("El número de identidad debe tener 13 dígitos");
      setErrorIdentidad(true);
      mostraAlerta("El número de identidad debe tener 13 dígitos", "warning");
      return;
    }
    if (!regex.test(formularioClientes.nombreprimer)) {
      console.log("El campo primernombre solo debe contener letras");
      setErrorPrimerNombre(true);
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (
      formularioClientes.nombresegundo === "" ||
      !regex.test(formularioClientes.nombresegundo)
    ) {
      console.log("Por favor, revise los datos de Segundo Nombre");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise los datos de Segundo Nombre", "warning");
      return;
    }
    if (
      formularioClientes.apellidoprimer === "" ||
      !regex.test(formularioClientes.apellidoprimer)
    ) {
      console.log("Por favor, revise los datos de Primer Apellido");
      setErrorPrimerApellido(true);
      mostraAlerta(
        "Por favor, revise los datos de Primero Apellido",
        "warning"
      );
      return;
    }
    if (formularioClientes.direccion.length<=3) {
      mostraAlerta("Escriba la direccion", "warning");
      return;
    }
    if (formularioClientes.lugarId==null) {
      mostraAlerta("Seleccione el lugar", "warning");
      return;
    }
    setErrorPrimerNombre(false);
    setErrorSalario(false);
    setErrorPrimerApellido(false);
    setErrorSegundoNombre(false);
    setErrorSegundoApellido(false);
    setErrorIdentidad(false);
    try {
      let formData = new FormData();
      if(imagenSeleccionada){
        formData.append("imagen", inputRef.current.files[0]);
      } else {
        formData.append("imagen", "cliente-sin-imagen.png");
      }
      
      formData.append("data", JSON.stringify(formularioClientes));

      console.log(formularioClientes)
      await AxiosPrivado
        .post(guardarClientes, formularioClientes)
        .then((response) => {
          console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            ActualizarTabla();
            mostraAlerta(response.data.msj, "success");
            limpiarCampos()
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
          mostraAlerta("Revise los datos", "warning");
        });

      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error, "error");
    }
  };
  const manejadorClientes = (event) => {
    setFormularioClientes({
      ...formularioClientes,
      [event.target.name]: event.target.value,
    });
  };

  const manejarCambioNumeros = (index, value) => {
    const nuevosNumeros = [...formularioClientes.numeros];
    nuevosNumeros[index] = { numero: value };

    setFormularioClientes({
      ...formularioClientes,
      numeros: nuevosNumeros,
    });
  };

  const agregarNumero = () => {
    setFormularioClientes((prevState) => ({
      ...prevState,
      numeros: [...prevState.numeros, { numero: "" }],
    }));
  };
  const eliminarNumero = (index) => {
    setFormularioClientes((prevState) => {
      const nuevosNumeros = [...prevState.numeros];
      nuevosNumeros.splice(index, 1);
      return { ...prevState, numeros: nuevosNumeros };
    });
  };
  const modificarCliente = () => {
    const regex = /^[a-zA-Z]+$/;
    // Validar campos vacíos
    if (formularioClientes.identidad === "") {
      console.log("Por favor, complete todos los campos");
      setErrorPrimerNombre(true);
      mostraAlerta("Por favor, complete todos los campos", "warning");
      return;
    }
    if (!regex.test(formularioClientes.nombreprimer)) {
      console.log("El campo primernombre solo debe contener letras");
      setErrorPrimerNombre(true);
      mostraAlerta(
        "El campo primer nombre solo debe contener letras",
        "warning"
      );
      return;
    }
    if (
      formularioClientes.nombresegundo === "" ||
      !regex.test(formularioClientes.nombresegundo)
    ) {
      console.log("Por favor, revise los datos de Segundo Nombre");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise los datos de Segundo Nombre", "warning");
      return;
    }
    if (
      formularioClientes.genero === ""
    ) {
      console.log("Por favor, revise el genero");
      setErrorSegundoNombre(true);
      mostraAlerta("Por favor, revise el genero", "warning");
      return;
    }
    if (
      formularioClientes.apellidoprimer === "" ||
      !regex.test(formularioClientes.apellidoprimer)
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

    AxiosPrivado
      .put(editarClientes + formularioClientes.id, formularioClientes)
      .then((response) => {
        console.log("Respuesta:", response.data);
        if (response.data.tipo === 1) {
          ActualizarTabla();
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
    setErrorPrimerNombre(false);
    setErrorSegundoNombre(false);
    setErrorPrimerApellido(false);
    setErrorSegundoApellido(false);
    setNombreLugar("Seleccione un lugar");
    setErrorIdentidad(false);
    setUrlImagen(imagenCliente + "cliente-sin-imagen.png");
    setFormularioClientes({
      id: null,
      identidad: "",
      nombreprimer: "",
      nombresegundo: "",
      apellidoprimer: "",
      apellidosegundo: "",
      lugarId: null,
      direccion: "",
      genero: "",
      activo: true,
      Imagen:
        "cliente-sin-imagen.png",
      profesionId: null,
      numeros: [{ numero: "" }],
    });
    setProfesionId(null);
    setGeneroId(null);
  };

  
  const handleOpenModal = () => {
    setShowModalInformacion(true);
  };

  const inputRef = useRef(null);

  const SeleccionarImagen = () => {
    // 👇️ open file input box on click of another element
    console.log("Haciendo clic en SeleccionarImagen");
    if (inputRef.current) {
      inputRef.current.click();
    }
    
  };

  const handleFileChange = async event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    else {
      try {
        let formData = new FormData();
        formData.append("imagen", event.target.files[0]);
        const respuesta = await AxiosImagen.put(clientesEditarImagen + formularioClientes.id,
          formData,
        );
        if (respuesta.data.tipo === 1) {
          //formularioClientes.Imagen = respuesta.data.datos.Imagen;
          setFormularioClientes({
            ...formularioClientes,
            Imagen: respuesta.data.datos.Imagen,
          });
          setUrlImagen(imagenCliente+respuesta.data.datos.Imagen);
          ActualizarTabla();
          mostraAlertaOk(respuesta.data.msj);
        }
      } catch (error) {
        console.log(error);
        mostraAlertaError("Error al actualizar la imagen");
      }
    }
  };

  
  return (
    <>
      {accion ? (
        <div>
          <Button variant="primary" onClick={handleShow}>
            Crear Cliente
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
      <Modal show={showModal} onHide={handleClose} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Formulario de Cliente</h4>
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
          <form>
            <div className="card-body">
              <div className="row">
              <div className="col-sm-2">

  <div className="form-group">
    <div className="text-center">
      <img className="product-image" src={urlImagen} alt="Foto" />
    </div>
    {accion ? (
      <>
    
        
      </>
    ) : (
      <>
        <input
          type="file"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={handleFileChange}
        />
      <Button
      variant="light"
      className="btn btn-block btn-outline-info btn-xs"
      onClick={SeleccionarImagen}
    >
      Actualizar
    </Button>
    </>
    )}
  </div>
</div>
                <div className="col-sm-10">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Identidad</label>
                    <input
                      type="text"
                      className={`form-control ${errorIdentidad ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Ingrese la identidad"
                      name="identidad"
                      value={formularioClientes.identidad}
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Primer Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errorPrimerNombre ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Primer Nombre"
                      name="nombreprimer"
                      value={formularioClientes.nombreprimer}
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>

                <div className="col-lg-3 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Segundo Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errorSegundoNombre ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Segundo Nombre"
                      name="nombresegundo"
                      value={formularioClientes.nombresegundo}
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">
                      Primer Apellido
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errorPrimerApellido ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Primer Apellido"
                      name="apellidoprimer"
                      value={formularioClientes.apellidoprimer}
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">
                      Segundo Apellido
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errorSegundoApellido ? "is-invalid" : ""
                        }`}
                      id="text"
                      placeholder="Segundo Apellido"
                      name="apellidosegundo"
                      value={formularioClientes.apellidosegundo}
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>
              </div>
              <div className="row">

                <div className="col-sm-8">
                <label>Lugar</label>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Ej: 0123"
                      value={nombreLugar}
                      disabled
                    />
                    <BuscarLugar lista={listaLugares} buscarIdlugar={buscarIdlugar}></BuscarLugar>
                  </div>
                  <div className="form-group">
                    <label>Dirección del Cliente</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Ingrese Direccion del Cliente"
                      value={formularioClientes.direccion}
                      name="direccion"
                      onChange={manejadorClientes}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <label>Teléfonos</label>
                  <div className="row">
                    <div className="col-sm-9">
                      <div className="form-group">
                        {formularioClientes.numeros.map((numero, index) => (
                          <div key={index} className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ej: 98908767"
                              name="numeros"
                              value={numero.numero}
                              onChange={(event) =>
                                manejarCambioNumeros(index, event.target.value)
                              }
                            />
                            {formularioClientes.numeros.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => eliminarNumero(index)}
                                width="20px"
                              >
                                <i className="fa fa-minus" aria-hidden="true"></i>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-3">
                      <Button
                        variant="info"
                        onClick={agregarNumero}
                        width="20px"
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">
                      Genero
                    </label>
                    <Select
                      value={
                        generoId &&
                        generos.find(
                          (opcion) =>
                            opcion.value === generoId
                        )
                      }
                      onChange={(event) => {
                          setGeneroId(event.value);
                        }}
                      options={generos}
                      isSearchable={true}
                    ></Select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">
                      Profesión
                    </label>
                    <Select
                      value={
                        profesionId &&
                        profesiones?.find(
                          (opcion) =>
                            opcion.value === profesionId
                        )
                      }
                      onChange={(event) => {
                        setProfesionId(event.value);
                      }}
                      options={profesiones}
                      isSearchable={true}
                    ></Select>

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
                        checked={formularioClientes.activo}
                        onChange={(event) => {
                          setFormularioClientes({
                            ...formularioClientes,
                            activo: event.target.checked,
                          });
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customSwitch3"
                      >
                        {formularioClientes.activo ? 'Activo' : 'Inactivo'}
                      </label>
                    </div>
                  </div>
                </div>
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
            <Button variant="warning" onClick={limpiarCampos}>
              Limpiar Campos
            </Button>
            <span style={{ margin: "0 12px" }}></span>
            {accion ? (
              <Button variant="primary" onClick={saveClientes}>
                Guardar
              </Button>
            ) : (
              <Button variant="info" onClick={modificarCliente}>Modificar</Button>
            )}
          </div>
        </div>


      </Modal>
      <ModalInformacionClientes datos={datosClientes} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionClientes>
    </>
  );
}

export default ModalClienteForm;
