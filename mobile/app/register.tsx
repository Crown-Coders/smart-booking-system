import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterScreen() {
  const { login } = useAuth(); // We’ll log in the user after registration
  const router = useRouter(); // Router for navigation

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Basic validation
    if (!name || !surname || !idNumber || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Registration logic (mock: just log in the user)
    login(email, password);

    // Optional success message
    Alert.alert('Success', `Welcome ${name}! You are now registered.`);

    // Redirect to login page
    router.push('/login');
  };

  return (
    <ThemedView style={styles.appBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <ThemedView lightColor="#ffffff" darkColor="#111214" style={styles.card}>
          <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
          <ThemedText>Fill in your details to register</ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={styles.input}
            placeholder="ID Number"
            keyboardType="numeric"
            value={idNumber}
            onChangeText={setIdNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonRow}>
            <Button title="Register" onPress={handleRegister} />
          </View>

          <View style={styles.footer}>
            <ThemedText>Already have an account?</ThemedText>
            <Link href="/login">
              <Link.Trigger>
                <ThemedText type="link"> Sign in</ThemedText>
              </Link.Trigger>
            </Link>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  appBackground: { flex: 1 },
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    gap: 8,
  },
  title: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  buttonRow: { marginTop: 12 },
  footer: { marginTop: 12, flexDirection: 'row', gap: 6, alignItems: 'center' },
});