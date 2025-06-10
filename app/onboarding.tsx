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
import { ChevronRight, Target, DollarSign, TrendingUp, Smartphone } from 'lucide-react-native';

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
      id: 'mobile',
      message: "Let's get started! What's your mobile number? 📱",
      type: 'mobile',
      placeholder: 'Enter your mobile number...',
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
      id: 'income',
      message: "Last question! What's your monthly income? (This stays private, obvs 🔒)",
      type: 'income',
      placeholder: 'Enter your monthly income in ₹...',
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

  const handleMobileSubmit = () => {
    if (!textInput.trim() || textInput.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number');
      return;
    }
    
    addUserMessage(textInput);
    setUserData(prev => ({ ...prev, mobile: textInput }));
    setTextInput('');
    
    // Move directly to next step without OTP verification
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      const nextFlow = onboardingFlow[currentStep + 1];
      addBotMessage(nextFlow.message, nextFlow.options);
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
  const isMobileInput = currentFlow?.type === 'mobile';
  const isIncomeInput = currentFlow?.type === 'income';
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