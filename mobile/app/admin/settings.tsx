import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/shared/Header';
import Card from '../../components/shared/Card';

export default function AdminSettings() {
  const [notifications, setNotifications] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [sessionDuration, setSessionDuration] = useState('60');
  const [currency, setCurrency] = useState('USD');

  const settingsSections = [
    {
      title: 'General Settings',
      items: [
        { icon: 'notifications-outline', label: 'Push Notifications', type: 'switch', value: notifications, onChange: setNotifications },
        { icon: 'time-outline', label: 'Session Duration (minutes)', type: 'input', value: sessionDuration, onChange: setSessionDuration },
        { icon: 'cash-outline', label: 'Currency', type: 'select', value: currency, onChange: setCurrency, options: ['USD', 'EUR', 'GBP'] },
      ]
    },
    {
      title: 'Booking Settings',
      items: [
        { icon: 'calendar-outline', label: 'Auto-confirm Bookings', type: 'switch', value: autoConfirm, onChange: setAutoConfirm },
        { icon: 'time-outline', label: 'Cancellation Window (hours)', type: 'input', value: '24', onChange: () => {} },
        { icon: 'people-outline', label: 'Max Bookings per Day', type: 'input', value: '10', onChange: () => {} },
      ]
    },
  ];

  const handleSwitchChange = (item: any, value: boolean) => {
    item.onChange(value);
  };

  const handleInputChange = (item: any, text: string) => {
    item.onChange(text);
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack />
      <ScrollView>
        {settingsSections.map((section, idx) => (
          <View key={idx}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIdx) => (
              <Card key={itemIdx}>
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name={item.icon as any} size={24} color="#002324" />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.type === 'switch' && (
                    <Switch 
                      value={item.value as boolean} 
                      onValueChange={(value) => handleSwitchChange(item, value)} 
                      trackColor={{ false: '#E5DDDE', true: '#002324' }} 
                    />
                  )}
                  {item.type === 'input' && (
                    <TextInput
                      style={styles.settingInput}
                      value={item.value as string}
                      onChangeText={(text) => handleInputChange(item, text)}
                      keyboardType="numeric"
                    />
                  )}
                  {item.type === 'select' && (
                    <TouchableOpacity style={styles.settingSelect}>
                      <Text style={styles.settingSelectText}>{item.value}</Text>
                      <Ionicons name="chevron-down" size={20} color="#A1AD95" />
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#002324',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#002324',
    marginLeft: 12,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
  },
  settingSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5DDDE',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  settingSelectText: {
    marginRight: 8,
    fontSize: 14,
    color: '#002324',
  },
  saveButton: {
    backgroundColor: '#002324',
    margin: 16,
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