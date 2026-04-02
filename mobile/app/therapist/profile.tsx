import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

export default function TherapistProfile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Sarah Johnson',
    email: user?.email || 'sarah@nozwelo.com',
    phone: '+1 234 567 8900',
    specialization: 'Clinical Psychology',
    license: 'PSY-12345',
    experience: '8 years',
    bio: 'Experienced clinical psychologist specializing in anxiety and depression.',
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" showBack />
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userSpecialization}>{profile.specialization}</Text>
        </View>

        <Card>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
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
                <TextInput style={styles.infoInput} value={profile.phone} onChangeText={(text) => setProfile({...profile, phone: text})} keyboardType="phone-pad" />
              ) : (
                <Text style={styles.infoValue}>{profile.phone}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Specialization</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.specialization} onChangeText={(text) => setProfile({...profile, specialization: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.specialization}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>License Number</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.license} onChangeText={(text) => setProfile({...profile, license: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.license}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Experience</Text>
              {isEditing ? (
                <TextInput style={styles.infoInput} value={profile.experience} onChangeText={(text) => setProfile({...profile, experience: text})} />
              ) : (
                <Text style={styles.infoValue}>{profile.experience}</Text>
              )}
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bio</Text>
              {isEditing ? (
                <TextInput style={styles.bioInput} value={profile.bio} onChangeText={(text) => setProfile({...profile, bio: text})} multiline numberOfLines={4} />
              ) : (
                <Text style={styles.infoValue}>{profile.bio}</Text>
              )}
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Practice Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>342</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
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
          <>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={20} color="#EBFACF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#F44336" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#002324',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EBFACF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002324',
    marginBottom: 4,
  },
  userSpecialization: {
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
    flex: 1,
    textAlign: 'right',
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
  bioInput: {
    fontSize: 16,
    color: '#002324',
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 8,
    width: '60%',
    textAlign: 'right',
    minHeight: 80,
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
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 80,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutButtonText: {
    color: '#F44336',
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