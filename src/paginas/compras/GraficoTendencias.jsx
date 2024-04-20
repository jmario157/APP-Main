import React, { useEffect, useState } from "react";
import { listarCompras } from "../../components/apiUrls";
import { Line } from "react-chartjs-2";

const GraficoTendenciasPrecios = () => {
  const [productoNombre, setProductoNombre] = useState("Cemento");
  const [preciosPromedio, setPreciosPromedio] = useState([]);
  const [productoIngresado, setProductoIngresado] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(listarCompras);
        if (!response.ok) {
          throw new Error("No se pudo obtener los datos de compras");
        }
        const data = await response.json();

       
        const precios = [];

        data.datos.forEach((compra) => {
          const fecha = new Date(compra.fecha).toLocaleDateString();
          compra.detallesCompra.forEach((detalle) => {
            if (detalle.producto.nombre === productoNombre) {
              const precioPromedio = detalle.costo / detalle.cantidad;
              precios.push({ fecha, precioPromedio });
            }
          });
        });

        setPreciosPromedio(precios);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [productoNombre]);

  const handleProductoChange = (e) => {
    setProductoNombre(e.target.value);
  };

  return (
    <div>
      <h2>Tendencias de Precios</h2>
      <input
        type="text"
        placeholder="Ingrese el nombre del producto"
        value={productoNombre}
        onChange={handleProductoChange}
      />
      <Line
        data={{
          labels: preciosPromedio.map((item) => item.fecha),
          datasets: [
            {
              label: `Precio Promedio de ${productoNombre}`,
              data: preciosPromedio.map((item) => item.precioPromedio),
              fill: true,
              tension:0.5 ,
              borderColor: "rgba(75, 192, 192, 1)",
            },
          ],
        }}
      />
    </div>
  );
};

export default GraficoTendenciasPrecios;

