import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import BuscarProducto from "../../components/modals/Compras/BuscarProducto";
import BuscarProveedor from "../../components/modals/Compras/BuscarProveedor";
import { CompraContext } from "../../contexto/compra/CompraContext";
import { guardarCompras, imagenCompra, comprasEditarImagen } from "../../components/apiUrls";
import { mostraAlerta } from "../../components/Alerts/sweetAlert";
import { set } from "date-fns";
import { AxiosPrivado, AxiosImagen } from "../../components/axios/Axios";
import CompraModal from "../../components/modals/Compras/modalPagoCompra";

const Compras = () => {
  const { listaProductos, listaProveedores, caja } = useContext(CompraContext);
  //console.log("IDCAJA",caja.id)
  //const {  caja, CargarDatosCaja } = useContext(CajaContext);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [nombreProveedor, setNombreProveedor] = useState("Seleccione un Proveedor");
  const [nombreProducto, setNombreProducto] = useState("Seleccione un Producto");
  const [idProducto, setIdProducto] = useState(null);
  const [idProveedor, setIdProveedor] = useState(null);
  const [ total, setTotal] = useState(0);
  const [numeroFactura, setNumeroFactura] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [datosCompraModal, setDatosCompraModal]= useState(null);

  const handleAbrirModal = () => {
    if( productoSeleccionado.length > 0 && total > 0){
      setModalVisible(true);
      setDatosCompraModal({
        numerofactura: numeroFactura,
        proveedorId: idProveedor,
        cajaId: caja.id,
        detallesCompra: productoSeleccionado.map((producto) => ({
          idProducto: producto.id,
          cantidad: parseInt(producto.cantidad),
          costo: parseFloat(producto.costo),
        })),
      });
    }else{
      console.error("No hay productos en la compra o el total es 0.");
      mostraAlerta("No hay productos en la compra o el total es cero.", "warning");
    }
  }
 
console.log(caja.id);
  // Definir la función buscarIdProveedor en Compras
  const buscarIdProveedor = (id) => {
    const proveedor = listaProveedores.find((f) => f.id == id);
    const Proveedorid = id;
    if (proveedor) {
      setIdProveedor(Proveedorid);
      setNombreProveedor(proveedor.nombre);
    }
    console.log(idProveedor);
  };

  // Función para seleccionar un producto
  const buscarIdProducto = (id) => {
    const producto = listaProductos.find((f) => f.id == id);
    const Productoid = id;
    if (producto) {
      setNombreProducto(producto.nombre);
      setIdProducto(Productoid);
    }
  };

  const agregarProductoATabla = () => {
    if (nombreProducto !== "seleccione Producto") {
      const productoExistente = productoSeleccionado.find((producto) => producto.id === idProducto);
      
      if(productoExistente) {
        mostraAlerta("El producto ya ha sido agregado a la tabla","warning");
        return;
      }
      const nuevoProducto = {
        id: idProducto,
        nombre: nombreProducto,
        cantidad: 0,
        costo: 0,
      };
      setProductoSeleccionado([...productoSeleccionado, nuevoProducto]);
      setNombreProducto("seleccione Producto");
    }
  };

  const editarCantidad = (index, nuevaCantidad) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos[index].cantidad = nuevaCantidad;
    nuevosProductos[index].subtotal = nuevaCantidad*nuevosProductos[index].costo; 
    setProductoSeleccionado(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const editarCosto = (index, nuevoCosto) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos[index].costo = nuevoCosto;
    nuevosProductos[index].subtotal = nuevoCosto*nuevosProductos[index].cantidad;
    setProductoSeleccionado(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  const calcularTotal = (productos) => {
    const nuevoTotal = productos.reduce((acc, producto) => {
      return acc + producto.subtotal;
    },0);
    setTotal(nuevoTotal);
  };

  const quitarProducto = (index) => {
    const nuevosProductos = [...productoSeleccionado];
    nuevosProductos.splice(index, 1);
    setProductoSeleccionado(nuevosProductos);
  };

  const limpiarCampos = () => {
    setProveedorSeleccionado(null);
    setNombreProveedor("Seleccione un Proveedor");
    setProductoSeleccionado([]);
    setNombreProducto("Seleccione un Producto");
    setIdProducto(null);
    setIdProveedor(null);
    setTotal(0);
    setNumeroFactura("");
  };

  const guardarCompra = async (datosAdicionales) => {
    const cantidadesValidas = productoSeleccionado.every((producto) => producto.cantidad > 0 && producto.costo > 0);
  
    // Validar campos necesarios
    if (!idProveedor) {
      console.error("Debes seleccionar un proveedor.");
      mostraAlerta("Debes seleccionar un proveedor.", "warning");
      return;
    }
  
    if (productoSeleccionado.length === 0) {
      console.error("Debes agregar al menos un producto a la compra.");
      mostraAlerta("Debes agregar al menos un producto a la compra.", "warning");
      return;
    }
  
    if (!numeroFactura) {
      console.error("Debes incluir el número de Factura.");
      mostraAlerta("Debes incluir el número de Factura.", "warning");
      return;
    }
  
    if (!cantidadesValidas) {
      console.error("Asegúrate de que la cantidad y el costo sean mayores a 0.");
      mostraAlerta("Asegúrate de que la cantidad y el costo sean mayores a 0.", "warning");
      return;
    }
  
    try {
      // Prepara los datos de compra y detalles
      const datosCompra = {
        numerofactura: numeroFactura,
        proveedorId: parseInt(idProveedor),
        cajaId: parseInt(caja.id),
        monto: total,
        detallesCompra: productoSeleccionado.map((producto) => ({
          idProducto: producto.id,
          cantidad: parseInt(producto.cantidad),
          costo: parseFloat(producto.costo),
        })),
        ...datosAdicionales,
      };
  
      // Envía los datos al servidor utilizando AxiosPrivado.post
      const respuesta = await AxiosPrivado.post(guardarCompras, datosCompra);
  
      if (respuesta && respuesta.data.tipo === 1) {
        console.log(respuesta.data)
        console.log("imprimiendo id compra")
        const compraId = respuesta.data.datos.compra.id
        console.log("imprimiendo id compra")
        console.log(compraId)
        if(imagenSeleccionada){
          const formData = new FormData();
          formData.append('imagen', imagenSeleccionada);

          const imagenResponse = await AxiosImagen.put(comprasEditarImagen + compraId, formData)
          console.log("si esta llegando aqui")
          if (imagenResponse.data.tipo === 1) {
            // Limpia los campos después de guardar con éxito
            limpiarCampos();
            mostraAlerta("Compra guardada con éxito.", "success");
          } else {
            // Manejar errores si la subida de la imagen falla
            console.error("Error al subir la imagen:", imagenResponse.data.msj);
            mostraAlerta("Error al subir la imagen.", "error");
          }
          
        }else {
          // Limpia los campos después de guardar con éxito
          limpiarCampos();
          mostraAlerta("Compra guardada con éxito.", "success");
        /*mostraAlerta("Compra guardada con éxito.", "success");
        // Limpia los campos después de guardar con éxito
        limpiarCampos();*/
      }
    }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      mostraAlerta("Error en la solicitud al servidor.", "error");
    }
  };

  const renderTablaProductos = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Costo</th>
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
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => editarCantidad(index, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={producto.costo}
                  onChange={(e) => editarCosto(index, e.target.value)}
                />
              </td>
              <td>{producto.cantidad*producto.costo}</td>
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
                              <Form.Control
                                type="text"
                                value={nombreProducto}
                                readOnly
                              />
                               <BuscarProducto
                          lista={listaProductos}
                          buscarIdProducto={buscarIdProducto}
                        />
                              <Button
                                variant="primary"
                                onClick={agregarProductoATabla}
                              >
                                Agregar a la tabla
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <Form.Label>Proveedor</Form.Label>
                            <div className="input-group">
                              <Form.Control
                                type="text"
                                value={nombreProveedor}
                                readOnly
                              />
                              <BuscarProveedor
                                lista={listaProveedores}
                                buscarIdProveedor={buscarIdProveedor}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <Form.Label>Número de Factura</Form.Label>
                              <div className="input-group">
                                <Form.Control
                                  type="text"
                                  value={numeroFactura}
                                  onChange={(e) => setNumeroFactura(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <Form.Label>Total</Form.Label>
                              <div className="input-group">
                                <Form.Control
                                  type="text"
                                  value={total}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <Form.Label>Imagen de Factura</Form.Label>
                          <div className="input-group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImagenSeleccionada(e.target.files[0])}
                            />
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
                  <Button
                    variant="primary"
                    onClick={handleAbrirModal}
                    className="mt-3"
                  >
                    Guardar Compra
                  </Button>
                </Col>
              </Row>
              {modalVisible && (
  <CompraModal
    onHide={() => setModalVisible(false)}
    guardarCompra={guardarCompra}
    datosCompra={datosCompraModal}
    monto={total}
  />
)}
            </div>
          </section>
        </Col>
      </Row>
    </div>
    
  );
};


export default Compras;





