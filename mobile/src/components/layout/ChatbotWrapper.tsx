// mobile/src/components/layout/ChatbotWrapper.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatbotButton } from '../common/chatbot/ChatButton';
import { Chatbot } from '../common/chatbot/Chatbot';

export const ChatbotWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      {children}
      <ChatbotButton onPress={() => setIsChatbotVisible(true)} bottomOffset={Math.max(insets.bottom + 122, 138)} />
      <Chatbot visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
    </View>
  );
};
