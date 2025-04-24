import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ShowDetails from '../pages/ShowDetails';
import MyBookings from '../pages/MyBookings';
import LoginSignup from '../pages/LoginSignup'; 
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Download from '../pages/Download'; 

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/show/*" element={<ShowDetails />} />
    <Route path="/bookings" element={<MyBookings />} />
    <Route path="/download" element={<Download />} />
    <Route path="/login-signup" element={<LoginSignup />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
