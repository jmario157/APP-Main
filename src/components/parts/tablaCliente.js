import React from 'react';
import ModalClienteForm from '../modals/Clientes/modalClientes';
function TablaCliente({ datos , acceso }) {
   
      if (acceso === 0) {
        return (
    
    <tbody>
      {datos?.map((data) => (
         <tr key={data.id}> 
         <td >{data.id}</td>
         <td >{data.identidad} </td>
         <td >{data.nombreprimer} {data.nombresegundo} {data.apellidoprimer} {data.apellidosegundo}</td>
         <td >{data.direccion}</td>
         <td >{data.genero}</td>
     
         <td >{data.activo ? 'Activo' : 'Inactivo'}</td>
         <td ><img src={data.Imagen} alt="Foto"  style={{ width: '70px', height: 'auto' }} /></td>
        
         <td><ModalClienteForm accion={false} datosClientes={data}></ModalClienteForm></td>
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
             <td>{data.identidad} </td>
             <td>{data.nombreprimer} {data.nombresegundo} {data.apellidoprimer} {data.apellidosegundo}</td>
             <td>{data.direccion}</td>
             <td>{data.genero}</td>
         <td>{data.profesion.nombre}</td>
             <td>{data.activo ? 'Activo' : 'Inactivo'}</td>
             <td><img src={data.Imagen} alt="Foto"  style={{ width: '70px', height: 'auto' }} /></td>
             
             {data.clientetelefonos.map((celular) =>(
              <td>{celular.numero}</td>
             ))}
             {data.clientetelefonos.length === 1 && <td>Falta número</td>}
             </tr>
            ))}
          </tbody>
        );
      }
} 

export default TablaCliente;