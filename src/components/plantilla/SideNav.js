import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { imagenEmpleado } from "../apiUrls";
const SideNav = () => {
  const { usuario } = useContextUsuario();
  const [expandedItems, setExpandedItems] = useState([]);
  const handleMenuToggle = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const isMenuExpanded = (index) => {
    return expandedItems.includes(index);
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/app/home" className="brand-link">
        <img
          src="/dist/img/inca.png"
          alt="INCA Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">SigBir</span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src={
                usuario?.Imagen != null ?
                  imagenEmpleado + usuario.empleado.Imagen
                  : imagenEmpleado + "empleado.png"
              }
              className="img-circle elevation-2"
              alt="Imagen"
            />
          </div>
          <div className="info">
            <Link to="/login" className="d-block">
              {
                usuario?.login != null ?
                  usuario.empleado.primernombre + ' ' + usuario.empleado.primerapellido
                  : "Usuario"
              }
            </Link>
          </div>
        </div>
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Buscar"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-header">Administración</li>
            <li className="nav-item">
              <Link
                to="/app/home"
                className="nav-link"
              >
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>
                  Inicio
                  <i className="right fas fa-angle-left" />
                </p>
              </Link>
            </li>
            <li
              className={`nav-item ${isMenuExpanded(0) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(0)}
              >
                <i className="nav-icon fa fa-users" />
                <p>
                  Empleados
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/empleados/empleado" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Empleado
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/empleados/cargo" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Cargo
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/empleados/usuario" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Usuarios
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={`nav-item ${isMenuExpanded(1) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(1)}
              >
                <i className="nav-icon fas fa-building" />
                <p>
                  Inmobiliario
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/inmobiliario/proyecto" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Proyectos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/inmobiliario/etapas" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Etapas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/inmobiliario/bloques" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Bloques
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/inmobiliario/lotes" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Lotes
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={`nav-item ${isMenuExpanded(2) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(2)}
              >
                <i className="nav-icon fas fa-users" />
                <p>
                  Clientes
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/clientes" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Clientes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/clientes/profesion" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Profesión
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className={`nav-item ${isMenuExpanded(3) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(3)}
              >
                <i className="nav-icon fa fa-file-contract" />
                <p>
                  Contratos
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/contratos/nuevo" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Nuevo Contrato
                  </Link>
                </li>
              </ul>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/contratos" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Contratos
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(4) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(4)}
              >
                <i className="nav-icon fas fa-shopping-cart" />
                <p>
                  Compras
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/productos" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/proveedores" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Proveedores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/compras" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Compras
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/historial" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Historial
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/graficos" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Graficos
                  </Link>
                </li>

              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(5) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(5)}
              >
                <i className="nav-icon fas fa-arrow-right" />
                <p>
                  Salidas
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/salidas" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Salidas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/historialsalidas" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Historial Salidas
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(6) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(6)}
              >
                <i className="fas fa-map-marker-alt nav-icon" />
                <p>
                  Lugares
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/lugares/lugar" className="nav-link">
                    <i className="fas fa-map-marker-alt nav-icon" />
                    Lugares
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/lugares/departamentos" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Departamentos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/lugares/municipios" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Municipios
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(7) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(7)}
              >
                <i className="nav-icon fa fa-shopping-cart" />
                <p>
                  Caja
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/cajas/aperturas" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Apertura
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/cajas/cierres" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Cierres
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(8) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(8)}
              >
                <i className="nav-icon fa fa-shopping-cart" />
                <p>
                  Alquiler
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/alquiler" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Alquileres
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(9) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(9)}
              >
                <i className="nav-icon fa fa-box" />
                <p>
                  Inventario
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/inventario" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Inventario
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/inventario/productos" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Productos
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(10) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(10)}
              >
                <i className="nav-icon fa fa-balance-scale" />
                <p>
                  Nota de Peso
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/nota" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Nota de Peso
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link to="/app/nota/detalle" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Nota de Peso Detallada
                  </Link>
                </li> */}
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(11) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(11)}
              >
                <i className="nav-icon fas fa-cash-register" />
                <p>
                  Pagos
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/pagos/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Pagos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/pagos/cuota" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Pago Cuota
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/app/pagos/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Pago Capital
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(12) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(12)}
              >
                <i className="nav-icon fas fa-headset" />
                <p>
                  Soporte
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/ticket/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Tickets
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className={`nav-item ${isMenuExpanded(13) ? "menu-open" : ""}`}
            >
              <Link
                to="#"
                className="nav-link"
                onClick={() => handleMenuToggle(13)}
              >
                <i className="nav-icon fas fa-file-invoice-dollar" />
                <p>
                  Factura
                  <i className="fas fa-angle-left right" />
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/app/factura/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    Factura
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default SideNav;
