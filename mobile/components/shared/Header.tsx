import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogout?: boolean;
}

export default function Header({ title, showBack = false, showLogout = false }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={styles.leftButton}>
          <Ionicons name="arrow-back" size={24} color="#002324" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showLogout && (
        <TouchableOpacity onPress={handleLogout} style={styles.rightButton}>
          <Ionicons name="log-out-outline" size={24} color="#002324" />
        </TouchableOpacity>
      )}
      {!showLogout && !showBack && <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDDE',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002324',
  },
  leftButton: {
    padding: 5,
  },
  rightButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
});