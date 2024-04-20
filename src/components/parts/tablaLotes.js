import React, { useContext, useState } from "react";
import EtapaModal from "../modals/Etapas/modalEtapas";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { DataContext } from "../context/DataContextLotes";
function TablaLotes({ datos, acceso }) {
  const {
    lotesArray,
    setLotesArray,
    lotesLista,
    setLotesLista,
    lotesAccion,
    setLotesAccion,
    lotesModificar,
    setLotesDividir,
  } = useContext(DataContext);

  const presionarBoton = (data) => {
    setLotesAccion(false);
    setLotesDividir(data);
  };

  if (acceso === 0) {
    return (
      <tbody>
        {datos?.map((data) => (
          <tr key={data.id}>
            <td>{data.id}</td>
            <td>{data.nombre}</td>
            <td>{data.descripcion}</td>
            <td>{data.valor}</td>
            <td>{data.prima}</td>
            <td
              style={{
                color:
                  data.estado === "VE"
                    ? "green"
                    : data.estado === "DI"
                    ? "blue"
                    : data.estado === "RE"
                    ? "orange"
                    : data.estado === "BL"
                    ? "red"
                    : "black",
              }}
            >
              {data.estado === "VE"
                ? "Vendido"
                : data.estado === "DI"
                ? "Disponible"
                : data.estado === "RE"
                ? "Reservado"
                : data.estado === "BL"
                ? "Bloqueado"
                : ""}
            </td>
          
            <td>{data.activo ? "Activo" : "Inactivo"}</td>
            <td>{data?.bloque.nombre}</td>
            <td>{data?.etapa.nombre}</td>
            <td>{data?.proyecto.nombre}</td>

            <td>
              {" "}
              <Link to={`/crearlotes/${data.id}`} className="btn btn-warning">
                Modificar
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    );
  } else {
    return (
      <tbody>
        {datos?.map((data) => (
          <tr key={data.id}>
            <td>{data.id}</td>
            <td>{data.nombre}</td>
            <td>{data.descripcion}</td>
            <td>{data.valor}</td>
            <td>{data.prima}</td>
            <td>{data.estado}</td>
            <td>{data.activo ? "Activo" : "Inactivo"}</td>
            <td>{data?.bloque.nombre}</td>
            <td>{data?.etapa.nombre}</td>
            <td>{data?.proyecto.nombre}</td>
            <td>
              <EtapaModal accion={false} datosEtapas={data}></EtapaModal>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TablaLotes;
