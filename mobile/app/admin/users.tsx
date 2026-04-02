import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Mock data - replace with API call
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinedDate: '2024-01-15' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', joinedDate: '2024-01-20' },
      { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'inactive', joinedDate: '2024-02-01' },
    ];
    setUsers(mockUsers);
  };

  const handleUserAction = (action: string, user: User) => {
    if (action === 'delete') {
      Alert.alert('Confirm', `Delete user ${user.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => console.log('Delete user', user.id) },
      ]);
    } else {
      setSelectedUser(user);
      setModalVisible(true);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="User Management" showBack />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A1AD95" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView>
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userDate}>Joined: {user.joinedDate}</Text>
                </View>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity onPress={() => handleUserAction('edit', user)}>
                  <Ionicons name="create-outline" size={22} color="#002324" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUserAction('delete', user)}>
                  <Ionicons name="trash-outline" size={22} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.userFooter}>
              <View style={[styles.statusBadge, { backgroundColor: user.status === 'active' ? '#4CAF5020' : '#F4433620' }]}>
                <Text style={[styles.statusText, { color: user.status === 'active' ? '#4CAF50' : '#F44336' }]}>
                  {user.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <TextInput style={styles.modalInput} placeholder="Name" value={selectedUser?.name} />
            <TextInput style={styles.modalInput} placeholder="Email" value={selectedUser?.email} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5DDDE',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#002324',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#002324',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#EBFACF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002324',
  },
  userEmail: {
    fontSize: 14,
    color: '#A1AD95',
    marginTop: 2,
  },
  userDate: {
    fontSize: 12,
    color: '#A1AD95',
    marginTop: 2,
  },
  userActions: {
    flexDirection: 'row',
    gap: 16,
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userRole: {
    fontSize: 12,
    color: '#A1AD95',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#002324',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#002324',
  },
  saveButtonText: {
    color: '#EBFACF',
  },
});