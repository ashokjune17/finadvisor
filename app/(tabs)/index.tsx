import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  Bell, 
  ChevronRight,
  RefreshCw,
  Target,
  TrendingUp,
} from 'lucide-react-native';

interface Goal {
  goal_name: string;
  current_amount: number;
  target_amount: number;
}

interface ApiResponse {
  result: string;
  current_portfolio_value: number;
  Goals: Goal[];
}

export default function HomeScreen() {
  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded phone number for demo - in production, get from user context/storage
  const phoneNumber = '7894561230';

  const fetchHomeData = async () => {
    try {
      setError(null);
      const response = await fetch(`https://fin-advisor-ashokkumar5.replit.app/home?phone_number=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch home data: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.result === 'Success') {
        setPortfolioValue(data.current_portfolio_value || 0);
        setGoals(data.Goals || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalEmoji = (goalName: string) => {
    const name = goalName.toLowerCase();
    if (name.includes('car') || name.includes('vehicle')) return '🚗';
    if (name.includes('house') || name.includes('home')) return '🏠';
    if (name.includes('vacation') || name.includes('trip') || name.includes('travel')) return '🌴';
    if (name.includes('emergency') || name.includes('fund')) return '🛡️';
    if (name.includes('retirement')) return '🧘‍♀️';
    if (name.includes('business')) return '💼';
    if (name.includes('laptop') || name.includes('computer') || name.includes('gadget')) return '💻';
    if (name.includes('education') || name.includes('course')) return '🎓';
    if (name.includes('wedding') || name.includes('marriage')) return '💒';
    if (name.includes('bike') || name.includes('motorcycle')) return '🏍️';
    return '🎯'; // Default target emoji
  };

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
    return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! ☀️';
    if (hour < 17) return 'Good afternoon! 🌤️';
    return 'Good evening! 🌙';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TrendingUp size={48} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHomeData}>
            <RefreshCw size={20} color={Colors.surface} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>Ready to grow your wealth?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Value Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.vibeCard}
        >
          <Text style={styles.vibeTitle}>Your portfolio value today 💸✨</Text>
          <Text style={styles.vibeAmount}>{formatCurrency(portfolioValue)}</Text>
          <Text style={styles.vibeSubtitle}>Current portfolio value</Text>
          <View style={styles.vibeStats}>
            <View style={styles.vibeStat}>
              <Text style={styles.vibeStatNumber}>{goals.length}</Text>
              <Text style={styles.vibeStatLabel}>Active Goals</Text>
            </View>
            <View style={styles.vibeStat}>
              <Text style={styles.vibeStatNumber}>{getOverallProgress()}%</Text>
              <Text style={styles.vibeStatLabel}>Avg Progress</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Goal Progress */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Goal Progress 🎯</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {goals.slice(0, 3).map((goal, index) => (
              <TouchableOpacity key={`${goal.goal_name}-${index}`} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalEmoji}>{getGoalEmoji(goal.goal_name)}</Text>
                    <View>
                      <Text style={styles.goalTitle}>{goal.goal_name}</Text>
                      <Text style={styles.goalAmount}>
                        {formatCurrency(goal.current_amount)} of {formatCurrency(goal.target_amount)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.goalProgress}>
                    <Text style={styles.goalPercentage}>
                      {Math.round(getProgressPercentage(goal.current_amount, goal.target_amount))}%
                    </Text>
                    <ChevronRight size={16} color={Colors.textMuted} />
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[Colors.accent, Colors.primary]}
                    style={[
                      styles.progressFill,
                      { width: `${getProgressPercentage(goal.current_amount, goal.target_amount)}%` },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State for Goals */}
        {goals.length === 0 && (
          <View style={styles.emptyGoalsContainer}>
            <View style={styles.emptyGoalsCard}>
              <Target size={48} color={Colors.primary} />
              <Text style={styles.emptyGoalsTitle}>Start Your Financial Journey! 🚀</Text>
              <Text style={styles.emptyGoalsText}>
                Set your first financial goal and watch your money grow with smart planning.
              </Text>
              <TouchableOpacity style={styles.createGoalButton}>
                <Text style={styles.createGoalButtonText}>Create Your First Goal</Text>
                <ChevronRight size={16} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary }]}>
                <Target size={20} color={Colors.surface} />
              </View>
              <Text style={styles.quickActionText}>Add Goal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.accent }]}>
                <TrendingUp size={20} color={Colors.surface} />
              </View>
              <Text style={styles.quickActionText}>Invest</Text>
            </TouchableOpacity>
          </View>
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
    textTransform: 'capitalize',
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
  emptyGoalsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  emptyGoalsCard: {
    backgroundColor: Colors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.medium,
  },
  emptyGoalsTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyGoalsText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  createGoalButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionsTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    ...Shadows.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
  },
  bottomSpacing: {
    height: 24,
  },
});