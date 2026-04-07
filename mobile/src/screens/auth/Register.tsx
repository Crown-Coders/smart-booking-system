// src/screens/auth/Register.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const logo = require('../../../assets/logo-mental.com.png');

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext)!;

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (Object.values(form).some(field => !field)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        surname: form.surname,
        email: form.email,
        password: form.password,
        idNumber: form.idNumber,
      });
      Alert.alert('Success', 'Registration successful. Please login.');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={form.surname}
              onChangeText={(text) => handleChange('surname', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your ID Number"
              value={form.idNumber}
              onChangeText={(text) => handleChange('idNumber', text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Confirm</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
              />
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              Already have an account? <Text style={styles.linkText}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  loginLink: { textAlign: 'center', marginTop: 20, color: '#666' },
  linkText: { color: '#007bff', fontWeight: '600' },
});
