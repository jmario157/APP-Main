// import React, { useState, useEffect } from "react";
// import { Button, Modal } from "react-bootstrap";
// import { mostraAlerta, mostraAlertaWarning } from "../../Alerts/sweetAlert";
// import { guardarProductos, editarProductos } from "../../apiUrls"; // Importa las URL de la API aquí
// import { AxiosPrivado } from "../../axios/Axios";
// import ModalInformacionProducto from "./modalInformacionProducto";

// function ModalProductoForm({ accion, datosProducto, ActualizarTabla }) {
//   const [showModal, setShowModal] = useState(false);
//   const [showModalInformacion, setShowModalInformacion] = useState(false);
//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);
//   const[valorImpuesto, setValorImpuesto] = useState(0);
//   const [errorNombreProducto, setErrorNombreProducto] = useState(false);
  
//   const [formProducto, SetFormProducto] = useState({
//     id: null,
//     nombre: "",
//     descripcion: "",
//     costo: 0,
//     existencia: 0,
//     codigobarra: "",
//     codigocatalogo: "",
//     impuesto: "Exento",
//   });

//   useEffect(() => {
//     if (datosProducto != null) {
//       SetFormProducto({
//         id: datosProducto.id,
//         nombre: datosProducto.nombre,
//         descripcion: datosProducto.descripcion,
//         costo: datosProducto.costo,
//         existencia: datosProducto.existencia,
//         codigobarra: datosProducto.codigobarra,
//         codigocatalogo: datosProducto.codigocatalogo,
//         impuesto: datosProducto.impuesto,
//       });
//     } else {
     
//       limpiarCampos();
//     }
//   }, [datosProducto]);

//   useEffect(() => {
//     const calcularImpuesto = () => {
//       const costo = parseFloat(formProducto.costo);
//       const impuesto = formProducto.impuesto ? parseFloat(formProducto.impuesto.replace("%", "")) : 0;
//       if (!isNaN(costo) && !isNaN(impuesto)) {
//         const impuestoCalculado = (costo * impuesto)/100;
//         setValorImpuesto(impuestoCalculado);
//       } else{
//         setValorImpuesto(0);
//       }
//     };
//     calcularImpuesto();
//   },[formProducto.costo,formProducto.impuesto]);


//   const validateForm = () => {
//     let valid = true;

//     // Validación del nombre del proveedor
//     if (formProducto.nombre === "") {
//       setErrorNombreProducto(true);
//       mostraAlerta("Por favor, ingrese el nombre del producto.", "warning");
//       valid = false;
//     } else {
//         setErrorNombreProducto(false);
//     }
//     return valid;
//   };

//   const saveProductos = async () => {
//     console.log(formProducto);
//     if (!validateForm()) {
//       return;
//     }

  

//     try {
//       await AxiosPrivado.post(guardarProductos, formProducto).then((response) => {
//         console.log("Respuesta:", response.data);
//         console.log(response);
//         if (response.data.tipo == 1) {
//           mostraAlerta(response.data.msj, "Success");
//           ActualizarTabla();
//           limpiarCampos();
//           handleClose();
//         } else if (response.data.tipo === 0) {
//           if (response.data.msj.isArray) {
//             response.data.msj.forEach((element) => {
//               console.log(element.campo + " " + element.msj);
//               mostraAlertaWarning("El campo: " + element.campo + ", " + element.msj);
//             });
//           } else {
//             mostraAlertaWarning(response.data.msj);
//           }
//         } else if (response.data.tipo === 2) {
//           if (response.data.msj.isArray) {
//             response.data.msj.forEach((element) => {
//               console.log(element.campo + " " + element.msj);
//               mostraAlertaWarning("El campo: " + element.campo + ", " + element.msj);
//             });
//           } else {
//             mostraAlertaWarning(response.data.msj);
//           }
//         }
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       mostraAlerta("Error al ejecutar la petición", "warning");
//     }
//   };

//   const manejadorProducto = (event) => {
//     const { name, value } = event.target;

//     if (name === "existencia" || name === "costo") {
//       // Validar que el valor no sea negativo
//       if (parseFloat(value) < 0) {
//         // Mostrar un mensaje de error o realizar la validación que desees
//         mostraAlerta("No se permiten valores negativos", "warning");
//         return;
//       }
//     }
  
//     SetFormProducto({
//       ...formProducto,
//       [name]: value,
//     });
//   };



//   const modificarProducto = () => {
//     console.log(formProducto)
//     if (formProducto.id === null) {
//       mostraAlerta("Debe seleccionar un producto", "warning");
//       return;
//     }
//     if (formProducto.nombre == "") {
//       console.log("El campo nombre solo debe contener letras");
//       setErrorNombreProducto(true);
//       mostraAlerta("El campo nombre solo debe contener como mínimo 3 letras", "warning");
//       return;
//     }
//     setErrorNombreProducto(false);

//     AxiosPrivado.put(editarProductos + formProducto.id, formProducto).then((response) => {
//       console.log("Respuesta:", response.data);
//       if (response.data.tipo === 1) {
//         ActualizarTabla();
//         mostraAlerta(response.data.msj, "Success");
//         handleClose();
//       } else if (response.data.tipo === 0) {
//         mostraAlerta(response.data.msj);
//       } else if (response.data.tipo === 2) {
//         mostraAlerta(response.data.msj);
//       }
//     }).catch((error) => {
//       console.error("Error: ", error);
//       mostraAlerta(error);
//     });
//   };

