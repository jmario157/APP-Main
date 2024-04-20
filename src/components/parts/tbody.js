import React from 'react';
import CargoRow from './cargoRow';

function CargoTable({ datos , onRowClick }) {
    const handleRowClick = (cargo) => {
        onRowClick(cargo);
      };
    
  return (
    <tbody>
      {datos?.map((cargo) => (
        <CargoRow key={cargo.id}
        cargo={cargo}
        onClick={() => handleRowClick(cargo)}/>
      ))}
    </tbody>
  );
}

export default CargoTable;