/* global L, json_CSVdemographic_2, json_CSVTech_1 */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import Autolinker from 'autolinker';

let map1, map2, map3, map4; // Add map4 for the heatmap

const MapComponent = ({ populationRange }) => {  
  const demographicLayerRef = useRef(null); // Reference to store demographic layer

  useEffect(() => {
    // Map 1: Demographic data
    if (!map1) {
      map1 = L.map('map1', {
        zoomControl: false,
        maxZoom: 28,
        minZoom: 1,
      }).fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);

      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map1);
    }

    // Remove existing demographic layer before adding the new filtered data
    if (demographicLayerRef.current) {
      map1.removeLayer(demographicLayerRef.current);
    }

    // Add new demographic data filtered based on population range
    demographicLayerRef.current = L.geoJSON(json_CSVdemographic_2, {
      filter: (feature) => {
        const population = feature.properties['סהכ'];
        return population >= populationRange;
      },
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 4.0,
          fillColor: 'rgba(231,74,72,1.0)',
          color: 'rgba(35,35,35,1.0)',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        });
      },
      onEachFeature: pop_CSVdemographic_2,
    }).addTo(map1);
  }, [populationRange]);

  // Map 2: Tech company data
  useEffect(() => {
    if (!map2) {
      map2 = L.map('map2', {
        zoomControl: false,
        maxZoom: 28,
        minZoom: 1,
      }).fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);

      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map2);

      L.geoJSON(json_CSVTech_1, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 4.0,
            fillColor: 'rgba(243,229,166,1.0)',
            color: 'rgba(35,35,35,1.0)',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          });
        },
        onEachFeature: pop_CSVTech_1
      }).addTo(map2);
    }

    // Map 3: Both demographic and tech company data
    if (!map3) {
      map3 = L.map('map3', {
        zoomControl: false,
        maxZoom: 28,
        minZoom: 1,
      }).fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);

      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map3);

      // Add demographic and tech layers to map3
      L.geoJSON(json_CSVdemographic_2, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 4.0,
            fillColor: 'rgba(231,74,72,1.0)',
            color: 'rgba(35,35,35,1.0)',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          });
        },
        onEachFeature: pop_CSVdemographic_2
      }).addTo(map3);

      L.geoJSON(json_CSVTech_1, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 4.0,
            fillColor: 'rgba(243,229,166,1.0)',
            color: 'rgba(35,35,35,1.0)',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          });
        },
        onEachFeature: pop_CSVTech_1
      }).addTo(map3);
    }

    // Map 4: Heatmap combining both demographic and tech data
    if (!map4) {
      map4 = L.map('map4', {
        zoomControl: false,
        maxZoom: 28,
        minZoom: 1,
      }).fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);

      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map4);

      // Combine data points for heatmap
      const heatPoints = [];

      // Add demographic data points
      json_CSVdemographic_2.features.forEach(feature => {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        const intensity = feature.properties['סהכ'] / 1000; // Use population as intensity
        heatPoints.push([lat, lng, intensity]);
      });

      // Add tech company data points
      json_CSVTech_1.features.forEach(feature => {
        const lat = feature.geometry.coordinates[1];
        const lng = feature.geometry.coordinates[0];
        const intensity = 0.5; // You can adjust the intensity for tech companies if needed
        heatPoints.push([lat, lng, intensity]);
      });

      // Create heatmap layer
      L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(map4);
    }
  }, []); // Initial effect for maps 2, 3, and 4

  // Render the four maps side by side
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <div id="map1" style={{ height: '80vh', width: '25%' }}>
        <h1>Demographic Data</h1>
      </div>
      <div id="map2" style={{ height: '80vh', width: '25%' }}>
        <h1>Tech Company Data</h1>
      </div>
      <div id="map3" style={{ height: '80vh', width: '25%' }}>
        <h1>Combined Data</h1>
      </div>
      <div id="map4" style={{ height: '80vh', width: '25%' }}>
        <h1>Heatmap (Demographic + Tech)</h1>
      </div>
    </div>
  );
};

// Popup functions remain unchanged
const pop_CSVTech_1 = (feature, layer) => {
  // Your existing code for tech company popup
};

const pop_CSVdemographic_2 = (feature, layer) => {
  // Your existing code for demographic popup
};

export default MapComponent;
