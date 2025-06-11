import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Smartphone, ChevronRight, Sparkles, Shield, TrendingUp, Target } from 'lucide-react-native';

interface OnboardingResponse {
  result: string;
}

export default function AuthScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid 10-digit Indian mobile number
    return cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone);
  };

  const checkOnboardingStatus = async (cleanPhone: string): Promise<string> => {
    try {
      const response = await fetch('https://fin-advisor-ashokkumar5.replit.app/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: cleanPhone,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OnboardingResponse = await response.json();
      console.log('🔍 Onboarding status response:', data);
      
      return data.result;
    } catch (error) {
      console.error('❌ Error checking onboarding status:', error);
      // Default to 'User Not Onboarded' on error to ensure user can proceed
      return 'User Not Onboarded';
    }
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.'
      );
      return;
    }

    setLoading(true);

    try {
      // Clean the phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      console.log('📱 Checking onboarding status for:', cleanPhone);
      
      // Check onboarding status
      const onboardingStatus = await checkOnboardingStatus(cleanPhone);
      console.log('📊 Onboarding status:', onboardingStatus);

      switch (onboardingStatus) {
        case 'User Not Onboarded':
          // New user - start full onboarding
          console.log('🆕 New user - starting full onboarding');
          router.push({
            pathname: '/onboarding',
            params: { phoneNumber: cleanPhone }
          });
          break;

        case 'Basic':
          // User has basic info but needs risk assessment
          console.log('⚡ User has basic info - starting from risk questions');
          Alert.alert(
            'Welcome Back! 👋',
            'We need to complete your risk assessment to provide better recommendations.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // TODO: Navigate to onboarding starting from risk questions
                  // For now, we'll go to full onboarding - you can modify this later
                  router.push({
                    pathname: '/onboarding',
                    params: { 
                      phoneNumber: cleanPhone,
                      startFrom: 'risk' // This can be used to skip to risk questions
                    }
                  });
                }
              }
            ]
          );
          break;

        case 'Risk':
          // User completed onboarding - go to main app
          console.log('✅ User fully onboarded - going to main app');
          try {
            // Try to get user profile for welcome message
            const profileResponse = await fetch(`https://fin-advisor-ashokkumar5.replit.app/profile?phone_number=${cleanPhone}`);
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              const userName = profileData.Profile?.name || 'there';
              
              Alert.alert(
                'Welcome Back! 🎉',
                `Hi ${userName}! Ready to continue your financial journey?`,
                [
                  {
                    text: 'Let\'s Go!',
                    onPress: () => {
                      router.replace('/(tabs)');
                    }
                  }
                ]
              );
            } else {
              // Profile fetch failed, but user is onboarded
              router.replace('/(tabs)');
            }
          } catch (profileError) {
            console.error('⚠️ Error fetching profile, but proceeding to main app:', profileError);
            router.replace('/(tabs)');
          }
          break;

        default:
          // Unknown status - default to onboarding
          console.log('❓ Unknown status, defaulting to onboarding');
          router.push({
            pathname: '/onboarding',
            params: { phoneNumber: cleanPhone }
          });
          break;
      }
    } catch (error) {
      console.error('💥 Error in handleContinue:', error);
      
      // On any error, allow user to proceed to onboarding
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      Alert.alert(
        'Connection Issue',
        'We\'re having trouble connecting to our servers. You can still proceed with registration.',
        [
          {
            text: 'Continue Anyway',
            onPress: () => {
              router.push({
                pathname: '/onboarding',
                params: { phoneNumber: cleanPhone }
              });
            }
          },
          {
            text: 'Try Again',
            onPress: () => setLoading(false)
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    
    // Format as XXX XXX XXXX
    if (limited.length >= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    }
    
    return limited;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
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
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Sparkles size={32} color={Colors.surface} />
              </View>
              <Text style={styles.title}>Welcome to FinAdvisor</Text>
              <Text style={styles.subtitle}>
                Your personal finance companion for building wealth and achieving your dreams! 💰✨
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.accent }]}>
                  <Target size={20} color={Colors.surface} />
                </View>
                <Text style={styles.featureText}>Set & Track Goals</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.warning }]}>
                  <TrendingUp size={20} color={Colors.surface} />
                </View>
                <Text style={styles.featureText}>Smart Investments</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.success }]}>
                  <Shield size={20} color={Colors.surface} />
                </View>
                <Text style={styles.featureText}>Secure & Private</Text>
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Enter your mobile number to get started</Text>
              
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="XXX XXX XXXX"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={12} // Formatted length
                  autoFocus
                />
              </View>
              
              <Text style={styles.inputHint}>
                We'll check your registration status and guide you accordingly
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!validatePhoneNumber(phoneNumber) || loading) && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={!validatePhoneNumber(phoneNumber) || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.surface} />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ChevronRight size={20} color={Colors.surface} />
                </>
              )}
            </TouchableOpacity>

            {/* Privacy Notice */}
            <View style={styles.privacyNotice}>
              <Shield size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.privacyText}>
                Your data is encrypted and secure. We never share your personal information.
              </Text>
            </View>
          </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Shadows.medium,
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...Shadows.small,
  },
  featureText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 12,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  countryCode: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  countryCodeText: {
    ...Typography.bodyMedium,
    color: Colors.textDark,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...Typography.body,
    color: Colors.textDark,
    fontSize: 18,
  },
  inputHint: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...Shadows.medium,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    ...Typography.bodySemiBold,
    color: Colors.surface,
    fontSize: 18,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 8,
  },
  privacyText: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    flex: 1,
  },
});