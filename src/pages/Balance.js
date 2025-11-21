import React, { useEffect, useState, useCallback } from 'react';
import { Button, Table, ListGroup, Alert, Form } from 'react-bootstrap';

const Balance = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [payments, setPayments] = useState([]);
  const [balanceRows, setBalanceRows] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const loggedInUser = localStorage.getItem('loggedInUser'); // Usuario logueado

  // Cargar los viajes del usuario
  useEffect(() => {
    if (!loggedInUser) {
      alert('Por favor, inicia sesión primero.');
      window.location.href = '/login'; // Redirigir si no hay usuario logueado
      return;
    }

    const tripsData = JSON.parse(localStorage.getItem('trips')) || [];
    setTrips(tripsData);

    // Filtrar viajes en los que participa el usuario
    const userTrips = tripsData.filter(
      (trip) => trip.email === loggedInUser || trip.participants.includes(loggedInUser)
    );
    setFilteredTrips(userTrips);
  }, [loggedInUser]);

  // Calcular los balances de los participantes
  const calculateBalances = useCallback((tripIndex) => {
    const trip = filteredTrips[tripIndex];

    if (trip) {
      const totalSpentByParticipant = {};
      const totalOwedByParticipant = {};

      trip.participants.forEach((participant) => {
        totalSpentByParticipant[participant] = 0;
        totalOwedByParticipant[participant] = 0;
      });

      let total = 0;

      trip.expenses.forEach((expense) => {
        const amount = Number(expense.amount);
        if (!isNaN(amount)) {
          total += amount;
        }

        const totalParticipants = expense.participants.length + 1; // Incluye al pagador
        const share = amount / totalParticipants;

        totalSpentByParticipant[expense.payer] += amount;

        const allParticipants = [...expense.participants, expense.payer];
        allParticipants.forEach((participant) => {
          totalOwedByParticipant[participant] += share;
        });
      });

      setTotalExpenses(total);

      const balanceRows = trip.participants.map((participant) => {
        const paid = Number(totalSpentByParticipant[participant] || 0);
        const owed = Number(totalOwedByParticipant[participant] || 0);
        const balance = paid - owed;

        return (
          <tr key={participant}>
            <td>{participant}</td>
            <td>${paid.toFixed(2)}</td>
            <td>${owed.toFixed(2)}</td>
          </tr>
        );
      });

      setBalanceRows(balanceRows);
    }
  }, [filteredTrips]);

  useEffect(() => {
    if (selectedTripIndex !== null) {
      calculateBalances(selectedTripIndex);
    }
  }, [selectedTripIndex, calculateBalances]);

  // Función para equilibrar los gastos entre los participantes
  const equilibrarGastos = () => {
    const trip = filteredTrips[selectedTripIndex];
    if (!trip) return;

    const totalSpentByParticipant = {};
    const totalOwedByParticipant = {};
    const participantsWithPositiveBalance = [];
    const participantsWithNegativeBalance = [];
    const paymentsLog = [];

    trip.participants.forEach((participant) => {
      totalSpentByParticipant[participant] = 0;
      totalOwedByParticipant[participant] = 0;
    });

    trip.expenses.forEach((expense) => {
      const amount = Number(expense.amount);
      const totalParticipants = expense.participants.length + 1;
      const share = amount / totalParticipants;

      totalSpentByParticipant[expense.payer] += amount;

      const allParticipants = [...expense.participants, expense.payer];
      allParticipants.forEach((participant) => {
        totalOwedByParticipant[participant] += share;
      });
    });

    // Determinar los participantes con saldo positivo y negativo
    trip.participants.forEach((participant) => {
      const balance = totalSpentByParticipant[participant] - totalOwedByParticipant[participant];
      if (balance > 0) {
        participantsWithPositiveBalance.push({ participant, balance });
      } else if (balance < 0) {
        participantsWithNegativeBalance.push({ participant, balance: Math.abs(balance) });
      }
    });

    // Generar pagos entre participantes
    while (participantsWithPositiveBalance.length > 0 && participantsWithNegativeBalance.length > 0) {
      const creditor = participantsWithPositiveBalance[0];
      const debtor = participantsWithNegativeBalance[0];

      // Calcular el pago que el deudor debe hacer al acreedor
      const amountToSettle = Math.min(creditor.balance, debtor.balance);

      paymentsLog.push(`${debtor.participant} le debe $${amountToSettle.toFixed(2)} a ${creditor.participant}`);

      creditor.balance -= amountToSettle;
      debtor.balance -= amountToSettle;

      // Si el saldo de un participante se ha equilibrado, lo eliminamos de la lista
      if (creditor.balance === 0) participantsWithPositiveBalance.shift();
      if (debtor.balance === 0) participantsWithNegativeBalance.shift();
    }

    setPayments(paymentsLog);

    // Actualizar saldos en la tabla con los valores finales
    setBalanceRows(
      trip.participants.map((participant) => {
        const paid = Number(totalSpentByParticipant[participant] || 0);
        const owed = Number(totalOwedByParticipant[participant] || 0);
        const balance = paid - owed;

        return (
          <tr key={participant}>
            <td>{participant}</td>
            <td>${paid.toFixed(2)}</td>
            <td>${owed.toFixed(2)}</td>
          </tr>
        );
      })
    );
  };

  // Mensaje de carga de viajes
  if (!filteredTrips.length) {
    return <Alert variant="info">No tienes viajes disponibles.</Alert>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Balance</h1>
      <div className="form-group mb-4">
        <label htmlFor="tripSelect" className="form-label">Seleccionar Viaje:</label>
        <Form.Control
          as="select"
          id="tripSelect"
          className="form-control"
          onChange={(e) => setSelectedTripIndex(e.target.value)}
          value={selectedTripIndex}
        >
          <option value={null}>Selecciona un viaje</option>
          {filteredTrips.map((trip, index) => (
            <option key={index} value={index}>
              {trip.name}
            </option>
          ))}
        </Form.Control>
      </div>

      {selectedTripIndex !== null && filteredTrips[selectedTripIndex] && (
        <>
          <p><strong>Viaje:</strong> {filteredTrips[selectedTripIndex].name}</p>
          <p><strong>Total Gastado:</strong> ${totalExpenses.toFixed(2)}</p>

          <h5>Resúmen de saldos</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Participante</th>
                <th>Pagado</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>{balanceRows}</tbody>
          </Table>

          <Button variant="primary" onClick={equilibrarGastos} className="mt-4">
            Generar Balance
          </Button>

          <h5 className="mt-4"></h5>
          <ListGroup>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <ListGroup.Item key={index}>{payment}</ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>Todos los participantes se encuentran al día.</ListGroup.Item>
            )}
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default Balance;
