import React, { useState, useEffect } from 'react';
import './Maps.css';

import image from './Images/red location sign.png';  // Correct path to the image
import MapComponent from '../components/MapComponent';  // Correct path to the MapComponent

function TechCompanies() {
  const [populationRange, setPopulationRange] = useState(0);  // State to hold the population range
  const [debouncedPopulationRange, setDebouncedPopulationRange] = useState(populationRange);  // Debounced state

  // Debounce effect to update the populationRange with a delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPopulationRange(populationRange);
    }, 300);  // 0.3 seconds delay

    // Cleanup the timeout if populationRange changes before 300ms
    return () => {
      clearTimeout(handler);
    };
  }, [populationRange]);  // Effect runs whenever populationRange changes

  const handlePopulationChange = (event) => {
    setPopulationRange(event.target.value);  // Update the population range immediately on change
  };

  return (
    <div className="app-container">
      <div className="options">
        <h2>
          <img src={image} alt="description" style={{ width: "90px", height: "auto" }} />
        </h2>
        <label style={{ fontSize: '26px' }}>Select city:</label>
        <select>
          <option value="jerusalem">Jerusalem</option>
          <option value="tel-aviv">Tel Aviv</option>
          <option value="haifa">Haifa</option>
          <option value="ramat gan">Ramat Gan</option>
          <option value="petah tikva">Petah Tikva</option>
          <option value="ashdod">Ashdod</option>
          <option value="beer sheva">Beer Sheva</option>
          <option value="natanya">Natanya</option>
          <option value="eilat">Eilat</option>
          <option value="herzliya">Herzliya</option>
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
      </div>

      <div className='mapsContainer'>
        {/* Pass the debouncedPopulationRange instead of populationRange */}
        <MapComponent populationRange={debouncedPopulationRange} />
      </div>

    </div>
  );
}

export default TechCompanies;
