import React, { useEffect, useState } from 'react';
import Header from '../../components/plantilla/Header';
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer';
//import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate, useParams } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import ReporteContratos from './ReporteContratos';
import { reportesContrato, listarClientes, listarUsuarios } from '../../components/apiUrls'
import { AxiosPrivado } from "../../components/axios/Axios";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";
import BuscarCliente from '../../components/modals/contratos/BuscarClientePagos';
import BuscarUsuario from '../../components/modals/contratos/BuscarUsuario';

function PageReporteContratos() {
    const [listaContratos, setListaContratos] = useState([]);
    const [listaClientes, setListaClientes] = useState([]);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [nombreCliente, setNombreCliente] = useState();
    const [nombreUsuario, setNombreUsuario]=useState();
    const [usuarioId, setUsuarioId]=useState();
    const [nombreBeneficiario, setNombreBeneficiario] = useState();
    const [clienteId, setClienteId] = useState(); 
    const [beneficiarioId, setBeneficiarioId] = useState();

 


    useEffect(() => {
        ActualizarTabla();
    }, []);
    useEffect(() => {
        ActualizarTabla();
    }, [clienteId]);
   
    const ActualizarTabla = async () => {
        try {
            let url = reportesContrato;

            // Verificar si hay un cliente seleccionado
            if (clienteId) {
                url += `?clienteId=${clienteId}`;
            }

            // Verificar si hay un beneficiario seleccionado
            if (beneficiarioId) {
                // Agregar el separador adecuado en función de si ya hay parámetros en la URL
                url += (clienteId || usuarioId) ? '&' : '?';
                url += `beneficiarioId=${beneficiarioId}`;
            }
        
            // Verificar si hay un usuario seleccionado
            if (usuarioId) {
                // Agregar el separador adecuado en función de si ya hay parámetros en la URL
                url += (clienteId || beneficiarioId) ? '&' : '?';
                url += `usuarioId=${usuarioId}`;
            }
          
                const usuarios = await AxiosPrivado.get(listarUsuarios);
                setListaUsuarios(usuarios.data.datos);
                console.log(usuarios);
            
          
                const clientes = await AxiosPrivado.get(listarClientes);
            setListaClientes(clientes.data.datos);
          

            const response = await AxiosPrivado.get(url);
            console.log(response.data.datos);
            setListaContratos(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde, Revise su conexión");
        }
       
    }
    const buscarIdcliente = async (id) => {
        const clienteSeleccionado = listaClientes.find(
            (f) =>
                f.id == id
        );

        if (clienteSeleccionado) {
            setNombreCliente(clienteSeleccionado.identidad + " | " + clienteSeleccionado.nombreprimer + " " + clienteSeleccionado.nombresegundo + clienteSeleccionado.apellidoprimer + " " + clienteSeleccionado.apellidosegundo)
            setClienteId(clienteSeleccionado.id)
        }
        else {
            setNombreCliente("Seleccione un cliente");
        }
    }

    const buscarIdBeneficiario = async (id) => {
        const beneficiarioSeleccionado = listaClientes.find(
            (f) =>
                f.id == id
        );

        if (beneficiarioSeleccionado) {
            setNombreBeneficiario(beneficiarioSeleccionado.identidad + " | " + beneficiarioSeleccionado.nombreprimer + " " + beneficiarioSeleccionado.nombresegundo + beneficiarioSeleccionado.apellidoprimer + " " + beneficiarioSeleccionado.apellidosegundo)
            setBeneficiarioId(beneficiarioSeleccionado.id);
        }
        else {
            setNombreBeneficiario("Seleccione un Beneficiario");
        }
    }

    const buscarIdUsuario = async (id) => {
        const beneficiarioSeleccionado = listaUsuarios.find(
            (f) =>
                f.id == id
        );

        if (beneficiarioSeleccionado) {
            setNombreUsuario(beneficiarioSeleccionado.empleado.primernombre + " " + beneficiarioSeleccionado.empleado.segundonombre + " " + beneficiarioSeleccionado.empleado.primerapellido + " " + beneficiarioSeleccionado.empleado.segundoapellido)
            setUsuarioId(beneficiarioSeleccionado.id);
        }
        else {
            setNombreUsuario("Seleccione un Usuario");
        }
    }
    const handleTodoClick = () => {
        setNombreBeneficiario(null);
        setNombreCliente(null);
        setClienteId(null);
        setBeneficiarioId(null);
        setNombreUsuario(null);
        setUsuarioId(null);
        ActualizarTabla();
    };

    // const { usuario } = useContextUsuario();
    // if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/contratos")){
    //     mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    // return(
    //     <Navigate to={"/app/home"}></Navigate>
    //   )
    // }
    return(
        <>
        <Header />
        <SideNav />
        <div style={{ marginLeft: '250px', flex: '1',  }}>
                <div className="col-sm-8 form-group">
                    <label>Cliente</label>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Seleccione un Cliente"
                            value={nombreCliente || ''}
                            disabled
                        />
                        <BuscarCliente lista={listaClientes} buscarIdcliente={buscarIdcliente}></BuscarCliente>
                    </div>
                </div>
                <div className="col-sm-8 form-group">
                    <label>Beneficiario</label>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Seleccione un Beneficiario"
                            value={nombreBeneficiario || ''}
                            disabled
                        />
                        <BuscarCliente lista={listaClientes} buscarIdcliente={buscarIdBeneficiario}></BuscarCliente>
                    </div>
                </div>
                <div className="col-sm-8 form-group">
                    <label>Usuario</label>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Seleccione un Beneficiario"
                            value={nombreUsuario || ''}
                            disabled
                        />
                        <BuscarUsuario lista={listaUsuarios} buscarIdUsuario={buscarIdUsuario}></BuscarUsuario>
                    </div>
                </div>
            </div>
        <div style={{ marginLeft: '250px', flex: '1',  }}>
        <button style={{marginLeft:'40%', marginBottom:5}} onClick={ActualizarTabla} >Filtrar</button>
        <button style={{marginLeft:10}} onClick={handleTodoClick}>Todo</button>
        <ReporteContratos datos={listaContratos}/>
        </div>
        <Footer />
      </> 
    );
}

export default PageReporteContratos;