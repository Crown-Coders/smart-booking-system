// mobile/src/components/common/chatbot/useChatbot.ts
import { useState, useCallback } from 'react';
import { storage } from '../../../utils/storage';
import { API_BASE } from '../../../utils/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am the Mental.com Care Assistant. I am an AI, not a human therapist, but I can help you find a specialist, manage your bookings, or guide you through a quick grounding exercise. How can I support you today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token = await storage.getItem('token');
      // Build conversation history
      const history = [...messages, userMsg].map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));

      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ history }),
      });

      if (!response.ok) {
        throw new Error('Chatbot request failed');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I'm having trouble connecting right now.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Sorry, I’m currently offline.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);

  return { messages, isLoading, isOpen, sendMessage, toggleChat, setIsOpen };
}
