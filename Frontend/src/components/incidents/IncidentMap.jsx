import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng, `GPS Location (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`);
    },
  });
  return null;
}

export default function IncidentMap({
  position = { lat: 5.6037, lng: -0.1870 },
  incidents = [],
  onLocationSelect,
  isPicker = false,
  height = '360px',
}) {
  const [markerPos, setMarkerPos] = useState([position.lat, position.lng]);

  useEffect(() => {
    if (position.lat && position.lng) {
      setMarkerPos([position.lat, position.lng]);
    }
  }, [position]);

  const handleSelect = (lat, lng, addr) => {
    setMarkerPos([lat, lng]);
    if (onLocationSelect) onLocationSelect(lat, lng, addr);
  };

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-inner border border-slate-300 dark:border-slate-800 relative">
      <MapContainer
        center={markerPos}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {isPicker && (
          <>
            <Marker
              position={markerPos}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const pos = marker.getLatLng();
                  handleSelect(pos.lat, pos.lng, `GPS (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`);
                },
              }}
            >
              <Popup>Selected Location Pin</Popup>
            </Marker>
            <MapClickHandler onSelect={handleSelect} />
          </>
        )}

        {!isPicker && incidents.map((inc) => (
          <Marker key={inc.id} position={[inc.latitude || position.lat, inc.longitude || position.lng]}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold font-mono text-blue-600">{inc.reference_number}</span>
                <p className="font-semibold text-slate-900">{inc.title}</p>
                <p className="text-[10px] text-slate-500">{inc.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
