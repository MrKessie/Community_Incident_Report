import React from 'react';
import { Tabs } from 'expo-router';
import { Shield, List, CheckCircle, User } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function TeamLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Duty Queue',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="response"
        options={{
          title: 'Field Action Log',
          tabBarIcon: ({ color, size }) => <CheckCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
