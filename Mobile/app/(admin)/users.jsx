import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../../src/components/common/Header';
import DataTable from '../../src/components/common/DataTable';
import MobileButton from '../../src/components/common/MobileButton';
import { colors } from '../../src/theme/colors';

import ActionMenu from '../../src/components/common/ActionMenu';
import { UserCheck, UserX, Trash2, Edit3 } from 'lucide-react-native';

export default function UserManagementScreen() {
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@community.org', role: 'reporter', is_active: true },
    { id: '2', name: 'Metro Fire Unit 4', email: 'fire4@metro.gov', role: 'response_team', is_active: true },
    { id: '3', name: 'Admin Officer', email: 'admin@cirs.gov', role: 'admin', is_active: true },
  ]);

  const toggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const columns = [
    { header: 'Name', key: 'name', width: 140 },
    { header: 'Email', key: 'email', width: 160 },
    {
      header: 'Role',
      key: 'role',
      width: 110,
      render: (r) => (
        <View style={{ backgroundColor: colors.iconBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: colors.brand }}>{r.role.toUpperCase()}</Text>
        </View>
      ),
    },
    {
      header: 'Status',
      key: 'is_active',
      width: 90,
      render: (r) => (
        <Text style={{ fontSize: 11, fontWeight: '700', color: r.is_active ? '#166534' : '#991b1b' }}>
          {r.is_active ? 'Active' : 'Disabled'}
        </Text>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      width: 80,
      render: (r) => (
        <ActionMenu
          items={[
            {
              label: r.is_active ? 'Disable Account' : 'Activate Account',
              icon: r.is_active ? UserX : UserCheck,
              onPress: () => toggleActive(r.id),
            },
            {
              label: 'Delete User',
              icon: Trash2,
              danger: true,
              onPress: () => deleteUser(r.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <View style={styles.flex}>
      <Header title="User Directory" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <DataTable
          title="System User & Unit Directory"
          description="Manage registered citizen accounts and response units"
          columns={columns}
          data={users}
          selectable
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
});
