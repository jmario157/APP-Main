import React from 'react';
import Header from '../plantilla/Header'
import SideNav  from '../plantilla/SideNav';
import Footer from '../plantilla/Footer'
import Home from '../plantilla/Home'

function PageHome() {
  return (
    <React.StrictMode>
      <Header/>
      <SideNav/>
      <Home/>
      <Footer/>
    </React.StrictMode>
  );
}

export default PageHome;
