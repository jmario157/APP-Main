import React from 'react';
import ModalUsuarioForm from '../../modals/Usuarios/ModalUsuarios';
function TablaUsuarios({ datos , acceso }) {
   
      if (acceso === 0) {
        return (
    
    <tbody>
      {datos?.map((data) => (
         <tr key={data.id}> 
         <td>{data.id}</td>
         <td>{data.login} </td>
         <td>{data.correo}</td>
         <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
         <td
              style={{
                color:
                  data.estado === "AC"
                    ? "green"
                    : data.estado === "IN"
                    ? "blue"
                    : data.estado === "BL"
                   
              }}
            >
              {data.estado === "AC"
                ? "Activo"
                : data.estado === "IN"
                ? "Inactivo"
                : data.estado === "BL"
                ? "Bloqueado"
                : ""}
            </td>
         <td>{data.empleado.primernombre} {data.empleado.primerapellido}</td>
         <td><ModalUsuarioForm accion={false} datosUsuario={data}> </ModalUsuarioForm></td>
       
        
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
            <td>{data.login} </td>
            <td>{data.correo}</td>
            <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
            <td
                 style={{
                   color:
                     data.estado === "AC"
                       ? "green"
                       : data.estado === "IN"
                       ? "blue"
                       : data.estado === "BL"
                      
                 }}
               >
                 {data.estado === "AC"
                   ? "Activo"
                   : data.estado === "IN"
                   ? "Inactivo"
                   : data.estado === "BL"
                   ? "Bloqueado"
                   : ""}
               </td>
            <td>{data.empleado.primernombre} {data.empleado.primerapellido}</td>
             </tr>
            ))}
          </tbody>
        );
      }
} 

export default TablaUsuarios;