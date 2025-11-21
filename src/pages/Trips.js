import React, { useEffect, useState } from 'react';
import AddTripModal from '../components/AddTripModal';
import JoinTripModal from '../components/JoinTripModal';
import TripDetailsModal from '../components/TripInfoModal';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showJoinTripModal, setShowJoinTripModal] = useState(false);
  const [showTripDetailsModal, setShowTripDetailsModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Cargar los datos al montar el componente
  useEffect(() => {
    const userEmail = localStorage.getItem('loggedInUser'); // Obtiene el usuario actual
    if (!userEmail) {
      alert('Por favor, inicia sesión primero.');
      window.location.href = '/login'; // Redirige si no hay usuario
    } else {
      setLoggedInUser(userEmail);
      loadUserTrips(userEmail); // Cargar los viajes del usuario
    }
  }, []);

  const loadUserTrips = (userEmail) => {
    const tripsData = JSON.parse(localStorage.getItem('trips')) || [];
    const userTrips = tripsData.filter(
      (trip) => trip.email === userEmail || trip.participants.includes(userEmail)
    );
    setTrips(userTrips);
  };

  const addNewTrip = (newTrip) => {
    const tripsData = JSON.parse(localStorage.getItem('trips')) || [];
    if (!tripsData.some((trip) => trip.code === newTrip.code)) {
      tripsData.push(newTrip);
      localStorage.setItem('trips', JSON.stringify(tripsData));
      loadUserTrips(loggedInUser);
    }
  };

  const showTripDetails = (tripCode) => {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const tripIndex = trips.findIndex((trip) => trip.code === tripCode);
    if (tripIndex !== -1) {
      localStorage.setItem('selectedTripCode', tripCode);
      localStorage.setItem('selectedTripIndex', tripIndex);
      setShowTripDetailsModal(true);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        {/* <i className="bi bi-geo-alt-fill me-2"></i> */}Mis viajes
      </h1>

      {/* Lista de viajes */}
      {trips.length === 0 ? (
        <div className="alert alert-warning">
          No tienes viajes registrados o en los que participes.
        </div>
      ) : (
        <ul className="list-group">
          {trips.map((trip) => (
            <li
              key={trip.code}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <i className="bi bi-airplane me-2 text-success"></i>
                {trip.name}
              </span>
              <button
                className="btn btn-info btn-sm"
                onClick={() => showTripDetails(trip.code)}
              >
                <i className="bi bi-info-circle"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowAddTripModal(true)}
        >
          <i className="bi bi-plus-circle me-1"></i>Añadir Viaje
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowJoinTripModal(true)}
        >
          <i className="bi bi-share me-2"></i>Unirse a un Viaje
        </button>
      </div>

      {/* Modales */}
      <AddTripModal
        show={showAddTripModal}
        onHide={() => setShowAddTripModal(false)}
        refreshTrips={loadUserTrips}
        userEmail={loggedInUser}
        addNewTrip={addNewTrip}
      />

      <JoinTripModal
        show={showJoinTripModal}
        onHide={() => setShowJoinTripModal(false)}
        refreshTrips={loadUserTrips}
      />

      <TripDetailsModal
        show={showTripDetailsModal}
        onHide={() => setShowTripDetailsModal(false)}
      />
    </div>
  );
}

export default Trips;
