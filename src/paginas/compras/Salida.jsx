import React, { useContext, useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import  BuscarProducto  from '../../components/modals/Compras/BuscarProducto';
import  BuscarEmpleado from '../../components/modals/Compras/BuscarEmpleado';
import { SalidaContext } from '../../contexto/compra/SalidaContext';
import { guardarSalidas } from '../../components/apiUrls';
import { mostraAlerta } from '../../components/Alerts/sweetAlert';
import { AxiosPrivado } from '../../components/axios/Axios';

const Salidas = () => {
  const { listaProductos, listaEmpleados } = useContext(SalidaContext);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [nombreEmpleado, setNombreEmpleado] = useState('Seleccione un Empleado');
  const [nombreProducto, setNombreProducto] = useState('Seleccione un Producto');
  const [costoProducto, setCostoProducto] = useState(0);
  const [idProducto, setIdProducto] = useState(null);
  const [idEmpleado, setIdEmpleado] = useState(null);
  const [total, setTotal] = useState(0);

  const buscarIdEmpleado = (id) => {
    const empleado = listaEmpleados.find((e) => e.id == id);
    const empleadoId = id;
    if (empleado) {
      setIdEmpleado(empleadoId);
      const nombreCompleto = `${empleado.primernombre} ${empleado.segundonombre} ${empleado.primerapellido} ${empleado.segundoapellido}`;
      setNombreEmpleado(nombreCompleto);
    }
  };

  const buscarIdProducto = (id) => {
    const producto = listaProductos.find((p) => p.id == id);
    const productoId = id;
    if (producto) {
      setNombreProducto(producto.nombre);
      setCostoProducto(producto.costo);
      setIdProducto(productoId);
    }
  };

  const agregarProductoATabla = () => {
    if (nombreProducto !== 'Seleccione un Producto') {
      const productoExistente = productoSeleccionado.find((p) => p.id === idProducto);

      if (productoExistente) {
        mostraAlerta('El producto ya ha sido agregado a la tabla', 'warning');
        return;
      }

      const nuevoProducto = {
        id: idProducto,
        nombre: nombreProducto,
        cantidad: 0,
        costo: costoProducto,
      };

      setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
      setNombreProducto('Seleccione un Producto');
    }
  };

  const editarCantidad = (index, nuevaCantidad) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos[index].cantidad = nuevaCantidad;
    nuevosProductos[index].subtotal = nuevaCantidad * nuevosProductos[index].costo;
    setProductoSeleccionado(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const editarCosto = (index, nuevoCosto) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos[index].costo = nuevoCosto;
    nuevosProductos[index].subtotal = nuevoCosto * nuevosProductos[index].cantidad;
    setProductoSeleccionado(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const calcularTotal = (productos) => {
    const nuevoTotal = productos.reduce((acc, producto) => {
      return acc + producto.subtotal;
    }, 0);
    setTotal(nuevoTotal);
  };

  const quitarProducto = (index) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos.splice(index, 1);
    setProductoSeleccionado(nuevosProductos);
  };

  const limpiarCampos = () => {
    setEmpleadoSeleccionado(null);
    setNombreEmpleado('Seleccione un Empleado');
    setProductoSeleccionado([]);
    setNombreProducto('Seleccione un Producto');
    setIdProducto(null);
    setIdEmpleado(null);
    setTotal(0);
  };

  const guardarSalida = async () => {
    const cantidadesValidas = productoSeleccionado.every(
      (producto) => producto.cantidad > 0 && producto.costo > 0
    );

    // Validar campos necesarios
    if (!idEmpleado) {
      console.error('Debes seleccionar un empleado.');
      mostraAlerta('Debes seleccionar un empleado.', 'warning');
      return;
    }

    if (productoSeleccionado.length === 0) {
      console.error('Debes agregar al menos un producto a la salida.');
      mostraAlerta('Debes agregar al menos un producto a la salida.', 'warning');
      return;
    }

    if (!cantidadesValidas) {
      console.error('Asegúrate de que la cantidad y el costo sean mayores a 0.');
      mostraAlerta('Asegúrate de que la cantidad y el costo sean mayores a 0.', 'warning');
      return;
    }

    try {
      // Prepara los datos de la salida y detalles
      const datosSalida = {
        empleadoId: parseInt(idEmpleado),
        detallesSalida: productoSeleccionado.map((producto) => ({
          idProducto: producto.id,
          cantidad: parseInt(producto.cantidad),
          costo: parseFloat(producto.costo),
        })),
      };

      // Envía los datos al servidor utilizando AxiosPrivado.post
      const respuesta = await AxiosPrivado.post(guardarSalidas, datosSalida);

      if (respuesta && respuesta.data.tipo === 1) {
        // Limpia los campos después de guardar con éxito
        limpiarCampos();
        mostraAlerta('Salida guardada con éxito.', 'success');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      mostraAlerta('Error en la solicitud al servidor.', 'error');
    }
  };

  const renderTablaProductos = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Costo</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Quitar</th>
          </tr>
        </thead>
        <tbody>
          {productoSeleccionado.map((producto, index) => (
            <tr key={index}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>
                {producto.costo} 
              </td>
              <td>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => editarCantidad(index, e.target.value)}
                />
              </td>
              <td>{producto.cantidad * producto.costo}</td>
              <td>
                <Button variant="danger" onClick={() => quitarProducto(index)}>
                  Quitar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="content-wrapper">
      <Row>
        <Col>
          <section className="content">
            <div className="container-fluid">
              <Row>
                <Col>
                  <div className="card card-primary card-outline">
                    <div className="card-header">
                      <h3 className="card-title">Información General</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Form.Label>Producto</Form.Label>
                            <div className="input-group">
                              <Form.Control type="text" value={nombreProducto} readOnly />
                              <BuscarProducto lista={listaProductos} buscarIdProducto={buscarIdProducto} />
                              <Button variant="primary" onClick={agregarProductoATabla}>
                                Agregar a la tabla
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Form.Label>Empleado</Form.Label>
                            <div className="input-group">
                              <Form.Control type="text" value={nombreEmpleado} readOnly />
                              <BuscarEmpleado lista={listaEmpleados} buscarIdEmpleado={buscarIdEmpleado} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <Form.Label>Total</Form.Label>
                              <div className="input-group">
                                <Form.Control type="text" value={total} readOnly />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </Col>
      </Row>

      <Row>
        <Col>
          <section className="content">
            <div className="container-fluid">
              <Row>
                <Col>
                  <div className="card card-primary card-outline">
                    <div className="card-header">
                      <h3 className="card-title">Productos Seleccionados</h3>
                    </div>
                    <div className="card-body">{renderTablaProductos()}</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" onClick={guardarSalida} className="mt-3">
                    Guardar Salida
                  </Button>
                </Col>
              </Row>
            </div>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default Salidas;
