import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { FileText, MapPin, AlertTriangle, CheckCircle, Camera, Image as ImageIcon, ArrowLeft, ArrowRight, Send } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Header from '../../src/components/common/Header';
import CategoryGrid from '../../src/components/incidents/CategoryGrid';
import SeveritySelector from '../../src/components/incidents/SeveritySelector';
import MobileButton from '../../src/components/common/MobileButton';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';

export default function ReportIncidentScreen() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('Central District, Sector 4');
  const [coords, setCoords] = useState({ lat: 5.6037, lng: -0.1870 });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGps, setFetchingGps] = useState(false);
  const router = useRouter();

  const getCurrentGpsLocation = async () => {
    setFetchingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to geotag incidents.');
        setFetchingGps(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setAddress(`Lat: ${loc.coords.latitude.toFixed(4)}, Lng: ${loc.coords.longitude.toFixed(4)}`);
      Alert.alert('Location Pinned', 'Your exact GPS coordinates have been attached.');
    } catch (e) {
      Alert.alert('Location Error', 'Unable to fetch current GPS coordinates.');
    } finally {
      setFetchingGps(false);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setPhotos([...photos, ...result.assets.map((a) => a.uri)]);
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to capture photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Validation Error', 'Please enter title and description.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category_id', String(categoryId));
      formData.append('severity', severity);
      formData.append('latitude', String(coords.lat));
      formData.append('longitude', String(coords.lng));
      formData.append('address', address);
      formData.append('is_anonymous', '0');

      if (photos.length > 0) {
        photos.forEach((uri, index) => {
          const filename = uri.split('/').pop() || `photo_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
          formData.append('files[]', { uri, name: filename, type });
        });
      }

      await api.post('/incidents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Your incident report has been dispatched to emergency responders.');
      router.replace('/(reporter)/incidents');
    } catch (e) {
      Alert.alert('Submission Error', e.response?.data?.message || 'Unable to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <Header title="Report Incident" />

      {/* Step Wizard Progress Bar */}
      <View style={styles.wizardBar}>
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Severity & Photos' },
          { num: 4, label: 'Review' },
        ].map((s) => (
          <View key={s.num} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                step === s.num
                  ? { backgroundColor: colors.brand }
                  : step > s.num
                  ? { backgroundColor: colors.brandSoft }
                  : { backgroundColor: '#e2e8f0' },
              ]}
            >
              <Text style={[styles.stepNum, (step === s.num || step > s.num) && { color: '#ffffff' }]}>
                {step > s.num ? '✓' : s.num}
              </Text>
            </View>
            <Text style={[styles.stepLabel, step === s.num && { color: '#0f172a', fontWeight: '800' }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 1: Incident Description & Category</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Incident Title *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Water main burst near 5th avenue"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Incident Category *</Text>
              <CategoryGrid selectedId={categoryId} onSelect={setCategoryId} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Detailed Description *</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what happened, any visible danger, or injured persons..."
                multiline
                numberOfLines={4}
                style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              />
            </View>

            <MobileButton
              title="Next: Set Location"
              onPress={() => {
                if (!title || !description) {
                  Alert.alert('Required', 'Please fill in title and description.');
                  return;
                }
                setStep(2);
              }}
              icon={ArrowRight}
            />
          </View>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 2: Incident Location & Geotag</Text>

            <View style={styles.gpsBox}>
              <MapPin size={24} color={colors.brand} />
              <View style={{ flex: 1 }}>
                <Text style={styles.gpsTitle}>Drop Pin / Auto GPS</Text>
                <Text style={styles.gpsAddress}>{address}</Text>
              </View>
            </View>

            <MobileButton
              title="Use Current GPS Coordinates"
              onPress={getCurrentGpsLocation}
              loading={fetchingGps}
              variant="outline"
              icon={MapPin}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address / Landmark</Text>
              <TextInput value={address} onChangeText={setAddress} style={styles.input} />
            </View>

            <View style={styles.navRow}>
              <MobileButton title="Back" onPress={() => setStep(1)} variant="outline" style={{ flex: 1 }} />
              <MobileButton title="Next: Severity" onPress={() => setStep(3)} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {/* Step 3: Severity & Photos */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 3: Severity Level & Evidence Photos</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Severity Level *</Text>
              <SeveritySelector selectedId={severity} onSelect={setSeverity} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Evidence Photos / Camera</Text>
              <View style={styles.mediaRow}>
                <TouchableOpacity onPress={takePhotoWithCamera} style={styles.mediaBtn}>
                  <Camera size={20} color={colors.brand} />
                  <Text style={styles.mediaBtnText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={pickImageFromGallery} style={styles.mediaBtn}>
                  <ImageIcon size={20} color={colors.brand} />
                  <Text style={styles.mediaBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {photos.length > 0 && (
                <ScrollView horizontal style={{ marginTop: 10 }}>
                  {photos.map((uri, i) => (
                    <Image key={i} source={{ uri }} style={styles.photoThumb} />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.navRow}>
              <MobileButton title="Back" onPress={() => setStep(2)} variant="outline" style={{ flex: 1 }} />
              <MobileButton title="Next: Review" onPress={() => setStep(4)} style={{ flex: 1 }} />
            </View>
          </View>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Step 4: Review & Submit Incident</Text>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewHeading}>{title}</Text>
              <Text style={styles.reviewDesc}>{description}</Text>
              <Text style={styles.reviewMeta}>Category ID: {categoryId} • Severity: {severity.toUpperCase()}</Text>
              <Text style={styles.reviewMeta}>Address: {address}</Text>
              <Text style={styles.reviewMeta}>Photos attached: {photos.length}</Text>
            </View>

            <View style={styles.navRow}>
              <MobileButton title="Back" onPress={() => setStep(3)} variant="outline" style={{ flex: 1 }} />
              <MobileButton title="Dispatch Report" onPress={handleSubmit} loading={loading} icon={Send} style={{ flex: 1 }} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  wizardBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  stepNum: { fontSize: 10, fontWeight: '800', color: '#64748b' },
  stepLabel: { fontSize: 9, color: '#94a3b8', textAlign: 'center' },
  scroll: { padding: 16, paddingBottom: 40 },
  stepContent: { gap: 14 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  inputGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 0, paddingHorizontal: 12, height: 46, fontSize: 13, backgroundColor: '#ffffff', color: '#0f172a' },
  gpsBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, padding: 12, borderRadius: 0 },
  gpsTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  gpsAddress: { fontSize: 11, color: '#64748b', marginTop: 2 },
  navRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  mediaRow: { flexDirection: 'row', gap: 10 },
  mediaBtn: { flex: 1, height: 44, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 0 },
  mediaBtnText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  photoThumb: { width: 64, height: 64, borderRadius: 4, marginRight: 8 },
  reviewCard: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, padding: 16, borderRadius: 0, gap: 6 },
  reviewHeading: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  reviewDesc: { fontSize: 12, color: '#64748b' },
  reviewMeta: { fontSize: 11, fontWeight: '700', color: colors.brand, marginTop: 2 },
});
