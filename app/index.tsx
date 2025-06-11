import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Start with the auth screen instead of onboarding
    router.replace('/auth');
  }, []);

  return null;
}