import React from 'react';
import { PDFViewer, Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 10,
    marginBottom: 6,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderCollapse: 'collapse',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  image: {
    marginVertical: 10,
    marginHorizontal: 240,
    height: '80px',
    width: '80px',
  },
  tableCell: {
    width: '25%',
    textAlign: 'center',
    fontSize: 10,
    padding: 5,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5,
  },
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

const ReporteCierres = ({ datos }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document title="Reporte de Cierres">
        {datos.map((cierre, index) => (
          <Page key={index} size="A4" style={styles.page}>
            <View style={styles.header}>
            <Image style={styles.image} src="/dist/img/inca.png" />
            <Text style={styles.title}>Reporte de Cierres</Text>
            <Text style={styles.subtitle}>Cierre ID: {cierre.cierreId}</Text>
            <Text style={styles.subtitle}>Fecha: {formatearFecha(cierre.fecha)}</Text>
            <Text style={styles.subtitle}>Efectivo Inicial: {formatoMoneda(cierre.efectivo)}</Text>
            </View>
            

            <View style={styles.section}>
              <Text style={styles.subtitle}>Datos del Cierre:</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Pagos</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Pago en Efectivo</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Pago con Tarjeta</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Pago con Transferencia</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.pago)}</Text>
                  <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.pagoefectivos)}</Text>
                  <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.pagotarjeta)}</Text>
                  <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.pagotransferencia)}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Compras</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Compra en Efectivo</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Compra con Transferencia</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Compra al Crédito</Text>
                </View>
              <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.compraefectivos+cierre.datos.compratransferencia+cierre.datos.compracredito)}</Text>
              <Text style={styles.tableCell}> {formatoMoneda(cierre.datos.compraefectivos)}</Text>
              <Text style={styles.tableCell}>{formatoMoneda(cierre.datos.compratransferencia)}</Text>
              <Text style={styles.tableCell}> {formatoMoneda(cierre.datos.compracredito)}</Text>
              </View>
             
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Detalles de Pagos:</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Pago Número</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Total Pago</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto en Efectivo</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto con Tarjeta</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto con Transferencia</Text>
                </View>
                {cierre.Pagos.map((pago, pagoIndex) => (
                  <View key={pagoIndex} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{pagoIndex + 1}</Text>
                    <Text style={styles.tableCell}>{formatoMoneda(pago.pago)}</Text>
                    <Text style={styles.tableCell}>{pago.pagoefectivos.length > 0 ? formatoMoneda(pago.pagoefectivos[0].monto) : '0'}</Text>
                    <Text style={styles.tableCell}>{pago.pagotarjeta.length > 0 ? formatoMoneda(pago.pagotarjeta[0].monto) : '0'}</Text>
                    <Text style={styles.tableCell}>{pago.pagotransferencia.length > 0 ? formatoMoneda(pago.pagotransferencia[0].monto) : '0'}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.subtitle}>Detalles de Compras:</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Factura Número</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Fecha</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto en Efectivo</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto con Transferencia</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Monto a Crédito</Text>
                </View>
                {cierre.Compras.map((compra, compraIndex) => (
                  <View key={compraIndex} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{compra.numerofactura}</Text>
                    <Text style={styles.tableCell}>{formatearFecha(compra.fecha)}</Text>
                    <Text style={styles.tableCell}>{compra.compraefectivos.length > 0 ? formatoMoneda(compra.compraefectivos[0].monto) : '0'}</Text>
                    <Text style={styles.tableCell}>{compra.compratransferencia.length > 0 ? formatoMoneda(compra.compratransferencia[0].monto) : '0'}</Text>
                    <Text style={styles.tableCell}>{compra.compracreditos.length > 0 ? formatoMoneda(compra.compracreditos[0].monto) : '0'}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
};

export default ReporteCierres;
