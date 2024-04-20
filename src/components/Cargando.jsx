const Cargando = () => {
    return (
        <div className="col-md-12">
            <div className="card card-primary">
                <div className="card-header">
                    <h3 className="card-title">Cargando los datos</h3>
                </div>
                <div className="card-body">
                    Espere mientras se cargan los datos
                </div>
                <div className="overlay">
                    <i className="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>
            </div>
        </div>
    );
}

export default Cargando;