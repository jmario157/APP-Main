import React, { useContext } from 'react';
import { Navigate, Route, Routes, createBrowserRouter, createRoutesFromElements, defer } from 'react-router-dom';

import PageCargo from '../components/Pages/pageCargo';
import PageHome from '../components/Pages/pageHome';
import Login from '../paginas/empleados/Login';
import PageEmpleado from '../components/Pages/PageEmpleado';
import PageClientes from '../components/Pages/PageClientes';
import PageUsuario from '../components/Pages/PageUsuario';
import PageProfesion from '../components/Pages/pageProfesion';
//import EjemploPdf from '../components/reports/pruebas';

import { AutenticacionRoute } from './AutenticacionRoute';
import { ClienteLayout } from './ClienteLayout'
import { LugaresLayout } from './LugaresLayout';
import PageLugar from '../paginas/lugares/pageLugar';
import { EmpleadoLayout } from './EmpleadoLayout';
import { CajasLayout } from './CajasLayout';
import Aperturas from '../paginas/cajas/Aperturas';
import PageReportePagoPrima from '../paginas/contratos/PageReportePagoPrima';
import { PagosLayout } from './PagosLayout';
import Pagos from '../paginas/pagos/Pagos';
import PagoCuota from '../paginas/pagos/PagoCuota';
import Cierres from '../paginas/cajas/Cierres';
import PageDepartamento from '../paginas/lugares/pageDepartamento';
import PageMunicipio from '../paginas/lugares/pageMunicipio';
import { AlquilerLayout } from './AlquilerLayout';
import PageAlquiler from '../components/Pages/PageAlquiler';
import { InventarioLayout } from './InventarioLayout';
import PageInventario from '../components/Pages/PageInventario';
import PageProductos from '../paginas/inventario/pageProductos';
import { NotaPesoLayout } from './NotaPesoLayout';
import PageNotaPeso from '../components/Pages/PageNotaPeso';
// import PageDetalle from '../paginas/notaPeso/pageDetalle';
import { FacturaLayout } from './FacturaLayout'
import PageFactura from '../components/Pages/PageFactura'
import { TicketLayout } from './TicketLayout';
import PageTicket from '../components/Pages/PageTicket';


export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/login' element={<Login />} />
      <Route path="app/" element={<AutenticacionRoute />}>
        <Route path="home" element={<PageHome />} />
        <Route path='clientes' element={<ClienteLayout />}>
          <Route path='' element={<PageClientes />} />
          <Route path='profesion' element={<PageProfesion />} />
        </Route>
        <Route path='empleados' element={<EmpleadoLayout />}>
          <Route path='usuario' element={<PageUsuario />} />
          <Route path="cargo" element={<PageCargo />} />
          <Route path="empleado" element={<PageEmpleado />} />
        </Route>

        <Route path='lugares' element={<LugaresLayout />}>
          <Route path='lugar' element={<PageLugar />} />
          <Route path='departamentos' element={<PageDepartamento />} />
          <Route path='municipios' element={<PageMunicipio />} />
        </Route>
        <Route path='cajas' element={<CajasLayout />}>
          <Route path='aperturas' element={<Aperturas />} />
          <Route path='cierres' element={<Cierres />} />
        </Route>
        <Route path='pagos' element={<PagosLayout />}>
          <Route path='' element={<Pagos />} />
        </Route>
        <Route path='alquiler' element={<AlquilerLayout/>} >
          <Route path='' element={<PageAlquiler/>} /> 
        </Route>
        <Route path='inventario' element={<InventarioLayout/>} >
          <Route path='' element={<PageInventario/>} /> 
          <Route path='productos' element={<PageProductos/>} /> 
        </Route>
        <Route path='nota' element={<NotaPesoLayout/>}>
          <Route path='' element={<PageNotaPeso/>}/>
          {/* <Route path='detalle' element={<PageDetalle/>}/> */}
        </Route>
        <Route path='factura' element={<FacturaLayout/>}>
          <Route path='' element={<PageFactura/>}/>
        </Route>
        <Route path='ticket' element={<TicketLayout/>}>
          <Route path='' element={<PageTicket/>}/>
        </Route>
      </Route>
      <Route path='*' element={<Navigate to="app/home" />} />
    </Route>
  )
);
