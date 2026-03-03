// app/Login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // Dummy login logic
    if (email && password) {
      router.replace('/(tabs)/index'); // navigate to Tabs
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => router.push('/Register')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5DDDE', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E5DDDE',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  title: { fontSize: 28, fontWeight: '600', color: '#002324', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A1AD95', marginBottom: 24 },
  input: {
    width: '100%',
    backgroundColor: '#EBFACF',
    borderWidth: 1,
    borderColor: '#A1AD95',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#002324',
  },
  button: {
    backgroundColor: '#002324',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#EBFACF', fontWeight: '600', fontSize: 16 },
  error: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  signupText: { fontSize: 14, color: '#002324', textAlign: 'center' },
  signupLink: { color: '#002324', fontWeight: '600', textDecorationLine: 'underline' },
});