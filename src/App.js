import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';  
import Trips from './pages/Trips';
import Expense from './pages/Expense';
import Balance from './pages/Balance';
import Navbar from './components/Navbar';


function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('loggedInUser'); 

  if (!loggedInUser) {
    return navigate('/login');
  }

  return children; 
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}

        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Navbar /> 
              <Home />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/trips" 
          element={
            <PrivateRoute>
              <Navbar /> 
              <Trips />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/viaje/:tripIndex" 
          element={
            <PrivateRoute>
              <Navbar /> 
              <Expense />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/balance" 
          element={
            <PrivateRoute>
              <Navbar /> 
              <Balance />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
