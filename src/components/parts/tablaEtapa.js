import React from 'react';
import EtapaModal from '../modals/Etapas/modalEtapas';
function TablaEtapa({ datos , acceso }) {
   
      if (acceso === 0) {
        return (
    
    <tbody>
      {datos?.map((data) => (
         <tr key={data.id}> 
         <td>{data.id}</td>
         <td>{data.nombre}</td>
         <td>{data.descripcion}</td>
         <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
         <td>{data?.proyecto.nombre}</td>
         <td><EtapaModal accion={false} datosEtapas={data}></EtapaModal></td>
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
         <td>{data?.proyecto.nombre}</td>
         
       </tr>
      ))}
          </tbody>
        );
      }
} 

export default TablaEtapa;