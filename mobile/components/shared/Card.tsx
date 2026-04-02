import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, Platform } from 'react-native';
import { shadowStyle } from '../../utils/platformStyles';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function Card({ title, subtitle, children, onPress, style }: CardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[styles.card, style]} onPress={onPress}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    ...shadowStyle({ offsetY: 2, radius: 8, elevation: 2 }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1AD95',
    marginBottom: 12,
  },
});