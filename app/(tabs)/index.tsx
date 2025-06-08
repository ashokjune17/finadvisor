import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  ChevronRight,
  DollarSign 
} from 'lucide-react-native';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

interface GoalProgress {
  id: string;
  title: string;
  current: number;
  target: number;
  emoji: string;
}

export default function HomeScreen() {
  const quickActions: QuickAction[] = [
    {
      id: 'add-goal',
      title: 'Add Goal',
      icon: <Plus size={24} color={Colors.surface} />,
      color: Colors.primary,
    },
    {
      id: 'track-expense',
      title: 'Log Expense',
      icon: <DollarSign size={24} color={Colors.surface} />,
      color: Colors.accent,
    },
    {
      id: 'learn',
      title: 'Learn',
      icon: <BookOpen size={24} color={Colors.surface} />,
      color: Colors.warning,
    },
    {
      id: 'invest',
      title: 'Invest',
      icon: <TrendingUp size={24} color={Colors.surface} />,
      color: Colors.success,
    },
  ];

  const goalProgress: GoalProgress[] = [
    {
      id: '1',
      title: 'Bali Trip',
      current: 25000,
      target: 100000,
      emoji: '🌴',
    },
    {
      id: '2',
      title: 'Emergency Fund',
      current: 75000,
      target: 150000,
      emoji: '🛡️',
    },
    {
      id: '3',
      title: 'New MacBook',
      current: 45000,
      target: 120000,
      emoji: '💻',
    },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning! ☀️</Text>
            <Text style={styles.userName}>Ready to grow your wealth?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Money Vibe Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.vibeCard}
        >
          <Text style={styles.vibeTitle}>Your money vibe today 💸✨</Text>
          <Text style={styles.vibeAmount}>₹1,45,000</Text>
          <Text style={styles.vibeSubtitle}>Total across all goals</Text>
          <View style={styles.vibeStats}>
            <View style={styles.vibeStat}>
              <Text style={styles.vibeStatNumber}>3</Text>
              <Text style={styles.vibeStatLabel}>Active Goals</Text>
            </View>
            <View style={styles.vibeStat}>
              <Text style={styles.vibeStatNumber}>67%</Text>
              <Text style={styles.vibeStatLabel}>Avg Progress</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: action.color }]}
              >
                {action.icon}
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Goal Progress 🎯</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {goalProgress.map((goal) => (
            <TouchableOpacity key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  <View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalAmount}>
                      {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                    </Text>
                  </View>
                </View>
                <View style={styles.goalProgress}>
                  <Text style={styles.goalPercentage}>
                    {Math.round(getProgressPercentage(goal.current, goal.target))}%
                  </Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </View>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[Colors.accent, Colors.primary]}
                  style={[
                    styles.progressFill,
                    { width: `${getProgressPercentage(goal.current, goal.target)}%` },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Smart Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Award size={24} color={Colors.warning} />
            <Text style={styles.tipTitle}>🧠 Smart Tip</Text>
          </View>
          <Text style={styles.tipContent}>
            Investing early = Future You thanks you 💼📊
          </Text>
          <Text style={styles.tipDetail}>
            Starting investments in your 20s can grow your wealth 3x faster due to compound interest!
          </Text>
          <TouchableOpacity style={styles.tipButton}>
            <Text style={styles.tipButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
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
  greeting: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  userName: {
    ...Typography.h2,
    color: Colors.textDark,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  vibeCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    ...Shadows.medium,
  },
  vibeTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 8,
  },
  vibeAmount: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.surface,
    marginBottom: 4,
  },
  vibeSubtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  vibeStats: {
    flexDirection: 'row',
    gap: 32,
  },
  vibeStat: {
    alignItems: 'center',
  },
  vibeStatNumber: {
    ...Typography.h2,
    color: Colors.surface,
  },
  vibeStatLabel: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textDark,
  },
  seeAllText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    ...Shadows.small,
  },
  quickActionText: {
    ...Typography.smallMedium,
    color: Colors.surface,
    marginTop: 8,
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Shadows.small,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
  },
  goalAmount: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalPercentage: {
    ...Typography.bodySemiBold,
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginLeft: 8,
  },
  tipContent: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  tipDetail: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  tipButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tipButtonText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  bottomSpacing: {
    height: 24,
  },
});