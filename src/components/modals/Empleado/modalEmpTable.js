import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";
import axios from "axios";
import {
  DataContext,
  DataEmpleadoProvider,
} from "../../context/DataEmpleadoContext";
import EmpleadoTable from "../../parts/tbodyEmp";
import { useFormularioEmpleado } from "../../data/formularioEmpleadoData";
import { listarEmpleado} from "../../apiUrls";
const datio = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Smith", age: 30 },
  // Agrega más datos aquí...
];

const pageSize = 5; // Tamaño de la página

const ExampleModal = ({ showModal, setShowModal }) => {

  const { data, setData ,empleadoArray, setEmpleadoArray } = useContext(DataContext);
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

   /* Listar empleados para tabla */
   const fetchData = async () => {
    try {
      const response = await axios.get(
       listarEmpleado
      );
      setData(response.data);

      if (empleados == "") {
        response.data.datos.forEach((element) => {
          empleados.push(element);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }; 
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="custom-modalView"
    >
      <Modal.Header closeButton>
        <Modal.Title>Información Empleados</Modal.Title>
        <div className="card-tools">
          <div className="input-group input-group-xl" style={{ width: 250 }}>
            <input
              type="text"
              name="table_search"
              className="form-control float-right"
              placeholder="Buscar"
              onChange={(e) => setFilteredData(e.target.value)}
            />
            <div className="input-group-append"></div>
          </div>
        </div>
        
      </Modal.Header>

      <Modal.Body>
      <div className="table-responsive">
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Identidad</th>
              <th>Primer Nombre</th>
              <th>Segundo Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Salario</th>
              <th>Fecha Ingreso</th>
              <th>Activo</th>
              <th>Imagen</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <EmpleadoTable
            datos={registros.filter((item) => {
              return filteredData.toLocaleLowerCase() === ""
                ? item
                : item.primernombre
                    .toLocaleLowerCase()
                    .includes(filteredData) ||
                    item.identidad.includes(filteredData) ||
                    item.segundonombre
                      .toLocaleLowerCase()
                      .includes(filteredData);
            })}
          ></EmpleadoTable>
        </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a href="#" className="page-link" onClick={prePage}>
                Anterior
              </a>
            </li>

            {numeros.map((n, i) => (
              <li
                className={`page-item ${paginaActual === n ? "active" : ""} `}
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
              <a href="#" className="page-link" onClick={nextPage}>
                {" "}
                Siguiente{" "}
              </a>
            </li>
          </ul>
        </nav>
      </Modal.Footer>
    </Modal>
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

 
};

export default ExampleModal;
