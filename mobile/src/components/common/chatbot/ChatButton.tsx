// mobile/src/components/common/chatbot/ChatButton.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const chatbotLogo = require('../../../../assets/images/logo-mental.com.png');

type Props = {
  onPress: () => void;
  bottomOffset?: number;
};

export const ChatbotButton: React.FC<Props> = ({ onPress, bottomOffset = 96 }) => {
  return (
    <TouchableOpacity style={[styles.button, { bottom: bottomOffset }]} onPress={onPress} activeOpacity={0.8}>
      <Image source={chatbotLogo} style={styles.logo} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    backgroundColor: '#004B45',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#A1AD95',
  },
  logo: {
    width: 35,
    height: 35,
  },
});
