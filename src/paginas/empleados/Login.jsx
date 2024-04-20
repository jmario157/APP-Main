import React, { useContext, useEffect, useState } from 'react';
import { loginUsuarios } from '../../components/apiUrls';
import { Link } from 'react-router-dom';
import { mostraAlerta } from '../../components/Alerts/sweetAlert'
import { useContextUsuario } from '../../contexto/usuario/UsuarioContext';
import { useNavigate, useParams } from "react-router-dom";
import { AxiosPublico } from '../../components/axios/Axios';
import { DesEncriptar, Encriptar } from '../../components/encryptar/Crypto';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLogin, msj, sesionIniciada, tokenValidado, setCerrarSesion } = useContextUsuario();

  useEffect(() => {
    setCerrarSesion();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (username === "" || password === "") {
        mostraAlerta("Porfavor Complete los campos", "warning")
        return
      }
      await AxiosPublico.post('autenticacion/iniciarsesion', {
        login: username,
        contrasena: password
      })
        .then(async (data) => {
          const json = data.data;
          console.log(data.data);
          if (json.tipo == 1) {
            var usuario = json.datos.usuario;
            var token = json.datos.jwt;
            //var t = Encriptar(token);

            /*sessionStorage.setItem('toke_almacenado', String(t));
            var u = Encriptar(JSON.stringify(usuario));
            sessionStorage.setItem('usuario_almacenado', u);
            t=DesEncriptar(sessionStorage.getItem('toke_almacenado'));
            u=JSON.parse(DesEncriptar(sessionStorage.getItem('usuario_almacenado')));
            console.log(t);
            console.log(u);*/
            mostraAlerta('Bienvenido(a) ' + usuario.empleado.primernombre + ' ' + usuario.empleado.primerapellido, "success");
            await setLogin({ usuario: usuario, token: token });
            navigate('/app/home')
          }

        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.tipo == 2) {
            if (Array.isArray(error.response.data.msj)) {
              error.response.data.msj.forEach(f => {
                mostraAlerta("Campo: " + f.campo + '. ' + f.msj, "warning")
              });
            }
            else {
              mostraAlerta(error.response.data.msj, "warning")
            }
          }
          else {
            mostraAlerta(error.response.data.msj, "error")
          }
        });
    } catch (error) {
      console.log('Error:', error);
      mostraAlerta('Error en la petión', "error")
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          {/* Agrega aquí el logotipo de tu aplicación */}
          <Link to="/app/home" className="brand-link">
            <img
              src="/dist/img/incalogo2.png"
              alt="INCA Logo"
              className="img-fluid img-circle"
            />
            
          </Link>
        </div>
        <div className="card card-outline card-primary">
          <div className="card-body">
            <p className="login-box-msg">Inicio de sesión</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="input-group-append">
                  <div className="input-group-text">

                    <span className="fas fa-lock"></span>
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-12">
                  <button type="submit" className="btn btn-primary btn-block">
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="text-center mt-3">
          <Link>Olvidaste tu Contraseña</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
