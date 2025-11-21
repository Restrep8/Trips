import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      alert('Inicio de sesión exitoso.');
      loginUser(email);
      window.location.href = '/home';
    } else {
      alert('Credenciales inválidas. Intente nuevamente.');
    }
  };

  const loginUser = (email) => {
    localStorage.setItem('loggedInUser', email);
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row shadow rounded bg-white overflow-hidden" style={{ width: '90%', maxWidth: '900px' }}>

        {/* Imagen izquierda */}
        <div className="col-md-6 d-none d-md-block p-0">
          <div
            className="h-100"
            style={{
              backgroundImage: `url('https://raw.githubusercontent.com/Restrep8/Trips/main/images/LoginImage.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="col-md-6 p-4">
          <h2 className="text-center text-primary fw-bold mb-4">Trip$</h2>
          <p className="text-center text-secondary">Explora el mundo y gestiona tus gastos.</p>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="loginEmail"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Iniciar Sesión
              </button>
            </div>
          </form>
          <p className="text-center mt-3">
            ¿No tienes una cuenta? <a href="/register" className="text-primary">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
