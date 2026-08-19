import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(reporter)" />
        <Stack.Screen name="(team)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
