import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';

export default function MobileButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline'
  loading = false,
  disabled = false,
  icon: Icon,
  style,
}) {
  const getButtonStyle = () => {
    if (variant === 'secondary') return styles.secondary;
    if (variant === 'danger') return styles.danger;
    if (variant === 'outline') return styles.outline;
    return styles.primary;
  };

  const getTextStyle = () => {
    if (variant === 'outline') return styles.outlineText;
    return styles.btnText;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.baseBtn, getButtonStyle(), (disabled || loading) && styles.disabledBtn, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.brand : '#ffffff'} size="small" />
      ) : (
        <>
          {Icon && <Icon size={18} color={variant === 'outline' ? colors.brand : '#ffffff'} style={{ marginRight: 8 }} />}
          <Text style={[getTextStyle()]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 0, // Sharp square corners per brand rules
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primary: {
    backgroundColor: colors.brand, // --brand: #0f766e
  },
  secondary: {
    backgroundColor: colors.brandSoft, // --brand-soft: #14b8a6
  },
  danger: {
    backgroundColor: '#dc2626',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.brand,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  outlineText: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '800',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
