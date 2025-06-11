import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  ChevronRight, 
  Target, 
  DollarSign, 
  Calendar,
  PiggyBank,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Star
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface GoalData {
  name: string;
  target_amount: string;
  target_date: string;
  amount_saved: string;
}

interface FundRecommendation {
  fund_name: string;
  sip: number;
}

interface FundRecommendationResponse {
  goal_id: number;
  recommendation: FundRecommendation[];
}

interface CreateGoalResponse {
  result: string;
  Message: string;
  Goal_ID: number;
}

export default function CreateGoalScreen() {
  const router = useRouter();
  const { phoneNumber } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [goalData, setGoalData] = useState<GoalData>({
    name: '',
    target_amount: '',
    target_date: '',
    amount_saved: '',
  });
  const [suggestedGoals, setSuggestedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fundRecommendations, setFundRecommendations] = useState<FundRecommendation[]>([]);
  const [selectedFund, setSelectedFund] = useState<FundRecommendation | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [goalId, setGoalId] = useState<number | null>(null);

  const chatFlow = [
    {
      id: 'welcome',
      message: "Hey there! 🎯 I'm here to help you create your next financial goal. Let's make your dreams happen! ✨",
      type: 'welcome',
    },
    {
      id: 'goal_selection',
      message: "What goal would you like to work towards? You can pick from these popular ones or tell me your own! 💭",
      type: 'goal_selection',
    },
    {
      id: 'target_amount',
      message: "Awesome choice! 🚀 How much money do you need to reach this goal?",
      type: 'amount_input',
      placeholder: 'Enter target amount in ₹...',
    },
    {
      id: 'target_date',
      message: "Perfect! 📅 When would you like to achieve this goal?",
      type: 'date_input',
      placeholder: 'e.g., 12/12/2025 or Dec 2025',
    },
    {
      id: 'amount_saved',
      message: "Great! 💰 Do you already have some money saved for this goal?",
      type: 'savings_input',
      placeholder: 'Enter amount already saved in ₹... (or leave empty for 0)',
    },
    {
      id: 'creating',
      message: "Amazing! 🎉 I'm creating your goal now. This is going to be epic!",
      type: 'creating',
    },
  ];

  useEffect(() => {
    // Initialize with welcome message when component mounts
    initializeChat();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  const initializeChat = () => {
    // Clear all state and start fresh
    setCurrentStep(0);
    setMessages([]);
    setTextInput('');
    setGoalData({
      name: '',
      target_amount: '',
      target_date: '',
      amount_saved: '',
    });
    setLoading(false);
    setShowRecommendations(false);
    setFundRecommendations([]);
    setSelectedFund(null);
    setGoalId(null);
    
    // Load initial data
    fetchGoalSuggestions();
    
    // Add welcome message
    addBotMessage(chatFlow[0].message);
  };

  const fetchGoalSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fin-advisor-ashokkumar5.replit.app/finadvisor/goal_suggesstion');
      const data = await response.json();
      setSuggestedGoals(data.goals || []);
    } catch (error) {
      console.error('Error fetching goal suggestions:', error);
      // Fallback suggestions if API fails
      setSuggestedGoals([
        "Retirement",
        "Emergency fund", 
        "Dream vacation",
        "First Home",
        "Dream car"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFundRecommendations = async (goalId: number) => {
    try {
      setLoading(true);
      const response = await fetch('https://fin-advisor-ashokkumar5.replit.app/fund_recommendation', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: FundRecommendationResponse = await response.json();
        console.log('📈 Fund recommendations received:', data);
        
        if (data.recommendation && data.recommendation.length > 0) {
          setFundRecommendations(data.recommendation);
          setGoalId(goalId);
          setShowRecommendations(true);
          
          addBotMessage("🎯 Perfect! Based on your goal, I've found some great investment options for you. Choose the one that feels right!");
        } else {
          throw new Error('No recommendations available');
        }
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('❌ Error fetching fund recommendations:', error);
      addBotMessage("🎉 Your goal has been created successfully! You can view and manage it in the Goals tab. Let's go crush this goal! 💪");
      
      setTimeout(() => {
        router.back();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const addBotMessage = (content: string, options?: string[]) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}-${Math.random()}`,
      type: 'bot',
      content,
      options,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleGoalSelection = (goal: string) => {
    addUserMessage(goal);
    setGoalData(prev => ({ ...prev, name: goal }));
    
    setTimeout(() => {
      setCurrentStep(2); // Move to target amount
      addBotMessage(chatFlow[2].message);
    }, 1000);
  };

  const handleCustomGoal = () => {
    if (!textInput.trim()) {
      Alert.alert('Please enter a goal', 'Tell me what you\'d like to save for!');
      return;
    }
    
    addUserMessage(textInput);
    setGoalData(prev => ({ ...prev, name: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      setCurrentStep(2); // Move to target amount
      addBotMessage(chatFlow[2].message);
    }, 1000);
  };

  const handleAmountInput = () => {
    if (!textInput.trim() || isNaN(Number(textInput)) || Number(textInput) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    const formattedAmount = `₹${Number(textInput).toLocaleString('en-IN')}`;
    addUserMessage(formattedAmount);
    setGoalData(prev => ({ ...prev, target_amount: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      setCurrentStep(3); // Move to target date
      addBotMessage(chatFlow[3].message);
    }, 1000);
  };

  const handleDateInput = () => {
    if (!textInput.trim()) {
      Alert.alert('Please enter a date', 'When would you like to achieve this goal?');
      return;
    }
    
    addUserMessage(textInput);
    setGoalData(prev => ({ ...prev, target_date: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      setCurrentStep(4); // Move to amount saved
      addBotMessage(chatFlow[4].message);
    }, 1000);
  };

  const handleSavingsInput = () => {
    const amount = textInput.trim() || '0';
    
    if (isNaN(Number(amount)) || Number(amount) < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount (or leave empty for 0)');
      return;
    }
    
    const formattedAmount = Number(amount) > 0 
      ? `₹${Number(amount).toLocaleString('en-IN')}` 
      : 'Starting fresh! ₹0';
    
    addUserMessage(formattedAmount);
    setGoalData(prev => ({ ...prev, amount_saved: amount }));
    setTextInput('');
    
    setTimeout(() => {
      setCurrentStep(5); // Move to creating
      addBotMessage(chatFlow[5].message);
      createGoal();
    }, 1000);
  };

  const createGoal = async () => {
    try {
      setLoading(true);
      
      if (!phoneNumber) {
        throw new Error('User phone number not found. Please complete authentication first.');
      }
      
      // Ensure all numeric values are properly converted
      const targetAmount = parseInt(goalData.target_amount);
      const currentAmount = goalData.amount_saved ? parseInt(goalData.amount_saved) : 0;
      
      // Validate numeric conversions
      if (isNaN(targetAmount) || targetAmount <= 0) {
        throw new Error('Invalid target amount');
      }
      
      if (isNaN(currentAmount) || currentAmount < 0) {
        throw new Error('Invalid current amount');
      }
      
      const payload = {
        phone_number: phoneNumber,
        goal_name: goalData.name,
        target_amount: targetAmount,
        target_date: goalData.target_date,
        current_amount: currentAmount,
      };
      
      console.log('🚀 Creating goal with payload:', payload);
      
      const response = await fetch('https://fin-advisor-ashokkumar5.replit.app/create_goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('✅ Goal created successfully:', responseText);
        
        try {
          const data: CreateGoalResponse = JSON.parse(responseText);
          
          if (data.result === 'Success' && data.Goal_ID) {
            console.log('🎯 Goal created with ID:', data.Goal_ID);
            // Fetch fund recommendations
            await fetchFundRecommendations(data.Goal_ID);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.log('⚠️ Response parsing failed, but goal likely created');
          addBotMessage("🎉 Your goal has been created successfully! You can view and manage it in the Goals tab. Let's go crush this goal! 💪");
          
          setTimeout(() => {
            router.back();
          }, 2000);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to create goal: ${response.status}`);
      }
    } catch (error) {
      console.error('💥 Error creating goal:', error);
      Alert.alert(
        'Oops!', 
        'Something went wrong while creating your goal. Please try again.',
        [
          { text: 'Try Again', onPress: () => setCurrentStep(0) },
          { text: 'Cancel', onPress: () => router.back() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFundSelection = (fund: FundRecommendation) => {
    setSelectedFund(fund);
  };

  const handleStartInvesting = () => {
    if (!selectedFund) {
      Alert.alert('Please select a fund', 'Choose one of the recommended funds to proceed.');
      return;
    }

    addBotMessage(`Excellent choice! 🎉 You've selected ${selectedFund.fund_name} with a SIP of ₹${selectedFund.sip.toLocaleString('en-IN')}. Your investment journey begins now! 🚀`);
    
    setTimeout(() => {
      addBotMessage("Your goal and investment plan are all set up! You can track your progress in the Goals tab. Time to make your money work for you! 💪✨");
      
      setTimeout(() => {
        router.back();
      }, 2000);
    }, 1500);
  };

  const moveToGoalSelection = () => {
    setTimeout(() => {
      setCurrentStep(1);
      addBotMessage(chatFlow[1].message, suggestedGoals);
    }, 1000);
  };

  const currentFlow = chatFlow[currentStep];
  const isAmountInput = currentFlow?.type === 'amount_input';
  const isDateInput = currentFlow?.type === 'date_input';
  const isSavingsInput = currentFlow?.type === 'savings_input';
  const isGoalSelection = currentFlow?.type === 'goal_selection';
  const isWelcome = currentFlow?.type === 'welcome';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Goal</Text>
          <View style={styles.headerRight}>
            <Target size={24} color={Colors.surface} />
          </View>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[Colors.accent, Colors.surface]}
              style={[styles.progressFill, { width: `${(currentStep / (chatFlow.length - 1)) * 100}%` }]}
            />
          </View>
        </View>

        {/* Chat messages */}
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <Animated.View
              key={message.id}
              style={[
                styles.messageContainer,
                message.type === 'user' ? styles.userMessage : styles.botMessage,
                { opacity: fadeAnim }
              ]}
            >
              <Text style={[
                styles.messageText,
                message.type === 'user' ? styles.userMessageText : styles.botMessageText
              ]}>
                {message.content}
              </Text>
            </Animated.View>
          ))}
          
          {/* Welcome action */}
          {isWelcome && (
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={moveToGoalSelection}
              >
                <Sparkles size={20} color={Colors.surface} />
                <Text style={styles.primaryButtonText}>Let's Create a Goal! ✨</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Goal selection options */}
          {isGoalSelection && (
            <View style={styles.optionsContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.surface} />
                  <Text style={styles.loadingText}>Loading suggestions...</Text>
                </View>
              ) : (
                <>
                  {suggestedGoals.map((goal, index) => (
                    <TouchableOpacity
                      key={`goal-${index}`}
                      style={styles.optionChip}
                      onPress={() => handleGoalSelection(goal)}
                    >
                      <Text style={styles.optionText}>{goal}</Text>
                    </TouchableOpacity>
                  ))}
                  
                  <View style={styles.customGoalContainer}>
                    <Text style={styles.customGoalLabel}>Or tell me your own goal:</Text>
                    <View style={styles.customGoalInput}>
                      <TextInput
                        value={textInput}
                        onChangeText={setTextInput}
                        placeholder="Type your goal here..."
                        style={styles.textInput}
                        onSubmitEditing={handleCustomGoal}
                        returnKeyType="send"
                        placeholderTextColor={Colors.textMuted}
                      />
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleCustomGoal}
                      >
                        <ChevronRight size={20} color={Colors.surface} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Fund Recommendations */}
          {showRecommendations && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>💡 Recommended Investment Options</Text>
              <Text style={styles.recommendationsSubtitle}>
                Based on your goal, here are the best funds to help you achieve it:
              </Text>
              
              <View style={styles.fundsContainer}>
                {fundRecommendations.map((fund, index) => (
                  <TouchableOpacity
                    key={`fund-${index}`}
                    style={[
                      styles.fundCard,
                      selectedFund?.fund_name === fund.fund_name && styles.selectedFundCard
                    ]}
                    onPress={() => handleFundSelection(fund)}
                  >
                    <View style={styles.fundHeader}>
                      <View style={styles.fundIconContainer}>
                        <TrendingUp size={24} color={Colors.primary} />
                      </View>
                      <View style={styles.fundInfo}>
                        <Text style={styles.fundName}>{fund.fund_name}</Text>
                        <Text style={styles.fundSip}>
                          Recommended SIP: ₹{fund.sip.toLocaleString('en-IN')}/month
                        </Text>
                      </View>
                      {selectedFund?.fund_name === fund.fund_name && (
                        <CheckCircle size={24} color={Colors.success} />
                      )}
                    </View>
                    
                    <View style={styles.fundFeatures}>
                      <View style={styles.fundFeature}>
                        <Star size={16} color={Colors.warning} />
                        <Text style={styles.fundFeatureText}>Professional Management</Text>
                      </View>
                      <View style={styles.fundFeature}>
                        <Target size={16} color={Colors.primary} />
                        <Text style={styles.fundFeatureText}>Goal-Aligned Strategy</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedFund && (
                <TouchableOpacity
                  style={styles.startInvestingButton}
                  onPress={handleStartInvesting}
                >
                  <TrendingUp size={20} color={Colors.surface} />
                  <Text style={styles.startInvestingButtonText}>Start Investing</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {loading && currentStep === 5 && !showRecommendations && (
            <View style={styles.creatingContainer}>
              <ActivityIndicator size="large" color={Colors.surface} />
              <Text style={styles.creatingText}>Creating your goal...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input containers */}
        {isAmountInput && (
          <View style={styles.inputContainer}>
            <View style={styles.amountInputContainer}>
              <DollarSign size={20} color={Colors.textMuted} />
              <TextInput
                value={textInput}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setTextInput(numericText);
                }}
                placeholder={currentFlow.placeholder}
                style={styles.amountInput}
                onSubmitEditing={handleAmountInput}
                returnKeyType="send"
                keyboardType="numeric"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleAmountInput}
            >
              <ChevronRight size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        )}

        {isDateInput && (
          <View style={styles.inputContainer}>
            <View style={styles.dateInputContainer}>
              <Calendar size={20} color={Colors.textMuted} />
              <TextInput
                value={textInput}
                onChangeText={setTextInput}
                placeholder={currentFlow.placeholder}
                style={styles.dateInput}
                onSubmitEditing={handleDateInput}
                returnKeyType="send"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleDateInput}
            >
              <ChevronRight size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        )}

        {isSavingsInput && (
          <View style={styles.inputContainer}>
            <View style={styles.savingsInputContainer}>
              <PiggyBank size={20} color={Colors.textMuted} />
              <TextInput
                value={textInput}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setTextInput(numericText);
                }}
                placeholder={currentFlow.placeholder}
                style={styles.savingsInput}
                onSubmitEditing={handleSavingsInput}
                returnKeyType="send"
                keyboardType="numeric"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSavingsInput}
            >
              <ChevronRight size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.surface,
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '85%',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageText: {
    ...Typography.body,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    lineHeight: 22,
  },
  botMessageText: {
    backgroundColor: Colors.surface,
    color: Colors.textDark,
  },
  userMessageText: {
    backgroundColor: Colors.accent,
    color: Colors.surface,
  },
  actionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    ...Shadows.medium,
  },
  primaryButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  optionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.surface,
  },
  optionChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    ...Shadows.small,
  },
  optionText: {
    ...Typography.bodyMedium,
    color: Colors.textDark,
  },
  customGoalContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
  },
  customGoalLabel: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 12,
  },
  customGoalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Typography.body,
    color: Colors.textDark,
  },
  recommendationsContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  recommendationsTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 8,
    textAlign: 'center',
  },
  recommendationsSubtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  fundsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  fundCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.small,
  },
  selectedFundCard: {
    borderColor: Colors.success,
    backgroundColor: '#f0f9ff',
  },
  fundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fundInfo: {
    flex: 1,
  },
  fundName: {
    ...Typography.bodySemiBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  fundSip: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  fundFeatures: {
    gap: 8,
  },
  fundFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fundFeatureText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  startInvestingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    ...Shadows.medium,
  },
  startInvestingButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  amountInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
  },
  savingsInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  savingsInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
  },
  sendButton: {
    backgroundColor: Colors.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  creatingText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
});