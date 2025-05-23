import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/Navbar'
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword'
import withAuth, { withGuest } from './auth/withAuth';

const LoginWithGuest = withGuest(Login);
const RegisterWithGuest = withGuest(Register);
const ForgotPasswordWithGuest = withGuest(ForgotPassword);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginWithGuest />} />
        <Route path="/register" element={<RegisterWithGuest />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordWithGuest />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;