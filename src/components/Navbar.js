import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
      <div className="container">

        <Link className="navbar-brand text-primary fw-bold" to="/home">
          <i className="bi bi-globe-americas me-2"></i>Trip$
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links del navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/trips">
                <i className="bi bi-airplane me-1"></i>Viajes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark fw-semibold" to="/balance">
                <i className="bi bi-wallet me-1"></i>Balance
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-danger fw-semibold"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
