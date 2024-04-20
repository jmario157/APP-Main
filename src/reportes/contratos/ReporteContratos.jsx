import React from 'react';
import { PDFViewer, Page, Text, Document, StyleSheet, Image, View, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    border: '1px solid #000',
    padding: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },

  table: {
    display: 'table',
    width: '100%',
    marginBottom: 10,
  },
  tableHeaderWide: {
    width: '50%',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5,
    flex: 1,
  },
  tableRow2: {
    flexDirection: 'row',

  },

  tableHeader2: {
    width: '50%',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 10,
  },

  column: {
    width: '50%',
    padding: 5,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    // color: 'grey',
  },
  image: {
    marginVertical: 10,
    marginHorizontal: 230,
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
    margin: 'auto',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  tableCell: {
    width: '14.3%',
    textAlign: 'center',
    padding: 5,
    fontSize: 9
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
  return 'L ' + new Intl.NumberFormat('en-hn', {
    minimumFractionDigits: 2,
  }).format(valor);
};
const ultimoSaldo = (saldos) => {
  var saldo=0;
  saldos.forEach((f)=>saldo=f.saldoactual);
  return 'L ' + new Intl.NumberFormat('en-hn', {
    minimumFractionDigits: 2,
  }).format(saldo);
};
const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);
  const fechaFormateada = fechaObj.toLocaleDateString();
  return fechaFormateada;
};

export const ReporteContratos = ({ datos }) => {
  console.log('Reporte', datos)
  return (
    <div>
      <PDFViewer style={{ width: '99%', height: '88vh' }}>
        <Document title={`Reporte de Contratos`}>
          {datos.map((contrato, index) => (
            <Page key={index} size="A4" style={styles.body}>
              {/* ... tu contenido existente */}
              <View style={styles.header}>
                <Image style={styles.image} src="/dist/img/inca.png" />
                <Text style={styles.title}>Reporte de Contrato N° {contrato.id}</Text>
                <Text style={styles.subtitle}>Empleado Encargado: {contrato.usuario.empleado.primernombre ?? ""}{" "}
                  {contrato.usuario.empleado.segundonombre ?? ""}{" "}{contrato.usuario.empleado.primerapellido ?? ""}{" "}{contrato.usuario.empleado.segundoapellido ?? ""}{" "}</Text>
                <Text style={styles.subtitle}>Fecha de Inicio: {formatearFecha(contrato.fechaInicio)}</Text>

              </View>

              <View style={styles.body}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Clientes y Beneficiarios</Text>

                  {contrato.contratoclientes || contrato.contratobeneficiarios ? (
                    <View style={styles.table}>
                      <View style={styles.tableRow2}>
                        <Text style={styles.tableHeader2}>Clientes</Text>
                        <Text style={styles.tableHeader2}>Beneficiarios</Text>
                      </View>

                      <View style={styles.tableRow}>
                        <View style={styles.column}>
                          {contrato.contratoclientes ? (
                            contrato.contratoclientes.map((cliente, index) => (
                              <Text style={styles.text} key={index}>
                                <strong>Nombre:</strong> {cliente.cliente?.nombreprimer ?? ""}{" "}
                                {cliente.cliente?.nombresegundo ?? ""}{" "}
                                {cliente.cliente?.apellidoprimer ?? ""}{" "}
                                {cliente.cliente?.apellidosegundo ?? ""}
                              </Text>
                            ))
                          ) : (
                            <Text style={styles.text}>No hay detalles de clientes disponibles</Text>
                          )}
                        </View>
                        <View style={styles.column}>
                          {contrato.contratobeneficiarios ? (
                            contrato.contratobeneficiarios.map((beneficiario, index) => (
                              <Text style={styles.text} key={index}>
                                <strong>Nombre:</strong> {beneficiario.cliente?.nombreprimer ?? ""}{" "}
                                {beneficiario.cliente?.nombresegundo ?? ""}{" "}
                                {beneficiario.cliente?.apellidoprimer ?? ""}{" "}
                                {beneficiario.cliente?.apellidosegundo ?? ""}
                              </Text>
                            ))
                          ) : (
                            <Text style={styles.text}>No hay detalles de beneficiarios disponibles</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.text}>No hay detalles de clientes ni beneficiarios disponibles</Text>
                  )}
                </View>
              </View>


              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles de Lotes</Text>
                {contrato.contratodetalles ? (
                  contrato.contratodetalles.map((lote, index) => (
                    <Text style={styles.text} key={index}>
                      <strong>Lote:</strong> {lote.lote.nombre}, {lote.lote.bloque.nombre}, {lote.lote.etapa.nombre}, {lote.lote.proyecto.nombre}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.text}>No hay detalles de lotes disponibles</Text>
                )}
              </View>
              <Text style={styles.subtitle}>Detalles del Contrato</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Fecha de inicio</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Plazo</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Tasa</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Cuota</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Prima</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Saldo Inicial</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Saldo Actual</Text>
                </View>
                <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{formatearFecha(contrato.fechaInicio)}</Text>
                      <Text style={styles.tableCell}>{contrato.plazo}</Text>
                      <Text style={styles.tableCell}>{contrato.tasa}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(contrato.cuota)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(contrato.prima)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(contrato.total)}</Text>
                      <Text style={styles.tableCell}>{ultimoSaldo(contrato.contratosaldos)}</Text>
                    </View>
              </View>
              <Text style={styles.subtitle}>Detalles de Amortizaciones</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Número</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Fecha de Pago</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Cuota</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Amortización Capital</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Intereses</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Saldo Capital</Text>
                  <Text style={[styles.tableHeader, styles.tableCell]}>Estado</Text>
                </View>
                {contrato.contratocuota ? (
                  contrato.contratocuota.map((cuota, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{cuota.numero}</Text>
                      <Text style={styles.tableCell}>{formatearFecha(cuota.fechapago)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(cuota.cuota)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(cuota.amortizacioncapital)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(cuota.intereses)}</Text>
                      <Text style={styles.tableCell}>{formatoMoneda(cuota.saldocapital)}</Text>
                      <Text style={styles.tableCell}>{cuota.estado}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>No hay detalles de amortizaciones disponibles</Text>
                )}
              </View>

            </Page>
          ))}
        </Document>
      </PDFViewer>
    </div>
  );
};

export default ReporteContratos;
