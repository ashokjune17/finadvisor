import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Fire,
  Target,
  DollarSign,
  Clock,
  Users,
  Star,
  Plus,
  X,
  AlertTriangle,
  Rocket
} from 'lucide-react-native';

interface YOLOInvestment {
  id: string;
  name: string;
  symbol: string;
  type: 'Crypto' | 'Meme Stock' | 'IPO' | 'Startup' | 'NFT';
  currentPrice: number;
  change24h: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  riskLevel: 'High' | 'Extreme';
  hypeScore: number;
  socialMentions: number;
  description: string;
  image: string;
}

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  engagement: number;
  timeframe: string;
}

export default function YOLOVestScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<YOLOInvestment | null>(null);
  const [investAmount, setInvestAmount] = useState('');

  const yoloInvestments: YOLOInvestment[] = [
    {
      id: '1',
      name: 'Dogecoin',
      symbol: 'DOGE',
      type: 'Crypto',
      currentPrice: 0.08,
      change24h: 0.012,
      changePercent: 15.8,
      volume: '2.1B',
      marketCap: '11.2B',
      riskLevel: 'Extreme',
      hypeScore: 92,
      socialMentions: 45000,
      description: 'The meme coin that started it all. Much wow, very gains! 🐕',
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'GameStop',
      symbol: 'GME',
      type: 'Meme Stock',
      currentPrice: 18.45,
      change24h: -2.15,
      changePercent: -10.4,
      volume: '15.2M',
      marketCap: '5.8B',
      riskLevel: 'Extreme',
      hypeScore: 78,
      socialMentions: 28000,
      description: 'Diamond hands forever! 💎🙌 The original meme stock.',
      image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Shiba Inu',
      symbol: 'SHIB',
      type: 'Crypto',
      currentPrice: 0.000008,
      change24h: 0.000002,
      changePercent: 25.6,
      volume: '890M',
      marketCap: '4.7B',
      riskLevel: 'Extreme',
      hypeScore: 88,
      socialMentions: 38000,
      description: 'The Dogecoin killer! To the moon! 🚀🌙',
      image: 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      name: 'Tesla',
      symbol: 'TSLA',
      type: 'Meme Stock',
      currentPrice: 248.50,
      change24h: 12.30,
      changePercent: 5.2,
      volume: '45.8M',
      marketCap: '789B',
      riskLevel: 'High',
      hypeScore: 85,
      socialMentions: 52000,
      description: 'Elon\'s rocket ship to Mars! 🚀 Electric dreams and memes.',
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const trendingTopics: TrendingTopic[] = [
    {
      id: '1',
      title: 'AI Crypto Boom',
      description: 'AI tokens are exploding! ChatGPT meets blockchain 🤖⛓️',
      category: 'Crypto',
      engagement: 89000,
      timeframe: '2h ago',
    },
    {
      id: '2',
      title: 'Meme Stock Revival',
      description: 'Reddit is back at it! New meme stocks trending 📈',
      category: 'Stocks',
      engagement: 67000,
      timeframe: '4h ago',
    },
    {
      id: '3',
      title: 'NFT Comeback?',
      description: 'Digital art is heating up again. New collections dropping 🎨',
      category: 'NFT',
      engagement: 34000,
      timeframe: '6h ago',
    },
  ];

  const filterOptions = ['All', 'Crypto', 'Meme Stock', 'IPO', 'Startup'];

  const filteredInvestments = selectedFilter === 'All' 
    ? yoloInvestments 
    : yoloInvestments.filter(inv => inv.type === selectedFilter);

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const handleInvest = (investment: YOLOInvestment) => {
    setSelectedInvestment(investment);
    setShowInvestModal(true);
  };

  const handleInvestSubmit = () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid investment amount');
      return;
    }

    Alert.alert(
      'YOLO Investment! 🚀',
      `You're about to invest ₹${investAmount} in ${selectedInvestment?.name}!\n\nRemember: This is high-risk, high-reward territory. Only invest what you can afford to lose!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'YOLO IT! 🚀', 
          onPress: () => {
            setShowInvestModal(false);
            setInvestAmount('');
            Alert.alert('Investment Placed! 🎉', 'Your YOLO investment is now live. May the gains be with you! 💎🙌');
          }
        },
      ]
    );
  };

  const getRiskColor = (riskLevel: string) => {
    return riskLevel === 'Extreme' ? Colors.error : Colors.warning;
  };

  const getHypeColor = (score: number) => {
    if (score >= 90) return Colors.error;
    if (score >= 80) return Colors.warning;
    return Colors.accent;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>YOLOVest 🚀</Text>
            <Text style={styles.subtitle}>High risk, high reward. YOLO responsibly!</Text>
          </View>
          <View style={styles.headerBadge}>
            <Fire size={16} color={Colors.error} />
            <Text style={styles.headerBadgeText}>HOT</Text>
          </View>
        </View>

        {/* Warning Card */}
        <View style={styles.warningCard}>
          <AlertTriangle size={24} color={Colors.warning} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>⚠️ High-Risk Zone</Text>
            <Text style={styles.warningText}>
              These investments are extremely volatile. Only invest money you can afford to lose completely!
            </Text>
          </View>
        </View>

        {/* Portfolio Summary */}
        <LinearGradient
          colors={[Colors.error, '#FF6B6B']}
          style={styles.portfolioCard}
        >
          <Text style={styles.portfolioTitle}>YOLO Portfolio 💎</Text>
          <Text style={styles.portfolioValue}>₹45,000</Text>
          <View style={styles.portfolioStats}>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>24h Change</Text>
              <Text style={[styles.statValue, { color: Colors.surface }]}>+₹8,500</Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.statLabel}>Total Return</Text>
              <Text style={[styles.statValue, { color: Colors.surface }]}>+23.4%</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Trending Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.trendingCard}>
                <Text style={styles.trendingTitle}>{topic.title}</Text>
                <Text style={styles.trendingDescription}>{topic.description}</Text>
                <View style={styles.trendingFooter}>
                  <Text style={styles.trendingEngagement}>
                    🔥 {(topic.engagement / 1000).toFixed(0)}K
                  </Text>
                  <Text style={styles.trendingTime}>{topic.timeframe}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.selectedFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.selectedFilterText,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* YOLO Investments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOLO Picks 🎯</Text>
          
          {filteredInvestments.map((investment) => (
            <TouchableOpacity 
              key={investment.id} 
              style={styles.investmentCard}
              onPress={() => handleInvest(investment)}
            >
              <View style={styles.investmentHeader}>
                <Image source={{ uri: investment.image }} style={styles.investmentImage} />
                <View style={styles.investmentInfo}>
                  <View style={styles.investmentTitleRow}>
                    <Text style={styles.investmentName}>{investment.name}</Text>
                    <View style={[styles.riskBadge, { backgroundColor: getRiskColor(investment.riskLevel) }]}>
                      <Text style={styles.riskText}>{investment.riskLevel}</Text>
                    </View>
                  </View>
                  <Text style={styles.investmentSymbol}>{investment.symbol}</Text>
                  <Text style={styles.investmentDescription}>{investment.description}</Text>
                </View>
              </View>

              <View style={styles.investmentMetrics}>
                <View style={styles.priceSection}>
                  <Text style={styles.currentPrice}>{formatPrice(investment.currentPrice)}</Text>
                  <View style={styles.changeContainer}>
                    {investment.changePercent >= 0 ? (
                      <TrendingUp size={16} color={Colors.success} />
                    ) : (
                      <TrendingDown size={16} color={Colors.error} />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: investment.changePercent >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {formatChange(investment.changePercent)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsGrid}>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Hype Score</Text>
                    <View style={styles.hypeScore}>
                      <Text style={[styles.metricValue, { color: getHypeColor(investment.hypeScore) }]}>
                        {investment.hypeScore}
                      </Text>
                      <Fire size={12} color={getHypeColor(investment.hypeScore)} />
                    </View>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Social Buzz</Text>
                    <Text style={styles.metricValue}>
                      {(investment.socialMentions / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricLabel}>Volume</Text>
                    <Text style={styles.metricValue}>{investment.volume}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.yoloButton}
                onPress={() => handleInvest(investment)}
              >
                <Rocket size={16} color={Colors.surface} />
                <Text style={styles.yoloButtonText}>YOLO IT! 🚀</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>💡 Remember</Text>
          <Text style={styles.disclaimerText}>
            YOLO investing is for entertainment and high-risk tolerance only. These are speculative investments that can result in total loss. Always do your own research and never invest more than you can afford to lose! 🎲
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Investment Modal */}
      <Modal
        visible={showInvestModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>YOLO Investment 🚀</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInvestModal(false)}
            >
              <X size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedInvestment && (
              <>
                <View style={styles.modalInvestmentInfo}>
                  <Image source={{ uri: selectedInvestment.image }} style={styles.modalImage} />
                  <Text style={styles.modalInvestmentName}>{selectedInvestment.name}</Text>
                  <Text style={styles.modalInvestmentPrice}>
                    {formatPrice(selectedInvestment.currentPrice)}
                  </Text>
                  <View style={[styles.modalRiskBadge, { backgroundColor: getRiskColor(selectedInvestment.riskLevel) }]}>
                    <AlertTriangle size={16} color={Colors.surface} />
                    <Text style={styles.modalRiskText}>{selectedInvestment.riskLevel} Risk</Text>
                  </View>
                </View>

                <View style={styles.investmentForm}>
                  <Text style={styles.inputLabel}>Investment Amount (₹)</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={investAmount}
                    onChangeText={setInvestAmount}
                    placeholder="How much are you willing to YOLO?"
                    keyboardType="numeric"
                    placeholderTextColor={Colors.textMuted}
                  />

                  <View style={styles.quickAmounts}>
                    {['1000', '5000', '10000', '25000'].map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        style={styles.quickAmountChip}
                        onPress={() => setInvestAmount(amount)}
                      >
                        <Text style={styles.quickAmountText}>₹{amount}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.riskWarning}>
                    <AlertTriangle size={20} color={Colors.warning} />
                    <Text style={styles.riskWarningText}>
                      High-risk investment! You could lose your entire investment. Only invest what you can afford to lose completely.
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.investButton} onPress={handleInvestSubmit}>
                    <Text style={styles.investButtonText}>YOLO IT! 🚀💎</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    ...Shadows.small,
  },
  headerBadgeText: {
    ...Typography.captionMedium,
    color: Colors.error,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    ...Typography.bodySemiBold,
    color: '#856404',
    marginBottom: 4,
  },
  warningText: {
    ...Typography.caption,
    color: '#856404',
    lineHeight: 18,
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
    marginBottom: 16,
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginBottom: 16,
  },
  trendingCard: {
    backgroundColor: Colors.surface,
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    ...Shadows.small,
  },
  trendingTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  trendingDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 12,
    lineHeight: 18,
  },
  trendingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingEngagement: {
    ...Typography.small,
    color: Colors.error,
    fontWeight: '600',
  },
  trendingTime: {
    ...Typography.small,
    color: Colors.textMuted,
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
  investmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Shadows.small,
  },
  investmentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  investmentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  investmentName: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    ...Typography.small,
    color: Colors.surface,
    fontWeight: '600',
  },
  investmentSymbol: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  investmentDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  investmentMetrics: {
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    ...Typography.h3,
    color: Colors.textDark,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    ...Typography.bodySemiBold,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    ...Typography.small,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  metricValue: {
    ...Typography.captionMedium,
    color: Colors.textDark,
  },
  hypeScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yoloButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  yoloButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  disclaimerCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    ...Shadows.medium,
  },
  disclaimerTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  disclaimerText: {
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
  modalInvestmentInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  modalInvestmentName: {
    ...Typography.h2,
    color: Colors.textDark,
    marginBottom: 8,
  },
  modalInvestmentPrice: {
    ...Typography.h3,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  modalRiskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  modalRiskText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  investmentForm: {
    flex: 1,
  },
  inputLabel: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Typography.body,
    color: Colors.textDark,
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickAmountChip: {
    flex: 1,
    backgroundColor: Colors.border,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    ...Typography.captionMedium,
    color: Colors.textDark,
  },
  riskWarning: {
    flexDirection: 'row',
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  riskWarningText: {
    ...Typography.caption,
    color: '#856404',
    marginLeft: 12,
    lineHeight: 18,
    flex: 1,
  },
  investButton: {
    backgroundColor: Colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  investButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
});