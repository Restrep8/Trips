import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Table, ListGroup, Alert } from 'react-bootstrap';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal'; // Importamos el modal de detalles

const Expense = () => {
  const { tripIndex } = useParams();
  const [trip, setTrip] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showExpenseDetailsModal, setShowExpenseDetailsModal] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tripCode = localStorage.getItem('selectedTripCode');
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const selectedTrip = trips.find((trip) => trip.code === tripCode);

    if (selectedTrip) {
      setTrip(selectedTrip);
      setError(null);
    } else {
      setError('No se encontró el viaje seleccionado.');
    }

    setLoading(false);
  }, [tripIndex]);

  const calculateTotalSpent = () => {
    if (!trip || !trip.expenses) return 0;
    return trip.expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0).toFixed(2);
  };

  const calculateTotalPerParticipant = (participant) => {
    if (!trip || !trip.expenses) return 0;
    return trip.expenses
      .filter(expense => expense.payer === participant)
      .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
      .toFixed(2);
  };

  const handleExpenseAdded = (newExpense) => {
    const updatedTrip = { ...trip, expenses: [...trip.expenses, newExpense] };

    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    const tripIndex = trips.findIndex(t => t.code === trip.code);
    if (tripIndex !== -1) {
      trips[tripIndex] = updatedTrip;
      localStorage.setItem('trips', JSON.stringify(trips));
    }

    setTrip(updatedTrip);
    setShowAddExpenseModal(false);
  };

  const handleShowExpenseDetails = (expense) => {
    setExpenseDetails(expense);
    setShowExpenseDetailsModal(true);
  };

  const handleCloseExpenseDetailsModal = () => {
    setShowExpenseDetailsModal(false);
    setExpenseDetails(null);
  };

  const handleCloseAddExpenseModal = () => {
    setShowAddExpenseModal(false);
  };

  if (loading) {
    return <div className="text-center mt-5"><Alert variant="info">Cargando detalles del viaje...</Alert></div>;
  }

  if (error) {
    return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-primary">{trip.name}</h1>
      <p><strong>Código del Viaje:</strong> {trip.code}</p>
      <p><strong>Divisa:</strong> {trip.currency}</p>

      <h5 className="mt-4">Participantes:</h5>
      <ListGroup>
        {trip.participants && trip.participants.length > 0 ? (
          trip.participants.map((participant, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between">
              {participant}
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="warning">No hay participantes.</Alert>
        )}
      </ListGroup>

      <h5 className="mt-4">Gastos:</h5>
      {trip.expenses && trip.expenses.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Título</th>
              <th>Monto ({trip.currency})</th>
              <th>Pagador</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {trip.expenses.map((expense, index) => (
              <tr key={index}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.title}</td>
                <td>{expense.amount}</td>
                <td>{expense.payer}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowExpenseDetails(expense)} className="w-100">
                    <i className="bi bi-info-circle me-2"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No hay gastos registrados.</Alert>
      )}

      <h5 className="mt-4">Total Gastado por Participante:</h5>
      <ListGroup>
        {trip.participants && trip.participants.length > 0 ? (
          trip.participants.map((participant, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between">
              {participant}: <strong>{calculateTotalPerParticipant(participant)} {trip.currency}</strong>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info">No hay participantes para calcular.</Alert>
        )}
      </ListGroup>

      <h5 className="mt-4">Total Gastado en General:</h5>
      <p className="font-weight-bold">{calculateTotalSpent()} {trip.currency}</p>

      <Button variant="primary" onClick={() => setShowAddExpenseModal(true)} className="mt-3">
        <i className="bi bi-cash me-2"></i>Registrar Gasto
      </Button>

      <AddExpenseModal
        trip={trip}
        show={showAddExpenseModal}
        onHide={handleCloseAddExpenseModal}
        onExpenseAdded={handleExpenseAdded}
      />

      <ExpenseDetailsModal
        show={showExpenseDetailsModal && expenseDetails}
        onHide={handleCloseExpenseDetailsModal}
        expenseDetails={expenseDetails}
      />
    </div>
  );
};

export default Expense;
