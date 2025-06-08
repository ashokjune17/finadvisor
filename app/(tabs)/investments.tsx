import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Eye,
  EyeOff,
  Filter,
  X,
  DollarSign,
  Calendar,
  Percent
} from 'lucide-react-native';

interface Investment {
  id: string;
  name: string;
  type: 'SIP' | 'Lumpsum' | 'FD' | 'Crypto' | 'Stocks';
  amount: number;
  currentValue: number;
  returns: number;
  returnPercentage: number;
  startDate: string;
  category: string;
}

const investmentTypes = [
  { id: 'SIP', name: 'SIP', color: Colors.primary },
  { id: 'Lumpsum', name: 'Lumpsum', color: Colors.accent },
  { id: 'FD', name: 'Fixed Deposit', color: Colors.success },
  { id: 'Crypto', name: 'Crypto', color: Colors.warning },
  { id: 'Stocks', name: 'Stocks', color: Colors.error },
];

export default function InvestmentsScreen() {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'HDFC Index Fund',
      type: 'SIP',
      amount: 50000,
      currentValue: 55500,
      returns: 5500,
      returnPercentage: 11.0,
      startDate: 'Jan 2024',
      category: 'Mutual Fund',
    },
    {
      id: '2',
      name: 'Axis Bank FD',
      type: 'FD',
      amount: 100000,
      currentValue: 106500,
      returns: 6500,
      returnPercentage: 6.5,
      startDate: 'Mar 2024',
      category: 'Fixed Deposit',
    },
    {
      id: '3',
      name: 'Bitcoin',
      type: 'Crypto',
      amount: 25000,
      currentValue: 32000,
      returns: 7000,
      returnPercentage: 28.0,
      startDate: 'Feb 2024',
      category: 'Cryptocurrency',
    },
  ]);

  const [showValues, setShowValues] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'SIP' as Investment['type'],
    amount: '',
    category: '',
    startDate: '',
  });

  const formatCurrency = (amount: number) => {
    if (!showValues) return '••••••';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTotalInvested = () => {
    return investments.reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getTotalCurrentValue = () => {
    return investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  };

  const getTotalReturns = () => {
    return investments.reduce((sum, inv) => sum + inv.returns, 0);
  };

  const getOverallReturnPercentage = () => {
    const totalInvested = getTotalInvested();
    const totalReturns = getTotalReturns();
    return totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  };

  const filteredInvestments = selectedFilter === 'All' 
    ? investments 
    : investments.filter(inv => inv.type === selectedFilter);

  const handleAddInvestment = () => {
    if (!newInvestment.name.trim() || !newInvestment.amount || !newInvestment.category) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const investment: Investment = {
      id: Date.now().toString(),
      name: newInvestment.name,
      type: newInvestment.type,
      amount: parseInt(newInvestment.amount),
      currentValue: parseInt(newInvestment.amount), // Start with invested amount
      returns: 0,
      returnPercentage: 0,
      startDate: newInvestment.startDate || 'Now',
      category: newInvestment.category,
    };

    setInvestments(prev => [...prev, investment]);
    setShowAddModal(false);
    setNewInvestment({
      name: '',
      type: 'SIP',
      amount: '',
      category: '',
      startDate: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Investments 📈</Text>
            <Text style={styles.subtitle}>Track your wealth journey</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowValues(!showValues)}
            >
              {showValues ? (
                <Eye size={20} color={Colors.textDark} />
              ) : (
                <EyeOff size={20} color={Colors.textDark} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Filter size={20} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Portfolio Overview */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.portfolioCard}
        >
          <Text style={styles.portfolioTitle}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>
            {formatCurrency(getTotalCurrentValue())}
          </Text>
          
          <View style={styles.portfolioStats}>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Invested</Text>
              <Text style={styles.statValue}>
                {formatCurrency(getTotalInvested())}
              </Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Returns</Text>
              <Text style={styles.statValue}>
                {formatCurrency(getTotalReturns())}
              </Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Return %</Text>
              <Text style={styles.statValue}>
                {showValues ? `${getOverallReturnPercentage().toFixed(1)}%` : '••••'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <View style={[styles.quickStatIcon, { backgroundColor: Colors.primary }]}>
              <TrendingUp size={20} color={Colors.surface} />
            </View>
            <Text style={styles.quickStatLabel}>Best Performer</Text>
            <Text style={styles.quickStatValue}>Bitcoin (+28%)</Text>
          </View>
          
          <View style={styles.quickStat}>
            <View style={[styles.quickStatIcon, { backgroundColor: Colors.accent }]}>
              <DollarSign size={20} color={Colors.surface} />
            </View>
            <Text style={styles.quickStatLabel}>Monthly SIP</Text>
            <Text style={styles.quickStatValue}>₹12,000</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === 'All' && styles.selectedFilter,
              ]}
              onPress={() => setSelectedFilter('All')}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === 'All' && styles.selectedFilterText,
              ]}>
                All ({investments.length})
              </Text>
            </TouchableOpacity>
            
            {investmentTypes.map((type) => {
              const count = investments.filter(inv => inv.type === type.id).length;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterTab,
                    selectedFilter === type.id && styles.selectedFilter,
                  ]}
                  onPress={() => setSelectedFilter(type.id)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === type.id && styles.selectedFilterText,
                  ]}>
                    {type.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Investments List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'All' ? 'All Investments' : `${selectedFilter} Investments`}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color={Colors.surface} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {filteredInvestments.map((investment) => (
            <TouchableOpacity key={investment.id} style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <View style={styles.investmentInfo}>
                  <View style={[
                    styles.typeTag,
                    { backgroundColor: investmentTypes.find(t => t.id === investment.type)?.color || Colors.primary }
                  ]}>
                    <Text style={styles.typeText}>{investment.type}</Text>
                  </View>
                  <Text style={styles.investmentName}>{investment.name}</Text>
                  <Text style={styles.investmentCategory}>{investment.category}</Text>
                </View>
                
                <View style={styles.investmentValues}>
                  <Text style={styles.currentValue}>
                    {formatCurrency(investment.currentValue)}
                  </Text>
                  <View style={styles.returnContainer}>
                    {investment.returns >= 0 ? (
                      <TrendingUp size={14} color={Colors.success} />
                    ) : (
                      <TrendingDown size={14} color={Colors.error} />
                    )}
                    <Text style={[
                      styles.returnText,
                      { color: investment.returns >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {showValues ? `+${formatCurrency(Math.abs(investment.returns))}` : '••••'}
                    </Text>
                    <Text style={[
                      styles.returnPercentage,
                      { color: investment.returns >= 0 ? Colors.success : Colors.error }
                    ]}>
                      ({showValues ? `${investment.returnPercentage.toFixed(1)}%` : '••••'})
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.investmentFooter}>
                <Text style={styles.investedAmount}>
                  Invested: {formatCurrency(investment.amount)}
                </Text>
                <Text style={styles.startDate}>
                  Since {investment.startDate}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredInvestments.length === 0 && (
            <View style={styles.emptyState}>
              <TrendingUp size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No investments yet!</Text>
              <Text style={styles.emptySubtitle}>
                Start your wealth building journey by adding your first investment
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyButtonText}>Add Investment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Investment Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Investment Tip</Text>
          <Text style={styles.tipContent}>
            Diversify your portfolio across different asset classes to reduce risk and maximize returns!
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Investment Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Investment 📈</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddModal(false)}
            >
              <X size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Investment Type */}
            <Text style={styles.inputLabel}>Investment Type</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.typesContainer}
            >
              {investmentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeChip,
                    newInvestment.type === type.id && { backgroundColor: type.color },
                  ]}
                  onPress={() => setNewInvestment(prev => ({ ...prev, type: type.id as Investment['type'] }))}
                >
                  <Text style={[
                    styles.typeChipText,
                    newInvestment.type === type.id && styles.selectedTypeText,
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Investment Name */}
            <Text style={styles.inputLabel}>Investment Name *</Text>
            <TextInput
              style={styles.textInput}
              value={newInvestment.name}
              onChangeText={(text) => setNewInvestment(prev => ({ ...prev, name: text }))}
              placeholder="e.g., HDFC Index Fund"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Category */}
            <Text style={styles.inputLabel}>Category *</Text>
            <TextInput
              style={styles.textInput}
              value={newInvestment.category}
              onChangeText={(text) => setNewInvestment(prev => ({ ...prev, category: text }))}
              placeholder="e.g., Mutual Fund, Stocks, etc."
              placeholderTextColor={Colors.textMuted}
            />

            {/* Invested Amount */}
            <Text style={styles.inputLabel}>Invested Amount (₹) *</Text>
            <TextInput
              style={styles.textInput}
              value={newInvestment.amount}
              onChangeText={(text) => setNewInvestment(prev => ({ ...prev, amount: text }))}
              placeholder="50000"
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />

            {/* Start Date */}
            <Text style={styles.inputLabel}>Start Date</Text>
            <TextInput
              style={styles.textInput}
              value={newInvestment.startDate}
              onChangeText={(text) => setNewInvestment(prev => ({ ...prev, startDate: text }))}
              placeholder="e.g., Jan 2024"
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleAddInvestment}>
              <Text style={styles.createButtonText}>Add Investment 🚀</Text>
            </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  portfolioCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    ...Shadows.medium,
  },
  portfolioTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 8,
  },
  portfolioValue: {
    ...Typography.h1,
    fontSize: 32,
    color: Colors.surface,
    marginBottom: 24,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioStat: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statValue: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  quickStat: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Shadows.small,
  },
  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickStatLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  quickStatValue: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterTab: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.captionMedium,
    color: Colors.textDark,
  },
  selectedFilterText: {
    color: Colors.surface,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  investmentCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Shadows.small,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeText: {
    ...Typography.small,
    color: Colors.surface,
    fontWeight: '600',
  },
  investmentName: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  investmentCategory: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  currentValue: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  returnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  returnText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  returnPercentage: {
    ...Typography.caption,
    fontWeight: '600',
  },
  investmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  investedAmount: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  startDate: {
    ...Typography.caption,
    color: Colors.textMuted,
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
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  tipCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  tipTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  tipContent: {
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
  typesContainer: {
    marginBottom: 8,
  },
  typeChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipText: {
    ...Typography.captionMedium,
    color: Colors.textDark,
  },
  selectedTypeText: {
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
});