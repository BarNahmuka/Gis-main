/* global json_CSVdemographic_2 */
import React, { useState, useEffect } from 'react';
import './Maps.css';

import image from './Images/red location sign.png';
import MapComponent from '../components/MapComponent';

function TechCompanies() {
  const [populationRange, setPopulationRange] = useState(0);
  const [ageGroup, setAgeGroup] = useState('All');
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  // City coordinates for zooming
  const cities = {
    "Jerusalem": [31.7683, 35.2137],
    "Tel Aviv": [32.0853, 34.7818],
    "Haifa": [32.7940, 34.9896],
    "Ramat Gan": [32.0684, 34.8248],
    "Petah Tikva": [32.0840, 34.8878],
    "Ashdod": [31.8044, 34.6553],
    "Beer Sheva": [31.2520, 34.7915],
    "Netanya": [32.3215, 34.8532],
    "Eilat": [29.5581, 34.9482],
    "Herzliya": [32.1663, 34.8436]
  };

  // Load unique age groups from JSON data
  useEffect(() => {
    const groups = new Set();
    json_CSVdemographic_2.features.forEach((feature) => {
      Object.keys(feature.properties).forEach((prop) => {
        if (prop.startsWith('גיל_')) {
          let groupLabel = prop.replace('גיל_', '').replace('_', '-');
          if (groupLabel.includes('פלוס')) {
            groupLabel = groupLabel.replace('-פלוס', '+');
          }
          groups.add(groupLabel);
        }
      });
    });
    setAgeGroups([...groups]);
  }, []);

  const handlePopulationChange = (event) => setPopulationRange(event.target.value);
  const handleAgeGroupChange = (event) => setAgeGroup(event.target.value);
  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName ? { name: cityName, coordinates: cities[cityName] } : null);
  };

  return (
    <div className="app-container">
      <div className="options">
        <h2>
          <img src={image} alt="description" style={{ width: "90px", height: "auto" }} />
        </h2>
        <label style={{ fontSize: '26px' }}>Select city:</label>
        <select onChange={handleCityChange}>
          <option value="">Select a city</option>
          {Object.keys(cities).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <label style={{ fontSize: '17px' }}>Select population (0 - 200,000):</label>
        <input 
          type="range" 
          min="0" 
          max="200000" 
          step="5000" 
          value={populationRange} 
          onChange={handlePopulationChange} 
        />

        <label style={{ fontSize: '17px' }}>Select Age Group:</label>
        <select value={ageGroup} onChange={handleAgeGroupChange}>
          <option value="All">All</option>
          {ageGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className='mapsContainer'>
        <MapComponent populationRange={populationRange} ageGroup={ageGroup} city={selectedCity} />
      </div>
    </div>
  );
}

export default TechCompanies;
