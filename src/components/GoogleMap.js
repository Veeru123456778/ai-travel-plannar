// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { useEffect, useState } from 'react';
// import L from 'leaflet';

// // Ensure to import the leaflet CSS
// import 'leaflet/dist/leaflet.css';

// const Map = ({ center, zoom, markers }) => {
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     if (map) {
//       // You can do something when the map is initialized, like adding controls or handling map events
//     }
//   }, [map]);

//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       style={{ height: '500px', width: '100%' }}
//       whenCreated={setMap}
//     >
//       {/* Tile Layer */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
//       />
      
//       {/* Markers */}
//       {markers.map((marker, index) => (
//         <Marker
//           key={index}
//           position={marker.position}
//           icon={new L.Icon({
//             iconUrl: '/marker-icon.png', // Optional: Use a custom marker image
//             iconSize: [25, 41],           // Customize marker size
//             iconAnchor: [12, 41],         // Anchor to position marker correctly
//             popupAnchor: [1, -34],        // Position for the popup
//           })}
//         >
//           <Popup>{marker.popupText}</Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default Map;
