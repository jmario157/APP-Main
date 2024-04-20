import { Button } from "react-bootstrap";
import { useContextContrato } from "../../contexto/contratos/ContratoContext";
import { useEffect, useState } from "react";

const TablaContratoLotes = ( ) => {
    const {lotes} = useContextContrato();
   
    return (
        <div className="table-responsive p-0">
            <table className="table table-hover text-nowrap">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Lote</th>
                        <th>Valor</th>
                        <th>Prima</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lotes.map(f =>
                            <Fila key={f.id} f={f}></Fila>
                            )
                    }
                </tbody>
            </table>
        </div>
    );
};

const Fila = ({ f }) => {
    const { lotes, setLotes, actualizarDatos } = useContextContrato();
    const [prima, setPrima] = useState(f.prima);
    useEffect(()=>{
        console.log("Cambio en lotes");
    },[lotes]);
    const eliminarLote =(id)=>{
        const nuevo = lotes.filter(l => l.id != id.target.value);
        setLotes(nuevo);
    }
    const cambioValor = (e) =>{
        setPrima(e.target.value);
        var lotesNuevaPrima = lotes;
        lotesNuevaPrima.find(fila => fila.id==f.id).prima= parseFloat(e.target.value);
        setLotes(lotesNuevaPrima);
        actualizarDatos();
        /*var lotesNuevaPrima = lotes.find(fila => fila.id==f.id);
        lotesNuevaPrima.prima=e.target.value;
        var lista = lotes.filter(fila => fila.id !=f.id);
        lista.push(lotesNuevaPrima);
        setLotes(lista);*/
    }
    return (
        <tr>
            <td>{f.id}</td>
            <td>{f.nombre + ", " + f.bloque.nombre + ", " + f.etapa.nombre + ", " + f.proyecto.nombre}</td>
            <td>{"L " + new Intl.NumberFormat('en-hn', {
                        minimumFractionDigits: 2,
                    }).format(f.valor)}</td>
            <td>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i></i>L</span>
                        </div>
                        <input type="number" className="form-control" placeholder="Ej. 1000"
                            value={prima}
                            onChange={cambioValor}
                            name="prima"
                        />
                    </div>
                </div>
            </td>
            <td>
                <Button value={f.id} variant="danger" onClick={eliminarLote}>Eliminar</Button>
            </td>
        </tr>
    );
}

export default TablaContratoLotes;