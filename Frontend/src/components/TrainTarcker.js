import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix the default marker icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const TrainTracker = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchTrainPositions = async () => {
      try {
        const response = await axios.get('https://train-tracking-system.vercel.app/api/vehicles/latest-positions'); // Update this URL with your backend API endpoint
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching train positions:', error);
      }
    };

    fetchTrainPositions();
  }, []);

  return (
    <div style={{ height: '100vh', margin: 0 }}>
      <MapContainer
        center={[6.9337, 79.85]} // Center on a location in Sri Lanka
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {positions.map((position) => (
          <Marker key={position._id} position={[position.lat, position.long]}>
            <Popup>
              <strong>{position.vehicleId}</strong>
              <br />
              Time Logged: {new Date(position.timeLogged).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrainTracker;
