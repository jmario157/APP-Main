import { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Button, Modal } from "react-bootstrap";
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';


const BuscarContrato = ({lista, buscarIdContrato}) => {
    const [verModal, setVerModal] = useState(false);
    const cerrarModal = () => setVerModal(false);
    const ver = () => setVerModal(true);

    useEffect(() => {
        //CrearTabla();
    }, []);
    useEffect(() => {
        CrearTabla();
    }, [verModal]);
    const CrearTabla = () => {
        let table = new DataTable('#tablaContratos', {
            data: lista,
            "columnDefs": [
                {
                    "targets": 0,
                    "data": "id",
                    "title": "Id",
                },
                {
                    "targets": 1,
                    "data": "fechaInicio",
                    "title": "Fecha",
                },
                {
                    "targets": 2,
                    "data": "plazo",
                    "title": "Plazo",
                },
                {
                    "targets": 3,
                    "data": "tasa",
                    "title": "Tasa",
                },
                {
                    "targets": 4,
                    "data": "cuota",
                    "title": "Cuota",
                },
                {
                    "targets": 5,
                    "data": "estado",
                    "title": "Estado",
                },
                {
                    "targets": 6,
                    "data": null,
                    "title": "Opciones",
                    createdCell: (td, cellData, rowData, row, col) => {
                        const root = createRoot(td);
                        root.render(
                            <Button value={rowData.id} onClick={e => seleccionContrato(e, "value")}>Selecionar</Button>
                        );
                    }
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
                $('.dataTables_filter').find("[aria-controls='tablaContratos']").addClass('form-control');
                $('.paginate_button').addClass('btn btn-outline-dark page-item');
            }
        });
    }

    const seleccionContrato = (e)=>{
        const con = e.target.value
        buscarIdContrato(con)
        cerrarModal();
    }

    return (
        <div className="input-group-prepend">
            <Button className="input-group-text" onClick={ver}>
                <i className="fa fa-search"></i>
            </Button>
            <Modal show={verModal} onHide={cerrarModal} className="modal fade" size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Buscar Contrato</h4>
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
                    
                    <table id="tablaContratos" className="table table-bordered table-hover">
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
export default BuscarContrato;