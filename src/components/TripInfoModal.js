import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TripDetailsModal({ show, onHide }) {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const tripCode = localStorage.getItem('selectedTripCode');
      const trips = JSON.parse(localStorage.getItem('trips')) || [];

      if (tripCode) {
        const selectedTrip = trips.find((trip) => trip.code === tripCode);

        if (selectedTrip) {
          setTripDetails(selectedTrip);
          setError(null);
        } else {
          setError('No se encontraron los detalles del viaje.');
        }
      } else {
        setError('No se especificó un código de viaje.');
      }

      setLoading(false);
    }
  }, [show]);

  const handleRedirectToDetails = () => {
    const tripIndex = localStorage.getItem('selectedTripIndex');
    if (tripIndex) {
      navigate(`/viaje/${tripIndex}`);
    } else {
      alert('No se pudo redirigir al viaje. Intenta nuevamente.');
    }
  };

  const closeModal = () => {
    setTripDetails(null);
    setLoading(true);
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-info-circle me-2"></i>Información del Viaje
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          tripDetails && (
            <>
              <h5 className="text-center text-primary">
                {tripDetails.name}
              </h5>
              <p>
                <strong>Código del Viaje:</strong> {tripDetails.code}
              </p>
              <p>
                <strong>Divisa:</strong> {tripDetails.currency}
              </p>
              <h6>Participantes:</h6>
              <ul>
                {tripDetails.participants.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </>
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        {tripDetails && (
          <Button 
            variant="primary" 
            onClick={handleRedirectToDetails}
            className="w-100"
          >
            Ver más
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TripDetailsModal;
