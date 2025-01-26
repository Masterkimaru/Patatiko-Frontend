import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './LoginSignup.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for showing/hiding password

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState(''); // Referral code state for registration
  const [phoneNumber, setPhoneNumber] = useState(''); // Phone number state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match during signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          'http://localhost:5000/api/users/login',
          { email, password }
        );

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        // Set the user in context
        setUser(response.data.user);
        navigate('/');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/users/register',
          {
            name,
            email,
            password,
            role: 'USER', // Hardcoded as USER
            referralCode,
            phoneNumber, // Send phone number in registration request
          }
        );
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
      setError('');
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        {loading ? (
          <div className="loading-indicator">
            <i className="ticket-icon">🎟️</i>
          </div>
        ) : (
          <>
            <div className={`form ${isLogin ? 'show-login' : 'show-signup'}`}>
              <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="input-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label>Referral Code (Optional)</label>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div className="password-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                {!isLogin && (
                  <>
                    <div className="input-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <button type="submit" className="btn-primary">
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>
              </form>
            </div>
            <div className="toggle-section">
              <p>{isLogin ? 'Need an account?' : 'Already have an account?'}</p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="btn-secondary"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
