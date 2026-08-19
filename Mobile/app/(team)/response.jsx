import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../../src/components/common/Header';
import MobileButton from '../../src/components/common/MobileButton';
import { CheckCircle2, FileText, Send } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function FieldActionLogScreen() {
  const [incidentId, setIncidentId] = useState('101');
  const [logMessage, setLogMessage] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    if (!logMessage) {
      Alert.alert('Validation Error', 'Please enter action log notes.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Field Log Saved', 'Dispatch updates & action log transmitted to command center.');
      setLogMessage('');
    }, 800);
  };

  return (
    <View style={styles.flex}>
      <Header title="Field Action Log" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit Operational Field Update</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident ID / Ref Number</Text>
            <TextInput value={incidentId} onChangeText={setIncidentId} style={styles.input} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Action Log & On-Scene Findings *</Text>
            <TextInput
              value={logMessage}
              onChangeText={setLogMessage}
              placeholder="e.g. Unit arrived at scene 10:42 AM. Performed emergency containment..."
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            />
          </View>

          <MobileButton title="Transmit Log Update" onPress={handleUpdate} loading={loading} icon={Send} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0, padding: 16, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  inputGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 0, paddingHorizontal: 12, height: 44, fontSize: 13, backgroundColor: '#ffffff', color: '#0f172a' },
});
