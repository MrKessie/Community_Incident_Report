import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Shield, Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';
import MobileButton from '../../src/components/common/MobileButton';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      Alert.alert('Reset Link Sent', 'Password reset instructions have been sent to your email.');
      router.back();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={20} color="#0f172a" />
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>

      <View style={styles.headerArea}>
        <View style={styles.logoBadge}>
          <Shield size={32} color={colors.brand} />
        </View>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.desc}>Enter your email to receive a password reset link</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color="#94a3b8" />
            <TextInput value={email} onChangeText={setEmail} placeholder="user@community.org" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          </View>
        </View>

        <MobileButton title="Send Reset Link" onPress={handleReset} loading={loading} icon={Send} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20, paddingTop: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 30 },
  backText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  headerArea: { alignItems: 'center', marginBottom: 20 },
  logoBadge: { width: 56, height: 56, backgroundColor: colors.iconBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  desc: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 12, padding: 18, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 46, gap: 10, backgroundColor: '#ffffff' },
  input: { flex: 1, fontSize: 13, color: '#0f172a' },
});
