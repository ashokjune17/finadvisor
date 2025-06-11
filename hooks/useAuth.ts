import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PHONE_NUMBER_KEY = '@user_phone_number';

export function useAuth() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhoneNumber();
  }, []);

  const loadPhoneNumber = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem(PHONE_NUMBER_KEY);
      setPhoneNumber(storedPhoneNumber);
    } catch (error) {
      console.error('Error loading phone number:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePhoneNumber = async (phone: string) => {
    try {
      await AsyncStorage.setItem(PHONE_NUMBER_KEY, phone);
      setPhoneNumber(phone);
    } catch (error) {
      console.error('Error saving phone number:', error);
    }
  };

  const clearPhoneNumber = async () => {
    try {
      await AsyncStorage.removeItem(PHONE_NUMBER_KEY);
      setPhoneNumber(null);
    } catch (error) {
      console.error('Error clearing phone number:', error);
    }
  };

  return {
    phoneNumber,
    isLoading,
    savePhoneNumber,
    clearPhoneNumber,
  };
}