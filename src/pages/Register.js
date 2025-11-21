import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      alert('El correo electrónico ya está registrado.');
    } else if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Intente nuevamente.');
    } else {
      const newUser = { email, name, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registro exitoso. Puedes iniciar sesión ahora.');
      window.location.href = '/login';
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row shadow rounded bg-white overflow-hidden" style={{ width: '100%', maxWidth: '450px' }}>

        {/* Formulario de registro */}
        <div className="p-4 w-100">
          <h2 className="text-center text-primary fw-bold mb-4">Trip$</h2>
          <p className="text-center text-secondary">
            Explora el mundo y gestiona tus gastos.</p>
            
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="registerEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="registerName" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                id="registerName"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="registerPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña"
                required
                minLength="6"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                minLength="6"
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Registrar
              </button>
            </div>
          </form>
          <p className="text-center mt-3">
            ¿Ya tienes una cuenta? <a href="/login" className="text-primary">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
