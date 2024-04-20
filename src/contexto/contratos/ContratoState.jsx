import React, { useEffect, useReducer, useState } from "react"
import { ContratoContext } from "./ContratoContext"
import { AxiosPrivado, AxiosPublico } from "../../components/axios/Axios";
import { listarContratos } from "../../components/apiUrls";
import moment from "moment";
import { useContextUsuario } from "../usuario/UsuarioContext";

export const ContratoState = (props) => {
    const { usuario, caja, estacion } = useContextUsuario();
    const [contrato, setContrato] = useState({
        id: 0,
        fechaInicio: moment().format("YYYY-MM-DD"),
        plazo: 0,
        tasa: 0,
        periodicidad: 12,
        gastoadministrativo: 1000,
        total: 1000,
        cuota: 0,
        prima: 0,
        saldo: 0,
        clienteId: 0,
        usuarioId: usuario.id,
        estacionId: estacion.id,
        descuento: 0,
        "lotes": [],
        "pago": []
    });
    const [listaContratos, setListaContratos] = useState([]);
    const [amortizaciones, setAmortizaciones] = useState([]);
    const [actualizar, setActualizar] = useState(false);
    const [lotes, setLotes] = useState([]);
    const [pagos, setPagos] = useState([]);

    const Lista = async () => {
        try {
            const response = await AxiosPrivado.get(listarContratos);
            setListaContratos(response.data.datos);
          } catch (error) {
            console.log(error);
          }
    };
    
    const actualizarDatos = () =>{
        let sumaPrima = 0;
        let sumaTotal = parseFloat(contrato.gastoadministrativo);
        lotes.forEach(f => {
            sumaPrima+=f.prima;
            sumaTotal+=f.valor;
        });
        let totalPagar = parseFloat(sumaPrima) + parseFloat(contrato.gastoadministrativo);
        let saldo = parseFloat(sumaTotal)-parseFloat(totalPagar)-parseFloat(contrato.descuento);
        let cuota = calculoCuota({
            tasa: contrato.tasa,
            periodicidad: contrato.periodicidad,
            plazo: contrato.plazo,
            saldo: saldo
        });
        let lotesContrato = lotes?.map(f=>({
            loteId: f.id,
            prima: f.prima,
            valor: f.valor
        }))
        setContrato({
            ...contrato,
            prima: sumaPrima,
            saldo: saldo,
            cuota: cuota,
            total: sumaTotal,
            lotes: lotesContrato
        })
    }
    const calculoCuota = (datos) =>{
        var interes = datos.tasa==0 ? 0 : ((datos.tasa)/100)/datos.periodicidad//tasa/((360*periodicidad)/365)
        var cuota = 0;
        if(datos.plazo>0)
            cuota = datos.tasa==0 ? datos.saldo/datos.plazo : datos.saldo/((1- Math.pow((1+interes),(-1*datos.plazo)))/interes)
        
        return parseFloat(cuota.toFixed(2));
    }

    const tablaAmortizacion = (datos) =>{
        var Tabla=[];
        var fechaInicio = moment(datos.fechaInicio, "YYYY-MM-DD");
        var interes = datos.tasa==0? 0 : ((datos.tasa)/100)/datos.periodicidad;//tasa/((360*periodicidad)/365)
        var cuota = datos.tasa==0? datos.saldo/datos.plazo : datos.saldo/((1- Math.pow((1+interes),(-1*datos.plazo)))/interes)
        var saldocapital = datos.saldo
        for(var n=1; n<=datos.plazo; n++){
            var interescuota= (saldocapital)*(((datos.tasa)/100)/datos.periodicidad)
            var amortizacioncapital = cuota-interescuota
            saldocapital=saldocapital-amortizacioncapital
            var contrato = 0;
            if(datos.contratoId){
                contrato= datos.contratoId;
            }
            Tabla.push({
                numero: n,
                fechapago: fechaInicio.add(1, "M").format("YYYY-MM-DD"),
                cuota: cuota.toFixed(2),
                amortizacioncapital: amortizacioncapital.toFixed(2),
                intereses: interescuota.toFixed(2),
                estado: 'PE',
                saldocapital: saldocapital.toFixed(2),
                contratoId: contrato
            });
        }
        return Tabla;
    }

    return (
        <ContratoContext.Provider value={{
            contrato: contrato,
            listaContratos: listaContratos,
            actualizar,
            lotes,
            pagos,
            amortizaciones,
            caja,
            setActualizar,
            setContrato,
            setListaContratos,
            Lista,
            setLotes,
            setPagos,
            setAmortizaciones,
            actualizarDatos,
            tablaAmortizacion,
            calculoCuota
        }}>
            {props.children}
        </ContratoContext.Provider>
    )
}
