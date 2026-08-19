import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ActionMenu({ items = [] }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.triggerBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MoreVertical size={18} color="#64748b" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuCard}>
                {items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setVisible(false);
                        if (item.onPress) item.onPress();
                        if (item.to) router.push(item.to);
                      }}
                      style={[
                        styles.menuItem,
                        idx < items.length - 1 && styles.borderBottom,
                        item.danger && styles.dangerItem,
                      ]}
                    >
                      {Icon && <Icon size={16} color={item.danger ? '#ef4444' : '#0f172a'} />}
                      <Text style={[styles.menuText, item.danger && styles.dangerText]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  menuCard: {
    width: '80%',
    maxWidth: 280,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dangerItem: {
    backgroundColor: '#fef2f2',
  },
  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  dangerText: {
    color: '#ef4444',
  },
});
