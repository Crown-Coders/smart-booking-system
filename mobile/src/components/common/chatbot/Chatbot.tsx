// mobile/src/components/common/chatbot/Chatbot.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useChatbot } from './useChatbot';

type Props = { visible: boolean; onClose: () => void };

export const Chatbot: React.FC<Props> = ({ visible, onClose }) => {
  const { messages, isLoading, sendMessage } = useChatbot();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const suggestions = [
    'Find a therapist',
    'Quick grounding exercise',
    'What are your prices?',
    'Do you take insurance?',
  ];

  useEffect(() => {
    if (visible && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, visible]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
      <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderSuggestion = (suggestion: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionChip}
      onPress={() => sendMessage(suggestion)}
      disabled={isLoading}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Care Assistant</Text>
            <Text style={styles.headerSubtitle}>Your secure, AI-powered guide</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✖</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.suggestionsContainer}>
          {suggestions.map(renderSuggestion)}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.sendText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#004B45',
    borderBottomWidth: 1,
    borderBottomColor: '#A1AD95',
  },
  headerTitle: { color: '#EBFACF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: '#A1AD95', fontSize: 12, marginTop: 2 },
  closeButton: { color: '#EBFACF', fontSize: 24, fontWeight: 'bold' },
  messagesList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 20 },
  userBubble: { backgroundColor: '#002324' },
  botBubble: { backgroundColor: '#E5DDDE' },
  userText: { color: '#EBFACF' },
  botText: { color: '#002324' },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#f7f8f7',
    borderWidth: 1,
    borderColor: '#A1AD95',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: { color: '#002324', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A1AD95',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#f7f8f7',
  },
  sendButton: {
    backgroundColor: '#002324',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#EBFACF', fontWeight: 'bold' },
});