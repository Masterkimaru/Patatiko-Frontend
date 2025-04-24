import { FaPhone, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h2>For any problems or enquiries, reach us through the below contact details:</h2>
      <div className="contact-info">
        <div className="contact-item">
          <FaPhone className="contact-icon" />
          <span>+2547 99654 737</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <span>themasterskimaru@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
