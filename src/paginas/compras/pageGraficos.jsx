import React from 'react';
import GraficosCompras from './GraficosProductos';
import GraficoAumentoDecremento from './GraficoComprasTiempo';
import GraficoComprasProveedores from './GraficoProveedores';
import GraficoTendenciasPrecios from './GraficoTendencias';

const PageGraficos = () => {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '10px',
  };

  const graphContainerStyle = {
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '25px',
    margin: '10px',
    flex: 1,
    maxWidth: '660px',
    textAlign: 'center',
    border: '2px solid #007bff', 
  };

  const titleStyle = {
    fontSize: '20px',
    marginBottom: '10px',
  };

  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <div><h3 className='card-title'>Módulo de Análisis de Información</h3></div>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                    <div></div>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">Información para la Toma de Decisiones</h6>
                  <p className="card-text">
                    Aquí puedes mostrar información importante que ayuda en la toma de decisiones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={containerStyle}>
        <div style={graphContainerStyle}>
          <h2 style={titleStyle}>Gráfico de Compras</h2>
          <GraficosCompras />
        </div>
        <div style={graphContainerStyle}>
          <h2 style={titleStyle}>Gráfico de Aumento/Decremento</h2>
          <GraficoAumentoDecremento />
        </div>
        <div style={graphContainerStyle}>
          <h2 style={titleStyle}>Gráfico de Compras por Proveedores</h2>
          <GraficoComprasProveedores />
        </div>
        <div style={graphContainerStyle}>
          <h2 style={titleStyle}>Gráfico de Tendencias de Precios</h2>
          <GraficoTendenciasPrecios />
        </div>
      </div>
    </div>
  );
};

export default PageGraficos;
