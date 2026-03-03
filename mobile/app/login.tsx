import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      // Replace this fetch with your backend login later
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      login({ email: data.user.email, role: data.user.role });
      router.replace('../index'); // go to Home tab after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
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

        <Text style={styles.signupText} onPress={() => router.push('/register')}>
          Do not have an account? Sign up
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#E5DDDE' },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#E5DDDE', padding: 24, borderRadius: 16 },
  title: { fontSize: 28, fontWeight: '600', color: '#002324', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A1AD95', marginBottom: 24 },
  input: { width: '100%', backgroundColor: '#EBFACF', borderColor: '#A1AD95', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16, color: '#002324' },
  button: { backgroundColor: '#002324', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#EBFACF', fontWeight: '600', fontSize: 16 },
  error: { color: '#d32f2f', backgroundColor: '#ffebee', padding: 8, borderRadius: 8, marginBottom: 12 },
  signupText: { fontSize: 14, color: '#002324', textAlign: 'center', textDecorationLine: 'underline' },
});