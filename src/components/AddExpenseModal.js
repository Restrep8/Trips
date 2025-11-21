import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AddExpenseModal = ({ trip, show, onHide, onExpenseAdded }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [payer, setPayer] = useState('');
  
  const expenseParticipantsSelect = React.useRef(null);

  // Este efecto se asegura de que el modal tenga el primer participante como pagador cuando se abre.
  useEffect(() => {
    if (trip && trip.participants && trip.participants.length > 0) {
      setPayer(trip.participants[0]); // set the first participant as payer by default
    }
  }, [trip]);

  // Resetear los campos del modal al cerrarlo
  useEffect(() => {
    if (!show) {
      setTitle('');
      setAmount('');
      setDate('');
      setPayer(trip && trip.participants ? trip.participants[0] : '');
    }
  }, [show, trip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedParticipants = Array.from(expenseParticipantsSelect.current.selectedOptions).map(option => option.value);

    const newExpense = { title, amount, date, payer, participants: selectedParticipants };

    // Llamar a la función onExpenseAdded para actualizar el estado
    onExpenseAdded(newExpense); // Esto actualizará el estado en TripDetails.js

    // No cerramos el modal hasta que el gasto haya sido añadido correctamente
    // onHide(); // Deberíamos esperar a que el gasto se haya añadido correctamente antes de cerrar
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <i className="bi bi-cash me-2"></i>Registrar Gasto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="expenseTitle">Título del Gasto</label>
            <input
              type="text"
              className="form-control"
              id="expenseTitle"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="expenseAmount">Monto Pagado</label>
            <input
              type="number"
              className="form-control"
              id="expenseAmount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="expenseDate">Fecha del Gasto</label>
            <input
              type="date"
              className="form-control"
              id="expenseDate"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="expensePayer">Participante que realizó el pago</label>
            <select
              className="form-control"
              id="expensePayer"
              value={payer}
              onChange={e => setPayer(e.target.value)}
              required
            >
              {trip && trip.participants.map((participant, index) => (
                <option key={index} value={participant}>{participant}</option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="expenseParticipants">Participantes que dividirán el gasto</label>
            <select
              id="expenseParticipantsSelect"
              ref={expenseParticipantsSelect}
              className="form-control"
              multiple
              required
            >
              {trip && trip.participants.filter(participant => participant !== payer).map((participant, index) => (
                <option key={index} value={participant}>{participant}</option>
              ))}
            </select>
            <small className="form-text text-muted">
              Mantén presionada la tecla Ctrl (o Cmd en Mac) para seleccionar múltiples participantes.
            </small>
          </div>
          <Button type="submit" variant="primary" className="w-100">
            <i className="bi bi-check-circle me-2"></i>
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExpenseModal;
