import React from 'react';
import { PDFViewer, PDFDownloadLink, Page, Text, Document, StyleSheet, Image, View, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    body: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 10,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    image: {
        marginVertical: 10,
        marginHorizontal: 10,
        height: "80px",
        width: "80px",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderCollapse: "collapse",
        marginBottom: 10,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
    },
    tableCell: {
        width: "25%",
        textAlign: "center",
        padding: 5,
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: "bold",
        padding: 5,
    },
});

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const formatoMoneda = (valor) => {
    return "L " + new Intl.NumberFormat('en-hn', {
        minimumFractionDigits: 2,
    }).format(valor);
};
const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + " || Hora: " + fechaObj.toLocaleTimeString();
    return fechaFormateada;
};

export const ReporteSalidas = ({ datos }) => {
    const totalCostoEstimado = datos.reduce((total, salida) => {
        const totalDetalles = salida.detallesSalida.reduce((subtotal, detalle) => {
            return subtotal + detalle.costo * detalle.cantidad;
        }, 0);
        return total + totalDetalles;
    }, 0);

    return (
        <div>
           

            <PDFViewer style={{ width: '99%', height: '88vh' }}>
                <Document title={`Reporte de Salidas`}>
                    {datos.map((salida, index) => (
                        <Page key={index} size="A4" style={styles.body}>
                            <Image style={styles.image} src="/dist/img/inca.png" />
                            <Text style={styles.header}>
                                INVERSIONES CENTROAMERICANAS S. DE R.L DE C.V
                            </Text>
                            <Text style={styles.title}>Reporte de Salidas</Text>

                            <Text style={styles.subtitle}>Detalles de la Salida</Text>

                            <Text style={styles.text}>ID de Salida: {salida.id}</Text>
                            <Text style={styles.text}>Fecha: {formatearFecha(salida.fecha)}</Text>
                            <Text style={styles.text}>
                                Empleado: {salida.empleado
                                    ? `${salida.empleado.primernombre} ${salida.empleado.segundonombre} ${salida.empleado.primerapellido} ${salida.empleado.segundoapellido}`
                                    : 'Empleado no encontrado'}
                            </Text>

                            <Text style={styles.subtitle}>Detalles de Productos</Text>

                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableHeader, styles.tableCell]}>Producto</Text>
                                    <Text style={[styles.tableHeader, styles.tableCell]}>Cantidad</Text>
                                    <Text style={[styles.tableHeader, styles.tableCell]}>Costo</Text>
                                    <Text style={[styles.tableHeader, styles.tableCell]}>Subtotal</Text>
                                </View>
                                {salida.detallesSalida ? (
                                    salida.detallesSalida.map((detalle, index) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={styles.tableCell}>
                                                {detalle.producto ? detalle.producto.nombre : 'Producto no encontrado'}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {detalle.cantidad}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {formatoMoneda(detalle.costo)}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {formatoMoneda(detalle.costo * detalle.cantidad)}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.text}>No hay detalles de productos disponibles</Text>
                                )}
                            </View>

                            <Text style={styles.text}>Total Costo Estimado: {formatoMoneda(totalCostoEstimado)}</Text>
                        </Page>
                    ))}
                </Document>
            </PDFViewer>
        </div>
    );
};

export default ReporteSalidas;

