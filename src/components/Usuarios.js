import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import { listarUsuarios } from "./apiUrls";
import { DataContext } from './context/DataContextUsuario';
import TablaUsuarios from "./parts/usuarios/tablaUsuarios";
import ModalUsuarioForm from "./modals/Usuarios/ModalUsuarios";
import ModalInformacionUsuario from "./modals/Usuarios/ModalInformacionUsuario";
function Usuarios() {
  const [selectedOpcion, setSelectedOpcion] = useState("");
 
  const {usuariosArray, setUsuarioArray, 
    usuarioLista, setUsuarioLista,
    token, setToken} =
    useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [filteredData, setFilteredData] = useState("");

  /* para paginacion */

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const registros = usuarioLista.slice(primerIndice, ultimoIndice);
  const numeroPagina = Math.ceil(usuarioLista.length / registrosPorPagina);
  const numeros = [...Array(numeroPagina + 1).keys()].slice(1);
 

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  /* consulta para cargos del listbox */

  const handleSelect = (event) => {
    setSelectedOpcion(event.target.value);
  };

  /* Listar proyectos para tabla */
  const fetchData = async () => {

    console.log(usuariosArray)
    console.log("Este es token", token)
    try {
      const response = await axios.get(listarUsuarios,{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });
      
      if (proyectos == "") {
        response.data.datos.forEach((element) => {
          proyectos.push(element);
        });
      }
      setUsuarioLista(proyectos);
    } catch (error) {
      console.log(error);
    }
  };

  /* para busqueda*/

  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Formulario de Usuario</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Usuario</a>
                  </li>
                  <li className="breadcrumb-item active">
                    Formulario de Usuario
                  </li>
                </ol>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>

        <section className="container m-2 d-flex justify-content-center align-items-center ">
          <div className="container  ">
            <div className="row">
              {/* left column */}
              <div className="col-md-11">
                {/* general form elements */}
                <div className="card">
                  <div className="card-header">
                    <ModalUsuarioForm accion={true} datosDelProyecto={null} />
                    <span style={{ margin: "0 12px" }}></span>
                    <Button variant="info" onClick={handleOpenModal}>
                      Ver Información Completa
                    </Button>
                    <ModalInformacionUsuario
                    showModal={showModal}
                    setShowModal={setShowModal}
                    >

                    </ModalInformacionUsuario>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                </div>
              </div>
              <div>
                <div className="container m-1 d-flex justify-content-center align-items-center">
                  <div classname="col-md-6">
                    <div className="row">
                      <div className="col-12 mx-auto">
                        <div className="card">
                          <div className="card-header">
                            <h3 className="card-title">Tabla de Usuarios</h3>
                            <div className="card-tools">
                              <div
                                className="input-group input-group-sm"
                                style={{ width: 150 }}
                              >
                                <input
                                  type="text"
                                  name="table_search"
                                  className="form-control float-right"
                                  placeholder="Buscar"
                                  onChange={(e) =>
                                    setFilteredData(e.target.value)
                                  }
                                />
                                <div className="input-group-append"></div>
                              </div>
                            </div>
                          </div>
                          {/* /.card-header */}
                          <div className="card-body table-responsive p-0">
                            <table className="table  table-md table-responsive table-hover ">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Login</th>
                                  <th>Correo</th>
                                  <th>Activo</th>
                                  <th>Estado</th>
                                  <th>Empleado</th>
                                </tr>
                              </thead>
                              <TablaUsuarios
                                acceso={0}
                                datos={registros.filter((item) => {
                                  return filteredData.toLocaleLowerCase() === ""
                                    ? item
                                    : item.login
                                        .toLocaleLowerCase()
                                        .includes(filteredData) ||
                                        item.correo
                                        .toLocaleLowerCase()
                                        .includes(filteredData) 
                                })}
                               
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

export default Usuarios;
