import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DEFAULT_CENTER = {
  lat: 5.603717,
  lng: -0.186964,
};

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event);
    },
  });

  return null;
}

function ReportIncidentPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    latitude: '',
    longitude: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const photoInputRef = useRef(null);

  const markerPosition = useMemo(() => {
    if (!formData.latitude || !formData.longitude) {
      return null;
    }

    return {
      lat: Number(formData.latitude),
      lng: Number(formData.longitude),
    };
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  function handleChange(event) {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function handlePhotoChange(event) {
    const selected = event.target.files?.[0];
    setPhoto(selected || null);
  }

  function handleFileDrop(event) {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    if (!droppedFile.type.startsWith('image/')) {
      toast.error('Invalid file', 'Only image files are allowed.');
      return;
    }

    setPhoto(droppedFile);
  }

  function handleMapClick(event) {
    const lat = event.latlng?.lat;
    const lng = event.latlng?.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      latitude: lat.toFixed(7),
      longitude: lng.toFixed(7),
    }));
  }

  async function submitIncident() {
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('description', formData.description);
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);

      if (photo) {
        payload.append('photo', photo);
      }

      await apiClient.post('/incidents', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Incident submitted', 'Your report was submitted successfully.');
      navigate('/dashboard');
    } catch (apiError) {
      if (apiError.response?.data?.errors) {
        const firstFieldError = Object.values(apiError.response.data.errors)[0]?.[0];
        toast.error('Submission failed', firstFieldError || 'Incident submission failed.');
      } else {
        toast.error('Submission failed', apiError.response?.data?.message || 'Incident submission failed.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowConfirm(true);
  }

  return (
    <DashboardLayout
      title="Report New Incident"
      subtitle="Include details, coordinates, and an optional photo."
      breadcrumbItems={[{ label: 'Incidents', to: '/incidents' }, { label: 'Report' }]}
    >
      <section className="panel">
        <h2>Report New Incident</h2>
        <p className="panel-subtitle">Include details, coordinates, and an optional photo.</p>

        <form onSubmit={handleSubmit} className="auth-form report-form">
          <div className="map-panel">
            <h2>Select Location on Map</h2>

            <MapContainer
              className="incident-map"
              center={markerPosition || DEFAULT_CENTER}
              zoom={markerPosition ? 16 : 12}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} />
              {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>

            <p className="map-hint">Click on the map to place a marker and auto-fill coordinates.</p>
          </div>

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue (e.g. burst pipe, pothole, broken streetlight)..."
            rows={4}
            required
          />

          <div className="inline-grid">
            <div>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="0.0000001"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="5.603717"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="0.0000001"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-0.186964"
                required
              />
            </div>
          </div>

          <label htmlFor="photo">Incident Photo (optional)</label>
          <div
            className={`upload-dropzone ${isDragActive ? 'active' : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleFileDrop}
            onClick={() => photoInputRef.current?.click()}
          >
            <p>Drag and drop an image here, or click to browse.</p>
          </div>
          <input
            ref={photoInputRef}
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />

          {photoPreview && (
            <div className="photo-preview-wrap">
              <img src={photoPreview} alt="Selected incident" className="photo-preview" />
            </div>
          )}

          <div className="action-row">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Incident'}
            </button>
            <Link to="/dashboard" className="text-link">
              Back to dashboard
            </Link>
          </div>
        </form>
      </section>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Incident Submission"
        actions={
          <>
            <button type="button" className="ghost-button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setShowConfirm(false);
                submitIncident();
              }}
            >
              Confirm Submit
            </button>
          </>
        }
      >
        <p>Submit this incident report now?</p>
      </Modal>
    </DashboardLayout>
  );
}

export default ReportIncidentPage;
