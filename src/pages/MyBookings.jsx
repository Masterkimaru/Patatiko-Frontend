import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import QRCode from 'qrcode';
import { getUserBookings, getShowByName } from '../services/api';
import './MyBookings.css';

// Mapping of ticket types to their respective payment links based on dynamic event data
const paymentLinks = {
  Student: 'https://short.payhero.co.ke/s/b9jBg46tqNvFx64vLCxApB',
  Advance: 'https://short.payhero.co.ke/s/BNJW5SLNqkWZeqnuZwo6Lo',
  Gate: 'https://short.payhero.co.ke/s/hthPRb3qCre6Ui432B6oQp',
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  // Ticket state is kept if you later wish to offer a download (e.g., QR code ticket)
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setError('Sorry, you will have to sign in to access your bookings');
    } else {
      const fetchBookings = async () => {
        try {
          const response = await getUserBookings(userId);
          setBookings(response.data);
        } catch (err) {
          setError('Error fetching bookings');
        }
      };

      fetchBookings();
    }
  }, [navigate]);

  const handleLoginRedirect = () => {
    navigate('/login-signup');
  };

  // This function maps the booking's ticket type to its payment link and redirects the user
  const handlePayClick = (booking) => {
    const ticketType = booking.ticketType; // Expecting values like "Student", "Early Bird", "Gate"
    const baseLink = paymentLinks[ticketType];
    if (baseLink) {
      // Optionally, append query parameters for additional tracking (like amount and booking reference)
      const params = new URLSearchParams({
        amount: booking.totalPrice,
        reference: booking.id,
      });
      const paymentLink = `${baseLink}?${params.toString()}`;
      window.location.href = paymentLink;
    } else {
      alert('No payment link available for this ticket type.');
    }
  };

  // Example function to download a ticket as a QR code (if ticket info is available)
  const handleDownloadTicket = async () => {
    if (ticket && ticket.reference) {
      try {
        const qrCodeData = JSON.stringify(ticket);
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
        const element = document.createElement('a');
        element.href = qrCodeUrl;
        element.download = `Ticket_${ticket.reference}.png`;
        document.body.appendChild(element);
        element.click();
      } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Failed to generate ticket QR code.');
      }
    } else {
      alert('No ticket available to download.');
    }
  };

  return (
    <div className="my-bookings-container">
      <h1 className="my-bookings-title">My Bookings</h1>

      {error ? (
        <div className="error-container">
          <strong>{error}</strong>
          <img
            src="https://cdn.pixabay.com/photo/2024/07/20/17/12/warning-8908707_1280.png"
            alt="Warning"
            className="error-image"
          />
          <button onClick={handleLoginRedirect} className="login-button">
            Login or Sign Up
          </button>
        </div>
      ) : (
        <div>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings have been made yet</p>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <h3 className="booking-title">{booking.title}</h3>
                  <img
                    src={booking.show}
                    alt={booking.title}
                    className="booking-image"
                  />
                  <p className="booking-info">
                    <strong>Ticket Type:</strong> {booking.ticketType}
                  </p>
                  <p className="booking-info">
                    <strong>Total Price:</strong> Ksh {booking.totalPrice}
                  </p>
                  <p className="booking-info">
                    <strong>Booking Date:</strong>{' '}
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                  <button
                    className="pay-button"
                    onClick={() => handlePayClick(booking)}
                  >
                    <span className="money-icon">💰</span> PAY
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {ticket && (
        <div className="ticket-container">
          <h2>Your Ticket</h2>
          <pre>{JSON.stringify(ticket, null, 2)}</pre>
          <button onClick={handleDownloadTicket} className="download-button">
            Download Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
