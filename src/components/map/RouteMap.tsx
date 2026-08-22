import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PopulatedTrip } from '../../types';

interface RouteMapProps {
  trip: PopulatedTrip;
}

// Helper to auto-fit map bounds to markers
const MapBoundsFitter: React.FC<{ coords: [number, number][] }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [coords, map]);
  return null;
};

export const RouteMap: React.FC<RouteMapProps> = ({ trip }) => {
  const stops = trip.stops || [];

  const coordinates: [number, number][] = stops
    .filter(s => s.city && s.city.lat && s.city.lng)
    .map(s => [s.city.lat, s.city.lng]);

  const defaultCenter: [number, number] = coordinates.length > 0 ? coordinates[0] : [48.8566, 2.3522];

  // Custom marker icon factory
  const createMarkerIcon = (index: number, name: string) => {
    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          background: #0F172A;
          color: #FFFFFF;
          border: 2px solid #FF5A36;
          border-radius: 9999px;
          padding: 4px 8px;
          font-weight: 800;
          font-size: 11px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
        ">
          <span style="background: #FF5A36; color: white; border-radius: 9999px; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 9px;">${index + 1}</span>
          <span>${name}</span>
        </div>
      `,
      iconSize: [40, 24],
      iconAnchor: [20, 12],
    });
  };

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-3xl overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordinates.length > 1 && (
          <Polyline
            positions={coordinates}
            pathOptions={{
              color: '#FF5A36',
              weight: 3.5,
              dashArray: '8, 8',
              opacity: 0.85,
            }}
          />
        )}

        {stops.map((stop, index) => {
          if (!stop.city || !stop.city.lat || !stop.city.lng) return null;
          return (
            <Marker
              key={stop.id}
              position={[stop.city.lat, stop.city.lng]}
              icon={createMarkerIcon(index, stop.city.name)}
            >
              <Popup>
                <div className="p-1 max-w-[200px] space-y-1.5">
                  <img
                    src={stop.city.image}
                    alt={stop.city.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="font-extrabold text-sm text-slate-900">
                    {index + 1}. {stop.city.name}, {stop.city.country}
                  </div>
                  <div className="text-xs text-slate-600">
                    Stay: <strong>{stop.nights} nights</strong> ({stop.arrivalDate})
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">
                    {stop.city.description}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapBoundsFitter coords={coordinates} />
      </MapContainer>
    </div>
  );
};
