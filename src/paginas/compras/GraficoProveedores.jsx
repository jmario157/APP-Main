import React, { useEffect, useState } from 'react';
import { listarCompras } from '../../components/apiUrls';
import { Bar } from 'react-chartjs-2';

const GraficoComprasProveedores = () => {
  const [proveedoresData, setProveedoresData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Compras por Proveedor',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [productosPorProveedorData, setProductosPorProveedorData] = useState([]);

  const fetchComprasData = () => {
  
    fetch(listarCompras)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.datos && Array.isArray(data.datos)) {
          const proveedores = {};

          data.datos.forEach((compra) => {
            const nombreProveedor = compra.proveedor.nombre;

            // Contar compras por proveedor
            if (proveedores[nombreProveedor]) {
              proveedores[nombreProveedor]++;
            } else {
              proveedores[nombreProveedor] = 1;
            }
          });

          // Ordenar proveedores por cantidad de compras en orden descendente
          const sortedProveedores = Object.keys(proveedores).sort(
            (a, b) => proveedores[b] - proveedores[a]
          );

          
          const topProveedores = sortedProveedores.slice(0, 5);

          // Filtrar datos para incluir solo proveedores en el top
          const filteredLabels = [];
          const filteredData = [];
          topProveedores.forEach((proveedor) => {
            filteredLabels.push(proveedor);
            filteredData.push(proveedores[proveedor]);
          });

          setProveedoresData({
            labels: filteredLabels,
            datasets: [
              {
                label: 'Compras por Proveedor',
                data: filteredData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });

       
          const productosPorProveedor = {};

          data.datos.forEach((compra) => {
            const nombreProveedor = compra.proveedor.nombre;

            if (topProveedores.includes(nombreProveedor)) {
              if (!productosPorProveedor[nombreProveedor]) {
                productosPorProveedor[nombreProveedor] = {};
              }

              compra.detallesCompra.forEach((detalle) => {
                const nombreProducto = detalle.producto.nombre;

                if (productosPorProveedor[nombreProveedor][nombreProducto]) {
                  productosPorProveedor[nombreProveedor][nombreProducto] += detalle.cantidad;
                } else {
                  productosPorProveedor[nombreProveedor][nombreProducto] = detalle.cantidad;
                }
              });
            }
          });

          setProductosPorProveedorData(productosPorProveedor);
        } else {
          console.error('La respuesta de la API no contiene datos válidos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de compras', error);
      });
  };

  useEffect(() => {
    fetchComprasData();
  }, []);

  const estiloProveedorCard = {
    border: '2px solid rgba(0,123,255,0.4)',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    width: '300px',
    marginBottom: '20px',
    marginRight: '20px',
  
    minHeight: '200px',
    maxHeight: '200px',
  };

  const estiloProveedorNombre = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px',
    borderBottom: '2px solid rgba(0, 123, 255, 0.5)', 
    paddingBottom: '5px', 
  };

  const estiloListaProductos = {
    listStyle: 'none',
    padding: '4',
  };

  const estiloProducto = {
    display: 'flex',
    justifyContent: '',
    paddingLeft:'25%',
    fontSize: '14px',
    margin: '5px 0',
  };

  const estiloProductoNombre ={
    fontWeight:'bold',
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
        <div style={{minWidth:'350px', minHeight:'250px', flex: 1 }}>
          <Bar data={proveedoresData} />
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridGap: '8px',
          justifyContent: 'center',
        }}
      >
        {Object.keys(productosPorProveedorData).map((proveedor, index) => (
          <div
            key={proveedor}
            style={{
              ...estiloProveedorCard,
            }}
          >
            <h3 style={estiloProveedorNombre}>{proveedor}</h3>
            <ul style={estiloListaProductos}>
              {Object.keys(productosPorProveedorData[proveedor]).map((producto) => (
                <li key={producto} style={estiloProducto}>
                  {producto}: {productosPorProveedorData[proveedor][producto]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoComprasProveedores;


