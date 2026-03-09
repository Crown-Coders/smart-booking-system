import React, { useState, useEffect } from "react";
import "../../App.css";

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => {
    return localStorage.getItem("chat_session") || crypto.randomUUID();
  });

  useEffect(() => {
    localStorage.setItem("chat_session", sessionId);
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId })
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Don't render anything if the widget is closed
  if (!isOpen) return null;

  return (
    <div className="chatbot-widget">
      <div className="chat-header">
        AI Therapy Assistant
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="bot-message">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about booking therapy sessions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIChatbot;