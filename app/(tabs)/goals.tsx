import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Plus, Target, ChevronRight, Calendar, DollarSign, X, Smile, MessageCircle, CreditCard as Edit, RefreshCw, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

interface Goal {
  goal_id: number;
  goal_name: string;
  current_amount: number;
  target_amount: number;
  target_date: string;
  fund_decided: string;
  phone_number: string;
}

interface ApiResponse {
  result: string;
  Goals: Goal[];
}

const goalCategories = [
  { id: 'vacation', name: 'Dream Vacation', emoji: '🌴' },
  { id: 'emergency', name: 'Emergency Fund', emoji: '🛡️' },
  { id: 'house', name: 'Buy a House', emoji: '🏠' },
  { id: 'car', name: 'New Car', emoji: '🚗' },
  { id: 'retirement', name: 'Retirement', emoji: '🧘‍♀️' },
  { id: 'business', name: 'Start Business', emoji: '💼' },
  { id: 'gadget', name: 'New Gadget', emoji: '💻' },
  { id: 'education', name: 'Education', emoji: '🎓' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { phoneNumber, isLoading: authLoading } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: '',
    selectedCategory: goalCategories[0],
  });

  const fetchGoals = async () => {
    if (!phoneNumber) {
      setError('Phone number not available');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch(`https://fin-advisor-ashokkumar5.replit.app/goals?phone_number=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch goals: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.result === 'Success' && data.Goals) {
        setGoals(data.Goals);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError(error instanceof Error ? error.message : 'Failed to load goals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && phoneNumber) {
      fetchGoals();
    } else if (!authLoading && !phoneNumber) {
      setError('Please log in to view your goals');
      setLoading(false);
    }
  }, [phoneNumber, authLoading]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoals();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
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

  const handleAddGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target || !newGoal.deadline) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    // In a real app, you would make an API call to create the goal
    // For now, we'll just refresh the goals list
    setShowAddModal(false);
    setNewGoal({
      title: '',
      target: '',
      deadline: '',
      selectedCategory: goalCategories[0],
    });
    
    // Refresh goals after adding
    fetchGoals();
  };

  const getTotalProgress = () => {
    if (goals.length === 0) return 0;
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
    return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  };

  const handleCreateGoalChat = () => {
    router.push('/create-goal');
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your goals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Target size={48} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGoals}>
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
            <Text style={styles.title}>Your Goals 🎯</Text>
            <Text style={styles.subtitle}>Set a goal. Name it. Claim it.</Text>
          </View>
        </View>

        {/* Overall Progress */}
        {goals.length > 0 && (
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            style={styles.progressCard}
          >
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{getTotalProgress()}%</Text>
            <Text style={styles.progressSubtitle}>
              {goals.length} active goal{goals.length !== 1 ? 's' : ''} • Keep it up! 🔥
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <LinearGradient
                  colors={[Colors.accent, Colors.surface]}
                  style={[styles.progressBarFill, { width: `${getTotalProgress()}%` }]}
                />
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Goals List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <TouchableOpacity
              style={styles.addGoalButton}
              onPress={handleCreateGoalChat}
            >
              <MessageCircle size={18} color={Colors.surface} />
              <Text style={styles.addGoalButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>

          {goals.map((goal) => (
            <TouchableOpacity key={goal.goal_id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalEmoji}>{getGoalEmoji(goal.goal_name)}</Text>
                  <View style={styles.goalDetails}>
                    <Text style={styles.goalTitle}>{goal.goal_name}</Text>
                    <View style={styles.goalMeta}>
                      <Text style={styles.goalAmount}>
                        {formatCurrency(goal.current_amount)} of {formatCurrency(goal.target_amount)}
                      </Text>
                      <Text style={styles.goalDeadline}>
                        📅 {formatDate(goal.target_date)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.goalAction}>
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

              <View style={styles.goalFooter}>
                <Text style={styles.goalRemaining}>
                  ₹{(goal.target_amount - goal.current_amount).toLocaleString('en-IN')} left to go
                </Text>
                <View style={styles.goalStatus}>
                  {goal.fund_decided === 'True' ? (
                    <View style={styles.fundDecidedBadge}>
                      <Text style={styles.fundDecidedText}>Fund Selected ✓</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.editButton}>
                      <TrendingUp size={14} color={Colors.primary} />
                      <Text style={styles.editText}>Select Fund</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {goals.length === 0 && (
            <View style={styles.emptyState}>
              <Target size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No goals yet!</Text>
              <Text style={styles.emptySubtitle}>
                Add your first goal and start building your future
              </Text>
              <TouchableOpacity
                style={styles.emptyAddGoalButton}
                onPress={handleCreateGoalChat}
              >
                <MessageCircle size={20} color={Colors.surface} />
                <Text style={styles.emptyAddGoalButtonText}>Add Goal ✨</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Motivational Card */}
        {goals.length > 0 && (
          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>💪 You're doing great!</Text>
            <Text style={styles.motivationText}>
              Every small step counts. Keep adding to your goals regularly and watch them grow! 🌱
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quick Add Goal ⚡</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Goal Categories */}
            <Text style={styles.inputLabel}>What's your goal?</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {goalCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    newGoal.selectedCategory.id === category.id && styles.selectedCategory,
                  ]}
                  onPress={() => setNewGoal(prev => ({ ...prev, selectedCategory: category }))}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[
                    styles.categoryText,
                    newGoal.selectedCategory.id === category.id && styles.selectedCategoryText,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Goal Name */}
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput
              style={styles.textInput}
              value={newGoal.title}
              onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
              placeholder="e.g., Dream vacation to Bali"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Target Amount */}
            <Text style={styles.inputLabel}>Target Amount (₹)</Text>
            <TextInput
              style={styles.textInput}
              value={newGoal.target}
              onChangeText={(text) => setNewGoal(prev => ({ ...prev, target: text }))}
              placeholder="100000"
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Deadline */}
            <Text style={styles.inputLabel}>Target Date</Text>
            <TextInput
              style={styles.textInput}
              value={newGoal.deadline}
              onChangeText={(text) => setNewGoal(prev => ({ ...prev, deadline: text }))}
              placeholder="e.g., Dec 2024"
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleAddGoal}>
              <Text style={styles.createButtonText}>Create Goal 🚀</Text>
            </TouchableOpacity>

            <View style={styles.chatPrompt}>
              <Text style={styles.chatPromptText}>
                Want a more personalized experience? Try our interactive chat! 💬
              </Text>
              <TouchableOpacity
                style={styles.chatPromptButton}
                onPress={() => {
                  setShowAddModal(false);
                  handleCreateGoalChat();
                }}
              >
                <MessageCircle size={16} color={Colors.primary} />
                <Text style={styles.chatPromptButtonText}>Create with Chat</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.textDark,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    ...Shadows.medium,
  },
  progressTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 8,
  },
  progressPercentage: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.surface,
  },
  progressSubtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
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
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addGoalButtonText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Shadows.small,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  goalMeta: {
    gap: 4,
  },
  goalAmount: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  goalDeadline: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  goalAction: {
    alignItems: 'flex-end',
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
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalRemaining: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  goalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fundDecidedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fundDecidedText: {
    ...Typography.small,
    color: Colors.surface,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginTop: 16,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyAddGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    ...Shadows.medium,
  },
  emptyAddGoalButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  motivationCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  motivationTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  motivationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 24,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.textDark,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputLabel: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    ...Typography.captionMedium,
    color: Colors.textDark,
  },
  selectedCategoryText: {
    color: Colors.surface,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Typography.body,
    color: Colors.textDark,
    marginBottom: 8,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  createButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  chatPrompt: {
    backgroundColor: Colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  chatPromptText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  chatPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  chatPromptButtonText: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
});