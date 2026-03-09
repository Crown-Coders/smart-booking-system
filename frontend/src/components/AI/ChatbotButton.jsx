import React from 'react';
import '../../App.css';

const ChatbotButton = ({ onClick }) => {
  return (
    <button className="chatbot-toggle-btn" onClick={onClick}>
      💬 Chat
    </button>
  );
};

export default ChatbotButton;