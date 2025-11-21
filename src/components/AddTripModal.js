import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { generateUniqueCode } from '../utils';

function AddTripModal({ show, onHide, refreshTrips, userEmail }) {
  const [tripName, setTripName] = useState('');
  const [currency, setCurrency] = useState('COP');
  const [participants, setParticipants] = useState([]);
  const [participantEmail, setParticipantEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const tripCode = generateUniqueCode();

    // Asegura que el creador del viaje esté como participante
    const updatedParticipants = userEmail
      ? [userEmail, ...participants.filter((email) => email !== userEmail)]
      : participants;

    const newTrip = {
      name: tripName,
      currency,
      code: tripCode,
      participants: updatedParticipants,
      email: userEmail, // Creador del viaje
      expenses: [] // Comienza sin gastos
    };

    const tripsData = JSON.parse(localStorage.getItem('trips')) || [];
    tripsData.push(newTrip);
    localStorage.setItem('trips', JSON.stringify(tripsData));

    // Limpia los estados del formulario
    setTripName('');
    setCurrency('COP');
    setParticipants([]);
    setParticipantEmail('');

    // Actualiza la lista de viajes
    if (refreshTrips) refreshTrips();

    // Cierra el modal
    onHide();
  };

  const handleAddParticipant = () => {
    if (participantEmail && !participants.includes(participantEmail)) {
      setParticipants([...participants, participantEmail]);
      setParticipantEmail('');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle me-2"></i>Añadir Viaje
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Campo para el nombre del viaje */}
          <Form.Group controlId="tripName" className="mb-3">
            <Form.Label>
              <i className="bi bi-airplane-fill me-2"></i>Nombre
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa el nombre del viaje"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo para seleccionar la divisa */}
          <Form.Group controlId="currency" className="mb-3">
            <Form.Label>
              <i className="bi bi-currency-dollar me-2"></i>Divisa
            </Form.Label>
            <Form.Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </Form.Select>
          </Form.Group>

          {/* Campo para añadir participantes */}
          <Form.Group controlId="participantEmail" className="mb-3">
            <Form.Label>
              <i className="bi bi-person-plus-fill me-2"></i>Agregar Participante
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="email"
                placeholder="Correo del participante"
                value={participantEmail}
                onChange={(e) => setParticipantEmail(e.target.value)}
              />
              <Button variant="secondary" onClick={handleAddParticipant}>
                <i className="bi bi-person-plus"></i>
              </Button>
            </div>
          </Form.Group>

          {/* Lista de participantes */}
          {participants.length > 0 && (
            <div className="mb-3">
              <Form.Label>
                <i className="bi bi-list-check me-2"></i>Participantes
              </Form.Label>
              <ul className="list-group">
                {participants.map((email, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {email}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setParticipants(
                          participants.filter((p) => p !== email)
                        )
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            <i className="bi bi-check-circle me-1"></i>Crear
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddTripModal;
