// src/components/AI/ChatbotButton.jsx
import React from 'react';
// Import the chatbot logo image. Confirm the relative path from this file.
import chatbotLogo from '../../assets/images/chatbot logo.png';

function ChatbotButton({ onClick }) {
  // Style for the chatbot logo image to make it fit well within the button.
  const logoStyle = {
    maxWidth: '60%', // Adjusted to fit nicely within the 65px button
    height: 'auto',
    display: 'block',
  };

  return (
 // ChatbotButton.jsx
<button 
  onClick={onClick}
  style={{
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#004B45', // Darker teal for contrast
    color: '#EBFACF',
    border: '2px solid #A1AD95', // subtle border to separate from footer
    borderRadius: '25px 25px 0 25px',
    width: '65px',
    height: '65px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)', // stronger shadow for visibility
    cursor: 'pointer',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    transition: 'transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
    e.currentTarget.style.backgroundColor = '#A1AD95'; // accent on hover
    e.currentTarget.style.borderColor = '#002324';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1) translateY(0)';
    e.currentTarget.style.backgroundColor = '#004B45';
    e.currentTarget.style.borderColor = '#A1AD95';
  }}
>
  <img 
    src={chatbotLogo} 
    alt="AI Assistant logo" 
    style={{ maxWidth: '70%', height: 'auto', display: 'block' }} 
  />
</button>
 );
}

export default ChatbotButton;