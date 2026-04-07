import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { Card } from '../../components/common/Card';

export default function SettingsScreen() {
  return (
    <AppShell title="Settings" subtitle="Account and application preferences.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Text style={styles.title}>Application</Text>
          <Text style={styles.text}>Version 1.0.0</Text>
          <Text style={styles.text}>Use the logout button in the top-right corner to switch accounts quickly.</Text>
        </Card>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18 },
  title: { fontSize: 18, fontWeight: '700', color: '#002324', marginBottom: 12 },
  text: { color: '#475569', marginBottom: 8 },
});
