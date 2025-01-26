import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { getShowDetails } from '../services/api';
//import './ShowDetails.css';

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

const ShowDetails = () => {
  const { '*': rawShowId } = useParams(); // Use wildcard to capture any string after `/show/`
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get('referralCode');
  const navigate = useNavigate();  // Initialize the navigate hook

  // Clean up slashes from the showId
  const cleanedShowId = rawShowId.replace(/^\/+|\/+$/g, ''); 

  const [show, setShow] = useState(null);
  const [referrer, setReferrer] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Show'); // Default to 'Show' tab

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await getShowDetails(cleanedShowId, referralCode);
        setShow(response.data.show);
        setReferrer(response.data.referrer);
      } catch (err) {
        setError('Failed to fetch show details.');
      }
    };

    fetchShowDetails();
  }, [cleanedShowId, referralCode]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!show) {
    return <div>Loading...</div>;
  }

  const handleBuyTicket = () => {
    // Navigate to the login/signup page
    navigate('/login-signup');
  };
  

  return (
    <div>
      <div className="menu">
        <button onClick={() => setSelectedTab('Show')}>Show</button>
        <button onClick={() => setSelectedTab('Preview')}>Preview</button>
        <button onClick={() => setSelectedTab('Cast')}>Cast</button>
        <button onClick={() => setSelectedTab('ShowTime')}>Show Time</button>
      </div>

      <div className="show-details">
        {selectedTab === 'Show' && (
          <div className="show-info">
            <img src={show.image} alt={show.name} />
            <h2>{show.name}</h2>
            <p>{show.description}</p>
          </div>
        )}
        {selectedTab === 'Preview' && <Preview videoUrl={show.videoUrl} />}
        {selectedTab === 'Cast' && (
          <div className="cast">
            <h3>Cast</h3>
            <ul>
              {show.cast.map((actor, index) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedTab === 'ShowTime' && (
          <div className="show-time">
            <h3>Show Times</h3>
            <p><strong>Venue:</strong> {show.venue}</p>
            {show.occurrences?.length > 0 ? (
              show.occurrences.map((occurrence) => (
                <div key={occurrence.id} className="occurrence">
                  <h4>{occurrence.dayOfWeek}</h4>
                  <ul>
                    {occurrence.timings.map((timing) => {
                      const startTime = new Date(timing.startTime);
                      const endTime = new Date(timing.endTime);
                      return (
                        <li key={timing.id}>
                          {startTime.toLocaleDateString()} - 
                          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to 
                          {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      </div>

      {/* Buy Ticket Button */}
      <button
        className="buy-ticket-button"
        onClick={handleBuyTicket}  // Use the new click handler
      >
        Buy Ticket
      </button>
    </div>
  );
};

export default ShowDetails;
