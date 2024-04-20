import React from 'react';

const ComponenteFiltrado = ({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  filterByMonth,
  showAll,
  applyDateFilter,
}) => {
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [applyButtonStyle, setApplyButtonStyle] = React.useState({});
  const [showAllButtonStyle, setShowAllButtonStyle] = React.useState({});

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    filterByMonth(e.target.value);
    setFechaInicio(fechaInicio);
    setFechaFin(fechaFin);
  };

  const resetInputs = () => {
    setFechaInicio('');
    setFechaFin('');
  };

  const clearFilters = () => {
    setSelectedMonth('');
    setFechaInicio(fechaInicio);
    //resetInputs();
    showAll();
  };

  const handleApplyButtonMouseEnter = () => {
    setApplyButtonStyle({ backgroundColor: '#0056b3' });
  };

  const handleApplyButtonMouseLeave = () => {
    setApplyButtonStyle({});
  };

  const handleShowAllButtonMouseEnter = () => {
    setShowAllButtonStyle({ backgroundColor: '#999' });
  };

  const handleShowAllButtonMouseLeave = () => {
    setShowAllButtonStyle({});
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    title: {
      marginBottom: '10px',
    },
    filtersRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    filterMonth: {
      display: 'flex',
      alignItems: 'center',
    },
    selectMonth: {
      marginLeft: '10px',
    },
    filterDates: {
      display: 'flex',
      alignItems: 'center',
    },
    inputDate: {
      marginLeft: '40px',
      marginRight: '5px' 
    },
    applyButton: {
        marginLeft:'5px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
      ...applyButtonStyle,
    },
    showAllButton: {
      backgroundColor: '#ccc',
      color: '#000',
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
      ...showAllButtonStyle,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Filtros para Reporte:</h2>
      <div style={styles.filtersRow}>
        <div style={styles.filterMonth}>
          <span>Filtrar por:</span>
          <select style={styles.selectMonth} value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Seleccionar mes</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>
        <div style={styles.filterDates}>
          <input
            type="date"
            placeholder="Fecha de inicio"
            style={styles.inputDate}
            value={fechaInicio }
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            placeholder="Fecha de fin"
            value={fechaFin }
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <button
            style={styles.applyButton}
            onMouseEnter={handleApplyButtonMouseEnter}
            onMouseLeave={handleApplyButtonMouseLeave}
            onClick={() => {
              applyDateFilter();
            }}
          >
            Aplicar Filtro por Fechas
          </button>
        </div>
      </div>
      <button
        style={styles.showAllButton}
        onMouseEnter={handleShowAllButtonMouseEnter}
        onMouseLeave={handleShowAllButtonMouseLeave}
        onClick={clearFilters}
      >
        Mostrar Todos
      </button>
    </div>
  );
};

export default ComponenteFiltrado;
