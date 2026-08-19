import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shield, Bell, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { useNotificationStore } from '../../store/notificationStore';

export default function Header({ title = 'CIRS Mobile', showBack = false, onBack }) {
  const router = useRouter();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack || (() => router.back())} style={styles.iconButton}>
            <ArrowLeft size={22} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <Shield size={20} color={colors.brand} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.iconButton}>
        <Bell size={20} color="#ffffff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    backgroundColor: colors.iconBg,
    borderRadius: 8,
    alignItems: 'center',
    justify: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
