// mobile/src/components/common/Label.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string; // kept for API compatibility, ignored in RN
};

export const Label: React.FC<LabelProps> = ({ children }) => {
  return <Text style={styles.label}>{children}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#002324',
  },
});