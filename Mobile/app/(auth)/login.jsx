import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/authStore';
import MobileButton from '../../src/components/common/MobileButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const role = res.user?.role;
      if (role === 'admin' || role === 'super_admin') {
        router.replace('/(admin)');
      } else if (role === 'response_team') {
        router.replace('/(team)');
      } else {
        router.replace('/(reporter)');
      }
    } else {
      Alert.alert('Login Failed', res.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Shield size={36} color={colors.brand} />
          </View>
          <Text style={styles.appName}>CIR System Mobile</Text>
          <Text style={styles.tagline}>Community Incident Reporting & Emergency Dispatch</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In To Your Account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="citizen@community.org"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <MobileButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            icon={ArrowRight}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/(reporter)/report')}
            style={styles.anonBtn}
          >
            <Text style={styles.anonBtnText}>Report Incident Anonymously</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.signupText}>Register Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    backgroundColor: colors.iconBg, // #ccfbf1
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  tagline: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
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
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 12,
    color: colors.brand,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  anonBtn: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  anonBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.brand,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  signupText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.brand,
  },
});
