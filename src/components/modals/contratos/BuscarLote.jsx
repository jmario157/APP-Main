import { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Button, Modal } from "react-bootstrap";
import { useContextContrato } from "../../../contexto/contratos/ContratoContext";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';


const BuscarLote = ({lista, buscarIdlote}) => {
    const [verModal, setVerModal] = useState(false);
    const cerrarModal = () => setVerModal(false);
    const ver = () => setVerModal(true);
    const { lotes, setLotes } = useContextContrato();
    useEffect(() => {
        //CrearTabla();
    }, []);
    useEffect(() => {
        CrearTabla();
    }, [verModal]);
    const CrearTabla = () => {
        let table = new DataTable('#tablaLotes', {
            data: lista,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "nombre",
                    "title": "Lote",
                    "searchable": false,
                    render: (data, type, row) => row.proyecto.nombre + ", " + row.etapa.nombre + ", " + row.bloque.nombre + ", " + row.nombre
                },
                {
                    "targets": 1,
                    "data": "prima",
                    "title": "Prima",
                    "searchable": false,
                    render: (data, type, row) => "L "+ new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.prima)
                },
                {
                    "targets": 2,
                    "data": "valor",
                    "title": "Valor",
                    "searchable": false,
                    render: (data, type, row) => "L "+ new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(row.valor)
                },
                {
                    "targets": 3,
                    "data": null,
                    "title": "Opciones",
                    "searchable": false,
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <Button value={rowData.id} onClick={e => seleccionLote(e, "value")}>Selecionar</Button>
                        );
                    }
                },
                {
                    "targets": 4,
                    "data": "proyecto.nombre",
                    "title": "Proyecto",
                    visible: false
                },
                {
                    "targets": 5,
                    "data": "etapa.nombre",
                    "title": "Etapa",
                    visible: false
                },
                {
                    "targets": 6,
                    "data": "bloque.nombre",
                    "title": "Bloque",
                    visible: false
                },
                {
                    "targets": 7,
                    "data": "nombre",
                    "title": "Lote",
                    visible: false
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
                $('.dataTables_filter').find("[aria-controls='tablaLotes']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    const seleccionLote = (e)=>{
        const lote = e.target.value
        buscarIdlote(lote)
        /*const loteSeleccionado = lista.find(
            (f) =>
                f.id == lote
        );

        if (loteSeleccionado) {
            var l = lotes;
            l.push(loteSeleccionado);
            setLotes(l);
            mostraAlertaOk("Lote seleccionado");
        }
        else {
            mostraAlertaOk("No se selecciono ningun lote");
        }*/
        cerrarModal();
    }

    return (
        <div className="input-group-prepend">
            <Button className="input-group-text" onClick={ver}>
                <i className="fa fa-search"></i>
            </Button>
            <Modal show={verModal} onHide={cerrarModal} className="modal fade" size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Buscar Lote</h4>
                    <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={cerrarModal}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    
                    <table id="tablaLotes" className="table table-bordered table-hover">
                    </table>
                </div>
                <div className="modal-footer ">
                    <div className="card-footer">
                        <Button variant="secondary" onClick={cerrarModal}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default BuscarLote;