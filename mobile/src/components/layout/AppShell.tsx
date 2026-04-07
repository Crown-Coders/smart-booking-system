import React, { ReactNode, useContext } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { ChatbotWrapper } from './ChatbotWrapper';

type AppShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  scrollable?: boolean;
};

type NavItem = {
  route: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const COLORS = {
  deepTeal: '#002324',
  sand: '#E5DDDE',
  sage: '#A1AD95',
  mint: '#EBFACF',
  white: '#FFFFFF',
  page: '#F7F5F1',
};

const roleNavMap: Record<string, NavItem[]> = {
  CLIENT: [
    { route: 'Dashboard', label: 'Home', icon: 'home-outline' },
    { route: 'Services', label: 'Services', icon: 'grid-outline' },
    { route: 'Calendar', label: 'Book', icon: 'calendar-outline' },
    { route: 'MyAppointments', label: 'Sessions', icon: 'time-outline' },
    { route: 'Profile', label: 'Profile', icon: 'person-outline' },
  ],
  THERAPIST: [
    { route: 'TherapistDashboard', label: 'Home', icon: 'home-outline' },
    { route: 'UpcomingSessions', label: 'Upcoming', icon: 'calendar-outline' },
    { route: 'TotalSessions', label: 'Sessions', icon: 'stats-chart-outline' },
    { route: 'BookingHistory', label: 'History', icon: 'receipt-outline' },
    { route: 'Profile', label: 'Profile', icon: 'person-outline' },
  ],
  ADMIN: [
    { route: 'AdminDashboard', label: 'Home', icon: 'home-outline' },
    { route: 'Users', label: 'Users', icon: 'people-outline' },
    { route: 'Therapists', label: 'Therapists', icon: 'medkit-outline' },
    { route: 'Reports', label: 'Reports', icon: 'bar-chart-outline' },
    { route: 'Settings', label: 'Settings', icon: 'settings-outline' },
  ],
  SUPERUSER: [
    { route: 'AdminDashboard', label: 'Home', icon: 'home-outline' },
    { route: 'Users', label: 'Users', icon: 'people-outline' },
    { route: 'Therapists', label: 'Therapists', icon: 'medkit-outline' },
    { route: 'Reports', label: 'Reports', icon: 'bar-chart-outline' },
    { route: 'Settings', label: 'Settings', icon: 'settings-outline' },
  ],
};

export default function AppShell({
  children,
  title,
  subtitle,
}: AppShellProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user, logout } = useContext(AuthContext)!;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navItems = roleNavMap[user?.role || 'CLIENT'] || roleNavMap.CLIENT;
  const isWeb = Platform.OS === 'web';
  const isCompactWeb = isWeb && width < 900;
  const isVeryCompactWeb = isWeb && width < 640;

  const handleLogout = () => {
    Alert.alert('Logout', 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'U';

  return (
    <ChatbotWrapper>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View
          style={[
            styles.topBar,
            isCompactWeb && styles.topBarCompact,
            { paddingTop: 10 + Math.max(insets.top * 0.15, 0) },
          ]}
        >
          <View style={[styles.titleBlock, isCompactWeb && styles.titleBlockCompact]}>
            <Text style={styles.pageTitle}>{title}</Text>
            {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
          </View>

          <View style={[styles.actions, isCompactWeb && styles.actionsCompact]}>
            <View style={[styles.userPill, isVeryCompactWeb && styles.userPillCompact]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.userMeta}>
                <Text style={styles.userName} numberOfLines={1}>{user?.name || 'User'}</Text>
                <Text style={styles.userRole}>{user?.role || 'CLIENT'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.deepTeal} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.content, isWeb && styles.contentWeb]}>
          <View style={[styles.contentInner, isWeb && styles.contentInnerWeb]}>{children}</View>
        </View>

        <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
          <View
            style={[
              styles.bottomNav,
              isCompactWeb && styles.bottomNavCompact,
              { paddingBottom: Math.max(insets.bottom, 8) },
            ]}
          >
            {navItems.map((item) => {
              const active = route.name === item.route;
              return (
                <TouchableOpacity
                  key={item.route}
                  style={[styles.navItem, isCompactWeb && styles.navItemCompact, active && styles.navItemActive]}
                  onPress={() => navigation.navigate(item.route)}
                >
                  <Ionicons
                    name={active ? (item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap) : item.icon}
                    size={20}
                    color={active ? COLORS.deepTeal : COLORS.sage}
                  />
                  <Text style={[styles.navLabel, isCompactWeb && styles.navLabelCompact, active && styles.navLabelActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </ChatbotWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  topBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleBlockCompact: {
    width: '100%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.deepTeal,
  },
  pageSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.sage,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  actionsCompact: {
    width: '100%',
    justifyContent: 'space-between',
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: COLORS.sand,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: Platform.OS === 'web' ? 260 : 190,
  },
  userPillCompact: {
    maxWidth: '78%',
  },
  userMeta: {
    minWidth: 0,
    flexShrink: 1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.deepTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.mint,
    fontWeight: '700',
    fontSize: 13,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.deepTeal,
  },
  userRole: {
    fontSize: 11,
    color: COLORS.sage,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mint,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    minHeight: 0,
  },
  contentWeb: {
    alignItems: 'center',
  },
  contentInner: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  contentInnerWeb: {
    maxWidth: 1120,
  },
  bottomSafeArea: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.sand,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  bottomNavCompact: {
    paddingHorizontal: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 14,
  },
  navItemCompact: {
    paddingHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: COLORS.mint,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.sage,
    fontWeight: '500',
  },
  navLabelCompact: {
    fontSize: 10,
  },
  navLabelActive: {
    color: COLORS.deepTeal,
    fontWeight: '700',
  },
  topBarCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});
