import React, { useState } from 'react';
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
import { BookOpen, Trophy, Clock, Star, Play, CircleCheck as CheckCircle, Award, TrendingUp, Target, DollarSign } from 'lucide-react-native';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  category: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'basics', name: 'Basics', icon: '🎯' },
    { id: 'investing', name: 'Investing', icon: '📈' },
    { id: 'budgeting', name: 'Budgeting', icon: '💰' },
    { id: 'mindset', name: 'Mindset', icon: '🧠' },
  ];

  const learningModules: LearningModule[] = [
    {
      id: '1',
      title: 'How Credit Cards really work?',
      description: 'Master the art of budgeting and take control of your money',
      duration: '15 min',
      difficulty: 'Beginner',
      progress: 100,
      category: 'budgeting',
      icon: <DollarSign size={24} color={Colors.surface} />,
      color: Colors.accent,
      completed: true,
    },
    {
      id: '2',
      title: 'Investing 101: Power of Compounding',
      description: 'Discover how your money grows exponentially over time.',
      duration: '20 min',
      difficulty: 'Beginner',
      progress: 65,
      category: 'investing',
      icon: <TrendingUp size={24} color={Colors.surface} />,
      color: Colors.primary,
      completed: false,
    },
    {
      id: '3',
      title: 'Money & Mindset 🧠💸',
      description: 'Transform your relationship with money and build wealth habits',
      duration: '25 min',
      difficulty: 'Intermediate',
      progress: 0,
      category: 'mindset',
      icon: <Target size={24} color={Colors.surface} />,
      color: Colors.warning,
      completed: false,
    },
    {
      id: '4',
      title: 'Emergency Fund Essentials',
      description: 'Build a safety net that protects your financial future',
      duration: '12 min',
      difficulty: 'Beginner',
      progress: 30,
      category: 'basics',
      icon: <Award size={24} color={Colors.surface} />,
      color: Colors.success,
      completed: false,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first learning module',
      icon: '🏆',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Mastered budgeting fundamentals',
      icon: '💰',
      unlocked: true,
    },
    {
      id: '3',
      title: 'Investment Explorer',
      description: 'Started learning about investments',
      icon: '📈',
      unlocked: false,
    },
    {
      id: '4',
      title: 'Streak Keeper',
      description: 'Learned for 7 days straight',
      icon: '🔥',
      unlocked: false,
    },
  ];

  const filteredModules = selectedCategory === 'all' 
    ? learningModules 
    : learningModules.filter(module => module.category === selectedCategory);

  const completedModules = learningModules.filter(module => module.completed).length;
  const totalXP = completedModules * 100 + learningModules.reduce((sum, module) => 
    sum + (module.completed ? 0 : Math.floor(module.progress * 0.5)), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Learning Hub 🧠</Text>
            <Text style={styles.subtitle}>Level up your money IQ</Text>
          </View>
        </View>

        {/* Progress Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Your Learning Journey</Text>
              <Text style={styles.xpText}>{totalXP} XP earned 🎯</Text>
            </View>
            <View style={styles.levelBadge}>
              <Trophy size={20} color={Colors.surface} />
              <Text style={styles.levelText}>Level 3</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{completedModules}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{learningModules.length - completedModules}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Modules' : `${categories.find(c => c.id === selectedCategory)?.name} Modules`}
          </Text>
          
          {filteredModules.map((module) => (
            <TouchableOpacity key={module.id} style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                  {module.icon}
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleDescription}>{module.description}</Text>
                  <View style={styles.moduleMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{module.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star size={14} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{module.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.moduleAction}>
                  {module.completed ? (
                    <CheckCircle size={24} color={Colors.success} />
                  ) : (
                    <Play size={24} color={Colors.primary} />
                  )}
                </View>
              </View>
              
              {module.progress > 0 && !module.completed && (
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[module.color, Colors.primary]}
                      style={[styles.progressFill, { width: `${module.progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>{module.progress}% complete</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements 🏆</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsContainer}
          >
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.lockedAchievement,
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.lockedIcon,
                ]}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.lockedText,
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.lockedText,
                ]}>
                  {achievement.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🌟 Keep Learning!</Text>
          <Text style={styles.motivationText}>
            "The best investment you can make is in yourself. Every module you complete brings you closer to financial freedom!" 
          </Text>
          <TouchableOpacity style={styles.motivationButton}>
            <Text style={styles.motivationButtonText}>Continue Learning</Text>
          </TouchableOpacity>
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  progressTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 4,
  },
  xpText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  levelText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.surface,
  },
  statLabel: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
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
    ...Shadows.small,
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
  moduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Shadows.small,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  moduleDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 8,
    lineHeight: 18,
  },
  moduleMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.small,
    color: Colors.textMuted,
  },
  moduleAction: {
    marginLeft: 12,
  },
  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  achievementsContainer: {
    paddingBottom: 8,
  },
  achievementCard: {
    backgroundColor: Colors.surface,
    width: 140,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    ...Shadows.small,
  },
  lockedAchievement: {
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementTitle: {
    ...Typography.captionMedium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    ...Typography.small,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  lockedText: {
    opacity: 0.5,
  },
  motivationCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.medium,
  },
  motivationTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 12,
  },
  motivationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  motivationButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  motivationButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  bottomSpacing: {
    height: 24,
  },
});