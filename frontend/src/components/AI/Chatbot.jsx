// frontend/src/components/AI/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am the Mental.com Care Assistant. I am an AI, not a human therapist, but I can help you find a specialist, manage your bookings, or guide you through a quick grounding exercise. How can I support you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Find a therapist",
    "Quick grounding exercise",
    "What are your prices?",
    "Do you take insurance?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const newUserMsg = { id: Date.now(), sender: "user", text: textToSend };
    
    // We create the history BEFORE updating the state to include the current conversation
    // but we use the functional update to ensure we have the most recent messages
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);
      
      //  NEW: Convert current message history for the AI
     // 2. Build history SAFELY from current state + new message
    const historyForAPI = [...messages, newUserMsg].map(m => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text
    }));
    // 3. Call API ONCE
    callChatAPI(historyForAPI);
  };
    

  //  NEW: Separate API call logic to handle history correctly
  const callChatAPI = async (history) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
        //  NEW: We now send both the current message AND the history
         body: JSON.stringify({ history })
    });

      const data = await response.json();
      
     setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply || "I'm having trouble connecting right now."
      }
    ]);
  } catch (err) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, I’m currently offline."
      }
    ]);
  } finally {
    setIsTyping(false);
  }
};

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    setInput(""); 
  };

  if (!isOpen) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div style={{ textAlign: "left" }}>
          <h2>Care Assistant</h2>
          <p>Your secure, AI-powered guide</p>
        </div>
        <button className="chat-close-btn" onClick={onClose} aria-label="Close Chat">
          ✖
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Assistant is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-suggestions">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            className="suggestion-chip" 
            onClick={() => sendMessage(suggestion)}
            disabled={isTyping}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}