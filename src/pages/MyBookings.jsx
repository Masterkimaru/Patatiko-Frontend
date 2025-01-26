import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import QRCode from 'qrcode';  // Import QRCode library 
import { getUserBookings, initiateSTKPush, sendKCBCallback,   getShowByName } from '../services/api'; // Import the sendKCBCallback function
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null); // State for the generated ticket
  //const [showDetails, setShowDetails] = useState(null); // State for show details
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setError('Sorry, You will have to sign in to access your bookings');
    } else {
      const fetchBookings = async () => {
        try {
          const response = await getUserBookings(userId);
          if (response.data.length === 0) {
            setBookings([]);
          } else {
            setBookings(response.data);
          }
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

  const handlePayClick = (booking) => {
    console.log('Selected Booking:', booking);
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPhoneNumber('');
  };

  const handleSTKPush = async () => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User is not logged in. Please sign in to proceed with the payment.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Step 1: Initiate the STK push
      const response = await initiateSTKPush({
        phoneNumber,
        bookingId: selectedBooking.id,
        amount: selectedBooking.totalPrice,
        userId,
      });
  
      if (response.status === 200) {
        alert('Payment initiated. Please check your phone to complete the payment.');
  
        // Step 2: Send callback data to verify payment
        const callbackData = {
          status: "Completed", // Sample data from backend
          message: "Payment successful",
          amount: selectedBooking.totalPrice,
          mpesaReceiptNumber: 'TAP0FSSZBS', // Sample receipt number from backend
          phoneNumber: phoneNumber,
        };
  
        const callbackResponse = await sendKCBCallback(callbackData);
  
        if (callbackResponse.status === 200) {
          const callbackData = callbackResponse.data;
  
          // Log the entire callback structure to inspect its format
          console.log("Received Callback Data:", JSON.stringify(callbackData, null, 2));
  
          // Now, match the expected data directly
          if (callbackData.status === "Completed" && callbackData.message === "Payment successful") {
            const amount = callbackData.amount;
            const receiptNumber = callbackData.mpesaReceiptNumber;
            const phone = callbackData.phoneNumber;
  
            // Prepare ticket data and set it for the user
            const ticketData = { 
              amount, 
              receiptNumber, 
              phone 
            };
            setTicket(ticketData);
            alert('Payment successful. Your ticket is ready for download.');
          } else {
            alert(`Payment failed: ${callbackData.message}`);
          }
        } else {
          alert('Payment verification failed. Please try again.');
        }
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
      handleModalClose();
    }
  };
  
  
  
  
  
  
  
  
  
  

  const handleDownloadTicket = async () => {
    if (ticket && selectedBooking && selectedBooking.title) {
      try {
        console.log('Fetching details for Show Title:', selectedBooking.title);
  
        // Fetch the show details by title (assuming getShowByName API exists)
        const response = await getShowByName(selectedBooking.title);  
        const showDetails = response.data;
        console.log('Show Details:', showDetails);
  
        // Assuming showDetails contains occurrences and other information
        const showId = showDetails.id;
        const occurrences = showDetails.occurrences;
  
        // Format occurrences to include day of the week and human-readable start time
        const formattedOccurrences = occurrences.map((occurrence) => {
          return occurrence.timings.map((timing) => {
            return {
              dayOfWeek: occurrence.dayOfWeek,
              startTime: moment(timing.startTime).format('dddd, MMMM Do YYYY, h:mm A'),
              endTime: moment(timing.endTime).format('h:mm A'),
            };
          });
        }).flat();
  
        // Create the enhanced ticket object with showId, occurrences, and other details
        const enhancedTicket = {
          ...ticket,
          showId: showId,
          showName: showDetails.name,
          showVenue: showDetails.venue,
          showDescription: showDetails.description,
          showCast: showDetails.cast,
          occurrences: formattedOccurrences,
          ticketType: selectedBooking.ticketType,
        };
  
        // Generate the QR code from the enhanced ticket object
        const qrCodeData = JSON.stringify(enhancedTicket);  // The data you want to encode in the QR code
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);  // Generate the QR code as a data URL
  
        // Create an anchor element to download the QR code image
        const element = document.createElement('a');
        element.href = qrCodeUrl;  // Set the href to the generated QR code image
        element.download = `Ticket_${selectedBooking.id}.png`;  // Set the download file name
        document.body.appendChild(element);
        element.click();  // Trigger the download
      } catch (error) {
        console.error('Error fetching show details:', error.response || error);
        alert('Failed to fetch show details. Please try again.');
      }
    } else {
      console.error('Selected booking or show title is missing!');
      alert('No valid booking or show details found. Please check your booking.');
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Complete Payment</h2>
            <p>Enter your phone number to complete the payment:</p>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
            />
            <div className="modal-actions">
              <button onClick={handleSTKPush} className="submit-button">
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Submit'
                )}
              </button>
              <button onClick={handleModalClose} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
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
