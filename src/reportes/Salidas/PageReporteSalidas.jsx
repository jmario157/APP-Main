import React, { useEffect, useState } from 'react';
import Header from '../../components/plantilla/Header';
import SideNav from '../../components/plantilla/SideNav';
import Footer from '../../components/plantilla/Footer';
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { mostraAlertaWarning } from '../../components/Alerts/sweetAlert';
import ComponentePadre from '../../reportes/Salidas/paginaVariacionCostos';
import ReporteSalidas from './ReporteSalidas';
import { listarSalidas } from "../../components/apiUrls";
import { AxiosPrivado } from "../../components/axios/Axios";
import { mostraAlertaError } from "../../components/Alerts/sweetAlert";

function PageReporteSalidas() {
    const [listaSalidas, setListaSalidas] = useState([]);
    const {id} = useParams();
    const {datos} = useParams();
    const location = useLocation();
    const datosSalida = location.state;
    const { usuario } = useContextUsuario();

    useEffect(() => {
        ActualizarTabla();
    }, []);
    
   
    const ActualizarTabla = async () => {
        try {
            //setCargandoDatos(true);
            const response = await AxiosPrivado.get(listarSalidas);
            setListaSalidas(response.data.datos);
        } catch (error) {
            console.log(error);
            mostraAlertaError("El servidor no responde, Revise su conexión");
        }
       
    }
   
    if(!usuario.usuarioaccesos.find((f)=>f.ruta=="/productos")){
        mostraAlertaWarning("No tiene permisos para acceder a esta ruta");
    return(
        <Navigate to={"/app/home"}></Navigate>
      )
    }
    return(
        <>
        <Header />
        <SideNav />
        <div style={{ marginLeft: '250px', flex: '1',  }}>
        <ReporteSalidas datos={listaSalidas}/>
        </div>
        <Footer />
      </> 
    );
}

export default PageReporteSalidas;