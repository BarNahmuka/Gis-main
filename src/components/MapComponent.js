/* global L, json_CSVdemographic_2, json_CSVTech_1 */
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import Autolinker from 'autolinker';
import ReactDOMServer from 'react-dom/server';
import 'leaflet.heat';

let map1, map2, map3, map4;

const MapComponent = ({ populationRange, ageGroup, city }) => {  
  const demographicLayerRef1 = useRef(null);
  const demographicLayerRef3 = useRef(null);

  useEffect(() => {
    // Initialize map1
    if (!map1) {
      map1 = L.map('map1', { zoomControl: false, maxZoom: 28, minZoom: 1 })
        .fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);
      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map1);
    }

    if (demographicLayerRef1.current) {
      map1.removeLayer(demographicLayerRef1.current);
    }

    demographicLayerRef1.current = L.geoJSON(json_CSVdemographic_2, {
      filter: feature => feature.properties['סהכ'] >= populationRange,
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 4.0,
        fillColor: 'rgba(231,74,72,1.0)',
        color: 'rgba(35,35,35,1.0)',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
      }),
      onEachFeature: (feature, layer) => pop_CSVdemographic_2(feature, layer, ageGroup),
    }).addTo(map1);

    // Initialize map3 with both demographic and tech data
    if (!map3) {
      map3 = L.map('map3', { zoomControl: false, maxZoom: 28, minZoom: 1 })
        .fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);
      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map3);
    }

    if (demographicLayerRef3.current) {
      map3.removeLayer(demographicLayerRef3.current);
    }

    // Combine demographic and tech data for Map 3
    demographicLayerRef3.current = L.geoJSON(json_CSVdemographic_2, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 4.0,
        fillColor: 'rgba(231,74,72,1.0)',
        color: 'rgba(35,35,35,1.0)',
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      }),
      onEachFeature: (feature, layer) => pop_CSVdemographic_2(feature, layer, ageGroup),
    }).addTo(map3);

    L.geoJSON(json_CSVTech_1, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 4.0,
        fillColor: 'rgba(243,229,166,1.0)',
        color: 'rgba(35,35,35,1.0)',
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      }),
      onEachFeature: pop_CSVTech_1,
    }).addTo(map3);

  }, [populationRange, ageGroup]);

  // Zoom and popup functionality
  useEffect(() => {
    const zoomAndAutoPopup = (map, layerRef, coords) => {
      map.flyTo(coords, 13, { duration: 2 });
      if (layerRef.current) {
        layerRef.current.eachLayer(layer => {
          const { lat, lng } = layer.getLatLng();
          if (Math.abs(lat - coords[0]) < 0.01 && Math.abs(lng - coords[1]) < 0.01) {
            layer.openPopup();
          }
        });
      }
    };

    if (city) {
      if (map1) zoomAndAutoPopup(map1, demographicLayerRef1, city.coordinates);
      if (map2) map2.flyTo(city.coordinates, 13, { duration: 2 });
      if (map3) zoomAndAutoPopup(map3, demographicLayerRef3, city.coordinates);
      if (map4) map4.flyTo(city.coordinates, 13, { duration: 2 });
    }
  }, [city]);

  // Initialize map2 and map4
  useEffect(() => {
    if (!map2) {
      map2 = L.map('map2', { zoomControl: false, maxZoom: 28, minZoom: 1 })
        .fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);
      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map2);

      L.geoJSON(json_CSVTech_1, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
          radius: 4.0,
          fillColor: 'rgba(243,229,166,1.0)',
          color: 'rgba(35,35,35,1.0)',
          weight: 1,
          opacity: 1,
          fillOpacity: 1
        }),
        onEachFeature: pop_CSVTech_1,
      }).addTo(map2);
    }

    if (!map4) {
      map4 = L.map('map4', { zoomControl: false, maxZoom: 28, minZoom: 1 })
        .fitBounds([[29.58558648296286, 31.59799699704964], [33.50312293796286, 37.72679302032426]]);
      L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map4);

      const heatPoints = json_CSVdemographic_2.features.map(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const intensity = feature.properties['סהכ'] / 1000;
        return [lat, lng, intensity];
      });
      L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map4);
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <div id="map1" style={{ position: 'relative', height: '80vh', width: '25%' }}>
        <h1 style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 0', textAlign: 'center', zIndex: 1000 }}>
          Demographic Data
        </h1>
      </div>
      <div id="map2" style={{ position: 'relative', height: '80vh', width: '25%' }}>
        <h1 style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 0', textAlign: 'center', zIndex: 1000 }}>
          Tech Company Data
        </h1>
      </div>
      <div id="map3" style={{ position: 'relative', height: '80vh', width: '25%' }}>
        <h1 style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 0', textAlign: 'center', zIndex: 1000 }}>
          Both Demographic and Tech Company Data
        </h1>
      </div>
      <div id="map4" style={{ position: 'relative', height: '80vh', width: '25%' }}>
        <h1 style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 0', textAlign: 'center', zIndex: 1000 }}>
          Heatmap (Demographic + Tech)
        </h1>
      </div>
    </div>
  );
};

const pop_CSVTech_1 = (feature, layer) => {
  const popupContent = (
    <table dir="rtl" style={{ textAlign: 'right' }}>
      <tr><td><strong>מספר חברה:</strong></td><td>{feature.properties['מספר חברה']}</td></tr>
      <tr><td><strong>שם חברה:</strong></td><td>{feature.properties['שם חברה']}</td></tr>
      <tr><td><strong>שם באנגלית:</strong></td><td>{feature.properties['שם באנגלית']}</td></tr>
      <tr><td><strong>סטטוס חברה:</strong></td><td>{feature.properties['סטטוס חברה']}</td></tr>
    </table>
  );
  layer.bindPopup(ReactDOMServer.renderToString(popupContent));
};

const pop_CSVdemographic_2 = (feature, layer, ageGroup) => {
  const properties = feature.properties;
  const ageGroupKeys = ageGroup === 'All'
    ? Object.keys(properties).filter(key => key.startsWith('גיל_'))
    : [`גיל_${ageGroup.replace('-', '_').replace('+', 'פלוס')}`];

  const ageGroupRows = ageGroupKeys.map(key => {
    const label = key.replace('גיל_', '').replace('_', '-');
    const formattedLabel = `גיל ${label.replace('פלוס', '+')}`;
    const formattedNumber = properties[key]?.toLocaleString(); // Format the number with commas
    return (
      <tr key={key}>
        <td style={{ textAlign: 'right' }}><strong>{formattedLabel}:</strong></td>
        <td style={{ textAlign: 'left' }}>{formattedNumber}</td>
      </tr>
    );
  });

  const totalResidents = properties['סהכ']?.toLocaleString(); // Format total residents with commas
  const popupContent = (
    <table dir="rtl" style={{ textAlign: 'right' }}>
      <tr><td><strong>שם ישוב:</strong></td><td style={{ textAlign: 'left' }}>{properties['שם_ישוב']}</td></tr>
      <tr><td><strong>מספר תושבים:</strong></td><td style={{ textAlign: 'left' }}>{totalResidents}</td></tr>
      {ageGroupRows}
      <tr><td><strong>Latitude:</strong></td><td style={{ textAlign: 'left' }}>{properties['latitude']}</td></tr>
      <tr><td><strong>Longitude:</strong></td><td style={{ textAlign: 'left' }}>{properties['longitude']}</td></tr>
    </table>
  );

  layer.bindPopup(ReactDOMServer.renderToString(popupContent));
};

export default MapComponent;
