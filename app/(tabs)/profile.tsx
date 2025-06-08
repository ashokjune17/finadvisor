import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { User, Settings, Bell, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, Shield, Smartphone, Eye, Target, Award, TrendingUp } from 'lucide-react-native';

interface ProfileStats {
  goalsCompleted: number;
  totalInvested: number;
  learningModules: number;
  daysStreak: number;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  color?: string;
}

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [dataPrivacy, setDataPrivacy] = useState(true);

  const profileStats: ProfileStats = {
    goalsCompleted: 2,
    totalInvested: 175000,
    learningModules: 3,
    daysStreak: 12,
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Get updates about your goals and investments',
      icon: <Bell size={20} color={Colors.primary} />,
      type: 'toggle',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: 'biometrics',
      title: 'Biometric Login',
      subtitle: 'Use fingerprint or face ID to secure your app',
      icon: <Shield size={20} color={Colors.accent} />,
      type: 'toggle',
      value: biometrics,
      onPress: () => setBiometrics(!biometrics),
    },
    {
      id: 'privacy',
      title: 'Data Privacy',
      subtitle: 'Control how your data is used',
      icon: <Lock size={20} color={Colors.success} />,
      type: 'toggle',
      value: dataPrivacy,
      onPress: () => setDataPrivacy(!dataPrivacy),
    },
  ];

  const navigationItems: SettingItem[] = [
    {
      id: 'risk-profile',
      title: 'Update Risk Profile',
      subtitle: 'Review and update your investment preferences',
      icon: <TrendingUp size={20} color={Colors.primary} />,
      type: 'navigation',
      onPress: () => Alert.alert('Risk Profile', 'Coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with your account and investments',
      icon: <HelpCircle size={20} color={Colors.warning} />,
      type: 'navigation',
      onPress: () => Alert.alert('Help', 'Support feature coming soon!'),
    },
    {
      id: 'about',
      title: 'About Finance App',
      subtitle: 'Version 1.0.0',
      icon: <Smartphone size={20} color={Colors.textMuted} />,
      type: 'navigation',
      onPress: () => Alert.alert('About', 'Finance Made Simple v1.0.0'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            Alert.alert('Logged out', 'You have been logged out successfully');
          }
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={32} color={Colors.surface} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex@example.com</Text>
              <View style={styles.levelContainer}>
                <Award size={16} color={Colors.surface} />
                <Text style={styles.levelText}>Level 3 Investor</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{profileStats.goalsCompleted}</Text>
              <Text style={styles.statLabel}>Goals Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <TrendingUp size={24} color={Colors.accent} />
              <Text style={styles.statNumber}>
                {formatCurrency(profileStats.totalInvested)}
              </Text>
              <Text style={styles.statLabel}>Total Invested</Text>
            </View>
            
            <View style={styles.statCard}>
              <Award size={24} color={Colors.warning} />
              <Text style={styles.statNumber}>{profileStats.learningModules}</Text>
              <Text style={styles.statLabel}>Modules Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.statNumber}>{profileStats.daysStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
              disabled={item.type === 'toggle'}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              
              {item.type === 'toggle' && (
                <Switch
                  value={item.value}
                  onValueChange={item.onPress}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              )}
              
              {item.type === 'navigation' && (
                <ChevronRight size={16} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            Finance Made Simple for your generation
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.textDark,
  },
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  profileCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    ...Shadows.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h2,
    color: Colors.surface,
    marginBottom: 4,
  },
  userEmail: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  levelText: {
    ...Typography.captionMedium,
    color: Colors.surface,
    marginLeft: 6,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Shadows.small,
  },
  statNumber: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  streakEmoji: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Shadows.small,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    ...Typography.bodySemiBold,
    color: Colors.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  appInfoText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  bottomSpacing: {
    height: 24,
  },
});