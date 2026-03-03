import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth(); // get login function from AuthProvider
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dummy admin credentials
  const ADMIN_CREDENTIALS = { email: 'admin@example.com', password: 'admin123' };

  const handleLogin = () => {
    // --- Admin login ---
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      login({ email, role: 'admin' }); // store user in context
      router.replace('/admin/admin-dashboard'); // redirect to admin dashboard
      return;
    }

    // --- Normal user login (dummy example) ---
    if (email && password) {
      login({ email, role: 'user' }); // store user in context
      router.replace('/dashboard'); // redirect to user dashboard
      return;
    }

    // Invalid login
    Alert.alert('Error', 'Invalid credentials');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
        <ThemedText>Sign in to access your account</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <Button title="Login" onPress={handleLogin} />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  buttonRow: { marginTop: 16, width: '100%' },
});