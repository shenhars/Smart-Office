import React from 'react';
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './stores/AuthStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!authStore.isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={authStore.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
});

export default App;