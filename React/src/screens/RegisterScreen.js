import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import '../css/style.css'; //hoja de stiloss
function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleCancel = () => {
    navigate('/');
  };

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      setError('Por favor, rellena todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Verifica si el nombre de usuario ya existe
    const usersRef = ref(database, 'usuarios/');
    const usersQuery = query(usersRef, orderByChild('name'), equalTo(name));
    const snapshot = await get(usersQuery);
    if (snapshot.exists()) {
      setError('El nombre de usuario ya está en uso. Elige otro nombre.');
      return;
    }
    const userId = generateShortId(); // Generar ID corto
    // Si el nombre de usuario no existe, procede a crear el nuevo usuario
    const newUserRef = ref(database, `usuarios/${userId}`); // Use Date.now() para un ID simple
    set(newUserRef, {
      email: email,
      name: name,
      pass: password,
    }).then(() => {
      setError('');
      navigate('/'); // Navegar a la página login después del registro
    }).catch((error) => {
      setError('Error al crear el usuario: ' + error.message);
    });
  };

  const generateShortId = () => {
    const timestamp = Date.now().toString();
    const shortTimestamp = timestamp.substring(timestamp.length - 6); // Obtener los últimos 6 dígitos del timestamp
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Número aleatorio entre 0 y 99
    return `user${shortTimestamp}${randomNum}`; // Concatenar para formar el ID
  };

  return (
    <div className='d-flex flex-column justify-content-center' style={{ height: '100vh' }}>
      
       <div className="container d-flex justify-content-center">
          <div className='w-50'>
            <img src={require('../assets/Icons/LogoLogin.png')} alt="Logo" className='pb-2'  />
              <div className='w-100 p-4 border-green-rounded'>
                <h2 className='text-green'>Registrarse</h2>

                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="login-input"/>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="login-input" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="login-input"/>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar Contraseña"  className="login-input"/>

                <div className='d-flex justify-content-between'>
                  <button onClick={handleRegister} className="  login-button mx-2">Registrarse</button>
                  <button onClick={handleCancel} className=" login-button mx-2">Cancelar</button>
                </div>
                {error && <div className='mt-2 ms-2' style={{ color: 'red' }}>{error}</div>}
              </div>
          </div>
       </div>
    </div>
  );
}

export default RegisterScreen;
