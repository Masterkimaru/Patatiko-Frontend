import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId && !user) {
      axios
        .get(`https://patatiko-backend-ggkr.onrender.com/api/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        });
    }
  }, [user, setUser]);

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/login-signup');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">
        <img 
            src="/patatiko-logo.png" 
            alt="PataTiko Logo" 
            className="brand-logo" 
        />
        PataTiko     
       
        </Link>

        <div
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/contact">Contact Us</Link>

          <div className="auth-section">
            {user ? (
              <div className="user-dropdown">
                <button
                  className="user-button"
                  onClick={toggleDropdown}
                >
                  <FaUser /> {user.name}
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login-signup">
                <button className="auth-button">Login / Sign Up</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
