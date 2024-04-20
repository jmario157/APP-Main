import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { mostraAlerta } from "../../Alerts/sweetAlert";

const CompraModal = ({ onHide, guardarCompra, datosCompra, monto }) => {
  const [verModal, setVerModal] = useState(true);
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [montoTransferencia, setMontoTransferencia] = useState(0);
  const [referenciaCuenta1, setReferenciaCuenta1] = useState("");
  const [referenciaCuenta2, setReferenciaCuenta2] = useState("");
  const [referenciaCuenta3, setReferenciaCuenta3] = useState("");
  const [referenciaCuenta4, setReferenciaCuenta4] = useState("");
  const [referenciaCuenta5, setReferenciaCuenta5] = useState("");
  const [referenciaCuenta6, setReferenciaCuenta6] = useState("");
  const [cuenta1, setCuenta1] = useState(0);
  const [cuenta2, setCuenta2] = useState(0);
  const [cuenta3, setCuenta3] = useState(0);
  const [cuenta4, setCuenta4] = useState(0);
  const [cuenta5, setCuenta5] = useState(0);
  const [cuenta6, setCuenta6] = useState(0);
  const [credito, setCredito] = useState(false);
  const [totalRestanteCompra, setTotalRestanteCompra] = useState(monto);
  const [totalRegistrado, setTotalRegistrado] = useState(0);

  const cerrarModal = () => {
    setVerModal(false);
    onHide();
  };

  const handleGuardarCompra = () => {
    if (credito) {
      // Lógica para compras a crédito
      guardarCompra({
        credito:{
          monto: monto,
        }
      
      });
      setTotalRestanteCompra(0);
    } else {
     
      // Lógica para compras con otros métodos de pago
      var listaTransferencias = [];
      if (cuenta1 > 0) {
          listaTransferencias.push({ monto: cuenta1, referencia: referenciaCuenta1, cuentumId: 1 })
      }
      if (cuenta2 > 0) {
          listaTransferencias.push({ monto: cuenta2, referencia: referenciaCuenta2, cuentumId: 2 })
      }
      if (cuenta3 > 0) {
          listaTransferencias.push({ monto: cuenta3, referencia: referenciaCuenta3, cuentumId: 3 })
      }
      if (cuenta4 > 0) {
          listaTransferencias.push({ monto: cuenta4, referencia: referenciaCuenta4, cuentumId: 4 })
      }
      if (cuenta5 > 0) {
          listaTransferencias.push({ monto: cuenta5, referencia: referenciaCuenta5, cuentumId: 5 })
      }
      if (cuenta6 > 0) {
          listaTransferencias.push({ monto: cuenta6, referencia: referenciaCuenta6, cuentumId: 6 })
      }
      const totalTransferencias = listaTransferencias.reduce((total, item) => total + parseFloat(item.monto), 0);

      const totalPago = totalTransferencias + parseFloat(montoEfectivo);

      if (totalPago > monto) {
        mostraAlerta("El total de la compra no puede exceder el monto ingresado.");
      } 
      // else {
      //   const totalRestante = monto - totalPago;
      //   setTotalRegistrado(totalPago);
      // }
      if (listaTransferencias.length > 0 && montoEfectivo>0) {
       
  
          guardarCompra({
            transferencia:
              listaTransferencias,
            efectivo:{
              monto: montoEfectivo,
            }
          });
          setTotalRestanteCompra(0);
  
          
        
      } else if(listaTransferencias.length > 0){
        
          guardarCompra({
            transferencia:
              listaTransferencias,
          });
          setTotalRestanteCompra(0);
  
      } else if(montoEfectivo > 0){
  
          guardarCompra({
            efectivo:{
              monto: montoEfectivo,
            }
          });
          setTotalRestanteCompra(0);
  
      
        
      }
      

    
    }
  };

  useEffect(() => {
    // Actualizar total de transferencias al cambiar los montos
    const totalTransferencias =
      parseFloat(cuenta1) + parseFloat(cuenta2) + parseFloat(cuenta3) + parseFloat(cuenta4) + parseFloat(cuenta5) + parseFloat(cuenta6);
    setMontoTransferencia(totalTransferencias);
  }, [cuenta1, cuenta2, cuenta3, cuenta4, cuenta5, cuenta6]);

  useEffect(() => {
    // Actualizar total acumulado
    const totalPago = totalRegistrado + parseFloat(montoEfectivo) + parseFloat(montoTransferencia);
    const totalRestante = monto - totalPago;

    setTotalRestanteCompra(totalRestante);
  }, [montoEfectivo, totalRegistrado, monto, montoTransferencia]);

  return (
    <div className="input-group-prepend">
      <Button variant="info" className="input-group-text" onClick={handleGuardarCompra}>
        Realizar Compra
      </Button>

      <Modal show={verModal} onHide={cerrarModal} className="modal fade" size="lg">
        <div className="modal-header modal-primary">
          <h4 className="modal-title text-primary">Compra</h4>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={cerrarModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <td>Efectivo:</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Ingrese el monto en efectivo"
                          value={montoEfectivo}
                          onChange={(e) => setMontoEfectivo(e.target.value)}
                          disabled={credito}
                        />
                      </td>
                    </tr>
                    <tr data-widget="expandable-table" aria-expanded="false">
                      <th>
                        <button type="button" className="btn btn-link" data-widget="collapse" disabled={credito}>
                          Transferencias: {formatoMoneda(montoTransferencia)}
                        </button>
                      </th>
                      <th>Monto</th>
                      <th>Referencia</th>
                    </tr>
                    <tr className="expandable-body d-none">
                      <td colSpan={3}>
                        <div>
                          <table className="table table-hover">
                            <tbody>
                              <tr>
                                <td>Banco de Occidente</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta1}
                                    onChange={(e) => setCuenta1(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta1}
                                    onChange={(e) => setReferenciaCuenta1(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Banco Atlantida</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta2}
                                    onChange={(e) => setCuenta2(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta2}
                                    onChange={(e) => setReferenciaCuenta2(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Banrural</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta3}
                                    onChange={(e) => setCuenta3(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta3}
                                    onChange={(e) => setReferenciaCuenta3(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Davivienda</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta4}
                                    onChange={(e) => setCuenta4(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta4}
                                    onChange={(e) => setReferenciaCuenta4(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Ficosah</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta5}
                                    onChange={(e) => setCuenta5(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta5}
                                    onChange={(e) => setReferenciaCuenta5(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>Bac Credomatic</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    value={cuenta6}
                                    onChange={(e) => setCuenta6(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la referencia"
                                    value={referenciaCuenta6}
                                    onChange={(e) => setReferenciaCuenta6(e.target.value)}
                                    disabled={credito}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Total a Pagar:</th>
                      <th>{formatoMoneda(monto)}</th>
                    </tr>
                    <tr>
                      <th>Total Restante:</th>
                      <th>{formatoMoneda(totalRestanteCompra)}</th>
                    </tr>
                    <tr>
                      <th>Crédito:</th>
                      <th>
                        <input
                          type="checkbox"
                          checked={credito}
                          onChange={() => setCredito(!credito)}
                          disabled={totalRegistrado > 0 || montoEfectivo > 0 || montoTransferencia > 0}
                        />
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <div className="card-footer">
            <Button variant="primary" onClick={handleGuardarCompra} >
              Realizar Compra
            </Button>
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const formatoMoneda = (monto) => {
  // Verificar si monto está definido
  if (monto !== undefined) {
    return `L.${monto.toFixed(2)}`;
  } else {
    // Manejar el caso en que monto es undefined
    return "L.0.00";
  }
};

export default CompraModal;





