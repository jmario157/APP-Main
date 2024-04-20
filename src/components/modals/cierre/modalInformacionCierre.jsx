import moment from "moment";
import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const ModalInformacionCierre = ({ datos, showModal, setShowModalInformacion }) => {
  console.log("INFORMACION:",datos)
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModalInformacion(false)}
      className="custom-modalView"
      style={{ minHeight: '900px' }}
      size="lg"
    >
      <div className="modal-header modal-primary">
        <h4 className="modal-title text-primary">Información del cierre</h4>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={() => setShowModalInformacion(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <Row>
          {/* Sección de arriba */}
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{datos?.id}</td>
                </tr>
                <tr>
                  <th>Fecha</th>
                  <td>{moment(datos?.createdAt).format('DD-MM-YYYY, h:mm:ss a')}</td>
                </tr>
                <tr>
                  <th>Efectivo Caja Inicial</th>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.apertura?.efectivo)}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <hr />
        <Row>
          {/* Sección del medio */}
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Efectivo</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.efectivo)}</td>
                </tr>
                <tr>
                  <th>POS</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.pos)}</td>
                </tr>
                <tr>
                  <th>Transferencias</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.transferencias)}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Efectivo de Pagos</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.efectivosistema)}</td>
                </tr>
                <tr>
                  <th>POS Sistema</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.possistema)}</td>
                </tr>
                <tr>
                  <th>Transferencias de Pagos</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.transferenciassistema)}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Efectivo de Compras</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.efectivocompra)}</td>
                </tr>
                <tr>
                  <th>Transferencias de Compras</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.transferenciascompra)}</td>
                </tr>
                <tr>
                  <th>Crédito de Compras</th>
                </tr>
                <tr>
                  <td>{"L " + new Intl.NumberFormat('en-hn', { minimumFractionDigits: 2 }).format(datos?.creditocompra)}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <hr />
        <Row>
          {/* Sección de abajo */}
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th><i className="fas fa-map-marker-alt mr-1"></i> Caja</th>
                  <td className="text-muted">{datos?.caja ? datos?.caja?.nombre : ""}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th><i className="far fa-file-alt mr-1"></i> Usuario</th>
                  <td className="text-muted">{datos?.usuario ? datos.usuario.empleado.primernombre + " " + datos.usuario.empleado.segundonombre + " " + datos.usuario.empleado.primerapellido + " " + datos.usuario.empleado.segundoapellido : ""}</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </div>
      <div className="modal-footer">
        <Button variant="secondary" onClick={() => setShowModalInformacion(false)}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default ModalInformacionCierre;
