import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import CargoTable from "./parts/tbody";
import { useFetch } from "./generics/useFetch";
import { editarCargos, listarCargos, guardarCargos } from "./apiUrls";

import { mostraAlerta } from "./Alerts/sweetAlert";
import { DataContextCargo } from "./context/DataCargo";
function Cargo() {
  const {cargos,setCargos} = useContext(DataContextCargo);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errores, setError] = useState(null);
  const [cargoArray, setCargoArray] = useState([]);
  const [filteredData, setFilteredData] = useState("");
  const [ListaCargo, setListarCargo] = useState([]);
  const [formularioCargo, setFormularioCargo] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    activo: true,
    imagen: "1",
  });
 /* para paginacion */
   
 const [paginaActual, setPaginaActual] = useState(1);
 const registrosPorPagina = 6;
 const ultimoIndice = paginaActual * registrosPorPagina;
 const primerIndice = ultimoIndice - registrosPorPagina;
 const registros = cargos.slice(primerIndice, ultimoIndice);
 const numeroPagina = Math.ceil(cargos.length / registrosPorPagina);
 const numeros = [...Array(numeroPagina + 1).keys()].slice(1);
  const handleRowClick = (cargo) => {

    
    setFormularioCargo({
      id: cargo.id,
      nombre: cargo.nombre,
      descripcion: cargo.descripcion,
      activo: cargo.activo,
      imagen: cargo.imagen,
    });
  };
  const handleChange = (event) => {
    setFormularioCargo({
      ...formularioCargo,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
      const response = await axios.get(listarCargos);
      setData(response.data);
      
      setCargoArray([])
       if (cargoArray == "") {
        response.data.datos.forEach((element) => {
          cargoArray.push(element);
        });
      }
      setCargos(cargoArray);
      console.log(cargos)
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const saveCargos = (event) => {
    event.preventDefault();
    // Validar campos vacíos

    if(formularioCargo.id != null){
      mostraAlerta("Por favor, Limpie los campos antes de crear uno nuevo", 'warning');
      return;
    }
    if (formularioCargo.nombre === "") {
      console.log("Por favor, complete todos los campos");
      mostraAlerta("Por favor, complete todos los campos", 'warning');
      return;
    }
    
    if (/\d/.test(formularioCargo.nombre)) {
      console.log("El campo nombre no debe contener números");
      mostraAlerta("El campo nombre no debe contener números", 'warning');
      return;
    }
   
    try {
      axios
        .post(guardarCargos, formularioCargo)
        .then((response) => {
      if (response.data.tipo == 1) {
        mostraAlerta(response.data.msj, "success");
      } else if (response.data.tipo == 0) {
        
            mostraAlerta("Ya existe el cargo", 'warning');
         
       
      } else if (response.data.tipo == 2) {
       
          console.log(response.data.campo + " " + response.data.msj);
          mostraAlerta( "Ha ocurrido un error, revise los datos", 'warning');
      
      }
      fetchData();
      cleanCampos();
      
    })
    } catch (error) {
      console.error("Error:", error);
      mostraAlerta(error + "comuniquese con el administrador");
    }
  };
  const limpiarCampos = (event) => {
    event.preventDefault();
    setFormularioCargo({
      id: null,
      nombre: "",
      descripcion: "",
      activo: "",
      // Reinicia los demás campos a su valor inicial
    });
  };
  const cleanCampos = () => {
   
    setFormularioCargo({
      id: null,
      nombre: "",
      descripcion: "",
      activo: "",
      // Reinicia los demás campos a su valor inicial
    });
  };
  const handleModificar = (event) => {
    // verificar
    event.preventDefault();
    if (formularioCargo.nombre === "") {
      console.log("Por favor, complete todos los campos");
      mostraAlerta("Por favor, complete todos los campos", 'warning');
      return;
    }
    
    if (/\d/.test(formularioCargo.nombre)) {
      console.log("El campo nombre no debe contener números");
      mostraAlerta("El campo nombre no debe contener números", 'warning');
      return;
    }
    axios
      .put(editarCargos + formularioCargo.id, formularioCargo)
      .then((response) => {
       console.log("Respuesta:", response.data);
          if (response.data.tipo == 1) {
            mostraAlerta((response.data.msj),'success');
          } else if(response.data.tipo == 0) {
          
            for (let i = 0; i < response.data.msj.length; i++) {
              response.data.msj.forEach(element => {
                console.log(element)
                mostraAlerta(element)
              });
            }
          }else if(response.data.tipo == 2){
           response.data.msj.forEach(element => {
             console.log(element.campo +' '+ element.msj  )
             mostraAlerta("El campo : " + element.campo + ", " + element.msj )
           })
          }

          fetchData();
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error("Error:", error);
        alert(error);
      });
  };

  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Formulario de Cargo</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Cargo</a>
                  </li>
                  <li className="breadcrumb-item active">
                    Formulario de Cargo
                  </li>
                </ol>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>

        <section className="container ">
          <div className="container  ">
            <div className="row">
              {/* left column */}
              <div className="col-md-4">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">
                      Ingrese la informacion del cargo
                    </h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Nombre del Cargo
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="text"
                          placeholder="Ingrese el nombre del cargo"
                          name="nombre"
                          value={formularioCargo.nombre}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Descripción del cargo</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Ingrese Información del cargo"
                          value={formularioCargo.descripcion}
                          name="descripcion"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customSwitch3"
                            name="activo"
                            checked={formularioCargo.activo}
                            onChange={(event) => {
                              setFormularioCargo({
                                ...formularioCargo,
                                activo: event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customSwitch3"
                          >
                            Estado del cargo
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* /.card-body */}
                    <div className="card-footer">
                      <button className="btn btn-primary" id="Guardar" onClick={saveCargos}>
                        Crear
                      </button>
                      <span style={{ margin: "0 12px" }}></span>
                      <button
                        className="btn btn-info"
                        onClick={handleModificar}
                      >
                        Modificar
                      </button>
                      <span style={{ margin: "0 12px" }}></span>
                      <button
                        onClick={limpiarCampos}
                        className="btn btn-secondary"
                      >
                        Limpiar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div>
                <div className="container m-2 d-flex justify-content-center align-items-center">
                  <div classname="col-md-6">
                    <div className="row">
                      <div className="col-12 mx-auto">
                        <div className="card">
                          <div className="card-header">
                            <h3 className="card-title">Tabla de Cargos</h3>
                            <div className="card-tools">
                              <div
                                className="input-group input-group-sm"
                                style={{ width: 200 }}
                              >
                               <input
                                  type="text"
                                  name="table_search"
                                  className="form-control float-right"
                                  placeholder="Buscar"
                          
                                  onChange={(e) => setFilteredData (e.target.value)}
                                />
                                <div className="input-group-append">
                                
                                    
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* /.card-header */}
                          <div className="card-body table-responsive p-0">
                            <table className="table table-hover text-nowrap">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Descripción</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <CargoTable
                                datos={
                                  registros.filter((item) => {
                                    return filteredData.toLocaleLowerCase() === ''
                                    ? item
                                    : item.nombre.toLocaleLowerCase().includes(filteredData) 
                                  })
                                
                                  }
                                onRowClick={handleRowClick}
                              />
                            </table>
                            <span style={{ margin: "0 12px" }}></span>
                            <div>
                            
                              <nav>
                                <ul className="pagination">
                                  <li className="page-item">
                                    <a
                                      href="#"
                                      className="page-link"
                                      onClick={prePage}
                                    >
                                      Anterior
                                    </a>
                                  </li>

                                  {numeros.map((n, i) => (
                                    <li
                                      className={`page-item ${
                                        paginaActual === n ? "active" : ""
                                      } `}
                                      key={i}
                                    >
                                      <a
                                        href="#"
                                        className="page-link"
                                        onClick={() => changeCPage(n)}
                                      >
                                        {n}
                                      </a>
                                    </li>
                                  ))}

                                  <li className="page-item">
                                    <a
                                      href="#"
                                      className="page-link"
                                      onClick={nextPage}
                                    >
                                      {" "}
                                      Siguiente{" "}
                                    </a>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                          {/* /.card-body */}
                        </div>
                        {/* /.card */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
  function changeCPage(id) {
    setPaginaActual(id);
  }
  function prePage() {
    if (paginaActual !== 1) {
      setPaginaActual(paginaActual - 1);
    }
  }
  function nextPage() {
    if (paginaActual !== numeroPagina) {
      setPaginaActual(paginaActual + 1);
    }
  }
}

export default Cargo;
