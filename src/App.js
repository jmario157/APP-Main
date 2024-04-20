import React, { useContext } from 'react';
import RoutesApp, { routes } from './rutas/routes';
import { RouterProvider } from 'react-router-dom';
//import UsuarioContext from './contexto/usuario/UsuarioContext';
function App() {
  return (
    <RouterProvider router={routes}>
    </RouterProvider>
  );
}

export default App;