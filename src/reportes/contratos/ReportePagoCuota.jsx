import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { buscarIdContrato, buscarIdPago } from '../../components/apiUrls';
import { mostraAlertaError } from '../../components/Alerts/sweetAlert';
import { AxiosPrivado } from '../../components/axios/Axios';
import moment from 'moment';
import NumeroALetras from '../../components/funciones/NumeroALetras';
// Create styles
Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 350
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        margin: 1,
        textAlign: 'right',
        fontFamily: 'Oswald'
    },
    subtitle2: {
        fontSize: 14,
        margin: 1,
        textAlign: 'right',
        fontFamily: 'Oswald'
    },
    subtitleTotal: {
        fontSize: 18,
        margin: 1,
        textAlign: 'left',
        fontFamily: 'Oswald'
    },
    subtitle2Total: {
        fontSize: 14,
        margin: 1,
        textAlign: 'left',
        fontFamily: 'Oswald'
    },
    text: {
        margin: 1,
        fontSize: 12,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    textTotales: {
        margin: 2,
        fontSize: 12,
        fontWeight: "bold",
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 10,
        marginHorizontal: 10,
        height: "80px",
        width: "80px",
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
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
export const ReportePagoCuota = ({ id }) => {
    const [pago, setPago] = useState({});
    const [cliente, setCliente] = useState({});
    const [empleado, setEmpleado] = useState({});
    const [contrato, setContrato] = useState({});
    useEffect(() => {
        CargarDatos()
    }, [])
    const CargarDatos = async () => {
        try {
            const respuesta = await AxiosPrivado.get(buscarIdPago + id);
            console.log(respuesta.data.datos);
            setPago(respuesta.data.datos);
            setCliente(respuesta.data.datos.cliente);
            setEmpleado(respuesta.data.datos.usuario.empleado);
            setContrato(respuesta.data.datos.contrato);
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
    return (
        <Document title={"Pago Prima Contrato " + contrato.id}>
            <Page style={styles.body} size={"LEGAL"}>
                <View style={{ alignItems: "center" }}>
                    <Image style={styles.image} src="/dist/img/inca.png" />
                </View>

                <Text style={styles.header} fixed>
                    INVERSIONES CENTROAMERICANAS S. DE R.L DE C.V
                </Text>
                <Text style={styles.author}>RTN: 03019008133040</Text>
                <Text style={styles.author}>Comayagua, barrio cabañas</Text>
                <Text style={styles.author}>Teléfono: 2772-6250</Text>
                <Text style={styles.title}>Recibo de pago No. {pago?.id}</Text>
                <Text style={styles.text}>
                    Atendio: {empleado.primernombre + " " + empleado.segundonombre + " " + empleado.primerapellido + " " + empleado.segundoapellido}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
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
                            {moment(pago?.createdAt).format('DD-MM-YYYY')}
                        </Text>
                        <Text style={styles.subtitle2Total}>
                            {contrato.id}
                        </Text>
                    </View>
                </View>

                <Text style={styles.text}>
                    Cliente:
                </Text>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <Text style={styles.text}>
                    {cliente.nombreprimer + " " + cliente.nombresegundo + " " + cliente.apellidoprimer + " " + cliente.apellidosegundo}
                </Text>
                <View style={{ borderWidth: 1, color: "black", margin: 0 }}></View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.textTotales}>
                        Saldo anterior : {formatoMoneda(contrato.total)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Intereses a la fecha : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Mora : {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Descuentos/Rebajas : {formatoMoneda(contrato.descuento)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Total : {formatoMoneda(contrato.total)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>

                    <Text style={styles.textTotales}>
                        Pago Intereses: {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Pago Intereses Mora: {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Abono a Capital: {formatoMoneda(contrato.prima)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>

                    <Text style={styles.textTotales}>
                        Detalle nuevos saldos
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Capital : {formatoMoneda(contrato.saldo)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Intereses: {formatoMoneda(0)}
                    </Text>
                    <Text style={styles.textTotales}>
                        Saldo Mora: {formatoMoneda(0)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.textTotales}>
                        Nuevo Saldo: {formatoMoneda(contrato.saldo)}
                    </Text>
                </View>
                <View style={{ borderWidth: 1, color: "black" }}></View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}