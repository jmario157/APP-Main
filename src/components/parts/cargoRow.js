import React from 'react';

function CargoRow({ cargo, onClick }) {
  return (
    <tr onClick={onClick}> 
      <td>{cargo.id}</td>
      <td>{cargo.nombre}</td>
      <td>{cargo.descripcion}</td>
      <td>{cargo.activo ? 'Activo' : 'Inactivo'}</td>
    </tr>
  );
}

export default CargoRow;