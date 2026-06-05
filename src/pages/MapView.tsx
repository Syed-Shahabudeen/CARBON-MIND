import React from 'react';

const MapView: React.FC = () => {
  return (
    <div
      id="map-view-container"
      style={{
        width: '100%',
        height: 'calc(100vh - 85px)',
        overflow: 'hidden',
        background: '#060b12',
      }}
    >
      <iframe
        id="carbonmind-map-iframe"
        src="/CarbonMind_map_v9.html"
        title="CarbonMind Urban CO₂ Map"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        allow="autoplay"
      />
    </div>
  );
};

export default MapView;
