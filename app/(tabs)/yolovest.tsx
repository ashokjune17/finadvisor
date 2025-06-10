import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { 
  Zap, 
  Send, 
  MessageCircle, 
  Sparkles, 
  TrendingUp, 
  DollarSign,
  Brain,
  Lightbulb,
  Target,
  PiggyBank
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface QuickQuestion {
  id: string;
  question: string;
  icon: React.ReactNode;
  color: string;
}

export default function YOLOVestScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const quickQuestions: QuickQuestion[] = [
    {
      id: '1',
      question: 'How much should I save from my monthly income?',
      icon: <PiggyBank size={20} color={Colors.surface} />,
      color: Colors.primary,
    },
    {
      id: '2',
      question: 'What are the best investment options for beginners?',
      icon: <TrendingUp size={20} color={Colors.surface} />,
      color: Colors.accent,
    },
    {
      id: '3',
      question: 'How to create an emergency fund?',
      icon: <Target size={20} color={Colors.surface} />,
      color: Colors.success,
    },
    {
      id: '4',
      question: 'Should I invest in mutual funds or stocks?',
      icon: <DollarSign size={20} color={Colors.surface} />,
      color: Colors.warning,
    },
  ];

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      content: "Hey there, future millionaire! 💰✨ I'm your personal finance guru. Ask me anything about money, investments, savings, or financial planning. Let's make your money work as hard as you do! 🚀",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [messages]);

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}-${Math.random()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendQuery = async (query: string) => {
    if (!query.trim()) return;

    addUserMessage(query);
    setTextInput('');
    setLoading(true);

    try {
      const response = await fetch('https://127.0.0.1:8080/finadvisor/yolovest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: query,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns the response in a 'response' field
        const botResponse = data.response || data.message || "I received your question! Let me think about that... 🤔";
        
        setTimeout(() => {
          addBotMessage(botResponse);
        }, 1000);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending query:', error);
      setTimeout(() => {
        addBotMessage("Oops! I'm having trouble connecting right now. But here's what I think: " + getOfflineResponse(query));
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // Fallback responses when API is unavailable
  const getOfflineResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
      return "Great question! 💰 A good rule of thumb is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and investments. Start with at least 10-15% of your income if you're just beginning!";
    }
    
    if (lowerQuery.includes('invest') || lowerQuery.includes('investment')) {
      return "Smart thinking! 📈 For beginners, I'd recommend starting with SIPs in diversified mutual funds. They're less risky than individual stocks and perfect for building wealth over time. Start small and be consistent!";
    }
    
    if (lowerQuery.includes('emergency') || lowerQuery.includes('fund')) {
      return "Emergency funds are crucial! 🛡️ Aim for 6-12 months of expenses in a liquid savings account. This is your financial safety net for unexpected situations. Build it before investing in riskier assets!";
    }
    
    if (lowerQuery.includes('mutual fund') || lowerQuery.includes('stock')) {
      return "Both have their place! 🎯 Mutual funds are great for diversification and professional management, while stocks can offer higher returns but with more risk. For beginners, start with mutual funds and gradually learn about individual stocks!";
    }
    
    return "That's an interesting question! 🤔 While I can't give specific financial advice, I'd recommend consulting with a financial advisor for personalized guidance. In general, focus on building an emergency fund first, then start investing regularly in diversified instruments!";
  };

  const handleQuickQuestion = (question: string) => {
    sendQuery(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Zap size={24} color={Colors.surface} />
              </View>
              <View>
                <Text style={styles.title}>YOLOVest Chat 🚀</Text>
                <Text style={styles.subtitle}>Your AI Finance Guru</Text>
              </View>
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
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
                <View style={[
                  styles.messageBubble,
                  message.type === 'user' ? styles.userBubble : styles.botBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.type === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    message.type === 'user' ? styles.userMessageTime : styles.botMessageTime
                  ]}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </Animated.View>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Thinking...</Text>
                </View>
              </View>
            )}

            {/* Quick questions */}
            {messages.length === 1 && !loading && (
              <View style={styles.quickQuestionsContainer}>
                <Text style={styles.quickQuestionsTitle}>💡 Quick Questions to Get Started:</Text>
                <View style={styles.quickQuestions}>
                  {quickQuestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.quickQuestionChip, { backgroundColor: item.color }]}
                      onPress={() => handleQuickQuestion(item.question)}
                    >
                      {item.icon}
                      <Text style={styles.quickQuestionText}>{item.question}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={textInput}
                onChangeText={setTextInput}
                placeholder="Ask me anything about money... 💰"
                style={styles.textInput}
                multiline
                maxLength={500}
                placeholderTextColor={Colors.textMuted}
                onSubmitEditing={() => sendQuery(textInput)}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  textInput.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}
                onPress={() => sendQuery(textInput)}
                disabled={!textInput.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.surface} />
                ) : (
                  <Send size={20} color={Colors.surface} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputFooter}>
              <Brain size={16} color={Colors.surface} />
              <Text style={styles.inputFooterText}>
                Powered by AI • Ask about savings, investments, budgeting & more!
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    ...Typography.h2,
    color: Colors.surface,
  },
  subtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: Colors.success,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    ...Typography.small,
    color: Colors.surface,
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
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Shadows.small,
  },
  botBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 8,
  },
  userBubble: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 8,
  },
  messageText: {
    ...Typography.body,
    lineHeight: 22,
    marginBottom: 4,
  },
  botMessageText: {
    color: Colors.textDark,
  },
  userMessageText: {
    color: Colors.surface,
  },
  messageTime: {
    ...Typography.small,
    fontSize: 11,
  },
  botMessageTime: {
    color: Colors.textMuted,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    gap: 8,
    ...Shadows.small,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  quickQuestionsContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
  },
  quickQuestionsTitle: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    marginBottom: 16,
    textAlign: 'center',
  },
  quickQuestions: {
    gap: 12,
  },
  quickQuestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 12,
    ...Shadows.small,
  },
  quickQuestionText: {
    ...Typography.bodyMedium,
    color: Colors.surface,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    ...Shadows.medium,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textDark,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.textMuted,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  inputFooterText: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});