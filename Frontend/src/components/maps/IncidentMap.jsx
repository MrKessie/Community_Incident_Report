import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import { Link } from 'react-router-dom';

// Fix Leaflet icon URLs in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function IncidentMap({
  incidents = [],
  center = [40.7128, -74.0060],
  zoom = 12,
  interactivePicker = false,
  selectedLocation = null,
  onLocationSelect = null,
  height = '450px'
}) {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer center={selectedLocation || center} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {interactivePicker && <LocationPicker onLocationSelect={onLocationSelect} />}

        {/* Selected location marker for picker */}
        {interactivePicker && selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-slate-900 font-bold text-xs p-1">
                Selected Incident Location
                <p className="font-normal text-[10px] text-slate-600">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Incident List Markers */}
        {!interactivePicker &&
          incidents.map((inc) => {
            if (!inc.latitude || !inc.longitude) return null;
            return (
              <Marker key={inc.id} position={[parseFloat(inc.latitude), parseFloat(inc.longitude)]}>
                <Popup>
                  <div className="p-2 space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{inc.reference_number}</span>
                      <StatusBadge status={inc.status} />
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 leading-tight">{inc.title}</h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2">{inc.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                      <SeverityBadge severity={inc.severity} />
                      <Link
                        to={`/incidents/${inc.id}`}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {interactivePicker && (
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] font-medium text-amber-300 shadow-xl backdrop-blur-md">
          📍 Click anywhere on the map to place incident pin
        </div>
      )}
    </div>
  );
}
