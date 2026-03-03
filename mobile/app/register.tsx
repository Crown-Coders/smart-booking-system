import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import { useAuth, AuthProvider } from '../hooks/useAuth';

export default function Register() {
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
      await api.post('/register', { name, email, password, idNumber });
      router.replace('/login'); // redirect to login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="ID Number" value={idNumber} onChangeText={setIdNumber} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5DDDE', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#E5DDDE', padding: 24, borderRadius: 16 },
  title: { fontSize: 28, fontWeight: '600', color: '#002324', marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#EBFACF', borderWidth: 1, borderColor: '#A1AD95', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16, color: '#002324' },
  button: { backgroundColor: '#002324', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#EBFACF', fontWeight: '600', fontSize: 16 },
  error: { color: '#d32f2f', backgroundColor: '#ffebee', padding: 8, borderRadius: 8, marginBottom: 12 },
});