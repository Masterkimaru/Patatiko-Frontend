import React from 'react';
import './Footer.css'; // Import the styling for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          
          <a href="/contact" className="footer-link">Contact Us</a>
        </div>
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} PataTiko. All rights reserved.</p>
          <p>Powered by ReactJS and Vite</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
