// src/utils/chatbotHelper.ts
export const formatMessage = (text: string, sender: 'user' | 'bot') => ({
  id: Date.now().toString(),
  sender,
  text,
  timestamp: new Date(),
});

export const getSuggestions = () => [
  'Find a therapist',
  'Quick grounding exercise',
  'What are your prices?',
  'Do you take insurance?',
];

export const initialBotMessage = {
  id: '1',
  sender: 'bot' as const,
  text: 'Hello! I am the Mental.com Care Assistant. I am an AI, not a human therapist, but I can help you find a specialist, manage your bookings, or guide you through a quick grounding exercise. How can I support you today?',
  timestamp: new Date(),
};