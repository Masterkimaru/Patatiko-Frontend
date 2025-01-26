import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ShowDetails from '../pages/ShowDetails';
import MyBookings from '../pages/MyBookings';
import LoginSignup from '../pages/LoginSignup'; 
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/show/*" element={<ShowDetails />} />
    <Route path="/bookings" element={<MyBookings />} />
    <Route path="/login-signup" element={<LoginSignup />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
