import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Registrando usuario:', name);
    navigate('/home'); 
  };

  return (
    <div className="container mt-5">
      <h2>Registrarse</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="form-control" />
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="form-control mt-3" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="form-control mt-3" />
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar Contraseña" className="form-control mt-3" />
      <button onClick={handleRegister} className="btn btn-primary mt-3">Registrarse</button>
    </div>
  );
}

export default RegisterScreen;

