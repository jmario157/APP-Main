import { Modal } from "react-bootstrap";

const ModalInformacionProveedores = ({ datos, showModal, setShowModalInformacion})=> {

    const verTelefonos = datos?.proveedortelefonos.map((e, i) => {
        return (
                <li key={i} className="list-inline-item"><p ClasName="text-muted">
                <i className="fas fa-phone mr-1"></i>{e.numero}</p></li>
             )
    })
    
    return (
        <Modal
            show={showModal}
            onHide={() => setShowModalInformacion(false)}
            className= "custom-modalView"
                  
        >
            <div clasName="modal-header modal-primary">
                <h4 clasName="modal-title text-primary">Información de Proveedor</h4>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick= {() => setShowModalInformacion(false)}
                >
                    <span aria-hidden= "true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="col-md-12">
                    <div clasName= "card card-widget widget-user shadow">
                        <div className="card-header">
                            <div className="widget-user-header bg-info">
                                <h3 className="widget-user-username">{datos?.nombre}</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            
                                <div className="col-sm-6">
                                    <strong><i className="fas fa-map-marker-alt mr-1"></i>Nombre de Contacto</strong>
                                    <p className="text-muted">
                                        {datos?datos.nombrecontacto: ""}
                                    </p>
                                    <hr></hr>
                                    <strong><i className="fas fa-list mr-1"></i>Teléfonos</strong>
                                    <ul className="lis-inline">{verTelefonos}</ul>
                                    <h></h>
                                    <strong><i className="far fa-file-alt mr-1"></i>RTN</strong>
                                    <p className="text-muted">
                                        {datos?datos.rtn:""}
                                    </p>
                                </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <Modal.Footer>

            </Modal.Footer>

        </Modal>
    )

}

export default ModalInformacionProveedores;