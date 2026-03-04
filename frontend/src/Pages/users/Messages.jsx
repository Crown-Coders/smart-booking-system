// src/Pages/users/Messages.jsx
import React, { useState } from 'react';

function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const messages = [
    {
      id: 1,
      from: 'Dr. Sarah Smith',
      subject: 'Appointment Reminder',
      date: '2024-03-09',
      time: '10:30 AM',
      content: 'This is a reminder about your appointment tomorrow at 10:00 AM. Please arrive 10 minutes early.',
      read: false,
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      from: 'Dr. Michael Johnson',
      subject: 'Prescription Update',
      date: '2024-03-08',
      time: '2:15 PM',
      content: 'Your prescription has been renewed. You can pick it up at the pharmacy.',
      read: true,
      avatar: '👨‍⚕️'
    },
    {
      id: 3,
      from: 'Support Team',
      subject: 'Welcome to Smart Booking',
      date: '2024-03-07',
      time: '9:00 AM',
      content: 'Welcome to Smart Booking! We\'re excited to have you on board. Feel free to explore our services.',
      read: true,
      avatar: '🤖'
    },
    {
      id: 4,
      from: 'Dr. Emily Williams',
      subject: 'Session Follow-up',
      date: '2024-03-06',
      time: '4:45 PM',
      content: 'Thank you for the session today. Here are some resources I mentioned that might help you.',
      read: false,
      avatar: '👩‍⚕️'
    },
  ];

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="messages-page">
      <style>{`
        .messages-page {
          padding: 5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          color: #002324;
          margin: 0 0 0.5rem 0;
        }

        .unread-badge {
          background-color: #002324;
          color: #E5DDDE;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .messages-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 1.5rem;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          
        }

        .messages-list {
          border-right: 1px solid #E5DDDE;
          max-height: 600px;
          overflow-y: auto;
        }

        .message-item {
          padding: 1rem;
          border-bottom: 1px solid #E5DDDE;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .message-item:hover {
          background-color: #E5DDDE;
        }

        .message-item.selected {
          background-color: #A1AD95;
        }

        .message-item.unread {
          background-color: #f8f9fa;
          border-left: 3px solid #002324;
        }

        .message-sender {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .sender-avatar {
          width: 40px;
          height: 40px;
          background-color: #002324;
          color: #E5DDDE;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .sender-info {
          flex: 1;
        }

        .sender-name {
          font-weight: 600;
          color: #002324;
        }

        .message-date {
          font-size: 0.8rem;
          color: #A1AD95;
        }

        .message-subject {
          font-weight: 500;
          color: #002324;
          margin-bottom: 0.25rem;
        }

        .message-preview {
          font-size: 0.9rem;
          color: #A1AD95;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message-detail {
          padding: 2rem;
        }

        .message-header {
          margin-bottom: 2rem;
        }

        .message-header h2 {
          color: #002324;
          margin: 0 0 1rem 0;
        }

        .message-meta {
          display: flex;
          gap: 2rem;
          color: #A1AD95;
          font-size: 0.95rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #E5DDDE;
        }

        .message-body {
          color: #002324;
          line-height: 1.6;
          margin-bottom: 2rem;
          padding: 1rem 0;
        }

        .reply-section {
          margin-top: 2rem;
        }

        .reply-section h3 {
          color: #002324;
          margin: 0 0 1rem 0;
        }

        .reply-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #E5DDDE;
          border-radius: 8px;
          font-family: inherit;
          margin-bottom: 1rem;
          resize: vertical;
        }

        .reply-input:focus {
          outline: none;
          border-color: #002324;
        }

        .btn-send {
          background-color: #002324;
          color: #E5DDDE;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-send:hover {
          background-color: #A1AD95;
          color: #002324;
        }

        .no-message-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #A1AD95;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .messages-container {
            grid-template-columns: 1fr;
          }
          
          .messages-list {
            max-height: 300px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1>Messages</h1>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} unread</span>
        )}
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map(message => (
            <div
              key={message.id}
              className={`message-item ${selectedMessage?.id === message.id ? 'selected' : ''} ${!message.read ? 'unread' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="message-sender">
                <div className="sender-avatar">{message.avatar}</div>
                <div className="sender-info">
                  <div className="sender-name">{message.from}</div>
                  <div className="message-date">{message.date} at {message.time}</div>
                </div>
              </div>
              <div className="message-subject">{message.subject}</div>
              <div className="message-preview">{message.content.substring(0, 50)}...</div>
            </div>
          ))}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="message-header">
                <h2>{selectedMessage.subject}</h2>
                <div className="message-meta">
                  <span>From: {selectedMessage.from}</span>
                  <span>Date: {selectedMessage.date} at {selectedMessage.time}</span>
                </div>
              </div>
              
              <div className="message-body">
                {selectedMessage.content}
              </div>

              <div className="reply-section">
                <h3>Reply</h3>
                <textarea
                  className="reply-input"
                  rows="4"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <button className="btn-send">Send Reply</button>
              </div>
            </>
          ) : (
            <div className="no-message-selected">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;