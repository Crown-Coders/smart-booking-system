import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

      alert('Registration successful! Please login.');
      router.replace('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="ID Number" value={idNumber} onChangeText={setIdNumber} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.loginText} onPress={() => router.push('/login')}>
          Already have an account? Login
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#E5DDDE' },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#E5DDDE', padding: 24, borderRadius: 16 },
  title: { fontSize: 28, fontWeight: '600', color: '#002324', marginBottom: 24 },
  input: { width: '100%', backgroundColor: '#EBFACF', borderColor: '#A1AD95', borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16, color: '#002324' },
  button: { backgroundColor: '#002324', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#EBFACF', fontWeight: '600', fontSize: 16 },
  error: { color: '#d32f2f', backgroundColor: '#ffebee', padding: 8, borderRadius: 8, marginBottom: 12 },
  loginText: { fontSize: 14, color: '#002324', textAlign: 'center', textDecorationLine: 'underline' },
});