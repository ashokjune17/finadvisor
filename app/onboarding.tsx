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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { ChevronRight, Target, DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface RiskQuestion {
  question: string;
  answer: string;
}

interface UserData {
  name: string;
  dob: string;
  mobile: string;
  goals: string[];
  riskTolerance: string;
  income: string;
  socialStatus: string;
  pan: string;
  riskQuestions: RiskQuestion[];
}

interface OnboardingApiResponse {
  result: string;
  message?: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dob: '',
    mobile: phoneNumber || '',
    goals: [],
    riskTolerance: '',
    income: '',
    socialStatus: '',
    pan: '',
    riskQuestions: [],
  });
  const [fadeAnim] = useState(new Animated.Value(0));

  const onboardingFlow = [
    {
      id: 'welcome',
      message: "Hey there, money wizard 🪄 Ready to glow up your finances?",
      options: ["Let's do this! 🚀", "Tell me more first 🤔"],
    },
    {
      id: 'name',
      message: "Awesome! What should I call you? ✨",
      type: 'input',
      placeholder: 'Your name...',
    },
    {
      id: 'dob',
      message: "When's your birthday? 🎂 This helps me suggest the right investment timeline",
      type: 'dob',
      placeholder: 'YYYY-MM-DD (e.g., 1995-06-15)',
    },
    {
      id: 'pan',
      message: "What's your PAN number? 🆔 This is required for investment compliance",
      type: 'pan',
      placeholder: 'Enter your PAN number (e.g., ABCDE1234F)',
    },
    {
      id: 'income',
      message: "What's your monthly income? (This stays private, obvs 🔒)",
      type: 'income',
      placeholder: 'Enter your monthly income in ₹...',
    },
    {
      id: 'social_status',
      message: "What's your vibe right now? 💫 This helps me understand your financial priorities!",
      options: [
        "💃🕺 Single",
        "👰🤵 Married, no kids yet",
        "👨‍👩‍👧‍👦 Married with kids",
        "🧑‍👧 Single parent",
        "👵👴 Taking care of parents/elders"
      ],
    },
    {
      id: 'risk',
      message: "On a scale from chill 🧊 to full-send 🚀 — how comfy are you with taking risks?",
      options: [
        "Super chill - safety first 🧊",
        "Balanced - some ups and downs OK 🌊",
        "Let's go - I'm here for the ride 🚀",
      ],
    },
    {
      id: 'risk_1',
      message: "Let's say you invested ₹10,000 and it drops to ₹9,000. What would you do?",
      options: [
        "😨 Sell everything and exit",
        "😐 Hold and wait",
        "📈 Invest more while it's low",
      ],
    },
    {
      id: 'risk_2',
      message: "How important is it for you to have guaranteed returns?",
      options: [
        "Very important — I can't handle losses",
        "Somewhat important — I want balance",
        "Not important — I'm okay with risk for better gains",
      ],
    },
    {
      id: 'risk_3',
      message: "How would you feel if your investment value dropped 20% temporarily?",
      options: [
        "😬 Very stressed",
        "😐 A bit nervous",
        "😎 Chill, markets go up and down",
      ],
    },
    {
      id: 'risk_4',
      message: "What's your primary investment goal?",
      options: [
        "Capital preservation 💼",
        "Wealth creation 🚀",
        "Maximize returns 💰",
      ],
    },
    {
      id: 'complete',
      message: "Amazing! 🎉 I'm creating your personalized financial plan. Ready to see what your money can do?",
      type: 'completing',
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
    setLoading(false);
    
    // Add welcome message
    addBotMessage(onboardingFlow[0].message, onboardingFlow[0].options);
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

  const submitUserData = async (finalUserData: UserData) => {
    try {
      setLoading(true);
      
      const payload = {
        phone_number: phoneNumber, // Use the phone number from auth screen
        name: finalUserData.name,
        dob: finalUserData.dob,
        marital_status: finalUserData.socialStatus,
        income: parseInt(finalUserData.income),
        pan: finalUserData.pan.toUpperCase(),
        risk_questions: {
          items: finalUserData.riskQuestions
        }
      };

      console.log('🚀 Submitting payload:', payload);

      const response = await fetch('https://fin-advisor-ashokkumar5.replit.app/user_onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response status:', response.status);

      const responseText = await response.text();
      console.log('📡 Raw response:', responseText);

      if (response.ok) {
        let data: OnboardingApiResponse;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.log('⚠️ Response is not JSON, treating as success');
          data = { result: 'Success' };
        }
        
        console.log('✅ User onboarded successfully:', data);
        
        // Check the result value to determine next action
        if (data.result === 'Risk') {
          // User needs to go to home tab for additional setup
          console.log('🏠 Redirecting to home tab for additional setup');
          
          setTimeout(() => {
            addBotMessage("🎉 Great! Your profile is set up. Let's get you started with your financial journey! 💪✨");
            
            setTimeout(() => {
              // Navigate to home tab instead of main tabs
              router.replace('/(tabs)');
            }, 2000);
          }, 1000);
        } else {
          // Standard success flow
          setTimeout(() => {
            addBotMessage("🎉 Welcome aboard! Your financial journey starts now. Let's make your money work harder than you do! 💪✨");
            
            setTimeout(() => {
              router.replace('/(tabs)');
            }, 2000);
          }, 1000);
        }
      } else {
        console.error('❌ API Error - Status:', response.status);
        console.error('❌ API Error - Response:', responseText);
        
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
        } catch {
          errorMessage = `Server error: ${response.status} - ${responseText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Complete error details:', error);
      
      let userFriendlyMessage = 'Something went wrong while setting up your account.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error instanceof Error) {
        userFriendlyMessage = error.message;
      }
      
      Alert.alert(
        'Oops!', 
        userFriendlyMessage + '\n\nWould you like to try again or skip for now?',
        [
          { text: 'Try Again', onPress: () => setCurrentStep(currentStep - 1) },
          { text: 'Skip for now', onPress: () => router.replace('/(tabs)') }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    addUserMessage(option);
    
    const currentFlow = onboardingFlow[currentStep];
    
    // Update user data based on current step
    if (currentFlow.id === 'goals') {
      const currentGoals = userData.goals.includes(option) 
        ? userData.goals.filter(g => g !== option)
        : [...userData.goals, option];
      setUserData(prev => ({ ...prev, goals: currentGoals }));
      
      // Don't advance immediately for multi-select
      return;
    } else if (currentFlow.id === 'risk') {
      const updatedUserData = { 
        ...userData, 
        riskTolerance: option,
        riskQuestions: [...userData.riskQuestions, {
          question: currentFlow.message,
          answer: option
        }]
      };
      setUserData(updatedUserData);
    } else if (currentFlow.id === 'social_status') {
      const updatedUserData = { ...userData, socialStatus: option };
      setUserData(updatedUserData);
    } else if (currentFlow.id.startsWith('risk_')) {
      // Add risk question and answer to the array
      const updatedUserData = {
        ...userData,
        riskQuestions: [...userData.riskQuestions, {
          question: currentFlow.message,
          answer: option
        }]
      };
      setUserData(updatedUserData);
      
      // If this is the last risk question (risk_4), we need to handle completion specially
      if (currentFlow.id === 'risk_4') {
        setTimeout(() => {
          if (currentStep < onboardingFlow.length - 1) {
            setCurrentStep(prev => prev + 1);
            const nextFlow = onboardingFlow[currentStep + 1];
            
            if (nextFlow.type === 'completing') {
              // Start the completion process with the updated user data
              addBotMessage(nextFlow.message);
              submitUserData(updatedUserData);
            } else {
              addBotMessage(nextFlow.message, nextFlow.options);
            }
          }
        }, 1000);
        return;
      }
    }
    
    // Move to next step for all other cases
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        
        if (nextFlow.type === 'completing') {
          // Start the completion process
          addBotMessage(nextFlow.message);
          submitUserData(userData);
        } else {
          addBotMessage(nextFlow.message, nextFlow.options);
        }
      }
    }, 1000);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    addUserMessage(textInput);
    const currentFlow = onboardingFlow[currentStep];
    
    if (currentFlow.id === 'name') {
      setUserData(prev => ({ ...prev, name: textInput }));
    }
    
    setTextInput('');
    
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }
    }, 1000);
  };

  const handleDobSubmit = () => {
    // Validate DOB format (YYYY-MM-DD)
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!textInput.trim() || !dobRegex.test(textInput)) {
      Alert.alert('Invalid Date', 'Please enter date in YYYY-MM-DD format (e.g., 1995-06-15)');
      return;
    }
    
    // Validate if it's a valid date
    const date = new Date(textInput);
    const today = new Date();
    if (isNaN(date.getTime()) || date >= today) {
      Alert.alert('Invalid Date', 'Please enter a valid birth date');
      return;
    }
    
    addUserMessage(textInput);
    setUserData(prev => ({ ...prev, dob: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }
    }, 1000);
  };

  const handlePanSubmit = () => {
    // Validate PAN format (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const panUpper = textInput.trim().toUpperCase();
    
    if (!panUpper || !panRegex.test(panUpper)) {
      Alert.alert('Invalid PAN', 'Please enter a valid PAN number (e.g., ABCDE1234F)');
      return;
    }
    
    addUserMessage(panUpper);
    setUserData(prev => ({ ...prev, pan: panUpper }));
    setTextInput('');
    
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }
    }, 1000);
  };

  const handleIncomeSubmit = () => {
    if (!textInput.trim() || isNaN(Number(textInput)) || Number(textInput) <= 0) {
      Alert.alert('Invalid Income', 'Please enter a valid income amount');
      return;
    }
    
    const formattedIncome = `₹${Number(textInput).toLocaleString('en-IN')}`;
    addUserMessage(formattedIncome);
    setUserData(prev => ({ ...prev, income: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }
    }, 1000);
  };

  const handleGoalsDone = () => {
    if (userData.goals.length > 0) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }, 500);
    }
  };

  const currentFlow = onboardingFlow[currentStep];
  const isTextInput = currentFlow?.type === 'input';
  const isIncomeInput = currentFlow?.type === 'income';
  const isDobInput = currentFlow?.type === 'dob';
  const isPanInput = currentFlow?.type === 'pan';
  const isMultiSelect = currentFlow?.multiSelect;
  const isCompleting = currentFlow?.type === 'completing';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[Colors.accent, Colors.primary]}
                style={[styles.progressFill, { width: `${((currentStep + 1) / onboardingFlow.length) * 100}%` }]}
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
            
            {/* Loading indicator for completion */}
            {loading && isCompleting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.surface} />
                <Text style={styles.loadingText}>Setting up your account...</Text>
              </View>
            )}
            
            {/* Options */}
            {currentFlow?.options && !loading && (
              <View style={styles.optionsContainer}>
                {currentFlow.options.map((option, index) => (
                  <TouchableOpacity
                    key={`option-${currentStep}-${index}-${option}`}
                    style={[
                      styles.optionChip,
                      isMultiSelect && userData.goals.includes(option) && styles.selectedChip
                    ]}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={[
                      styles.optionText,
                      isMultiSelect && userData.goals.includes(option) && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                {isMultiSelect && userData.goals.length > 0 && (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleGoalsDone}
                  >
                    <Text style={styles.doneButtonText}>Done ✨</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>

          {/* Text input */}
          {isTextInput && (
            <View style={styles.inputContainer}>
              <TextInput
                value={textInput}
                onChangeText={setTextInput}
                placeholder={currentFlow.placeholder}
                style={styles.textInput}
                onSubmitEditing={handleTextSubmit}
                returnKeyType="send"
                placeholderTextColor={Colors.textMuted}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleTextSubmit}
              >
                <ChevronRight size={20} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          )}

          {/* DOB input */}
          {isDobInput && (
            <View style={styles.inputContainer}>
              <View style={styles.dobInputContainer}>
                <Calendar size={20} color={Colors.textMuted} />
                <TextInput
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={currentFlow.placeholder}
                  style={styles.dobInput}
                  onSubmitEditing={handleDobSubmit}
                  returnKeyType="send"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={10}
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleDobSubmit}
              >
                <ChevronRight size={20} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          )}

          {/* PAN input */}
          {isPanInput && (
            <View style={styles.inputContainer}>
              <View style={styles.panInputContainer}>
                <CreditCard size={20} color={Colors.textMuted} />
                <TextInput
                  value={textInput}
                  onChangeText={(text) => setTextInput(text.toUpperCase())}
                  placeholder={currentFlow.placeholder}
                  style={styles.panInput}
                  onSubmitEditing={handlePanSubmit}
                  returnKeyType="send"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={10}
                  autoCapitalize="characters"
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handlePanSubmit}
              >
                <ChevronRight size={20} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          )}

          {/* Income input */}
          {isIncomeInput && (
            <View style={styles.inputContainer}>
              <View style={styles.incomeInputContainer}>
                <DollarSign size={20} color={Colors.textMuted} />
                <TextInput
                  value={textInput}
                  onChangeText={(text) => {
                    // Only allow numbers
                    const numericText = text.replace(/[^0-9]/g, '');
                    setTextInput(numericText);
                  }}
                  placeholder={currentFlow.placeholder}
                  style={styles.incomeInput}
                  onSubmitEditing={handleIncomeSubmit}
                  returnKeyType="send"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleIncomeSubmit}
              >
                <ChevronRight size={20} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
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
    paddingVertical: 24,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
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
  },
  botMessageText: {
    backgroundColor: Colors.surface,
    color: Colors.textDark,
  },
  userMessageText: {
    backgroundColor: Colors.accent,
    color: Colors.surface,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 16,
  },
  loadingText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
  },
  optionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  optionChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Shadows.small,
  },
  selectedChip: {
    backgroundColor: Colors.accent,
  },
  optionText: {
    ...Typography.bodyMedium,
    color: Colors.textDark,
  },
  selectedOptionText: {
    color: Colors.surface,
  },
  doneButton: {
    alignSelf: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  doneButtonText: {
    ...Typography.bodyBold,
    color: Colors.surface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  dobInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  dobInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
  },
  panInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  panInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
  },
  incomeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  incomeInput: {
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
});