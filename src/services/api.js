import axios from 'axios';

const api = axios.create({
  baseURL: 'https://patatiko-backend.onrender.com/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shows-related API requests
export const getShows = () => api.get('/shows');
// New function to get show details without referralCode
export const getShowById = (showId) => api.get(`/shows/${showId}`);
export const getShowByName = (name) => api.get(`/shows/name/${name}`);
export const getShowDetails = (showId, referralCode) => api.get(`/shows/${showId}?referralCode=${referralCode}`);
export const getTicketTypes = (showId) => api.get(`/shows/${showId}/ticket-types`);

// Referral link-related API request
export const generateReferralLink = (showId) => api.get(`/shows/${showId}/generate-referral-link`, {
  headers: {
    // Add any necessary headers, such as authorization if needed
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your actual token retrieval method
  },
});

// Bookings-related API requests
export const createBooking = (data) => api.post('/bookings/create', data);
export const getUserBookings = (userId) => api.get(`/bookings/user/${userId}`);

// Payments-related API requests
export const getUserPayments = (userId) => api.get(`/payments/user/${userId}`);

export default api;
