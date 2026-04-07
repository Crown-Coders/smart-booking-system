import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppShell from '../../components/layout/AppShell';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils/date';
import { API_BASE } from '../../utils/api';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'client' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      setModalVisible(false);
      setNewUser({ name: '', email: '', password: '', role: 'client' });
      fetchUsers();
    } catch {
      Alert.alert('Error', 'Failed to add user');
    }
  };

  return (
    <AppShell title="Users" subtitle="Review registered accounts and create new ones.">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Management</Text>
            <Button title="+ Add User" onPress={() => setModalVisible(true)} />
          </View>

          {users.map((user) => (
            <View key={user.id} style={styles.userRow}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
                <View>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.meta}>{user.email}</Text>
                  <Text style={styles.meta}>Joined {formatDate(user.createdAt)}</Text>
                </View>
              </View>
              <Badge variant="secondary">{user.role}</Badge>
            </View>
          ))}
        </Card>

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <Input label="Name" value={newUser.name} onChangeText={(text) => setNewUser((prev) => ({ ...prev, name: text }))} />
              <Input label="Email" value={newUser.email} onChangeText={(text) => setNewUser((prev) => ({ ...prev, email: text }))} autoCapitalize="none" />
              <Input label="Password" secureTextEntry value={newUser.password} onChangeText={(text) => setNewUser((prev) => ({ ...prev, password: text }))} />
              <Input label="Role" value={newUser.role} onChangeText={(text) => setNewUser((prev) => ({ ...prev, role: text }))} />
              <View style={styles.modalActions}>
                <Button title="Close" onPress={() => setModalVisible(false)} variant="outline" />
                <Button title="Save" onPress={addUser} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  sectionCard: { padding: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#002324' },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5DDDE' },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#A1AD95', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#002324', fontWeight: '700' },
  name: { fontSize: 15, fontWeight: '700', color: '#002324' },
  meta: { color: '#64748B', fontSize: 12, marginTop: 2 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)', padding: 18 },
  modalCard: { backgroundColor: 'white', borderRadius: 20, padding: 18 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#002324', marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
