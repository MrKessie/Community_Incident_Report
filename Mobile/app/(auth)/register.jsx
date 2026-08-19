import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Shield, Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/authStore';
import MobileButton from '../../src/components/common/MobileButton';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const registerStore = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in name, email, and password.');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await registerStore({
      name,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
    });
    setLoading(false);

    if (res.success) {
      router.replace('/(reporter)');
    } else {
      Alert.alert('Registration Failed', res.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Shield size={32} color={colors.brand} />
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join your community emergency response network</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color="#94a3b8" />
              <TextInput value={name} onChangeText={setName} placeholder="John Doe" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#94a3b8" />
              <TextInput value={email} onChangeText={setEmail} placeholder="john@community.org" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={18} color="#94a3b8" />
              <TextInput value={phone} onChangeText={setPhone} placeholder="+1 234 567 8900" keyboardType="phone-pad" style={styles.input} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" />
              <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry={!showPassword} style={styles.input} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#94a3b8" />
              <TextInput value={passwordConfirmation} onChangeText={setPasswordConfirmation} placeholder="••••••••" secureTextEntry={!showConfirmPassword} style={styles.input} />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {showConfirmPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          <MobileButton title="Register Account" onPress={handleRegister} loading={loading} icon={ArrowRight} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  headerArea: { alignItems: 'center', marginBottom: 20 },
  logoBadge: { width: 56, height: 56, backgroundColor: colors.iconBg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  appName: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  tagline: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 2 },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 12, padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, height: 46, gap: 10, backgroundColor: '#ffffff' },
  input: { flex: 1, fontSize: 13, color: '#0f172a' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 13, color: '#64748b' },
  loginText: { fontSize: 13, fontWeight: '800', color: colors.brand },
});
