import React, { useState } from "react";
import ModalEmpFormEditar from '../../modals/Empleado/modalEmpFormEditar';

function EmpleadoRow({ empleado, acceso,onClick }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);



  // Función para abrir el modal y establecer el empleado seleccionado
  const handleOpenModal = (empleado) => {
    setSelectedEmployee(empleado);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  if (acceso === 0) {
    return (
      <>
        <tr onClick={onClick}> 
          <td>{empleado.id}</td>
          <td>{empleado.identidad}</td>
          <td>{empleado.primernombre} {empleado.segundonombre} {empleado.primerapellido} {empleado.segundoapellido}</td>
          <td>L {new Intl.NumberFormat('es-hn').format(empleado.salario)}</td>
          <td>{new Date(empleado.fechaingreso).toLocaleDateString()}</td>
          <td>{empleado.activo ? 'Activo' : 'Inactivo'}</td>
          <td>{empleado?.cargo.nombre}</td>
          
          <td> <ModalEmpFormEditar buttonLabel="Crear Empleado" empleado={empleado}></ModalEmpFormEditar> </td>
        </tr>
       
      </>
    );
  } else {
    return (
      <>
        <tr onClick={onClick}> 
          <td>{empleado.id}</td>
          <td>{empleado.identidad}</td>
          <td>{empleado.primernombre} </td>
          <td> {empleado.segundonombre}</td>
          <td>  {empleado.primerapellido}</td>
          <td>  {empleado.segundoapellido}</td>
          <td>L {new Intl.NumberFormat('es-hn').format(empleado.salario)}</td>
          <td>{new Date(empleado.fechaingreso).toLocaleDateString()}</td>
          <td>{empleado.activo ? 'Activo' : 'Inactivo'}</td>
          <td><img src={empleado.Imagen} alt="Foto"  style={{ width: '70px', height: 'auto' }} /></td>
          <td>{empleado?.cargo.nombre}</td>
          
          
        </tr>
       
      </>
    );
  }

  
}

export default EmpleadoRow;
