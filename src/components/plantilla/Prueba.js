import React from 'react';
import Header from '../plantilla/Header'
import SideNav from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Home from '../plantilla/Home'
import Cliente from '../Clientes';

function PageHome() {
    return (
        <React.StrictMode>
            <div className="wrapper">
                <Header></Header>
                <SideNav></SideNav>
                <Cliente></Cliente>
               
                <footer className="main-footer">
                    <div className="float-right d-none d-sm-block">
                        <b>Version</b> 3.2.0
                    </div>
                    <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
                </footer>

                
                <aside className="control-sidebar control-sidebar-dark">
                    
                </aside>
                
            </div>
        </React.StrictMode>
    );
}

export default PageHome;
