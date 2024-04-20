import { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Button, Modal } from "react-bootstrap";
import { mostraAlertaError, mostraAlertaOk, mostraAlertaWarning } from "../../Alerts/sweetAlert";
import { AxiosPrivado } from "../../axios/Axios";
import { guardarContratos, guardarPagoCuotas, listarClientes } from "../../apiUrls";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ModalPago = ({ listaCuotasSeleccionadas, Total, pagoCuota, tipoPago, contrato, caja }) => {
    console.log("cuota", pagoCuota)
    console.log("Contrato:", contrato)
    const navigate = useNavigate();
    const [verModal, setVerModal] = useState(false);
    const [efectivo, setEfectivo] = useState(0);
    const [totalRecibido, setTotalRecibido] = useState(0)
    const [pos, setPos] = useState(0);
    const [pos1, setPos1] = useState(0);
    const [pos2, setPos2] = useState(0);
    const [referenciaPos1, setReferenciaPos1] = useState("");
    const [referenciaPos2, setReferenciaPos2] = useState("");
    const [cuenta1, setCuenta1] = useState(0);
    const [cuenta2, setCuenta2] = useState(0);
    const [cuenta3, setCuenta3] = useState(0);
    const [cuenta4, setCuenta4] = useState(0);
    const [cuenta5, setCuenta5] = useState(0);
    const [cuenta6, setCuenta6] = useState(0);
    const [referenciaCuenta1, setReferenciaCuenta1] = useState("");
    const [referenciaCuenta2, setReferenciaCuenta2] = useState("");
    const [referenciaCuenta3, setReferenciaCuenta3] = useState("");
    const [referenciaCuenta4, setReferenciaCuenta4] = useState("");
    const [referenciaCuenta5, setReferenciaCuenta5] = useState("");
    const [referenciaCuenta6, setReferenciaCuenta6] = useState("");
    const [transferencias, setTransferencias] = useState(0);
    const cerrarModal = () => setVerModal(false);
    const ver = () => {
        if (!caja) {
            mostraAlertaWarning("El dispositivo no esta definido como caja");
        }
        else if (caja?.estado == "CE") {
            mostraAlertaWarning("La caja esta cerrada no puede realizar el pago");
        }
        else if (tipoPago == 'PR') {
            if (contrato?.plazo == 0 && Total < contrato?.total) {
                mostraAlertaWarning("La prima debe ser del valor de contado");
            }
            else if (contrato?.clientes?.id == 0) {
                mostraAlertaWarning("Debe seleccionar el cliente");
            }
            else {
                setVerModal(true)
            }
        }
        else if (tipoPago == 'CU') {
            if (pagoCuota?.clienteId == 0) {
                mostraAlertaWarning("Debe seleccionar el cliente");
            }
            else if (pagoCuota?.contratoId == 0) {
                mostraAlertaWarning("Debe seleccionar el contrato");
            }
            else if (!pagoCuota.pagocuotas) {
                mostraAlertaWarning("Debe seleccionar las cuotas a pagar")
            }
            else {
                setVerModal(true)
            }
        }
    };
    const [datosPago, setDatosPago] = useState({
        pago: Total,
        recibido: totalRecibido,
        tipo: tipoPago,
        efectivo: {
            monto: "500"
        },
        transferencia: [
            { monto: 1000, referencia: "900700027760", cuentumId: 1 }
        ],
        tarjeta: [
            { monto: 700, referencia: "900700027760", poId: 1 }
        ]
    });


    useEffect(() => {
        //pagoCuota
        //CrearTabla();
    }, []);

    useEffect(() => {
        setPos(parseFloat(pos1) + parseFloat(pos2));
    }, [pos1, pos2]);

    useEffect(() => {
        setTransferencias(parseFloat(cuenta1) + parseFloat(cuenta2) + parseFloat(cuenta3) + parseFloat(cuenta4) + parseFloat(cuenta5) + parseFloat(cuenta6));
    }, [cuenta1, cuenta2, cuenta3, cuenta4, cuenta5, cuenta6]);

    useEffect(() => {
        const r = parseFloat(pos) + parseFloat(transferencias) + parseFloat(efectivo)
        setTotalRecibido(r);
    }, [pos, transferencias, efectivo]);

    useEffect(() => {
        actualizarListaPagos();
    }, [referenciaCuenta1, referenciaCuenta2, referenciaCuenta3, referenciaCuenta4, referenciaCuenta5, referenciaCuenta6, referenciaPos1, referenciaPos2]);

    useEffect(() => {
        actualizarListaPagos();
    }, [totalRecibido]);

    const actualizarListaPagos = () =>{
        var nPago = {
            pago: Total,
            recibido: totalRecibido,
            tipo: tipoPago,
            fecha: pagoCuota ? pagoCuota.fecha : moment().format("YYYY-MM-DD"),
            efectivo: {
                monto: parseFloat(efectivo)
            },
        };
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
        if (listaTransferencias.length > 0) {
            nPago = { ...nPago, transferencia: listaTransferencias }
        }
        var listaPos = [];
        if (pos1 > 0) {
            listaPos.push({ monto: pos1, referencia: referenciaPos1, poId: 1 })
        }
        if (pos2 > 0) {
            listaPos.push({ monto: pos2, referencia: referenciaPos2, poId: 2 })
        }
        if (listaPos.length > 0) {
            nPago = { ...nPago, tarjeta: listaPos }
        }
        if (tipoPago == 'CU') {
            nPago = {
                ...nPago,
                ...pagoCuota
            }
        }
        setDatosPago({
            ...nPago
        });
    }

    const formatoMoneda = (valor) => {
        return "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
        }).format(valor);
    }
    const generarPago = async (e) => {
        if (totalRecibido < Total) {
            mostraAlertaWarning("Debe escribir el pago")
        }
        else {
            let validarPos = false
            let validarTransferencia = false
            datosPago.tarjeta?.forEach(f => {
                if (f.referencia == "") {
                    validarPos = true
                }
            });
            datosPago.transferencia?.forEach(f => {
                if (f.referencia == "") {
                    validarTransferencia = true
                }

            })
            if (validarPos) {
                mostraAlertaWarning("Dede escribir la referencia en el POS")
            }
            else if (validarTransferencia) {
                mostraAlertaWarning("Dede escribir la referencia en la cuenta")
            }
            else {
                if (tipoPago == 'PR') {
                    gPagoPrima();
                }
                else if(tipoPago == 'CU'){
                    gPagoCuota();
                }


            }

        }

    }
    const gPagoPrima = async () => {
        const datosContrato = {
            ...contrato,
            pago: datosPago
        }
        
    }

    const gPagoCuota = async () => {
        console.log("PAGO",datosPago);
        
        try {
            await AxiosPrivado
                .post(guardarPagoCuotas, datosPago)
                .then((response) => {
                    console.log("Respuesta:", response.data);
                    if (response.data.tipo == 1) {

                        mostraAlertaOk(response.data.msj);
                        setVerModal(false);
                        console.log(response.data.datos);
                        if (response.data.datos.pagoId)
                            navigate("/app/contratos/reportepagoprima/" + response.data.datos.pagoId);
                        else
                            navigate("/app/contratos/nuevo");
                    } else if (response.data.tipo === 0) {
                        if (response.data.msj.isArray) {
                            response.data.msj.forEach((element) => {
                                console.log(element.campo + " " + element.msj);
                                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
                            });
                        }
                        else {
                            mostraAlertaWarning(response.data.msj);
                        }
                    } else if (response.data.tipo === 2) {
                        if (response.data.msj.isArray) {
                            response.data.msj.forEach((element) => {
                                console.log(element.campo + " " + element.msj);
                                mostraAlertaWarning("El campo : " + element.campo + ", " + element.msj);
                            });
                        }
                        else {
                            mostraAlertaWarning(response.data.msj);
                        }

                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    mostraAlertaOk("Error al ejecutar la petición");
                });
        } catch (error) {
            console.error("Error:", error);
            mostraAlertaError(error, "error");
        }
    }

    return (
        <div className="input-group-prepend">
            <Button variant="info" className="input-group-text" onClick={ver}>
                {formatoMoneda(Total) + "  "}
            </Button>
            <Modal show={verModal} onHide={cerrarModal} className="modal fade" size="lg">
                <div className="modal-header modal-primary">
                    <h4 className="modal-title text-primary">Pagos {formatoMoneda(Total)}</h4>
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
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <tbody>
                                        <tr>
                                            <td>Efectivo:</td>
                                            <td>
                                                <input type="number" className="form-control" placeholder="L 1,000.00"
                                                    value={efectivo}
                                                    onChange={(e) => setEfectivo(e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                        <tr data-widget="expandable-table" aria-expanded="false">
                                            <th>POS:</th>
                                            <th>{formatoMoneda(pos)}</th>
                                        </tr>
                                        <tr className="expandable-body d-none">
                                            <td colSpan={2}>
                                                <div>
                                                    <table className="table table-hover">
                                                        <tbody>
                                                            <tr>
                                                                <td>POS Davivienda:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={pos1}
                                                                        onChange={(e) => setPos1(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaPos1}
                                                                        onChange={(e) => setReferenciaPos1(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>POS Occidente:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={pos2}
                                                                        onChange={(e) => setPos2(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaPos2}
                                                                        onChange={(e) => setReferenciaPos2(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr data-widget="expandable-table" aria-expanded="false">
                                            <th>Tranferencias:</th>
                                            <th>{formatoMoneda(transferencias)}</th>
                                        </tr>
                                        <tr className="expandable-body d-none">
                                            <td colSpan={2}>
                                                <div>
                                                    <table className="table table-hover">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    Banco de Occidente
                                                                </td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta1}
                                                                        onChange={(e) => setCuenta1(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta1}
                                                                        onChange={(e) => setReferenciaCuenta1(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Banco Atlantida:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta2}
                                                                        onChange={(e) => setCuenta2(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta2}
                                                                        onChange={(e) => setReferenciaCuenta2(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Banrural</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta3}
                                                                        onChange={(e) => setCuenta3(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta3}
                                                                        onChange={(e) => setReferenciaCuenta3(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Davivienda:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta4}
                                                                        onChange={(e) => setCuenta4(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta4}
                                                                        onChange={(e) => setReferenciaCuenta4(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Ficosah:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="number" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta5}
                                                                        onChange={(e) => setCuenta5(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta5}
                                                                        onChange={(e) => setReferenciaCuenta5(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Bac Credomatic:</td>
                                                                <td>
                                                                    <label>Monto</label>
                                                                    <input type="text" className="form-control" placeholder="L 1,000.00"
                                                                        value={cuenta6}
                                                                        onChange={(e) => setCuenta6(e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <label>Referencia</label>
                                                                    <input type="text" className="form-control" placeholder="141996084012702211"
                                                                        value={referenciaCuenta6}
                                                                        onChange={(e) => setReferenciaCuenta6(e.target.value)}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Recibido:</th>
                                            <th>{formatoMoneda(parseFloat(efectivo) + parseFloat(pos) + parseFloat(transferencias))}</th>
                                        </tr>
                                        <tr>
                                            <th>Total a Pagar:</th>
                                            <th>{formatoMoneda(Total)}</th>
                                        </tr>
                                        <tr>
                                            <th>Cambio:</th>
                                            <th>{formatoMoneda((parseFloat(efectivo) + parseFloat(pos) + parseFloat(transferencias)) - parseFloat(Total))}</th>
                                        </tr>
                                    </tbody></table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer ">
                    <div className="card-footer">
                        <Button variant="primary" onClick={generarPago}>
                            Pagar
                        </Button>
                        <Button variant="secondary" onClick={cerrarModal}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default ModalPago;