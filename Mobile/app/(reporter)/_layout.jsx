import React from 'react';
import { Tabs } from 'expo-router';
import { Home, AlertTriangle, List, MapPin, User } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function ReporterLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: 'My Reports',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null, // Hide detail page from tab bar buttons
        }}
      />
    </Tabs>
  );
}
