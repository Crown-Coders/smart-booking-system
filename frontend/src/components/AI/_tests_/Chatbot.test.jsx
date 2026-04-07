// frontend/src/components/AI/__tests__/Chatbot.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chatbot from '../Chatbot';
import ChatbotButton from '../ChatbotButton';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Chatbot Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('fake-token');
  });

  test('renders initial bot message when opened', () => {
    render(<Chatbot isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText(/Mental.com Care Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/I am an AI/i)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<Chatbot isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText(/Care Assistant/i)).not.toBeInTheDocument();
  });

  test('handles user input submission', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Test bot response' })
    });

    render(<Chatbot isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello bot' } });
    fireEvent.click(sendButton);

    // Check user message appears
    expect(screen.getByText('Hello bot')).toBeInTheDocument();
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('Test bot response')).toBeInTheDocument();
    });

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chatbot'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-token'
        })
      })
    );
  });

  test('handles API error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Chatbot isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I’m currently offline/i)).toBeInTheDocument();
    });
  });

  test('disables input while bot is typing', async () => {
    global.fetch.mockImplementationOnce(() => new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: async () => ({ reply: 'Delayed response' })
      }), 100)
    ));

    render(<Chatbot isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    // Input and button should be disabled while typing
    expect(screen.getByText(/Assistant is typing/i)).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('Delayed response')).toBeInTheDocument();
    });
  });

  test('suggestion chips send predefined messages', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ reply: 'Response to suggestion' })
    });

    render(<Chatbot isOpen={true} onClose={mockOnClose} />);
    
    const suggestionButton = screen.getByText('Find a therapist');
    fireEvent.click(suggestionButton);

    expect(screen.getByText('Find a therapist')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Response to suggestion')).toBeInTheDocument();
    });
  });
});

describe('ChatbotButton Component', () => {
  test('renders button with correct styling', () => {
    render(<ChatbotButton onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      position: 'fixed',
      bottom: '30px',
      right: '30px'
    });
  });

  test('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<ChatbotButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('button has hover effects', () => {
    render(<ChatbotButton onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    
    fireEvent.mouseEnter(button);
    expect(button).toHaveStyle({ transform: 'scale(1.1) translateY(-5px)' });
    
    fireEvent.mouseLeave(button);
    expect(button).toHaveStyle({ transform: 'scale(1) translateY(0)' });
  });
});