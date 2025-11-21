import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function JoinTripModal({ show, onHide, refreshTrips }) {
  const [tripCode, setTripCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinTrip = () => {
    const tripsData = JSON.parse(localStorage.getItem('trips')) || [];
    const trip = tripsData.find((t) => t.code === tripCode);

    if (trip) {
      const loggedInUserEmail = localStorage.getItem('loggedInUser');
      if (!trip.participants.includes(loggedInUserEmail)) {
        // Añadir el usuario al viaje
        trip.participants.push(loggedInUserEmail);
        localStorage.setItem('trips', JSON.stringify(tripsData));

        // Refrescar los viajes del usuario
        if (refreshTrips) refreshTrips();

        // Limpiar el estado y cerrar el modal
        setTripCode('');
        setErrorMessage('');
        onHide();
      } else {
        setErrorMessage('Ya estás registrado en este viaje.');
      }
    } else {
      setErrorMessage('El código de viaje ingresado es incorrecto.');
    }
  };

  return (
    <Modal show={show} onHide={() => {
      setErrorMessage('');
      setTripCode('');
      onHide();
    }}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-share me-2"></i>Unirse a un Viaje
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Campo para ingresar el código del viaje */}
          <Form.Group controlId="tripCode" className="mb-3">
            <Form.Label>
              <i className="bi bi-lock-fill me-2"></i>Código
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa el código del viaje"
              value={tripCode}
              onChange={(e) => setTripCode(e.target.value)}
              isInvalid={!!errorMessage} // Mostrar borde rojo si hay error
            />
            <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setErrorMessage('');
            setTripCode('');
            onHide();
          }}
        >
          <i className="bi bi-x-circle me-1"></i>Cerrar
        </Button>
        <Button variant="primary" onClick={handleJoinTrip}>
          <i className="bi bi-check-circle me-1"></i>Unirse
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default JoinTripModal;
