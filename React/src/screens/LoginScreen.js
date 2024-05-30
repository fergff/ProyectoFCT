import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import '../css/style.css'; //hoja de stiloss

function LoginScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
      useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          window.alert('Autenticado automáticamente.');
          navigate('/home'); //navegamos al home
        }
      }, [navigate]);
  
  const handleLogin = async () => {
    const usersRef = ref(database, 'usuarios');
    const userQuery = query(usersRef, orderByChild('name'), equalTo(name));

    try {
      const snapshot = await get(userQuery);
      if (snapshot.exists()) {
        let userKey = null;
        let userData = null;
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().pass === password) {
            userKey = childSnapshot.key;
            userData = childSnapshot.val();
          }
        });

        if (userKey && userData) {
          localStorage.setItem('userId', userKey);
          window.alert(`Inicio de sesión exitoso, Bienvenido ${userData.name}`);
          navigate('/home');
        } else {
          window.alert('Error: Contraseña incorrecta');
        }
      } else {
        window.alert('Error: Usuario no encontrado');
      }
    } catch (error) {
      console.error(error);
      window.alert('Error durante el inicio de sesión');
    }
  };

  return (
    <div className='d-flex flex-column justify-content-between' style={{ height: '100vh' }}>
      <div className="container mt-5 d-flex justify-content-center">
        <div>
          <div className="mb-3 ps-3">
            <img src={require('../assets/Icons/LogoLogin.png')} alt="Logo" className="login-logo" />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="login-input"
            />
          </div>
          <div className="form-group mt-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="login-input"
            />
          </div>
          <button onClick={handleLogin} className="login-button">
            Iniciar sesión
          </button>
          <button onClick={() => navigate('/register')} className="fs-4 btn mt-3 text-green">
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
        
      </div>
      <div className="d-flex justify-content-end align-items-end pe-5">
          <p className="align-self-end text-primary fw-bold fst-italic">Fernando Guio Franco &copy;</p>
          <img src={require('../assets/Icons/azarquielLogo.png')} alt="Copy" style={{ width: '60px', height: '60px' }}/>
      </div>
    </div>
  );
}

export default LoginScreen;
