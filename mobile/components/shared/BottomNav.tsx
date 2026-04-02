import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { shadowStyle } from '../../utils/platformStyles';

interface NavItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    icon: 'grid-outline',
    route: '/dashboard',
    roles: ['user', 'therapist', 'admin'],
  },
  {
    name: 'Book Session',
    icon: 'calendar-outline',
    route: '/book-session',
    roles: ['user'],
  },
  {
    name: 'My Bookings',
    icon: 'book-outline',
    route: '/my-bookings',
    roles: ['user', 'therapist'],
  },
  {
    name: 'Sessions',
    icon: 'time-outline',
    route: '/sessions',
    roles: ['therapist'],
  },
  {
    name: 'Users',
    icon: 'people-outline',
    route: '/users',
    roles: ['admin'],
  },
  {
    name: 'Reports',
    icon: 'bar-chart-outline',
    route: '/reports',
    roles: ['admin'],
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    route: '/profile',
    roles: ['user', 'therapist', 'admin'],
  },
];

interface BottomNavProps {
  userRole: string;
}

export default function BottomNav({ userRole }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const visibleItems = navItems.filter(item => item.roles.includes(userRole));

  const handleNavigation = (route: string) => {
    const fullPath = `/${userRole}${route}`;
    router.push(fullPath as any);
  };

  return (
    <View style={styles.container}>
      {visibleItems.map((item) => {
        const isActive = pathname.includes(item.route);
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={isActive ? (item.icon.replace('-outline', '') as any) : item.icon}
              size={24}
              color={isActive ? '#002324' : '#A1AD95'}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderTopColor: '#E5DDDE',
    ...shadowStyle({ offsetY: -2, radius: 4, opacity: 0.05, elevation: 3 }),
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#A1AD95',
  },
  navTextActive: {
    color: '#002324',
    fontWeight: '500',
  },
});