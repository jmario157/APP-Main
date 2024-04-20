import React from 'react';
import ModalProfesion from '../../modals/Clientes/modalProfesion';
function TablaProfesion({ datos , acceso }) {
   
      if (acceso === 0) {
        return (
    
    <tbody>
      {datos?.map((data) => (
         <tr key={data.id}> 
         <td>{data.id}</td>
         <td>{data.nombre} </td>     
         <td><ModalProfesion accion={false} datosProfesion={data}> </ModalProfesion></td>
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
            <td>{data.nombre} </td>
         
             </tr>
            ))}
          </tbody>
        );
      }
} 

export default TablaProfesion;