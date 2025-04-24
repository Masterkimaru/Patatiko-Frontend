import React, { useEffect, useState, useContext } from 'react';
import { getShows, getShowDetails, getTicketTypes, createBooking, generateReferralLink } from '../services/api';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import ChatIcon from './ChatIcon';
import './Home.css';

const extractVideoId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const Preview = ({ videoUrl }) => {
  const videoId = extractVideoId(videoUrl);
  return (
    <div className="preview">
      {videoId ? (
        <YouTube
          videoId={videoId}
          opts={{
            width: '560',
            height: '315',
            playerVars: { autoplay: 1 },
          }}
        />
      ) : (
        <p>
          Video preview not available.{' '}
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </p>
      )}
    </div>
  );
};

const Home = () => {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Show');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShow, setModalShow] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [referralLink, setReferralLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await getShows();
        setShows(response.data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };
    fetchShows();
  }, []);

  const handleShowClick = async (show) => {
    setSelectedShow(show);
    setSelectedTab('Show');
    try {
      const response = await getShowDetails(show.id);
      setTicketDetails(response.data);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const handleGenerateReferralLink = async () => {
    try {
      const response = await generateReferralLink(selectedShow.id);
      setReferralLink(response.data.referralLink);
      alert('Referral link generated!');
    } catch (error) {
      console.error('Error generating referral link:', error);
    }
  };

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      alert('Referral link copied to clipboard!');
    }
  };

  const handleBuyTicketClick = async (event, show) => {
    event.stopPropagation();
    if (!user) {
      alert('User has to be logged in to get a ticket');
      navigate('/login-signup');
      return;
    }
    setIsModalOpen(true);
    setModalShow(show);
    try {
      const response = await getTicketTypes(show.id);
      setTicketDetails(response.data);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalShow(null);
    setSelectedTicketType(null);
    setTicketQuantity(1);
  };

  const handleTicketTypeChange = (ticketType) => {
    setSelectedTicketType(ticketType);
  };

  const handleTicketQuantityChange = (event) => {
    setTicketQuantity(Number(event.target.value));
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTicketType) {
      alert('Please select a ticket type');
      return;
    }
    
    const ticketPrice = ticketDetails.ticketTypes[selectedTicketType];
    if (ticketPrice === undefined) {
      return alert('Invalid ticket type selected');
    }
    const totalPrice = ticketPrice * ticketQuantity;
    const bookingData = {
      userId: user.id,
      showId: modalShow.id,
      tickets: ticketQuantity,
      ticketType: selectedTicketType,
      totalPrice,
    };

    setBookingLoading(true);
    try {
      const response = await createBooking(bookingData);
      console.log('Booking response:', response.data);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error with your booking. Please try again.');
    } finally {
      setBookingLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="home">
      <h1>Upcoming Shows</h1>
      <div className="menu">
        {selectedShow && (
          <>
            <button onClick={() => setSelectedTab('Show')}>Show</button>
            <button onClick={() => setSelectedTab('Preview')}>Preview</button>
            <button onClick={() => setSelectedTab('Cast')}>Cast</button>
            <button onClick={() => setSelectedTab('ShowTime')}>Show Time</button>
            <button
              className="back-button"
              onClick={() => {
                setSelectedShow(null);
                setIsModalOpen(false);
              }}
            >
              Back
            </button>
          </>
        )}
      </div>

      <div className="show-list">
        {!selectedShow &&
          shows.map((show) => (
            <div
              key={show.id}
              className={`show-details ${isModalOpen ? 'modal-active' : ''}`}
              onClick={() => handleShowClick(show)}
            >
              <div className="show-info">
                <img src={show.image} alt={show.name} />
                <h2>{show.name}</h2>
                <p>{show.description}</p>
                {!isModalOpen && (
                  <button className="buy-ticket-button" onClick={(e) => handleBuyTicketClick(e, show)}>
                    Buy Ticket
                  </button>
                )}
              </div>
            </div>
          ))}

        {selectedShow && (
          <div className="show-details">
            {selectedTab === 'Show' && (
              <div className="show-info">
                <img src={selectedShow.image} alt={selectedShow.name} />
                <h2>{selectedShow.name}</h2>
                <p>{selectedShow.description}</p>
              </div>
            )}
            {selectedTab === 'Preview' && <Preview videoUrl={selectedShow.videoUrl} />}
            {selectedTab === 'Cast' && (
              <div className="cast">
                <h3>Cast</h3>
                <ul>
                  {selectedShow.cast.map((actor, index) => (
                    <li key={index}>{actor}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedTab === 'ShowTime' && (
              <div className="show-time">
                <h3>Show Times</h3>
                <p>
                  <strong>Venue:</strong> {selectedShow.venue}
                </p>
                {selectedShow.occurrences && selectedShow.occurrences.length > 0 ? (
                  selectedShow.occurrences.map((occurrence) => (
                    <div key={occurrence.id} className="occurrence">
                      <h4>{occurrence.dayOfWeek}</h4>
                      <ul>
                        {occurrence.timings.map((timing) => {
                          const startTime = new Date(timing.startTime);
                          const endTime = new Date(timing.endTime);
                          return (
                            <li key={timing.id}>
                              {startTime.toLocaleDateString()} -{' '}
                              {startTime.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                timeZone: 'Africa/Nairobi' 
                              })} to{' '}
                              {endTime.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                timeZone: 'Africa/Nairobi' 
                              })}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>No show times available.</p>
                )}
              </div>
            )}
            {!isModalOpen && (
              <button className="buy-ticket-button" onClick={(e) => handleBuyTicketClick(e, selectedShow)}>
                Buy Ticket
              </button>
            )}
          </div>
        )}
      </div>

      {selectedShow && (
        <button onClick={handleGenerateReferralLink}>Generate Referral Link</button>
      )}

      {referralLink && (
        <div>
          <p>Referral Link: {referralLink}</p>
          <button onClick={handleCopyLink}>{copied ? 'Link Copied!' : 'Copy Link'}</button>
        </div>
      )}

      {isModalOpen && modalShow && (
        <div className="ticket-modal">
          <div className="modal-content">
            <h3>Buy Tickets for {modalShow.name}</h3>
            {ticketDetails && ticketDetails.ticketTypes ? (
              <div>
                {Object.keys(ticketDetails.ticketTypes).map((type) => (
                  <div key={type}>
                    <label className={selectedTicketType === type ? 'selected-ticket' : ''}>
                      <input
                        type="radio"
                        name="ticketType"
                        value={type}
                        checked={selectedTicketType === type}
                        onChange={() => handleTicketTypeChange(type)}
                      />
                      {type} - Ksh {ticketDetails.ticketTypes[type]}
                    </label>
                  </div>
                ))}
                <div>
                  <label>
                    Quantity:{' '}
                    <input
                      type="number"
                      min="1"
                      value="1"
                      disabled
                    />
                  </label>
                </div>
                <button onClick={handleConfirmPurchase} disabled={bookingLoading}>
                  {bookingLoading ? 'Confirming.....' : 'Confirm Purchase'}
                </button>
              </div>
            ) : (
              <p>Loading ticket details...</p>
            )}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {/* Chatbot Window */}
      {chatbotOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            height: '400px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
            <button 
              onClick={() => setChatbotOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ✖
            </button>
          </div>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/jN9iQmYwDLWZ6G0VOBM-y"
            width="100%"
            height="90%"
            frameBorder="0"
          ></iframe>
        </div>
      )}

      {/* Chatbot Toggle Icon using Portal */}
      {!chatbotOpen && (
        <ChatIcon onClick={() => setChatbotOpen(true)} />
      )}
    </div>
  );
};

export default Home;
