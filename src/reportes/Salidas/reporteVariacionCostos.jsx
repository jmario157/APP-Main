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
    width: '50%',
    textAlign: 'center',
    padding: 4,
    fontSize: 12,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5,
  },
});

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

const formatoMoneda = (valor) => {
  return "L " + new Intl.NumberFormat('en-hn', {
    minimumFractionDigits: 2,
  }).format(valor);
}

const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const fechaFormateada = fechaObj.toLocaleDateString() + " - " + fechaObj.toLocaleTimeString();
    return fechaFormateada;
};

const ReporteVariacionCostos = ({ variacionesCostos, productoNombre, selectedMonth }) => {
  
    const variacionesFiltradas = selectedMonth ? variacionesCostos.filter((variacion)=> new Date(variacion.fechaCompra).getMonth()+1 === Number(selectedMonth)) : variacionesCostos;

    return (
    <PDFViewer style={{ width: '99%', height: '90vh' }}>
      <Document title={`Reporte de Variación de Costos`}>
        <Page size="A4" style={styles.body}>
          <Image style={styles.image} src="/dist/img/inca.png" />
          <Text style={styles.header}>
            INVERSIONES CENTROAMERICANAS S. DE R.L DE C.V
          </Text>
          <Text style={styles.title}>Reporte de Variación de Costos</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, styles.tableCell]}>Producto</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>Costo</Text>
              <Text style={[styles.tableHeader, styles.tableCell]}>Fecha y Hora</Text>
            </View>
            {variacionesFiltradas.map((variacion, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{productoNombre}</Text>
                <Text style={styles.tableCell}>{formatoMoneda(variacion.costo)}</Text>
                <Text style={styles.tableCell}>{formatearFecha(variacion.fechaCompra)}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReporteVariacionCostos;
  