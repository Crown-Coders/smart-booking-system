// mobile/src/components/common/Table.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ScrollView horizontal>
    <View style={styles.table}>{children}</View>
  </ScrollView>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.headerRow}>{children}</View>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View>{children}</View>
);

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.row}>{children}</View>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.headCell}>{children}</Text>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children }) => (
  <Text style={styles.cell}>{children}</Text>
);

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#002324',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDDE',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  headCell: {
    fontWeight: 'bold',
    color: '#EBFACF',
    flex: 1,
    textAlign: 'left',
  },
  cell: {
    flex: 1,
    color: '#002324',
  },
});