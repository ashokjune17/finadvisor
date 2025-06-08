import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, always start with onboarding
    // In a real app, you'd check if user has completed onboarding
    router.replace('/onboarding');
  }, []);

  return null;
}