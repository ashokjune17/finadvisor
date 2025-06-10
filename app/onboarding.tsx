import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { ChevronRight, Target, DollarSign, TrendingUp, Smartphone, Shield } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface UserData {
  name: string;
  age: string;
  mobile: string;
  goals: string[];
  riskTolerance: string;
  income: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    mobile: '',
    goals: [],
    riskTolerance: '',
    income: '',
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
      id: 'age',
      message: "Nice to meet you! How old are you? This helps me suggest the right investment timeline 📊",
      type: 'input',
      placeholder: 'Your age...',
    },
    {
      id: 'mobile',
      message: "Let's secure your account! What's your mobile number? 📱",
      type: 'mobile',
      placeholder: 'Enter your mobile number...',
    },
    {
      id: 'otp',
      message: "Perfect! I've sent a verification code to your number. Enter it below to continue 🔐",
      type: 'otp',
      placeholder: 'Enter 6-digit OTP...',
    },
    {
      id: 'goals',
      message: "What are you saving for? Dream vacay 🌴, new ride 🚗, your future self 🧘‍♀️?",
      options: [
        "Emergency Fund 🛡️",
        "Dream Vacation 🌴",
        "Buy a House 🏠",
        "New Car 🚗",
        "Retirement 🧘‍♀️",
        "Start a Business 💼",
      ],
      multiSelect: true,
    },    
    {
      id: 'income',
      message: "Last question! What's your monthly income range? (This stays private, obvs 🔒)",
      options: [
        "Under ₹25K 💫",
        "₹25K - ₹50K 💼",
        "₹50K - ₹1L 🌟",
        "Above ₹1L 🚀",
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
      id: 'risk_5',
      message: "How long can you stay invested without needing this money?",
      options: [
        "Less than 1 year ⏱️",
        "1–3 years 🧭",
        "5+ years 🌱",
      ],
    },
    {
      id: 'risk_6',
      message: "Do you track or follow stock market news or finance influencers?",
      options: [
        "Not at all 🙈",
        "Sometimes on Instagram/Twitter 📱",
        "Yes, I read/watch regularly 📊",
      ],
    },
    {
      id: 'risk_7',
      message: "What percentage of your income are you comfortable investing monthly?",
      options: [
        "<10% 🧃",
        "10–30% ☕",
        "30% 🔋",
      ],
    },
    {
      id: 'risk_8',
      message: "Would you try crypto or startup investing?",
      options: [
        "No way! Too risky 😵",
        "Maybe a small amount 💡",
        "Yes! I love high-risk, high-reward bets 🔥",
      ],
    },
    {
      id: 'risk_9',
      message: "What kind of investments have you made so far?",
      options: [
        "Not at all 🙈",
        "FDs, LICs, RDs only",
        "Mutual Funds or Gold",
        "Stocks, Crypto, Startups",
      ],
    },
    {
      id: 'risk_10',
      message: "If your friend made big money from a risky investment, what would you do?",
      options: [
        "Stay calm, not my style 😇",
        "Feel tempted but cautious 🤔",
        "Jump in, FOMO is real 🤑",
      ],
    },
    {
      id: 'complete',
      message: "Amazing! 🎉 I'm creating your personalized financial plan. Ready to see what your money can do?",
      options: ["Show me my plan! ✨"],
    },
  ];

  useEffect(() => {
    // Add initial welcome message
    addBotMessage(onboardingFlow[0].message, onboardingFlow[0].options);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setResendTimer(30);
    
    // In a real app, you would send this OTP via SMS
    // For demo purposes, we'll show it in an alert
    Alert.alert('OTP Sent', `Your verification code is: ${otp}\n\n(In production, this would be sent via SMS)`, [
      { text: 'OK' }
    ]);
  };

  const verifyOtp = () => {
    if (otpInput === generatedOtp) {
      setOtpVerified(true);
      addUserMessage(`✅ Verified: ${otpInput}`);
      addBotMessage("Great! Your number is verified. Let's continue! 🎉");
      
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      }, 1500);
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct verification code.');
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
      setUserData(prev => ({ ...prev, riskTolerance: option }));
    } else if (currentFlow.id === 'income') {
      setUserData(prev => ({ ...prev, income: option }));
    }
    
    // Move to next step
    setTimeout(() => {
      if (currentStep < onboardingFlow.length - 1) {
        setCurrentStep(prev => prev + 1);
        const nextFlow = onboardingFlow[currentStep + 1];
        addBotMessage(nextFlow.message, nextFlow.options);
      } else {
        // Complete onboarding
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      }
    }, 1000);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    
    addUserMessage(textInput);
    const currentFlow = onboardingFlow[currentStep];
    
    if (currentFlow.id === 'name') {
      setUserData(prev => ({ ...prev, name: textInput }));
    } else if (currentFlow.id === 'age') {
      setUserData(prev => ({ ...prev, age: textInput }));
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

  const handleMobileSubmit = () => {
    if (!textInput.trim() || textInput.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number');
      return;
    }
    
    addUserMessage(textInput);
    setUserData(prev => ({ ...prev, mobile: textInput }));
    setTextInput('');
    
    setTimeout(() => {
      sendOtp();
      setCurrentStep(prev => prev + 1);
      const nextFlow = onboardingFlow[currentStep + 1];
      addBotMessage(nextFlow.message);
    }, 1000);
  };

  const handleOtpSubmit = () => {
    if (otpInput.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit verification code');
      return;
    }
    verifyOtp();
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtp();
      setOtpInput('');
    }
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
  const isMobileInput = currentFlow?.type === 'mobile';
  const isOtpInput = currentFlow?.type === 'otp';
  const isMultiSelect = currentFlow?.multiSelect;

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
            
            {/* Options */}
            {currentFlow?.options && (
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

          {/* Mobile input */}
          {isMobileInput && (
            <View style={styles.inputContainer}>
              <View style={styles.mobileInputContainer}>
                <Smartphone size={20} color={Colors.textMuted} />
                <TextInput
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={currentFlow.placeholder}
                  style={styles.mobileInput}
                  onSubmitEditing={handleMobileSubmit}
                  returnKeyType="send"
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={10}
                />
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleMobileSubmit}
              >
                <ChevronRight size={20} color={Colors.surface} />
              </TouchableOpacity>
            </View>
          )}

          {/* OTP input */}
          {isOtpInput && (
            <View style={styles.otpContainer}>
              <View style={styles.otpInputContainer}>
                <Shield size={20} color={Colors.textMuted} />
                <TextInput
                  value={otpInput}
                  onChangeText={setOtpInput}
                  placeholder="Enter 6-digit OTP"
                  style={styles.otpInput}
                  onSubmitEditing={handleOtpSubmit}
                  returnKeyType="send"
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={6}
                />
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={handleOtpSubmit}
                >
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.resendButton, resendTimer > 0 && styles.disabledButton]}
                onPress={handleResendOtp}
                disabled={resendTimer > 0}
              >
                <Text style={[styles.resendButtonText, resendTimer > 0 && styles.disabledText]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </Text>
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
  mobileInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  mobileInput: {
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
  otpContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  otpInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
    textAlign: 'center',
    letterSpacing: 2,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  verifyButtonText: {
    ...Typography.captionMedium,
    color: Colors.surface,
  },
  resendButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resendButtonText: {
    ...Typography.captionMedium,
    color: Colors.surface,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    textDecorationLine: 'none',
  },
});