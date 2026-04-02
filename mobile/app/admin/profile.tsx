import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

export default function AdminProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@nozwelo.com',
    phone: '+1 234 567 8900',
    role: 'Administrator',
    department: 'Management',
    joinDate: '2024-01-01',
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call to save profile
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" showBack />
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={20} color="#EBFACF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userRole}>{profile.role}</Text>
        </View>

        <Card>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.name} onChangeText={(text) => setProfile({...profile, name: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.name}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.email} onChangeText={(text) => setProfile({...profile, email: text})} keyboardType="email-address" />
              ) : (
                <Text style={styles.infoValue}>{profile.email}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.phone} onChangeText={(text) => setProfile({...profile, phone: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.phone}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Department</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.department} onChangeText={(text) => setProfile({...profile, department: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.department}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{profile.joinDate}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Account Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Users Managed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Therapists</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>342</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
            </View>
          </View>
        </Card>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={20} color="#EBFACF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#002324',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EBFACF',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#002324',
    borderRadius: 20,
    padding: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#A1AD95',
  },
  infoSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DDDE',
  },
  infoLabel: {
    fontSize: 14,
    color: '#A1AD95',
  },
  infoValue: {
    fontSize: 16,
    color: '#002324',
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 16,
    color: '#002324',
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 8,
    width: '60%',
    textAlign: 'right',
  },
  statsSection: {
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
  },
  statLabel: {
    fontSize: 12,
    color: '#A1AD95',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#002324',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5DDDE',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#002324',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#002324',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#EBFACF',
    fontSize: 16,
    fontWeight: '600',
  },
});