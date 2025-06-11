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
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Plus, TrendingUp, TrendingDown, Eye, EyeOff, Filter, X, DollarSign, Calendar, Percent, RefreshCw, ChartBar as BarChart3, ChartPie as PieChart } from 'lucide-react-native';

interface Investment {
  fund_name: string;
  fund_nav: string;
  invested_amount: string;
}

interface ApiResponse {
  result: string;
  Investments: Investment[];
}

const investmentTypes = [
  { id: 'SIP', name: 'SIP', color: Colors.primary },
  { id: 'Lumpsum', name: 'Lumpsum', color: Colors.accent },
  { id: 'FD', name: 'Fixed Deposit', color: Colors.success },
  { id: 'Crypto', name: 'Crypto', color: Colors.warning },
  { id: 'Stocks', name: 'Stocks', color: Colors.error },
];

export default function InvestmentsScreen() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'SIP' as 'SIP' | 'Lumpsum' | 'FD' | 'Crypto' | 'Stocks',
    amount: '',
    category: '',
    startDate: '',
  });

  // Hardcoded phone number for demo - in production, get from user context/storage
  const phoneNumber = '7894561230';

  const fetchInvestments = async () => {
    try {
      setError(null);
      const response = await fetch(`https://fin-advisor-ashokkumar5.replit.app/investments?phone_number=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch investments: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.result === 'Success' && data.Investments) {
        setInvestments(data.Investments);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      setError(error instanceof Error ? error.message : 'Failed to load investments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvestments();
  };

  const formatCurrency = (amount: number | string) => {
    if (!showValues) return '••••••';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${numAmount.toLocaleString('en-IN')}`;
  };

  const getTotalInvested = () => {
    return investments.reduce((sum, inv) => sum + parseFloat(inv.invested_amount), 0);
  };

  const getTotalCurrentValue = () => {
    return investments.reduce((sum, inv) => {
      const invested = parseFloat(inv.invested_amount);
      const nav = parseFloat(inv.fund_nav);
      // Assuming NAV represents current value per unit, and we have 1 unit per rupee invested
      // This is a simplified calculation - in reality, you'd need units and current NAV
      return sum + (invested * (nav / 10)); // Simplified calculation
    }, 0);
  };

  const getTotalReturns = () => {
    return getTotalCurrentValue() - getTotalInvested();
  };

  const getOverallReturnPercentage = () => {
    const totalInvested = getTotalInvested();
    const totalReturns = getTotalReturns();
    return totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  };

  const getInvestmentReturn = (investment: Investment) => {
    const invested = parseFloat(investment.invested_amount);
    const nav = parseFloat(investment.fund_nav);
    // Simplified calculation for demo
    const currentValue = invested * (nav / 10);
    const returns = currentValue - invested;
    const returnPercentage = invested > 0 ? (returns / invested) * 100 : 0;
    
    return {
      currentValue,
      returns,
      returnPercentage
    };
  };

  const getFundType = (fundName: string): string => {
    const name = fundName.toLowerCase();
    if (name.includes('sip') || name.includes('systematic')) return 'SIP';
    if (name.includes('fd') || name.includes('fixed') || name.includes('deposit')) return 'FD';
    if (name.includes('equity') || name.includes('stock')) return 'Stocks';
    if (name.includes('crypto') || name.includes('bitcoin') || name.includes('ethereum')) return 'Crypto';
    return 'Mutual Fund';
  };

  const filteredInvestments = selectedFilter === 'All' 
    ? investments 
    : investments.filter(inv => getFundType(inv.fund_name) === selectedFilter);

  const handleAddInvestment = () => {
    if (!newInvestment.name.trim() || !newInvestment.amount || !newInvestment.category) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // In a real app, you would make an API call to create the investment
    // For now, we'll just refresh the investments list
    setShowAddModal(false);
    setNewInvestment({
      name: '',
      type: 'SIP',
      amount: '',
      category: '',
      startDate: '',
    });
    
    // Refresh investments after adding
    fetchInvestments();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your investments...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchInvestments}>
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
        {investments.length > 0 && (
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
                <Text style={[
                  styles.statValue,
                  { color: getTotalReturns() >= 0 ? Colors.surface : '#FFB3B3' }
                ]}>
                  {showValues ? (getTotalReturns() >= 0 ? '+' : '') + formatCurrency(Math.abs(getTotalReturns())) : '••••'}
                </Text>
              </View>
              <View style={styles.portfolioStat}>
                <Text style={styles.statLabel}>Return %</Text>
                <Text style={[
                  styles.statValue,
                  { color: getOverallReturnPercentage() >= 0 ? Colors.surface : '#FFB3B3' }
                ]}>
                  {showValues ? `${getOverallReturnPercentage() >= 0 ? '+' : ''}${getOverallReturnPercentage().toFixed(1)}%` : '••••'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Quick Stats */}
        {investments.length > 0 && (
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.primary }]}>
                <BarChart3 size={20} color={Colors.surface} />
              </View>
              <Text style={styles.quickStatLabel}>Total Funds</Text>
              <Text style={styles.quickStatValue}>{investments.length}</Text>
            </View>
            
            <View style={styles.quickStat}>
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.accent }]}>
                <PieChart size={20} color={Colors.surface} />
              </View>
              <Text style={styles.quickStatLabel}>Avg NAV</Text>
              <Text style={styles.quickStatValue}>
                ₹{(investments.reduce((sum, inv) => sum + parseFloat(inv.fund_nav), 0) / investments.length).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

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
              const count = investments.filter(inv => getFundType(inv.fund_name) === type.id).length;
              if (count === 0) return null;
              
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

          {filteredInvestments.map((investment, index) => {
            const fundType = getFundType(investment.fund_name);
            const typeColor = investmentTypes.find(t => t.id === fundType)?.color || Colors.primary;
            const returnData = getInvestmentReturn(investment);
            
            return (
              <TouchableOpacity key={`${investment.fund_name}-${index}`} style={styles.investmentCard}>
                <View style={styles.investmentHeader}>
                  <View style={styles.investmentInfo}>
                    <View style={[
                      styles.typeTag,
                      { backgroundColor: typeColor }
                    ]}>
                      <Text style={styles.typeText}>{fundType}</Text>
                    </View>
                    <Text style={styles.investmentName}>{investment.fund_name}</Text>
                    <Text style={styles.investmentCategory}>NAV: ₹{investment.fund_nav}</Text>
                  </View>
                  
                  <View style={styles.investmentValues}>
                    <Text style={styles.currentValue}>
                      {formatCurrency(returnData.currentValue)}
                    </Text>
                    <View style={styles.returnContainer}>
                      {returnData.returns >= 0 ? (
                        <TrendingUp size={14} color={Colors.success} />
                      ) : (
                        <TrendingDown size={14} color={Colors.error} />
                      )}
                      <Text style={[
                        styles.returnText,
                        { color: returnData.returns >= 0 ? Colors.success : Colors.error }
                      ]}>
                        {showValues ? `${returnData.returns >= 0 ? '+' : ''}${formatCurrency(Math.abs(returnData.returns))}` : '••••'}
                      </Text>
                      <Text style={[
                        styles.returnPercentage,
                        { color: returnData.returns >= 0 ? Colors.success : Colors.error }
                      ]}>
                        ({showValues ? `${returnData.returnPercentage >= 0 ? '+' : ''}${returnData.returnPercentage.toFixed(1)}%` : '••••'})
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.investmentFooter}>
                  <Text style={styles.investedAmount}>
                    Invested: {formatCurrency(investment.invested_amount)}
                  </Text>
                  <Text style={styles.startDate}>
                    Active Investment
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {filteredInvestments.length === 0 && investments.length > 0 && (
            <View style={styles.emptyFilterState}>
              <Filter size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No {selectedFilter} investments</Text>
              <Text style={styles.emptySubtitle}>
                Try selecting a different filter or add a new investment
              </Text>
            </View>
          )}

          {investments.length === 0 && (
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
        {investments.length > 0 && (
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Investment Tip</Text>
            <Text style={styles.tipContent}>
              Diversify your portfolio across different asset classes to reduce risk and maximize returns!
            </Text>
          </View>
        )}

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
                  onPress={() => setNewInvestment(prev => ({ ...prev, type: type.id as any }))}
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
  emptyFilterState: {
    alignItems: 'center',
    paddingVertical: 32,
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