import React from "react";

function Home() {

  const user = localStorage.getItem("loggedInUser");
  return (

      <div className="container mt-5">
        <h1 className="text-center mb-4">
          Bienvenid@ a Trip$!
        </h1>
        <h3 className="text-center text-primary">
          <i className="bi bi-person-circle me-2"></i>{user}
        </h3> 
        <p className="text-center text-secondary">
          <br />
          Con Trip$ puedes organizar tus viajes, registrar gastos y mantener un balance claro con tus amigos.
          <br />
          <br />
          Usa la barra de navegación superior para acceder a todas las funciones.
        </p>
      </div>

  );
}

export default Home;