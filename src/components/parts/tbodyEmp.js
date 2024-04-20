import React from 'react';
import EmpleadoRow from './empleado/empleadoRow';

function EmpleadoTable({ datos , acceso }) {


  return (
    <tbody>
      {datos?.map((empleado) => (
        <EmpleadoRow key={empleado.id}
        empleado={empleado}
        acceso={acceso}
      />
      ))}
    </tbody>
  );
}

export default EmpleadoTable;