import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  Button,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi 👋 I can help you with bookings, services, and payments.',
    },
  ]);
  const [input, setInput] = useState('');

  const getBotReply = (text: string) => {
    const msg = text.toLowerCase();

    if (msg.includes('book')) return 'You can book a service from the dashboard.';
    if (msg.includes('price')) return 'Prices depend on the selected therapy service.';
    if (msg.includes('payment')) return 'We support Card and EFT payments.';
    if (msg.includes('time')) return 'Available time slots depend on availability.';
    return 'Sorry, I did not understand that. Try asking about bookings or payments.';
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: getBotReply(input),
    };

    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">AI Assistant</ThemedText>

      <FlatList
        style={styles.chat}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === 'user' ? styles.userMsg : styles.botMsg,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask me something..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  chat: { flex: 1, marginVertical: 12 },
  message: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    maxWidth: '80%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
});