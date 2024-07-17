/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useEffect, useRef } from 'react';

const Map = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  const loadMapyCzApi = () => {
    return new Promise((resolve, reject) => {
      if (window.SMap) {
        resolve(window.SMap);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://api.mapy.cz/loader.js';
      script.async = true;
      script.onload = () => {
        window.Loader.async = true;
        window.Loader.load(null, null, () => {
          resolve(window.SMap);
        });
      };
      script.onerror = () => reject(new Error('Failed to load Mapy.cz API'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const SMap = await loadMapyCzApi();
        if (mapRef.current) {
          const center = SMap.Coords.fromWGS84(longitude, latitude);
          const map = new SMap(mapRef.current, center, 13);
          map.addDefaultLayer(SMap.DEF_BASE).enable();

          const layer = new SMap.Layer.Marker();
          map.addLayer(layer);
          layer.enable();

          const marker = new SMap.Marker(center);
          layer.addMarker(marker);
        }
      } catch (error) {
        console.error('Error loading Mapy.cz API:', error);
      }
    };

    initializeMap();
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default Map;
