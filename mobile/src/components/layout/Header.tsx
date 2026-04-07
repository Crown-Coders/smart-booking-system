import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightIcon }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#002324" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightPlaceholder}>{rightIcon}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDDE',
  },
  backButton: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#002324' },
  rightPlaceholder: { width: 32 },
});