import React from 'react';
import { PDFViewer, Page, Text, Document, StyleSheet, Image, View, Font } from '@react-pdf/renderer';

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
        height: '80px',
        width: '80px',
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderCollapse: 'collapse',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    tableCell: {
        width: '25%',
        textAlign: 'center',
        padding: 4,
        fontSize: 12
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: 5,
    },
    filterForm: {
        marginBottom: 20,
    },
    filterInput: {
        marginRight: 10,
    },
});

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + " - " + fechaObj.toLocaleTimeString();
    return fechaFormateada;
};

const formatoMoneda = (valor) => {
    return "L " + new Intl.NumberFormat('en-hn', {
        minimumFractionDigits: 2,
    }).format(valor);
}

const ReporteMovimientosProductos = ({ productoNombre, entradas, salidas, selectedMonth }) => { console.log("ENTRADAS:", entradas)

    const entradasFiltradas = selectedMonth ? entradas.filter((movimiento) => new Date(movimiento.movimientoRelacionado.fecha).getMonth() + 1 === Number(selectedMonth)) : entradas;
    const salidasFiltradas = selectedMonth ? salidas.filter((movimiento) => new Date(movimiento.movimientoRelacionado.fecha).getMonth() + 1 === Number(selectedMonth)) : salidas;

    return (
        <PDFViewer style={{ width: '99%', height: '90vh' }}>
            <Document title={`Reporte de Movimientos de Productos`}>
                <Page size="A4" style={styles.body}>
                    <Image style={styles.image} src="/dist/img/inca.png" />
                    <Text style={styles.header}>
                        INVERSIONES CENTROAMERICANAS S. DE R.L DE C.V
                    </Text>
                    <Text style={styles.title}>Reporte de Movimientos de Producto</Text>
                    
                    <Text style={styles.subtitle}>
                        Producto: {productoNombre}
                    </Text>
                    
                    <Text style={styles.subtitle}>
                        Tipo de Movimiento: Entradas
                    </Text>
                    
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Número Factura</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Proveedor</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Cantidad</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Costo</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Fecha y Hora</Text>
                        </View>
                        {entradasFiltradas.map((movimiento, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{movimiento.movimientoRelacionado.numerofactura}</Text>
                                <Text style={styles.tableCell}>{movimiento.movimientoRelacionado.proveedor ? movimiento.movimientoRelacionado.proveedor.nombre : ''}</Text>
                                <Text style={styles.tableCell}>{movimiento.cantidad}</Text>
                                <Text style={styles.tableCell}>{formatoMoneda(movimiento.costo)}</Text> {/* Aplica el formato de moneda */}
                                <Text style={styles.tableCell}>{formatearFecha(movimiento.movimientoRelacionado.fecha)}</Text>
                            </View>
                        ))}
                    </View>
                </Page>

                <Page size="A4" style={styles.body}>
                    <Image style={styles.image} src="/dist/img/inca.png" />
                    <Text style={styles.header}>
                        INVERSIONES CENTROAMERICANAS S. DE R.L DE C.V
                    </Text>
                    <Text style={styles.title}>Reporte de Movimientos de Producto</Text>
                    
                    <Text style={styles.subtitle}>
                        Producto: {productoNombre}
                    </Text>
                    
                    <Text style={styles.subtitle}>
                        Tipo de Movimiento: Salidas
                    </Text>
                    
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Empleado</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Cantidad</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Costo</Text>
                            <Text style={[styles.tableHeader, styles.tableCell]}>Fecha y Hora</Text>
                        </View>
                        {salidasFiltradas.map((movimiento, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>
                                    {`${movimiento.movimientoRelacionado.empleado ? movimiento.movimientoRelacionado.empleado.primernombre : ''} ${movimiento.movimientoRelacionado.empleado ? movimiento.movimientoRelacionado.empleado.segundonombre : ''} ${movimiento.movimientoRelacionado.empleado ? movimiento.movimientoRelacionado.empleado.primerapellido : ''} ${movimiento.movimientoRelacionado.empleado ? movimiento.movimientoRelacionado.empleado.segundoapellido : ''}`}
                                </Text>
                                <Text style={styles.tableCell}>{movimiento.cantidad}</Text>
                                <Text style={styles.tableCell}>{formatoMoneda(movimiento.costo)}</Text> {/* Aplica el formato de moneda */}
                                <Text style={styles.tableCell}>{formatearFecha(movimiento.movimientoRelacionado.fecha)}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default ReporteMovimientosProductos;



