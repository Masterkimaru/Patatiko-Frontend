// ChatIcon.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const ChatIcon = ({ onClick }) => {
  const chatIconStyle = {
    position: 'fixed',
    bottom: '110px',
    right: '20px',
    zIndex: 1000,
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
  };

  return ReactDOM.createPortal(
    <button style={chatIconStyle} onClick={onClick}>
      💬
    </button>,
    document.body
  );
};

export default ChatIcon;
