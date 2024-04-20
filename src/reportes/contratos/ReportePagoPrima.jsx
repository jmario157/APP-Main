import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { buscarIdContrato, buscarIdPago } from '../../components/apiUrls';
import { mostraAlertaError } from '../../components/Alerts/sweetAlert';
import { AxiosPrivado } from '../../components/axios/Axios';
import moment from 'moment';
import NumeroALetras from '../../components/funciones/NumeroALetras';
import Tw_Cen_MT from '../../components/font/Tw_Cen_MT/TCM_____.TTF';
import Tw_Cen_MT_Negrita from '../../components/font/Tw_Cen_MT/TCB_____.TTF';
import Tw_Cen_MT_Condensed from '../../components/font/Tw_Cen_MT/TCCM____.TTF';
// Create styles
Font.register(
    { family: 'Tw_Cen_MT', src: Tw_Cen_MT }
);
Font.register(
    { family: 'Tw_Cen_MT_Negrita', src: Tw_Cen_MT_Negrita }
);
Font.register(
    { family: 'Tw_Cen_MT_Condensed', src: Tw_Cen_MT_Condensed }
);
const styles = StyleSheet.create({
    body: {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 1,
        paddingRight: 1//450
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Tw_Cen_MT_Negrita'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Tw_Cen_MT',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        margin: 1,
        textAlign: 'right',
        fontFamily: 'Tw_Cen_MT_Negrita'
    },
    subtitle2: {
        fontSize: 12,
        margin: 1,
        textAlign: 'right',
        fontFamily: 'Tw_Cen_MT_Negrita'
    },
    subtitleTotal: {
        fontSize: 14,
        margin: 1,
        textAlign: 'left',
        fontFamily: 'Tw_Cen_MT_Negrita'
    },
    subtitle2Total: {
        fontSize: 12,
        margin: 1,
        textAlign: 'left',
        fontFamily: 'Tw_Cen_MT_Negrita'
    },
    text: {
        margin: 1,
        fontSize: 12,
        textAlign: 'justify',
        fontFamily: 'Tw_Cen_MT'
    },
    textTotales: {
        margin: 2,
        fontSize: 12,
        fontWeight: "bold",
        textAlign: 'justify',
        fontFamily: 'Tw_Cen_MT'
    },
    image: {
        marginVertical: 10,
        marginHorizontal: 10,
        height: "80px",
        width: "80px",
    },
    header: {
        fontSize: 12,
        textAlign: 'center',
        color: 'black',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

// Create Document Component
export const ReportePagoPrima = ({ id }) => {
    const [pago, setPago] = useState({});
    const [cliente, setCliente] = useState({});
    const [empleado, setEmpleado] = useState({});
    const [contrato, setContrato] = useState({});
    const [contratoSaldos, setContratoSaldos] = useState([]);
    const [pagoCuotas, setPagoCuotas] = useState([]);
    const [ultimoSaldo, setUltimoSaldo] = useState({});
    const [intereses, setIntereses] = useState(0);
    const [mora, setMora] = useState(0);
    useEffect(() => {
        CargarDatos()
    }, []);

    useEffect(() => {
        var ultimo = {};
        contratoSaldos.forEach((f) => {
            ultimo = f;
        });
        setUltimoSaldo(ultimo);
    }, [contratoSaldos])
    useEffect(() => {
        if (pagoCuotas.length > 0) {
            var totalInteres = 0;
            var totalMora = 0;
            var totalAmortizacion = 0;
            pagoCuotas.forEach((f) => {
                totalInteres += f.intereses;
                totalAmortizacion += f.amortizacioncapital;
                totalMora += f.mora;
            })
        }
    }, [pagoCuotas])

    const CargarDatos = async () => {
        try {
            const respuesta = await AxiosPrivado.get(buscarIdPago + id);
            console.log(respuesta.data.datos);
            setPago(respuesta.data.datos);
            setCliente(respuesta.data.datos.cliente);
            setEmpleado(respuesta.data.datos.usuario.empleado);
            setContrato(respuesta.data.datos.contrato);
            setContratoSaldos(respuesta.data.datos.contratosaldos);
            setPagoCuotas(respuesta.data.datos.pagocuota);
        } catch (error) {
            console.log(error)
            mostraAlertaError("Error al cargar los datos");
        }
    }
    const formatoMoneda = (valor) => {
        return "L " + new Intl.NumberFormat('en-hn', {
            minimumFractionDigits: 2,
        }).format(valor);
    }
    const formatoNumero = (valor) => {
        return String(valor).padStart(8, '0');
    }
    return (
        <Document title={"Pago Prima Contrato " + contrato.id}>
            <Page style={styles.body} size={[165, 1100]}>
                <View style={{ alignItems: "center" }}>
                    <Image style={styles.image} src="/dist/img/inca.png" />
                </View>

                <Text style={styles.header} fixed>
                    INVERSIONES
                </Text>
                <Text style={styles.header} fixed>
                    CENTROAMERICANAS
                </Text>
                <Text style={styles.header} fixed>
                    S. DE R.L DE C.V
                </Text>
                <Text style={styles.author}>RTN: 03019008133040</Text>
                <Text style={styles.author}>Comayagua, barrio cabañas</Text>
                <Text style={styles.author}>Teléfono: 2772-6250</Text>
                <Text style={styles.title}>Factura No. {"000-002-01-" + formatoNumero(pago?.id)}</Text>
                <Text style={styles.author}>
                    CAI:
                </Text>
                <Text style={styles.author}>
                    A49AD4-6B6564-9C4FA2- 630CB5-B44AAB-10
                </Text>
                <Text style={styles.text}>
                    Generado:
                </Text>
                <Text style={styles.text}>
                    {moment(pago?.createdAt).format('DD-MM-YYYY HH:MM:ss')}
                </Text>
                <Text style={styles.text}>
                    Atendio:
                </Text>
                <Text style={styles.text}>
                    {empleado.primernombre + " " + empleado.primerapellido}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 0 }}>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: "black" }}>
                        <Text style={styles.subtitle}>
                            Por
                        </Text>
                        <Text style={styles.subtitle2}>
                            Fecha
                        </Text>
                        <Text style={styles.subtitle2}>
                            Contrato
                        </Text>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: "black", textAlign: "left" }}>
                        <Text style={styles.subtitleTotal}>
                            {formatoMoneda(pago?.pago)}
                        </Text>
                        <Text style={styles.subtitle2Total}>
                            {moment(pago?.fecha).format('DD-MM-YYYY')}
                        </Text>
                        <Text style={styles.subtitle2Total}>
                            {contrato.id}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 0, marginBottom: 10 }}>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: "black", textAlign: "left" }}>
                        <Text style={styles.text}>
                            {NumeroALetras(pago?.pago)}
                        </Text>
                    </View>
                </View>


                <View style={{ borderWidth: 1, color: "black" }}>
                    <Text style={styles.text}>
                        Clientes:
                    </Text>
                    {contrato.contratoclientes ? (
                        contrato.contratoclientes.map((cliente, index) => (
                            <Text style={styles.text} key={index}>
                                {cliente.cliente?.nombreprimer ?? ""}{" "}
                                {cliente.cliente?.nombresegundo ?? ""}{" "}
                                {cliente.cliente?.apellidoprimer ?? ""}{" "}
                                {cliente.cliente?.apellidosegundo ?? ""}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.text}>No hay detalles de clientes disponibles</Text>
                    )}
                </View>

                <View style={{ borderWidth: 1, color: "black", margin: 0 }}>
                    <Text style={styles.text}>
                        Lotes:
                    </Text>
                    {contrato.contratodetalles ? (
                        contrato.contratodetalles.map((f, index) => (
                            <Text style={styles.text} key={index}>
                                {f.lote.nombre}, {f.lote.bloque.nombre}, {f.lote.etapa.nombre}, {f.lote.proyecto.nombre}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.text}>No hay detalles de lotes disponibles</Text>
                    )}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.textTotales}>
                        Saldo anterior : {formatoMoneda(ultimoSaldo.saldoanterior)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Intereses a la fecha : {formatoMoneda(intereses)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Mora : {formatoMoneda(mora)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Descuentos/Rebajas : {formatoMoneda(contrato.descuento)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Importe Exento : {formatoMoneda(ultimoSaldo.saldoanterior + intereses + mora)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Importe Grabado 15% : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Importe Grabado 18% : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        I.S.V 15% : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        I.S.V. 18% : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Total : {formatoMoneda(ultimoSaldo.saldoanterior + intereses + mora)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>

                    <Text style={styles.textTotales}>
                        Pago Intereses: {formatoMoneda(intereses)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Pago Intereses Mora: {formatoMoneda(mora)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Abono a Capital: {formatoMoneda(ultimoSaldo.abono)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>

                    <Text style={styles.textTotales}>
                        Detalle nuevos saldos
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Capital : {formatoMoneda(ultimoSaldo.saldoactual)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Intereses: {formatoMoneda(ultimoSaldo.saldointeres)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Mora: {formatoMoneda(ultimoSaldo.saldomora)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.textTotales}>
                        Nuevo Saldo: {formatoMoneda(ultimoSaldo.saldoactual)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.textTotales}>
                        Total Recibido: {formatoMoneda(pago.recibido)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Cambio: {formatoMoneda(pago.recibido - pago.pago)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <Text style={styles.author}>Fecha Limite de Emisión: 25/09/2024</Text>
                <Text style={styles.author}>Rango Autorizado: 000-002-01-00000001 a la 000-002-01-00005000</Text>
                <Text style={styles.author}>.</Text>
            </Page>
        </Document>
    )
}