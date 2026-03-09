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
    <button 
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#002324', // Your --primary-dark
        color: '#EBFACF', // Your --primary-light
        border: 'none',
        // Refactored to create a distinct chat bubble shape using varying border radii
        borderRadius: '25px 25px 0 25px', // Strongly rounds top/left and creates a sharp point at the bottom-right
        width: '65px',
        height: '65px',
        // fontSize removed, as it's no longer needed for text content
        boxShadow: '0 8px 20px rgba(0, 35, 36, 0.2)',
        cursor: 'pointer',
        zIndex: 9999, // Keeps it on top of everything
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        padding: 0, // Ensure no padding interferes with the image size
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
        e.currentTarget.style.backgroundColor = '#A1AD95'; // Your --accent color
        e.currentTarget.style.color = '#002324';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.backgroundColor = '#002324'; // Corrected from typo back to original color
        e.currentTarget.style.color = '#EBFACF';
      }}
      aria-label="Open AI Care Assistant"
      title="Chat with our AI Assistant"
    >
      {/* Replaced emoji with an image tag */}
      <img 
        src={chatbotLogo} 
        alt="AI Assistant logo" 
        style={logoStyle} 
      />
    </button>
 );
}

export default ChatbotButton;