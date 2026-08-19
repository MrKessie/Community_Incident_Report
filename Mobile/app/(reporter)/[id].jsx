import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '../../src/components/common/Header';
import { StatusBadge, SeverityBadge } from '../../src/components/common/StatusBadge';
import { formatDate, formatDateTime } from '../../src/utils/formatters';
import { colors } from '../../src/theme/colors';
import { Shield, Clock, MapPin, CheckCircle, Edit3, X, Image as ImageIcon } from 'lucide-react-native';
import api, { getBaseURL } from '../../src/api/client';
import MobileButton from '../../src/components/common/MobileButton';

const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = getBaseURL().replace('/api/v1', '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSeverity, setEditSeverity] = useState('medium');
  const [editAddress, setEditAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      const data = res.data?.data || res.data;
      if (data) {
        setIncident(data);
        setEditTitle(data.title || '');
        setEditDesc(data.description || '');
        setEditSeverity(data.severity || 'medium');
        setEditAddress(data.address || '');
      }
    } catch (e) {
      setIncident({
        id: id || '1',
        reference_number: 'INC-2026-00001',
        title: 'Major water main leak on 5th Avenue',
        description: 'High pressure water gushing onto the main road near community center. Road flooded.',
        severity: 'high',
        status: 'submitted',
        created_at: new Date().toISOString(),
        address: 'Central District, 5th Avenue Block B',
        category: { name: 'Flood & Water' },
        media: [],
        timeline: [
          { id: 1, title: 'Report Received', time: '10 mins ago', desc: 'Dispatched to community queue' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleSaveEdit = async () => {
    if (editTitle.trim().length < 10) {
      return Alert.alert('Validation Error', 'Title must be at least 10 characters.');
    }
    if (editDesc.trim().length < 10) {
      return Alert.alert('Validation Error', 'Description must be at least 10 characters.');
    }

    setUpdating(true);
    try {
      const payload = {
        title: editTitle,
        description: editDesc,
        severity: editSeverity,
        address: editAddress,
      };
      const res = await api.put(`/incidents/${incident.id}`, payload);
      const updated = res.data?.incident || res.data?.data || payload;
      setIncident((prev) => ({ ...prev, ...updated }));
      Alert.alert('Success', 'Incident report updated successfully.');
      setIsEditing(false);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update incident.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <Header title={`Incident ${incident.reference_number || id}`} showBack />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.badgesRow}>
            <View style={styles.badges}>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </View>

            {incident.status === 'submitted' && (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                <Edit3 size={14} color="#d97706" />
                <Text style={styles.editBtnText}>Edit Report</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>{incident.title}</Text>
          <Text style={styles.desc}>{incident.description}</Text>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Shield size={14} color={colors.brand} />
              <Text style={styles.metaText}>Category: {incident.category?.name || 'Emergency'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Clock size={14} color="#64748b" />
              <Text style={styles.metaText}>Reported: {formatDateTime(incident.created_at)}</Text>
            </View>
            {incident.address && (
              <View style={styles.metaRow}>
                <MapPin size={14} color="#ef4444" />
                <Text style={styles.metaText}>Address: {incident.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Evidence Photos Gallery */}
        {incident.media && incident.media.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionHeader}>EVIDENCE PHOTOS ({incident.media.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaContainer}>
              {incident.media.map((m) => (
                <View key={m.id} style={styles.mediaThumbWrapper}>
                  {m.file_type === 'image' ? (
                    <Image source={{ uri: getMediaUrl(m.file_path) }} style={styles.mediaThumb} />
                  ) : (
                    <View style={styles.mediaPlaceholder}>
                      <ImageIcon size={24} color="#94a3b8" />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Dispatch Progress Timeline */}
        <Text style={styles.sectionHeader}>DISPATCH TIMELINE & LOGS</Text>
        <View style={styles.timelineCard}>
          {(incident.updates && incident.updates.length > 0
            ? incident.updates.map((u) => ({ id: u.id, title: u.updater?.name || 'Dispatch Control', time: formatDateTime(u.created_at), desc: u.message }))
            : [
                { id: 1, title: 'Report Received', time: 'Just now', desc: 'Queued for dispatch triage' },
              ]
          ).map((t, idx) => (
            <View key={t.id || idx} style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                <CheckCircle size={14} color={colors.brand} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{t.title}</Text>
                  <Text style={styles.timelineTime}>{t.time}</Text>
                </View>
                <Text style={styles.timelineDesc}>{t.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Incident Modal */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Submitted Incident</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12, paddingVertical: 10 }}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput value={editTitle} onChangeText={setEditTitle} style={styles.input} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street Address / Landmark</Text>
                <TextInput value={editAddress} onChangeText={setEditAddress} style={styles.input} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  value={editDesc}
                  onChangeText={setEditDesc}
                  multiline
                  numberOfLines={4}
                  style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                />
              </View>

              <View style={styles.modalNav}>
                <MobileButton title="Cancel" onPress={() => setIsEditing(false)} variant="outline" style={{ flex: 1 }} />
                <MobileButton title="Save Changes" onPress={handleSaveEdit} loading={updating} style={{ flex: 1 }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0, padding: 16, gap: 10, marginBottom: 16 },
  badgesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badges: { flexDirection: 'row', gap: 6 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  editBtnText: { fontSize: 11, fontWeight: '800', color: '#b45309' },
  title: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  desc: { fontSize: 13, color: '#475569', lineHeight: 20 },
  metaBox: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 },
  mediaContainer: { flexDirection: 'row' },
  mediaThumbWrapper: { width: 90, height: 90, marginRight: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  mediaThumb: { width: '100%', height: '100%' },
  mediaPlaceholder: { width: '100%', height: '100%', backgroundColor: '#f1f5f9', alignItems: 'center', justify: 'center' },
  timelineCard: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0, padding: 16, gap: 16 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineDot: { marginTop: 2 },
  timelineContent: { flex: 1, gap: 2 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  timelineTime: { fontSize: 10, color: '#94a3b8' },
  timelineDesc: { fontSize: 11, color: '#64748b' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  inputGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 0, paddingHorizontal: 12, height: 44, fontSize: 13, backgroundColor: '#ffffff', color: '#0f172a' },
  modalNav: { flexDirection: 'row', gap: 10, marginTop: 10 },
});
