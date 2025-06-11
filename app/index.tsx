import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Start with the auth screen for user authentication
    router.replace('/auth');
  }, []);

  return null;
}