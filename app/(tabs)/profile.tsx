import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { User, Settings, Bell, Lock, CircleHelp as HelpCircle, LogOut, ChevronRight, Shield, Smartphone, Eye, Target, Award, TrendingUp, BookOpen, GraduationCap, RefreshCw } from 'lucide-react-native';

interface UserProfile {
  phone_number: string;
  name: string;
  age: number;
  dob: string;
  pan: string;
  risk: string;
  is_basic_completed: string;
  is_risk_completed: string;
  is_goal_completed: string;
  is_fund_completed: string;
  marital_status: string;
  income: number;
}

interface ApiResponse {
  result: string;
  Profile: UserProfile;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded phone number for demo - in production, get from user context/storage
  const phoneNumber = '7406189782';

  const getRiskText = (riskLevel: string): string => {
    const riskMap: { [key: string]: string } = {
      '1': 'Play It Safe',
      '2': 'Cautious Mover',
      '3': 'Balanced Approach',
      '4': 'Growth Seeker',
      '5': 'Risk Explorer',
    };
    return riskMap[riskLevel] || 'Unknown Risk Level';
  };

  const fetchUserProfile = async () => {
    try {
      setError(null);
      const response = await fetch(`https://fin-advisor-ashokkumar5.replit.app/profile?phone_number=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.result === 'Success' && data.Profile) {
        setUserProfile(data.Profile);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const getCompletionStats = () => {
    if (!userProfile) return { completed: 0, total: 4 };
    
    const completions = [
      userProfile.is_basic_completed === 'True',
      userProfile.is_risk_completed === 'True',
      userProfile.is_goal_completed === 'True',
      userProfile.is_fund_completed === 'True',
    ];
    
    return {
      completed: completions.filter(Boolean).length,
      total: completions.length,
    };
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
      id: 'learn',
      title: 'Learning Hub 🧠',
      subtitle: 'Level up your money IQ with courses and tips',
      icon: <BookOpen size={20} color={Colors.primary} />,
      type: 'navigation',
      onPress: () => Alert.alert('Learning Hub', 'Navigate to learning modules, courses, and financial education content!'),
    },
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
            <RefreshCw size={20} color={Colors.surface} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const completionStats = getCompletionStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
              <Text style={styles.userDetails}>
                Age: {userProfile?.age} • {userProfile?.marital_status?.replace(/[👰🤵👨‍👩‍👧‍👦💃🕺🧑‍👧👵👴]/g, '').trim()}
              </Text>
              <View style={styles.riskContainer}>
                <Award size={16} color={Colors.surface} />
                <Text style={styles.riskText}>
                  Risk Profile: {getRiskText(userProfile?.risk || '1')}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Profile Completion Card */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Target size={24} color={Colors.primary} />
            <Text style={styles.completionTitle}>Profile Completion</Text>
          </View>
          <Text style={styles.completionDescription}>
            Complete your profile to unlock all features and get personalized recommendations.
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={[
                  styles.progressFill,
                  { width: `${(completionStats.completed / completionStats.total) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completionStats.completed}/{completionStats.total} sections completed
            </Text>
          </View>

          <View style={styles.completionItems}>
            <View style={styles.completionItem}>
              <View style={[
                styles.completionDot,
                { backgroundColor: userProfile?.is_basic_completed === 'True' ? Colors.success : Colors.border }
              ]} />
              <Text style={styles.completionItemText}>Basic Information</Text>
            </View>
            <View style={styles.completionItem}>
              <View style={[
                styles.completionDot,
                { backgroundColor: userProfile?.is_risk_completed === 'True' ? Colors.success : Colors.border }
              ]} />
              <Text style={styles.completionItemText}>Risk Assessment</Text>
            </View>
            <View style={styles.completionItem}>
              <View style={[
                styles.completionDot,
                { backgroundColor: userProfile?.is_goal_completed === 'True' ? Colors.success : Colors.border }
              ]} />
              <Text style={styles.completionItemText}>Financial Goals</Text>
            </View>
            <View style={styles.completionItem}>
              <View style={[
                styles.completionDot,
                { backgroundColor: userProfile?.is_fund_completed === 'True' ? Colors.success : Colors.border }
              ]} />
              <Text style={styles.completionItemText}>Fund Selection</Text>
            </View>
          </View>
        </View>

        {/* Financial Overview */}
        <View style={styles.financialCard}>
          <Text style={styles.financialTitle}>💰 Financial Overview</Text>
          <View style={styles.financialStats}>
            <View style={styles.financialStat}>
              <Text style={styles.financialStatLabel}>Monthly Income</Text>
              <Text style={styles.financialStatValue}>
                {formatCurrency(userProfile?.income || 0)}
              </Text>
            </View>
            <View style={styles.financialStat}>
              <Text style={styles.financialStatLabel}>PAN Number</Text>
              <Text style={styles.financialStatValue}>
                {userProfile?.pan || 'Not provided'}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorTitle: {
    ...Typography.h2,
    color: Colors.textDark,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  retryButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
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
  userDetails: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  riskText: {
    ...Typography.captionMedium,
    color: Colors.surface,
    marginLeft: 6,
  },
  completionCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginLeft: 8,
  },
  completionDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  completionItems: {
    gap: 12,
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completionItemText: {
    ...Typography.caption,
    color: Colors.textDark,
  },
  financialCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  financialTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 16,
  },
  financialStats: {
    gap: 16,
  },
  financialStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financialStatLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  financialStatValue: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
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