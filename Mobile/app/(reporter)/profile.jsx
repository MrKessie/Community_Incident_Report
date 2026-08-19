import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { User, Mail, Phone, Shield, LogOut, Lock, Bell, Eye, EyeOff, Save, ShieldCheck, MapPin, Camera } from 'lucide-react-native';
import Header from '../../src/components/common/Header';
import MobileButton from '../../src/components/common/MobileButton';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'expo-router';
import { authApi } from '../../src/api/client';

export default function ProfileScreen() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();

  // Active section tab: 'details' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState('details');

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 000-0000');
  const [district, setDistrict] = useState('District 4 - Metro Center');
  const [isSaving, setIsSaving] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Switch preferences
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [dispatchTracking, setDispatchTracking] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleUpdateAccount = () => {
    setIsSaving(true);
    setTimeout(() => {
      setUser({ ...user, name, phone });
      setIsSaving(false);
      Alert.alert('Profile Saved', 'Your account details have been updated successfully.');
    }, 600);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'Please complete all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }
    Alert.alert('Password Updated', 'Your security password has been changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of CIRS Mobile?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.flex}>
      <Header title="My Profile & Settings" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Hero Header Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={36} color={colors.brand} />
              </View>
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => Alert.alert('Upload Photo', 'Profile photo picker initialized.')}
              >
                <Camera size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.userMainInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{name}</Text>
              </View>
              <View style={styles.badgeRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{(user?.role || 'reporter').replace('_', ' ').toUpperCase()}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={12} color="#166534" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{user?.email || 'citizen@community.org'}</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumberGreen}>10</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumberBlue}>100%</Text>
              <Text style={styles.statLabel}>Trust Score</Text>
            </View>
          </View>
        </View>

        {/* Section Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('details')}
            style={[styles.tabBtn, activeTab === 'details' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('security')}
            style={[styles.tabBtn, activeTab === 'security' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>Security</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('preferences')}
            style={[styles.tabBtn, activeTab === 'preferences' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === 'preferences' && styles.tabTextActive]}>Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Account Details */}
        {activeTab === 'details' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PERSONAL & CONTACT DETAILS</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color="#94a3b8" />
                <TextInput value={name} onChangeText={setName} style={styles.input} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address (Read-Only)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: '#f1f5f9' }]}>
                <Mail size={18} color="#94a3b8" />
                <TextInput value={user?.email || 'citizen@community.org'} editable={false} style={[styles.input, { color: '#64748b' }]} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone size={18} color="#94a3b8" />
                <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Neighborhood / District</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={18} color="#94a3b8" />
                <TextInput value={district} onChangeText={setDistrict} style={styles.input} />
              </View>
            </View>

            <MobileButton title="Save Profile Details" onPress={handleUpdateAccount} loading={isSaving} icon={Save} style={{ marginTop: 8 }} />
          </View>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>CHANGE SECURITY PASSWORD</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#94a3b8" />
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showCurrentPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#94a3b8" />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showNewPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#94a3b8" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>

            <MobileButton title="Update Security Password" onPress={handleUpdatePassword} icon={Lock} style={{ marginTop: 8 }} />
          </View>
        )}

        {/* Tab 3: Preferences & Alerts */}
        {activeTab === 'preferences' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>EMERGENCY ALERTS & PREFERENCES</Text>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Emergency Broadcast Warnings</Text>
                <Text style={styles.switchSub}>Real-time flash flood & hazardous weather alerts</Text>
              </View>
              <Switch value={emergencyAlerts} onValueChange={setEmergencyAlerts} trackColor={{ false: '#cbd5e1', true: colors.brand }} />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Dispatch Progress Tracking</Text>
                <Text style={styles.switchSub}>Alerts when emergency response units arrive on scene</Text>
              </View>
              <Switch value={dispatchTracking} onValueChange={setDispatchTracking} trackColor={{ false: '#cbd5e1', true: colors.brand }} />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Community Digest Emails</Text>
                <Text style={styles.switchSub}>Monthly neighborhood safety statistics</Text>
              </View>
              <Switch value={emailDigest} onValueChange={setEmailDigest} trackColor={{ false: '#cbd5e1', true: colors.brand }} />
            </View>
          </View>
        )}

        {/* Sign Out Button */}
        <MobileButton
          title="Sign Out of Account"
          onPress={handleLogout}
          variant="danger"
          icon={LogOut}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarContainer: { relative: 'relative' },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: colors.iconBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userMainInfo: { flex: 1, gap: 3 },
  userName: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roleBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: { fontSize: 9, fontWeight: '800', color: '#334155' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: { fontSize: 9, fontWeight: '800', color: '#166534' },
  userEmail: { fontSize: 11, color: '#64748b', marginTop: 1 },

  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 14,
    paddingTop: 12,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: '900', color: colors.brand },
  statNumberGreen: { fontSize: 16, fontWeight: '900', color: '#16a34a' },
  statNumberBlue: { fontSize: 16, fontWeight: '900', color: '#2563eb' },
  statLabel: { fontSize: 9, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: colors.brand,
  },
  tabText: { fontSize: 11, fontWeight: '800', color: '#64748b' },
  tabTextActive: { color: '#ffffff' },

  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  input: { flex: 1, fontSize: 13, color: '#0f172a' },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  switchTitle: { fontSize: 12, fontWeight: '800', color: '#0f172a' },
  switchSub: { fontSize: 10, color: '#64748b', marginTop: 1 },
});
