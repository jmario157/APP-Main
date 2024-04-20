import React, { useContext, useEffect, useState } from "react";
import { Modal, Table, Pagination } from "react-bootstrap";
import axios from "axios";
import { DataContext } from '../../context/DataContextUsuario';
import { mostraAlerta } from "../../Alerts/sweetAlert";
import {
  listarProyectos,
  guardarProyectos,
  editarProyectos,
} from "../../apiUrls";
import { set } from "date-fns";
import TablaUsuarios from "../../parts/usuarios/tablaUsuarios";

const ModalInformacionUsuario = ({ showModal, setShowModal }) => {
    const {usuariosArray, setUsuarioArray, 
        usuarioLista, setUsuarioLista,
        token, setToken} =
        useContext(DataContext);
  const [filteredData, setFilteredData] = useState("");

  /* para paginacion */
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  const registros = usuarioLista.slice(primerIndice, ultimoIndice);
  const numeroPagina = Math.ceil(usuarioLista.length / registrosPorPagina);
  const numeros = [...Array(numeroPagina + 1).keys()].slice(1);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="custom-modalView"
    >
      <Modal.Header closeButton>
        <Modal.Title>Información Proyectos</Modal.Title>
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
                <th>Login</th>
                <th>Correo</th>
                <th>Activo</th>
                <th>Estado</th>
                <th>Empleado</th>
              </tr>
            </thead>
            <TablaUsuarios
              acceso={1}
              datos={registros.filter((item) => {
                return filteredData.toLocaleLowerCase() === ""
                  ? item
                  : item.nombre.toLocaleLowerCase().includes(filteredData);
              })}
            ></TablaUsuarios>
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

export default ModalInformacionUsuario;
