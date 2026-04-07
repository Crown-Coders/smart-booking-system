// mobile/src/components/common/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'destructive':
        return styles.destructive;
      default:
        return styles.default;
    }
  };

  return (
    <View style={[styles.badge, getVariantStyle()]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#E5DDDE',
  },
  secondary: {
    backgroundColor: '#EBFACF',
  },
  destructive: {
    backgroundColor: '#ffebee',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#002324',
  },
});