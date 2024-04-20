import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import EmpleadoTable from "./parts/tbodyEmp";
import "react-datepicker/dist/react-datepicker.css";
import ModalEmpForm from "./modals/Empleado/modalEmpForm";
import ModalEmpFormEditar from "./modals/Empleado/modalEmpFormEditar";
import { useFormularioEmpleado } from "./data/formularioEmpleadoData";
import ModalAddCargo from "./modals/Empleado/modalAgregarCargo";
import {
  limpiarCampos,
} from "./data/formularioEmpleadoUtils";
import {
  DataContext,
  DataEmpleadoProvider,
} from "./context/DataEmpleadoContext";
import ExampleModal from "./modals/Empleado/modalEmpTable";
import Button from "react-bootstrap/Button";
import { listarEmpleado } from "./apiUrls";
import { mostraAlerta } from "./Alerts/sweetAlert";
function Empleado() {

  const [selectedOpcion, setSelectedOpcion] = useState("");
  const { formularioEmpleado, setFormularioEmpleado } = useFormularioEmpleado();
  const { data, setData ,empleadoArray, setEmpleadoArray} = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [empleados, setempleados] = useState([]);
  const [filteredData, setFilteredData] = useState("");


    /* para paginacion */
   
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 6;
    const ultimoIndice = paginaActual * registrosPorPagina;
    const primerIndice = ultimoIndice - registrosPorPagina;
    const registros = empleadoArray.slice(primerIndice, ultimoIndice);
    const numeroPagina = Math.ceil(empleadoArray.length / registrosPorPagina);
    const numeros = [...Array(numeroPagina + 1).keys()].slice(1);
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

 



  /* Listar empleados para tabla */
  const fetchData = async () => {
    try {
      const response = await axios.get(listarEmpleado);
      setData(response.data);

      setempleados([]);
      response.data.datos.forEach((element) => {
        empleados.push(element);
      });

      setEmpleadoArray(empleados);
    } catch (error) {
      console.log(error);
    }
  };

 
  const handleRowClick = (empleado) => {
    handleRowClick(empleado, setFormularioEmpleado);
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
                <h1>Formulario de Empleado</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Empleado</a>
                  </li>
                  <li className="breadcrumb-item active">
                    Formulario de Empleado
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
                    <ModalEmpForm buttonLabel="Crear Empleado" />
                    <span style={{ margin: "0 12px" }}></span>
                    <Button variant="info" onClick={handleOpenModal}>
                      Ver Información Completa
                    </Button>
                    <ExampleModal
                      showModal={showModal}
                      setShowModal={setShowModal}
                    />
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
                            <h3 className="card-title">Tabla de Cargos</h3>
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
                          
                                  onChange={(e) => setFilteredData (e.target.value)}
                                />
                                <div className="input-group-append">
                                 
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* /.card-header */}
                          <div className="card-body table-responsive p-0">
                            <table className="table  table-md table-responsive table-hover ">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Identidad</th>
                                  <th>Nombre</th>
                                  <th>Salario</th>
                                  <th>Fecha Ingreso</th>
                                  <th>Activo</th>
                                  <th>Cargo</th>
                                </tr>
                              </thead>
                              <EmpleadoTable
                                
                                datos={
                               registros.filter((item) => {
                               return filteredData.toLocaleLowerCase() === ''
                               ? item
                               : item.primernombre.toLocaleLowerCase().includes(filteredData)   || 
                               item.identidad.includes(filteredData) || 
                               item.segundonombre.toLocaleLowerCase().includes(filteredData)                                       
                               
                             })
                                
                                }
                                onRowClick={handleRowClick}
                                acceso={0}
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

export default Empleado;
