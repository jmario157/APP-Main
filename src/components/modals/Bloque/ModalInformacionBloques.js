import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";
import axios from "axios";
import { DataContext } from "../../context/DataContextBloques";
import { listarProyectos, guardarProyectos, editarProyectos } from "../../apiUrls";
import TablaBloques from "../../parts/tablaBloques";

const ModalInformacionBloques = ({ showModal, setShowModal }) => {
    const { bloquesArray, setBloquesArray, 
        bloquesLista, setBloquesLista } =
        useContext(DataContext);
  const [filteredData, setFilteredData] = useState("");

  /* para paginacion */
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const registros = bloquesArray.slice(primerIndice, ultimoIndice);
  const numeroPagina = Math.ceil(bloquesArray.length / registrosPorPagina);
  const numeros = [...Array(numeroPagina + 1).keys()].slice(1);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="custom-modalView"
    >
      <Modal.Header closeButton>
        <Modal.Title>Información Bloques</Modal.Title>
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
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Activo</th>
                <th>Etapa</th>
              </tr>
            </thead>
            <TablaBloques
              acceso={1}
              datos={registros.filter((item) => {
                return filteredData.toLocaleLowerCase() === ""
                  ? item
                  : item.nombre.toLocaleLowerCase().includes(filteredData) ||
                      item.descripcion
                        .toLocaleLowerCase()
                        .includes(filteredData);
              })}
            />
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

export default ModalInformacionBloques;
