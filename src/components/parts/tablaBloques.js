import React from 'react';
import BloqueModal from '../modals/Bloque/modalBloques';
function TablaBloques({ datos , acceso }) {
   
      if (acceso === 0) {
        return (
    
    <tbody>
      {datos?.map((data) => (
     
         <tr key={data.id}> 
         <td>{data.id}</td>
         <td>{data.nombre}</td>
         <td>{data.descripcion}</td>
         <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
         <td>{data?.etapa.nombre}</td>
         <td><BloqueModal accion={false} datosDelBloque={data}></BloqueModal></td>
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
         <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
         <td>{data?.etapa.nombre}</td>
         
       </tr>
      ))}
          </tbody>
        );
      }
} 

export default TablaBloques;