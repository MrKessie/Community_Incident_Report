import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/theme/colors';

export default function IndexScreen() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else {
        const role = user?.role;
        if (role === 'admin' || role === 'super_admin') {
          router.replace('/(admin)');
        } else if (role === 'response_team') {
          router.replace('/(team)');
        } else {
          router.replace('/(reporter)');
        }
      }
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
