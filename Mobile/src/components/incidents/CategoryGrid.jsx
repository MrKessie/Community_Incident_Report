import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Flame, ShieldAlert, Car, Droplets, HeartPulse, AlertTriangle, Building2, Biohazard } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export const categoriesList = [
  { id: '1', name: 'Fire / Explosion', icon: Flame },
  { id: '2', name: 'Theft / Robbery', icon: ShieldAlert },
  { id: '3', name: 'Road Accident', icon: Car },
  { id: '4', name: 'Flood / Water Damage', icon: Droplets },
  { id: '5', name: 'Medical Emergency', icon: HeartPulse },
  { id: '6', name: 'Violence / Assault', icon: AlertTriangle },
  { id: '7', name: 'Infrastructure Damage', icon: Building2 },
  { id: '8', name: 'Environmental Hazard', icon: Biohazard },
];

export default function CategoryGrid({ selectedId, onSelect }) {
  return (
    <View style={styles.grid}>
      {categoriesList.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedId === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect && onSelect(cat.id)}
            style={[
              styles.item,
              isSelected ? styles.itemSelected : styles.itemNormal,
            ]}
          >
            <View style={styles.iconBg}>
              <Icon size={18} color={colors.brand} />
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={2}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  item: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 0, // Sharp square corners per brand rules
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemNormal: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  itemSelected: {
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    borderColor: colors.brand,
    borderWidth: 2,
  },
  iconBg: {
    width: 32,
    height: 32,
    backgroundColor: colors.iconBg, // #ccfbf1 lightgreen shade
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  labelSelected: {
    color: colors.brand,
    fontWeight: '800',
  },
});
