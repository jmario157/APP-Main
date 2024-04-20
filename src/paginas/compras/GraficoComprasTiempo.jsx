import React, { useEffect, useState } from 'react';
import { listarCompras } from '../../components/apiUrls';
import { Line } from 'react-chartjs-2';

const GraficoAumentoDecremento = () => {
  const [productData, setProductData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Compras de Producto a lo largo del tiempo',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });

  const [searchText, setSearchText] = useState(''); // Para almacenar el texto de búsqueda
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Año seleccionado por defecto

  useEffect(() => {
    // Realiza la consulta a la API para obtener los datos de compras
    fetch(listarCompras)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.datos && Array.isArray(data.datos)) {
          // Filtra los datos según el texto de búsqueda
          const filteredData = data.datos.filter((compra) => {
            // Reemplaza 'productoX' con el valor de la búsqueda
            const searchTerm = searchText.toLowerCase();
            return compra.detallesCompra.some(
              (detalle) => detalle.producto.nombre.toLowerCase() === searchTerm
            );
          });

          // Filtra los datos para mostrar solo el año seleccionado
          const filteredDataByYear = filteredData.filter((compra) => {
            const compraDate = new Date(compra.fecha);
            return compraDate.getFullYear() === selectedYear;
          });

          // Realiza la agrupación de los datos por mes
          const monthlyData = new Map();
          filteredDataByYear.forEach((compra) => {
            const compraDate = new Date(compra.fecha);
            const monthYearKey = compraDate.toLocaleString('default', { month: 'long' }) + ' ' + compraDate.getFullYear();

            if (monthlyData.has(monthYearKey)) {
              monthlyData.set(monthYearKey, monthlyData.get(monthYearKey) + 1);
            } else {
              monthlyData.set(monthYearKey, 1);
            }
          });

          const labels = Array.from(monthlyData.keys());
          const dataValues = Array.from(monthlyData.values());

          setProductData({
            labels: labels,
            datasets: [
              {
                label: `Compras de ${searchText} a lo largo del tiempo`,
                data: dataValues,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error('La respuesta de la API no contiene datos válidos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de compras', error);
      });
  }, [searchText, selectedYear]);

  return (
    <div>
      <h2>Estadística de Compras por Producto</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div>
        {/* Input para seleccionar el año */}
        <input
          type="number"
          placeholder="Año"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(parseInt(e.target.value, 10));
          }}
        />
      </div>

      <div style={{ height: '400px', width: '600px' }}>
        <Line data={productData} />
      </div>
    </div>
  );
};

export default GraficoAumentoDecremento;






/*import React, { useEffect, useState } from 'react';
import { listarCompras } from '../../components/apiUrls';
import { Line } from 'react-chartjs-2';

const GraficoAumentoDecremento = () => {
  const [productData, setProductData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Compras de Producto X a lo largo del tiempo',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });

  const [searchText, setSearchText] = useState(''); // Para almacenar el texto de búsqueda

  useEffect(() => {
    // Realiza la consulta a la API para obtener los datos de compras
    fetch(listarCompras)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.datos && Array.isArray(data.datos)) {
          // Filtra los datos según el texto de búsqueda
          const filteredData = data.datos.filter((compra) => {
            // Reemplaza 'productoX' con el valor de la búsqueda
            const searchTerm = searchText.toLowerCase();
            return compra.detallesCompra.some(
              (detalle) => detalle.producto.nombre.toLowerCase() === searchTerm
            );
          });

          // Extrae las fechas y la cantidad de compras del producto encontrado
          const labels = filteredData.map((compra) => compra.fecha);
          const dataValues = filteredData.map((compra) =>
            compra.detallesCompra.find(
              (detalle) => detalle.producto.nombre.toLowerCase() === searchText.toLowerCase()
            ).cantidad
          );

          setProductData({
            labels: labels,
            datasets: [
              {
                label: `Compras de ${searchText} a lo largo del tiempo`,
                data: dataValues,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
              },
            ],
          });
        } else {
          console.error('La respuesta de la API no contiene datos válidos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de compras', error);
      });
  }, [searchText]);

  return (
    <div>
      <h2>Estadística de Compras por Producto</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div style={{ height: '400px', width: '600px' }}>
        <Line data={productData} />
      </div>
    </div>
  );
};

export default GraficoAumentoDecremento; */

