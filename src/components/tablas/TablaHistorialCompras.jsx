import React, { useEffect, useState, Button } from "react";
import $ from 'jquery';
import { createRoot } from "react-dom/client";
import { AxiosPrivado } from "../axios/Axios";
import { mostraAlertaError } from "../Alerts/sweetAlert";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import { listarCompras, listarProveedores, imagenCompra } from "../apiUrls";
import DetallesCompraModal from "../../components/modals/Compras/ModalInformacionCompras";
import ReactDOM from 'react-dom';
import { Modal } from "react-bootstrap";


const TablaCompras = (props) => {
    const [listaCompras, setListaCompras] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [listaProveedores, setListaProveedores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState(null);
    const [ urlImagen, setUrlImagen] = useState(imagenCompra + "factura-vacia.png");
    
    useEffect(() => {
        ActualizarTabla();
    }, []);

    useEffect(() => {
        crearTabla();
    }, [listaCompras]);

    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        try {
            const responseProveedores = await AxiosPrivado.get(listarProveedores);
            setListaProveedores(responseProveedores.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("Error al cargar la lista de proveedores");
        }
    };

    const ActualizarTabla = async () => {
        try {
            setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarCompras);
            setListaCompras(response.data.datos);
            console.log(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde, Revise su conexión");
        }
        setCargandoDatos(false);
    }

    const obtenerNombreProveedor = (idProveedor) => {
        const proveedor = listaProveedores.find((p) => p.id === idProveedor);
        return proveedor ? proveedor.nombre : "Proveedor no encontrado";
    }

    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const fechaFormateada = fechaObj.toLocaleDateString() + " - " + fechaObj.toLocaleTimeString();
        return fechaFormateada;
      };
    
    

    const mostrarDetallesCompra = (compra) => {
        console.log(compra);
        setShowModal(true);
        setCompraSeleccionada(compra);
    }

    const crearTabla = () => {
        if ($.fn.DataTable.isDataTable("#tablaCompras")) {
            $("#tablaCompras").DataTable().destroy();
        }

        let table = new DataTable("#tablaCompras", {
            data: listaCompras.map((compra) => ({
                ...compra,
                nombreProveedor: obtenerNombreProveedor(compra.proveedorId),
            })),
            columns: [
                { 
                    "targets": 0,
                    "data": "id", 
                    "title": "ID" 
                },
                { 
                    "targets": 1,
                    "data": "numerofactura", 
                    "title": "Número de Factura"
                 },
                {
                    "targets": 2,
                     "data": "nombreProveedor", 
                     "title": "Proveedor",
                },
                { 
                    "targets": 3,
                    "data": "fecha", 
                    "title": "Fecha" , 
                    render: function (data) {
                    // Llama a la función formatearFecha para formatear la fecha
                    return formatearFecha(data);
                }},
                {
                    data: null,
                     title: "Opciones",
                     // Add a button that implements the DetallesCompraModal Modal
                     createdCell: (cell, cellData) => {
                        
                        ReactDOM.render(
                            <button
                                className="btn btn-primary"
                                onClick={() => mostrarDetallesCompra(cellData)}
                            >
                                Ver Detalles
                            </button>,
                            cell
                        );},
                    
                },
            ],
            "paging": true,
            "lengthChange": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            destroy: true,
            drawCallback: function () {
                $('.dataTables_filter').find("[aria-controls='tablaCompras']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    return (
        <div>
            <table
                id="tablaCompras"
                className="table table-bordered table-hover"
            ></table>
            
            {compraSeleccionada && (
            <DetallesCompraModal
                compra={compraSeleccionada}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        )}
      

        </div>
    );
}

export default TablaCompras;

