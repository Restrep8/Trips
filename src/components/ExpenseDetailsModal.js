import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ExpenseDetailsModal = ({ show, onHide, expenseDetails }) => {
  // Función para calcular cuánto ha pagado cada participante
  const calculateShare = (expense) => {
    const totalParticipants = expense.participants.length + 1; // Incluimos al pagador en el total de participantes
    const share = expense.amount / totalParticipants;
    return share.toFixed(2);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <i className="bi bi-cash me-2"></i>Detalles del Gasto
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {expenseDetails && (
          <>
            <div className="mb-3">
              <p><strong>Título:</strong> {expenseDetails.title}</p>
              <p><strong>Monto:</strong> ${expenseDetails.amount}</p>
              <p><strong>Fecha:</strong> {new Date(expenseDetails.date).toLocaleDateString()}</p>
              <p><strong>Pagador:</strong> {expenseDetails.payer}</p>
              <p><strong>Implicados:</strong> {expenseDetails.participants.join(', ')}</p>
            </div>

            <h6 className="mt-3 mb-3">Detalle de lo que paga cada usuario:</h6>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>{expenseDetails.payer}</strong> pagó ${expenseDetails.amount}
              </li>
              {expenseDetails.participants.map((participant, index) => (
                <li key={index} className="list-group-item">
                  <strong>{participant}</strong> debe pagar ${calculateShare(expenseDetails)} 
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ExpenseDetailsModal;
