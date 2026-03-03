// app/Register.tsx
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

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !idNumber) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, idNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      Alert.alert('Success', 'User registered successfully');
      router.replace('/Login'); // go to login page
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="ID Number"
          value={idNumber}
          onChangeText={setIdNumber}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Already have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => router.push('/Login')}
          >
            Log in
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