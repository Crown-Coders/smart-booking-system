// mobile/src/components/common/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

type CardHeaderProps = { children: React.ReactNode };
type CardTitleProps = { children: React.ReactNode };
type CardDescriptionProps = { children: React.ReactNode };
type CardContentProps = { children: React.ReactNode };

export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <View style={styles.header}>{children}</View>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => (
  <Text style={styles.description}>{children}</Text>
);

export const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <View style={styles.content}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
  },
  description: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 4,
  },
  content: {
    marginTop: 8,
  },
});
