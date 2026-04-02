import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import SplashScreen from './splash';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        switch (user.role) {
          case 'admin':
            router.replace('/admin/dashboard');
            break;
          case 'therapist':
            router.replace('/therapist/dashboard');
            break;
          default:
            router.replace('/user/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <SplashScreen />;
}