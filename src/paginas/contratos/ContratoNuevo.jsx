import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Cargando from "../../components/Cargando";
import Header from "../../components/plantilla/Header";
import SideNav from "../../components/plantilla/SideNav";
import Footer from "../../components/plantilla/Footer";
import { mostraAlertaError, mostraAlertaOk } from "../../components/Alerts/sweetAlert";
import { Link } from "react-router-dom";
import Select from "react-select";
import { AxiosPrivado } from "../../components/axios/Axios";
import { listarClientes, listarLotes, listarLotesDisponibles, verAmortizacion } from "../../components/apiUrls";
import BuscarCliente from "../../components/modals/contratos/BuscarCliente";
import BuscarLote from "../../components/modals/contratos/BuscarLote";
import TablaContratoLotes from "../../components/tablas/TablaContratoLotes";
import { useContextContrato } from "../../contexto/contratos/ContratoContext";
import TablaContratoAmortizacion from "../../components/tablas/TablaContratoAmortizacion";
import ModalPago from "../../components/modals/pagos/pago";
const ContratoNuevo = () => {
    const [cargandoDatos, setCargandoDatos] = useState(false);
    const [listaClientes, setListaClientes] = useState([]);
    const [nombreCliente, setNombreCliente] = useState("Seleccione un cliente");
    const [listaLotes, setListaLotes] = useState([]);
    const [clienteId, setClienteId] = useState();
    const[clientesSeleccionados, setClientesSeleccionados]= useState([]);
    const[beneficiariosSeleccionados, setBenenificiariosSeleccionados]= useState([]);
    const { lotes, setLotes, contrato, setContrato, amortizaciones, actualizarDatos, calculoCuota, caja } = useContextContrato();
    const listaPeriodicidad = [
        { value: 12, label: "12" },
        { value: 6, label: "6" },
        { value: 4, label: "4" },
        { value: 2, label: "2" }
    ];

    useEffect(() => {
        CargarDatos();
    }, []);

    useEffect(() => {
        actualizarDatos();
    }, [lotes]);
    const CargarDatos = async () => {
        try {
            setCargandoDatos(true);
            const respuesta = await AxiosPrivado.get(listarClientes);
            setListaClientes(respuesta.data.datos);
            const respuestaLotes = await AxiosPrivado.get(listarLotesDisponibles);
            setListaLotes(respuestaLotes.data.datos);
        } catch (error) {
            mostraAlertaError("Error al cargar los datos");
        }
        setCargandoDatos(false);
    }
    const manejadorContratos = (event) => {
        let sumaPrima = 0;
        let sumaTotal = parseFloat(event.target.name == "gastoadministrativo" ? event.target.value : contrato.gastoadministrativo);
        lotes.forEach(f => {
            sumaPrima+=f.prima;
            sumaTotal+=f.valor;
        });
        let totalPagar = parseFloat(sumaPrima) + parseFloat(event.target.name == "gastoadministrativo" ? event.target.value : contrato.gastoadministrativo);
        let saldo = parseFloat(sumaTotal)-parseFloat(totalPagar)-parseFloat(event.target.name == "descuento" ? event.target.value : contrato.descuento);
        let lotesContrato = lotes?.map(f=>({
            loteId: f.id,
            prima: f.prima,
            valor: f.valor
        }))
        let cuota = calculoCuota({
            tasa: event.target.name == "tasa" ? event.target.value : contrato.tasa,
            periodicidad: event.target.name == "periodicidad" ? event.target.value : contrato.periodicidad,
            plazo: event.target.name == "plazo" ? event.target.value : contrato.plazo,
            saldo: saldo,
        });
        setContrato({
            ...contrato,
            prima: sumaPrima,
            saldo: saldo,
            cuota: cuota,
            total: sumaTotal,
            lotes: lotesContrato,
            [event.target.name]: event.target.value,
        });
    };

    const buscarIdcliente = (id) => {
        const clienteSeleccionado = listaClientes.find(
            (f) =>
                f.id == id
        );

        if (clienteSeleccionado) {
            setContrato({
                ...contrato,
                clientes: clientesSeleccionados,
                beneficiarios: beneficiariosSeleccionados,
            });
            setNombreCliente(clienteSeleccionado.identidad + " | " + clienteSeleccionado.nombreprimer + " " + clienteSeleccionado.nombresegundo + clienteSeleccionado.apellidoprimer + " " + clienteSeleccionado.apellidosegundo)
        }
        else {
            setContrato({
                ...contrato,
                clientes: null,
            });
            setNombreCliente("Seleccione un cliente");
        }
    }
    const buscarIdlote = (id) => {
        console.log('buscarIdlote');
        const loteSeleccionado = listaLotes.find(
            (f) =>
                f.id == id
        );
        if (loteSeleccionado) {
            if (lotes.find(f => f.id == loteSeleccionado.id)) {
                mostraAlertaError("El lote ya esta seleccionado");
            }
            else {
                var lista = lotes;
                lista.push(loteSeleccionado);
                setLotes(lista);
                var tp = 0;
                var tv = 0;
                lista.forEach(f => {
                    tp += f.prima;
                    tv += f.valor;
                })
                actualizarDatos();
            }
        }
        else {
            mostraAlertaOk("No se selecciono ningun lote");
        }
    }

    const agregarCliente = (cliente) => {
        if(!clienteId){
            setClienteId(cliente.id)
        }
        setClientesSeleccionados([...clientesSeleccionados,{clienteId:cliente.id, nombre: cliente.nombreprimer + " " + 
        cliente.nombresegundo + " " + cliente.apellidoprimer + " " + cliente.apellidosegundo
    }]);
        console.log(clientesSeleccionados);
        
    };
    useEffect(() => {
        // Este efecto se ejecutará cada vez que se actualice clientesSeleccionados
        // y actualizará el estado del contrato con la última lista de clientes seleccionados.
        setContrato({
            ...contrato,
            clientes: clientesSeleccionados,
            clienteId: clienteId,
        });
        console.log("CLIENTE",clienteId);
    }, [clientesSeleccionados]);

    const eliminarCliente = (id) => {
        if (clienteId === id) {
            // Encuentra el nuevo primer cliente en la lista, si hay alguno.
            const nuevoPrimerCliente = clientesSeleccionados.find((cliente) => cliente.id !== id);
            // Actualiza clienteId con el ID del nuevo primer cliente.
            setClienteId(nuevoPrimerCliente ? nuevoPrimerCliente.id : null);
        }
        const nuevosClientes = clientesSeleccionados.filter((cliente) => cliente.id !== id);
        setClientesSeleccionados(nuevosClientes);
      };

    const agregarBeneficiario = (beneficiario) => {
        setBenenificiariosSeleccionados([...beneficiariosSeleccionados,{clienteId: beneficiario.id, nombre: beneficiario.nombreprimer + " " + 
        beneficiario.nombresegundo + " " + beneficiario.apellidoprimer + " " + beneficiario.apellidosegundo}])
    }
    useEffect(() => {
        // Este efecto se ejecutará cada vez que se actualice clientesSeleccionados
        // y actualizará el estado del contrato con la última lista de clientes seleccionados.
        setContrato({
            ...contrato,
            beneficiarios: beneficiariosSeleccionados,
        });
        console.log("beneficiarios", beneficiariosSeleccionados)
    }, [beneficiariosSeleccionados]);

    const eliminarBeneficiario = (id) => {
        const nuevosBeneficiarios = beneficiariosSeleccionados.filter((beneficiario)=> beneficiario.id !== id);
        setBenenificiariosSeleccionados(nuevosBeneficiarios);
    }
   

    const formatoMoneda = (valor) => {
        return "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
        }).format(valor);
    }
    if (cargandoDatos) {
        return (
            <Cargando></Cargando>
        );
    }
    else {
        return (
            <React.StrictMode>

                <Header></Header>
                <SideNav />

                <div className="content-wrapper">
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Contratos</h1>
                                </div>
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><Link href="/app/home">Inicio</Link></li>
                                        <li className="breadcrumb-item active"><Link href="/app/contratos">Contratos</Link></li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="content">
                        <div className="container-fluid">
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Nuevo Contrato</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form action="">
                                        <div className="row">
                                            <div className="col-sm-4 col-lg-4 form-group">
                                                <label>Fecha de inicio</label>
                                                <div className="input-group">
                                                    <input type="date" className="form-control" placeholder="dd-mm-yyyy"
                                                        value={contrato.fechaInicio}
                                                        onChange={manejadorContratos}
                                                        name="fechaInicio"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-8 form-group">
                                                <label>Clientes</label>
                                                <div className="input-group">
                                                <BuscarCliente lista={listaClientes} agregarCliente={agregarCliente}></BuscarCliente>
                                                {clientesSeleccionados.map((cliente) => (
                      <div key={cliente.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', padding: '5px'}}>
                        <input type="text" readOnly value={cliente.nombre} style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '5px', marginRight: '5px' }} className="form-control" />
                        <button type="button" onClick={() => eliminarCliente(cliente.id)} className="btn btn-danger btn-sm"><i className="fas fa-minus"></i></button>
                      </div>
                    ))}                                      
                                                   
                                                </div>
                                                <div className="col-sm-8 form-group">
                  <label>Beneficiarios</label>
                  <div className="input-group">
                  <BuscarCliente lista={listaClientes} agregarCliente={agregarBeneficiario}></BuscarCliente>
                    {beneficiariosSeleccionados.map((beneficiario) => (
                      <div key={beneficiario.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', padding:'5px' }}>
                        <input
                          type="text"
                          readOnly
                          value={beneficiario.nombre}
                          style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '5px', marginRight: '5px' }}
                          className="form-control"
                        />
                        <button type="button" onClick={() => eliminarBeneficiario(beneficiario.id)} className="btn btn-danger btn-sm"><i className="fas fa-minus"></i></button>
                      </div>
                    ))}
                    
                  </div>
                </div>

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4 form-group">
                                                <label>Plazo</label>
                                                <div className="input-group">
                                                    <input type="number" className="form-control" placeholder="Ej: 120"
                                                        value={contrato.plazo}
                                                        onChange={manejadorContratos}
                                                        name="plazo"
                                                    />
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>M</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 form-group">
                                                <label>Tasa</label>
                                                <div className="input-group">
                                                    <input type="number" className="form-control" placeholder="Ej: 12%"
                                                        value={contrato.tasa}
                                                        onChange={manejadorContratos}
                                                        name="tasa"
                                                    />
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 form-group">
                                                <label>Periodicidad</label>
                                                <div className="input-group">
                                                    <Select
                                                        name="periodicidad"
                                                        value={
                                                            listaPeriodicidad.find(
                                                                (opcion) =>
                                                                    opcion.value === contrato.periodicidad
                                                            )
                                                        }
                                                        onChange={(e) => {
                                                            setContrato({
                                                                ...contrato,
                                                                periodicidad: e.value
                                                            })
                                                        }}
                                                        options={listaPeriodicidad}
                                                        isSearchable={true}>
                                                    </Select>
                                                </div>
                                            </div>


                                        </div>
                                        <div className="row">
                                            <div className="col-sm-6 col-lg-6 form-group">
                                                <label>Gasto Administrativo</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="number" className="form-control" placeholder="Ej: 1000"
                                                        value={contrato.gastoadministrativo}
                                                        onChange={manejadorContratos}
                                                        name="gastoadministrativo"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-lg-6 form-group">
                                                <label>Descuento</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"><i></i>L</span>
                                                    </div>
                                                    <input type="number" className="form-control" placeholder="Ej: 1000"
                                                        value={contrato.descuento}
                                                        onChange={manejadorContratos}
                                                        name="descuento"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4 form-group">
                                                <label>Total</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Ej: 0123"
                                                        value={formatoMoneda(contrato.total)}
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-4 form-group">
                                                <label>Cuota</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Ej: 0123"
                                                        value={formatoMoneda(contrato.cuota)}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-sm-4 form-group">
                                                <label>Financiado</label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Ej: 0123"
                                                        value={formatoMoneda(contrato.saldo)}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="row">

                                        <div className="col-6">
                                            <p className="lead">Metodos de pago:</p>
                                            <img src="../../dist/img/credit/visa.png" alt="Visa" />
                                            <img src="../../dist/img/credit/mastercard.png" alt="Mastercard" />
                                            <img src="../../dist/img/credit/american-express.png" alt="American Express" />
                                            <img src="../../dist/img/credit/paypal2.png" alt="Paypal" />
                                            <p className="text-muted well well-sm shadow-none">
                                                Selecione el metodo de pago
                                            </p>
                                        </div>

                                        <div className="col-6">
                                            <p className="lead">Datos del pago</p>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody><tr>
                                                        <th>+ Total Prima:</th>
                                                        <td>{formatoMoneda(contrato.prima)}</td>
                                                    </tr>
                                                        <tr>
                                                            <th>+ Gasto Administrativo:</th>
                                                            <td>{formatoMoneda(contrato.gastoadministrativo)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Total a Pagar:</th>
                                                            <td>
                                                                <ModalPago Total={parseFloat(contrato.prima) + parseFloat(contrato.gastoadministrativo)} contrato={contrato} caja={caja} tipoPago={"PR"}></ModalPago>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Lista de Lotes</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="col-sm-12 form-group">
                                        <label>Total Prima</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Ej: 0123"
                                                value={contrato.prima}
                                                disabled
                                            />
                                            <BuscarLote lista={listaLotes} buscarIdlote={buscarIdlote}></BuscarLote>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 form-group">

                                    </div>
                                    <TablaContratoLotes lotes={lotes}></TablaContratoLotes>
                                </div>
                            </div>
                            <div className="card card-primary card-outline">
                                <div className="card-header">
                                    <h3 className="card-title">Amortización</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <TablaContratoAmortizacion datos={amortizaciones}></TablaContratoAmortizacion>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </React.StrictMode>
        );
    }
}

export default ContratoNuevo;