import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../src/components/common/Header';
import { Bell, CheckCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { colors } from '../src/theme/colors';
import { useNotificationStore } from '../src/store/notificationStore';
import { formatDateTime } from '../src/utils/formatters';
import { useRouter } from 'expo-router';

export default function NotificationsModalScreen() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_at;
    if (filter === 'read') return !!n.read_at;
    return true;
  });

  return (
    <View style={styles.flex}>
      <Header title="Notification Center" showBack />

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'read', label: 'Read', count: notifications.length - unreadCount },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setFilter(t.key)}
            style={[styles.tabBtn, filter === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === t.key && styles.tabTextActive]}>
              {t.label} ({t.count})
            </Text>
          </TouchableOpacity>
        ))}
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
            <CheckCheck size={14} color={colors.brand} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.map((item) => {
          const isUnread = !item.read_at;
          const msg = item.data?.message || item.message || 'Notification update';

          return (
            <View key={item.id} style={[styles.itemCard, isUnread && styles.unreadCard]}>
              <View style={styles.itemHeader}>
                <View style={styles.iconBg}>
                  <Bell size={18} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.msgText}>{msg}</Text>
                  <View style={styles.timeRow}>
                    <Clock size={12} color="#94a3b8" />
                    <Text style={styles.timeText}>{formatDateTime(item.created_at)}</Text>
                  </View>
                </View>
              </View>

              {isUnread && (
                <TouchableOpacity onPress={() => markAsRead(item.id)} style={styles.readAction}>
                  <CheckCircle2 size={14} color={colors.brand} />
                  <Text style={styles.readActionText}>Mark as Read</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  tabRow: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', gap: 6, alignItems: 'center' },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 0 },
  tabActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  tabText: { fontSize: 11, fontWeight: '800', color: '#64748b' },
  tabTextActive: { color: '#ffffff' },
  markAllBtn: { marginLeft: 'auto', padding: 6 },
  scroll: { padding: 16, paddingBottom: 40, gap: 10 },
  itemCard: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0, padding: 12, gap: 8 },
  unreadCard: { backgroundColor: '#f0fdfa', borderColor: '#99f6e4' },
  itemHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  iconBg: { width: 34, height: 34, backgroundColor: colors.iconBg, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  msgText: { fontSize: 13, fontWeight: '700', color: '#0f172a', lineHeight: 18 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  timeText: { fontSize: 10, color: '#94a3b8' },
  readAction: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginTop: 4 },
  readActionText: { fontSize: 11, fontWeight: '800', color: colors.brand },
});
