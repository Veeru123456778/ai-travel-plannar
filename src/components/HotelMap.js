'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

const HotelMap = ({ coords, hotelName }) => {
  const [mounted, setMounted] = useState(false);
  const [lat, lng] = coords.split(',').map(Number);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer center={[lat, lng]} zoom={14} style={{ height: '300px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[lat, lng]}>
        <Popup>{hotelName || 'Hotel Location'}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default HotelMap;
