import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { AxiosPrivado } from "../../axios/Axios";
import { buscarIdClienteContrato } from "../../apiUrls";
import moment from "moment";
import $ from 'jquery';
import DataTable from "datatables.net-dt";
import "datatables.net-responsive-dt";

const ModalInformacionContrato = ({ contrato, showModal, setShowModal }) => {
  const [amortizaciones, setAmortizaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = React.createRef();
  console.log("CONTRATO", contrato)
  console.log("AMORT", amortizaciones)

  useEffect(() => {
    const obtenerAmortizaciones = async () => {
      try {
        const response = await AxiosPrivado.get(
          buscarIdClienteContrato + contrato.clienteId
        );

        const contratoSeleccionado = response.data.datos.find(
          (c) => c.id === contrato.id
        );

        if (contratoSeleccionado) {
          setAmortizaciones(contratoSeleccionado);
        } else {
          console.error("Contrato no encontrado en la respuesta.");
        }
      } catch (error) {
        console.error("Error al obtener amortizaciones:", error);
      }
    };

    if (showModal) {
      obtenerAmortizaciones();
    }
  }, [showModal, contrato.id, contrato.clienteId]);

  useEffect(() => {
    if (amortizaciones && amortizaciones.contratocuota) {
      CrearTabla();
    }
  }, [amortizaciones]);

  const CrearTabla = () => {
    const dataTable = $(tableRef.current).DataTable({
      data: amortizaciones.contratocuota,
      pageLength: itemsPerPage,
      lengthMenu: [10, 25, 50, 75, 100],
      columns: [
        { data: "numero", title: "Número" },
        {
          data: "fechapago",
          title: "Fecha de Pago",
          render: (data, type, row) => moment(row.fechapago).format("L"),
        },
        { data: "cuota", title: "Cuota",
        render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
          minimumFractionDigits: 2,
        }).format(row.cuota)
      },
        {
          data: "amortizacioncapital", title: "Capital",
          render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
          }).format(row.amortizacioncapital)
        },
        {
          data: "intereses", title: "Intereses",
          render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
          }).format(row.intereses)
        },
        {
          data: "saldocapital", title: "Saldo Capital",
          render: (data, type, row) => "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
          }).format(row.saldocapital)
        },
        {
          data: "estado",
          title: "Estado",
          render: (data, type, row) => {
            const estadoText =
              row.estado === "PE" ? "Pago Pendiente" : "Pago Realizado";
            return estadoText;
          },
        },
      ], fnRowCallback: (nRow, aData, iDisplayIndex, iDisplayIndexFull) => {
        const estado = aData.estado;
        const estadoText =
          estado === "PE" ? "Pago Pendiente" : "Pago Realizado";
        const fondoColor = estado === "PE" ? "#DF2E38" : "#5D9C59";
        const textoColor = estado === "PE" ? "white" : "white";
        const bordesCurvados = "border-radius: 5px;";
        const paddingMayor = "padding: 4px;";

        $('td:eq(6)', nRow).html(
          `<span style="background-color: ${fondoColor}; color: ${textoColor}; ${bordesCurvados}${paddingMayor}">${estadoText}</span>`
        );
      },
      "paging": true,
      "lengthChange": true,
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
        $('.dataTables_filter').find("[aria-controls='dataTable']").addClass('form-control');
        $('.paginate_button').addClass('btn btn-outline-dark page-item');
      }
    });

    // Agregar evento de cambio de página
    $(tableRef.current).on("page.dt", (e, settings) => {
      setCurrentPage(settings._iDisplayStart / itemsPerPage + 1);
    });
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      className="custom-modalView"
      size="xl"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">
          Información del Contrato
        </h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setShowModal(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-sm-6">
            <strong>ID:</strong> {contrato?.id}
          </div>
          <div className="col-sm-6">
            <strong>Fecha de Inicio:</strong>{" "}
            {moment(contrato?.fechaInicio).format("L")}
          </div>
        </div>
        <hr />
        <strong>
          <i className="fas fa-cubes mr-1"></i> Lotes
        </strong>
        <div className="row">
          <div className="col-sm-6">
            {amortizaciones?.contratodetalles?.map((detalle, index) => (
              <div key={index}>
                <strong>Nombre:</strong> {detalle.lote.nombre + ", " + detalle.lote.bloque.nombre + ", " + detalle.lote.etapa.nombre + ", " + detalle.lote.proyecto.nombre}
              </div>
            ))}
          </div>
        </div>
        <hr />

        <strong>
          <i className="fas fa-user mr-1"></i> Clientes
        </strong>
        <div className="row">
          <div className="col-sm-6">
            {amortizaciones?.contratoclientes?.map((detalle, index) => (
              <div key={index}>
                <strong>Nombre:</strong> {detalle.cliente?.nombreprimer ?? ""}{" "}
                {detalle.cliente?.nombresegundo ?? ""}{" "}
                {detalle.cliente?.apellidoprimer ?? ""}{" "}
                {detalle.cliente?.apellidosegundo ?? ""}
              </div>
            ))}
          </div>
        </div>
        <hr />

        <strong>
          <i className="fas fa-hand-holding-heart mr-1"></i> Beneficiarios
        </strong>
        <div className="row">
          <div className="col-sm-6">
            {amortizaciones?.contratobeneficiarios?.map((detalle, index) => (
              <div key={index}>
                <strong>Nombre:</strong> {detalle.cliente?.nombreprimer ?? ""}{" "}
                {detalle.cliente?.nombresegundo ?? ""}{" "}
                {detalle.cliente?.apellidoprimer ?? ""}{" "}
                {detalle.cliente?.apellidosegundo ?? ""}
              </div>
            ))}
          </div>
        </div>
        <hr />
        <strong>
          <i className="fas fa-chart-line mr-1"></i> Amortizaciones
        </strong>
        <Table
          responsive
          bordered
          id="tablaAmortizaciones"
          className="table table-bordered table-hover"
          ref={tableRef}
        ></Table>
      </div>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ModalInformacionContrato;
