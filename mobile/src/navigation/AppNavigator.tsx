import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UsersPage from '../screens/admin/UsersPages';
import TherapistsScreen from '../screens/admin/TherapistsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';
import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import MyAppointmentsScreen from '../screens/user/MyAppointmentsScreen';
import CalendarScreen from '../screens/user/CalanderScreen';
import ServicesScreen from '../screens/user/ServicesScreen';
import TherapistDashboard from '../screens/therapist/TherapistDashboard';
import Profile from '../screens/therapist/Profile';
import BookingHistory from '../screens/therapist/BookingHistory';
import UpcomingSessions from '../screens/therapist/UpcomingSessions';
import TotalSessions from '../screens/therapist/TotalSessions';
import PaymentSuccess from '../screens/PaymentSucces';
import PaymentCancel from '../screens/PaymentCancel';

const Stack = createStackNavigator();

function getRoleScreens(role: string) {
  switch (role) {
    case 'THERAPIST':
      return (
        <>
          <Stack.Screen name="TherapistDashboard" component={TherapistDashboard} />
          <Stack.Screen name="UpcomingSessions" component={UpcomingSessions} />
          <Stack.Screen name="TotalSessions" component={TotalSessions} />
          <Stack.Screen name="BookingHistory" component={BookingHistory} />
          <Stack.Screen name="Profile" component={Profile} />
        </>
      );
    case 'ADMIN':
    case 'SUPERUSER':
      return (
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="Users" component={UsersPage} />
          <Stack.Screen name="Therapists" component={TherapistsScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      );
    case 'CLIENT':
    default:
      return (
        <>
          <Stack.Screen name="Dashboard" component={UserDashboardScreen} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
          <Stack.Screen name="Profile" component={Profile} />
        </>
      );
  }
}

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext)!;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {getRoleScreens(user.role)}
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
            <Stack.Screen name="PaymentCancel" component={PaymentCancel} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
