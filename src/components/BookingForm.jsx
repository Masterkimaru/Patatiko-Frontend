import { useState } from 'react';
import { createBooking } from '../services/api';

const BookingForm = ({ showId }) => {
  const [tickets, setTickets] = useState(1);
  const [ticketType, setTicketType] = useState('Regular');

  const handleBooking = async () => {
    try {
      const userId = 'user-id'; // Replace with dynamic user ID
      const response = await createBooking({ userId, showId, tickets, ticketType });
      alert(response.data.message);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="booking-form">
      <label>
        Tickets:
        <input
          type="number"
          value={tickets}
          onChange={(e) => setTickets(e.target.value)}
          min="1"
        />
      </label>
      <label>
        Ticket Type:
        <select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
          <option value="Couple">Couple</option>
          <option value="GroupOf5">Group of 5</option>
          <option value="Advance">Advance</option>
        </select>
      </label>
      <button onClick={handleBooking}>Book Now</button>
    </div>
  );
};

export default BookingForm;
