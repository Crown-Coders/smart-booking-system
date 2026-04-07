import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';

type ContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
};

export const Container: React.FC<ContainerProps> = ({ children, scrollable = false, style }) => {
  const Wrapper = scrollable ? ScrollView : View;
  return (
    <Wrapper style={[styles.container, style]} contentContainerStyle={scrollable ? styles.scrollContent : undefined}>
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F7' },
  scrollContent: { flexGrow: 1, padding: 16 },
});