//   const limpiarCampos = () => {
//     SetFormProducto({
//         id: null,
//         nombre: "",
//         descripcion: "",
//         costo: 0,
//         existencia: 0,
//         codigobarra: "",
//         codigocatalogo: "",
//         impuesto: "Exento",
//     });

//     setErrorNombreProducto(false);
//   };

//   const handleOpenModal = () => {
//     setShowModalInformacion(true);
//   }

//   return (
//     <>
//       {accion ? (
//         <div>
//           <Button variant="primary" onClick={handleShow}>
//             Agregar Producto
//           </Button>
//         </div>
//       ) : (
//         <div>
//           <Button variant="info" onClick={handleOpenModal}>
//             <i className="fas fa-folder">
//             </i>
//           </Button>

//           <Button variant="warning" onClick={handleShow}>
//             <i className="fas fa-pencil-alt"></i>
//           </Button>
//         </div>
//       )}

//       <Modal show={showModal} onHide={handleClose} className="modal fade">
//         <div className="modal-header modal-primary">
//           <h4 className="modal-title text-primary">Formulario Producto</h4>
//           <button
//             type="button"
//             className="close"
//             data-dismiss="modal"
//             aria-label="Close"
//             onClick={handleClose}
//           >
//             <span aria-hidden="true">&times;</span>
//           </button>
//         </div>
//         <div className="modal-body">
//           <form>
//             <div className="card-body">
//               <div className="form-group">
//                 <label htmlFor="nombreProducto">Nombre del Producto</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errorNombreProducto ? "is-invalid" : ""}`}
//                   id="text"
//                   placeholder="Ingrese el nombre del producto"
//                   name="nombre"
//                   value={formProducto.nombre}
//                   onChange={manejadorProducto}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="descripcion">Descripcion de producto</label>
//                 <textarea
//                      className="form-control"
//                      rows={3}
//                      placeholder="Ingrese una descripcion del producto"
//                      value={formProducto.descripcion}
//                      name="descripcion"
//                      onChange={manejadorProducto}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="existencia">Existencias</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errorNombreProducto ? "is-invalid" : ""}`}
//                   id="existencia"
//                   placeholder="Ingrese existencias del producto"
//                   name="existencia"
//                   value={formProducto.existencia}
//                   onChange={manejadorProducto}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="costo">Costo</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errorNombreProducto ? "is-invalid" : ""}`}
//                   id="costo"
//                   placeholder="Ingrese costo del producto"
//                   name="costo"
//                   value={formProducto.costo}
//                   onChange={manejadorProducto}
//                 />
//               </div>

//               <div className="form-group">
//   <label htmlFor="impuesto">Tipo Impuesto</label>
//   <select
//     className="form-control"
//     id="impuesto"
//     name="impuesto"
//     value={formProducto.impuesto}
//     onChange={manejadorProducto}
//   >
//     <option value="15%">15%</option>
//     <option value="18%">18%</option>
//     <option value="Exento">Exento</option>
//   </select>
// </div>

// <div className="form-group">
//   <label htmlFor="impuestoCalculado">Valor de Impuesto</label>
//   <input
//    type="text"
//    className="form-control"
//    id="impuestoCalculado"
//    value={valorImpuesto.toFixed(2)}
//    readOnly
//    />
// </div>


//               <div className="form-group">
//                 <label htmlFor="codigobarra">Codigo de Barra</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errorNombreProducto ? "is-invalid" : ""}`}
//                   id="codigobarra"
//                   placeholder="Ingrese costo del codigo de barra"
//                   name="codigobarra"
//                   value={formProducto.codigobarra}
//                   onChange={manejadorProducto}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="codigocatalogo">Codigo de Catalogo</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errorNombreProducto ? "is-invalid" : ""}`}
//                   id="codigocatalogo"
//                   placeholder="Ingrese costo del codigo de catalogo"
//                   name="codigocatalogo"
//                   value={formProducto.codigocatalogo}
//                   onChange={manejadorProducto}
//                 />
//               </div>

              
//             </div>
//           </form>
//         </div>

//         <div className="modal-footer">
//           <div className="card-footer">
//             <Button variant="secondary" onClick={handleClose}>
//               Cerrar
//             </Button>
//             <span style={{ margin: "0 12px" }}></span>
//             <Button variant="warning" onClick={limpiarCampos}>
//               Limpiar Campos
//             </Button>
//             <span style={{ margin: "0 12px" }}></span>
//             {accion ? (
//               <Button variant="primary" onClick={saveProductos}>
//                 Guardar
//               </Button>
//             ) : (
//               <Button variant="info" onClick={modificarProducto}>
//                 Modificar
//               </Button>
//             )}
//           </div>
//         </div>
//       </Modal>
//       <ModalInformacionProducto datos={datosProducto} showModal={showModalInformacion} setShowModalInformacion={setShowModalInformacion}></ModalInformacionProducto>
//     </>
//   );
// } 

// export default ModalProductoForm;